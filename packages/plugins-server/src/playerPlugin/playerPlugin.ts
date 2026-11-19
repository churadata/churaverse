import type { MapPluginStore } from '@churaverse/map-plugin-server'
import type { NetworkDisconnectEvent, NetworkPluginStore, SendableObject } from '@churaverse/network-plugin-server'
import {
  BasePlugin,
  Direction,
  EntityDespawnEvent,
  type EntitySpawnEvent,
  type IMainScene,
  type InitEvent,
  type LivingDamageEvent,
  type LivingHealEvent,
  logger,
  type UpdateEvent,
  type Vector,
  WeaponDamageCause,
} from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { PLAYER_RESPAWN_WAITING_TIME_MS, Player, RESPAWN_INVINCIBLE_TIME_MS } from './domain/player'
import { movePlayers } from './domain/playerService'
import type { PlayerColorChangeEvent } from './event/playerColorChangeEvent'
import type { PlayerNameChangeEvent } from './event/playerNameChangeEvent'
import type { PlayerStopEvent } from './event/playerStopEvent'
import type { PlayerTurnEvent } from './event/playerTurnEvent'
import type { PlayerWalkEvent } from './event/playerWalkEvent'
import { PlayerDieMessage } from './message/playerDieMessage'
import { PlayerInvincibleTimeMessage } from './message/playerInvincibleTimeMessage'
import { PlayerRespawnMessage } from './message/playerRespawnMessage'
import { WeaponDamageMessage } from './message/weaponDamageMessage'
import { playerNameColorCache } from './playerNameColorCache'
import type { PlayerPluginStore } from './store/defPlayerPluginStore'
import { initPlayerPluginStore } from './store/initPlayerPluginStore'

export class PlayerPlugin extends BasePlugin<IMainScene> {
  private playerPluginStore!: PlayerPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private mapPluginStore!: MapPluginStore

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('update', this.update.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))
    this.bus.subscribeEvent('networkDisconnect', this.postPlayerLeaveEvent.bind(this))

    this.bus.subscribeEvent('entitySpawn', this.onPlayerJoin.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.onPlayerLeave.bind(this))
    this.bus.subscribeEvent('playerWalk', this.onPlayerWalk.bind(this))
    this.bus.subscribeEvent('playerStop', this.onPlayerStop.bind(this))
    this.bus.subscribeEvent('playerTurn', this.onPlayerTurn.bind(this))
    this.bus.subscribeEvent('playerNameChange', this.onPlayerNameChange.bind(this))
    this.bus.subscribeEvent('playerColorChange', this.onPlayerColorChange.bind(this))
    this.bus.subscribeEvent('livingDamage', this.onLivingDamage.bind(this))
    this.bus.subscribeEvent('livingHeal', this.onLivingHeal.bind(this))
    this.bus.subscribeEvent('livingDamage', this.handleRespawnInvincibility.bind(this), 'HIGH')
  }

  private init(_ev: InitEvent): void {
    initPlayerPluginStore(this.store)
    this.getStores()
  }

  private getStores(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
  }

  private update(ev: UpdateEvent): void {
    movePlayers(ev.dt, this.playerPluginStore.players)
  }

  private onPlayerJoin(ev: EntitySpawnEvent): void {
    logger.debug('onPlayerJoin', ev)
    if (!(ev.entity instanceof Player)) return
    const player = ev.entity
    this.playerPluginStore.players.set(player.id, player)
    logger.debug('onPlayerJoin:players:', this.playerPluginStore.players)
    playerNameColorCache.set(player.id, { name: player.name, color: player.color })
  }

  private postPlayerLeaveEvent(ev: NetworkDisconnectEvent): void {
    const leavePlayer = this.playerPluginStore.players.get(ev.socketId)

    // mainScene以外で通信切断した場合leavePlayerはundefined
    if (leavePlayer === undefined) return

    const leaveEvent = new EntityDespawnEvent(leavePlayer)
    this.bus.post(leaveEvent)
  }

  private onPlayerLeave(ev: EntityDespawnEvent): void {
    if (!(ev.entity instanceof Player)) return
    this.playerPluginStore.players.delete(ev.entity.id)
    playerNameColorCache.delete(ev.entity.id)
  }

  private onPlayerWalk(ev: PlayerWalkEvent): void {
    logger.debug('onPlayerWalk', ev)
    const player = this.playerPluginStore.players.get(ev.id)
    logger.debug('onPlayerWalk:players:', this.playerPluginStore.players)
    if (player === undefined) return
    if (player.isDead) {
      player.stop()
    } else {
      const velocity = { x: ev.speed * ev.direction.x, y: ev.speed * ev.direction.y }
      player.walk(ev.position, ev.direction, velocity)
    }
  }

  private onPlayerStop(ev: PlayerStopEvent): void {
    const player = this.playerPluginStore.players.get(ev.id)
    if (player === undefined) return
    player.stop()

    // 位置・向きを補正
    player.teleport(ev.position)
    player.turn(ev.direction)
  }

  private onPlayerTurn(ev: PlayerTurnEvent): void {
    this.playerPluginStore.players.get(ev.id)?.turn(ev.direction)
  }

  private onPlayerNameChange(ev: PlayerNameChangeEvent): void {
    const player = this.playerPluginStore.players.get(ev.id)
    if (player === undefined) return
    player.setPlayerName(ev.name)
    playerNameColorCache.set(ev.id, { name: ev.name, color: player.color })
  }

  private onPlayerColorChange(ev: PlayerColorChangeEvent): void {
    const player = this.playerPluginStore.players.get(ev.id)
    if (player === undefined) return
    player.setPlayerColor(ev.color)
    playerNameColorCache.set(ev.id, { name: player.name, color: ev.color })
  }

  private handleRespawnInvincibility(ev: LivingDamageEvent): void {
    if (!(ev.target instanceof Player)) return

    if (ev.target.isInvincible) {
      ev.cancel()
    }
  }

  private onLivingDamage(ev: LivingDamageEvent): void {
    if (!(ev.target instanceof Player)) return

    const player = this.playerPluginStore.players.get(ev.target.id)
    if (player === undefined) return

    player.damage(ev.amount)
    if (ev.cause instanceof WeaponDamageCause) {
      const weaponDamageMessage = new WeaponDamageMessage({
        targetId: ev.target.id,
        cause: ev.cause.weaponName,
        weaponId: ev.cause.weapon.id,
        amount: ev.amount,
      })
      this.networkPluginStore.messageSender.send(weaponDamageMessage)
    }

    if (player.isDead) {
      player.stop()

      const playerDieMessage = new PlayerDieMessage({ targetId: ev.target.id })
      this.networkPluginStore.messageSender.send(playerDieMessage)

      // PLAYER_RESPAWN_WAITING_TIME_MS後にリスポーン
      setTimeout(() => {
        // ランダムな通行可能マスの座標を取得
        const position = this.mapPluginStore.mapManager.currentMap.getRandomSpawnPoint()
        player.respawn(position)

        const playerRespawnMessage = new PlayerRespawnMessage({
          playerId: player.id,
          position: position.toVector() as Vector & SendableObject,
          direction: Direction.down,
        })
        const invincibleTimeMessage = new PlayerInvincibleTimeMessage({
          playerId: player.id,
          invincibleTime: RESPAWN_INVINCIBLE_TIME_MS,
        })

        this.networkPluginStore.messageSender.send(playerRespawnMessage)
        this.networkPluginStore.messageSender.send(invincibleTimeMessage)
      }, PLAYER_RESPAWN_WAITING_TIME_MS)
    }
  }

  private onLivingHeal(ev: LivingHealEvent): void {
    if (!(ev.target instanceof Player)) return
    const player = this.playerPluginStore.players.get(ev.target.id)
    if (player === undefined) return
    player.heal(ev.amount)
  }
}
