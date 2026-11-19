import { isBossAttack } from '@churaverse/churaren-boss-attack-plugin-server'
import { isBoss } from '@churaverse/churaren-boss-plugin-server'
import type { UseRevivalItemEvent } from '@churaverse/churaren-core-plugin-server'
import {
  CHURAREN_CONSTANTS,
  ChurarenDamageMessage,
  ChurarenEnemyDamageCause,
  ChurarenResultEvent,
} from '@churaverse/churaren-core-plugin-server'
import type { GetChurarenItemEvent, ItemPluginStore } from '@churaverse/churaren-item-plugin-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import type { PlayerPluginStore } from '@churaverse/player-plugin-server'
import { isPlayer, type Player } from '@churaverse/player-plugin-server'
import type { IMainScene, LivingDamageEvent } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import type { DropChurarenItemEvent } from './event/dropChurarenItemEvent'
import { type GetChurarenItemData, GetChurarenItemMessage } from './message/getChurarenItemMessage'
import { InvicibleTimeMessage } from './message/invicibleTimeMessage'
import { PlayerRevivalMessage } from './message/playerRevivalMessage'
import type { ChurarenPlayersStore } from './store/defChurarenPlayersStore'
import type { PlayerItemsStore } from './store/defPlayerItemsStore'
import { initChurarenPlayersStore, resetChurarenPlayersStore } from './store/initChurarenPlayersStore'
import { initPlayerItemStore, resetPlayerItemStore } from './store/initPlayerItemsStore'
import '@churaverse/churaren-boss-attack-plugin-server'
import '@churaverse/churaren-boss-plugin-server'
import { PlayerHealMessage } from '@churaverse/player-plugin-server'

export const MAX_ITEMS = 3

export class ChurarenPlayerPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private itemPluginStore!: ItemPluginStore
  private playerPluginStore!: PlayerPluginStore
  private churarenPlayerStore!: ChurarenPlayersStore
  private playerItemStore!: PlayerItemsStore
  private socketController?: SocketController
  private readonly inviciblePlayersList: string[] = []
  private readonly INVICIBLE_TIME = 2000 // 無敵時間

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('getChurarenItem', this.getItem)
    this.bus.subscribeEvent('dropChurarenItem', this.dropItem)
    this.bus.subscribeEvent('livingDamage', this.onChurarenDamageFromBoss)
    this.bus.subscribeEvent('livingDamage', this.onChurarenDamageFromBossAttack)
    this.bus.subscribeEvent('livingDamage', this.skipDamage, 'HIGH')
    this.bus.subscribeEvent('useRevivalItem', this.onUseRevivalItem)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('getChurarenItem', this.getItem)
    this.bus.unsubscribeEvent('dropChurarenItem', this.dropItem)
    this.bus.unsubscribeEvent('livingDamage', this.onChurarenDamageFromBoss)
    this.bus.unsubscribeEvent('livingDamage', this.onChurarenDamageFromBossAttack)
    this.bus.unsubscribeEvent('livingDamage', this.skipDamage)
    this.bus.unsubscribeEvent('useRevivalItem', this.onUseRevivalItem)
  }

  protected handleGameStart(): void {
    initPlayerItemStore(this.store)
    initChurarenPlayersStore(this.store)
    this.itemPluginStore = this.store.of('churarenItemPlugin')
    this.playerItemStore = this.store.of('playerItemStore')
    this.churarenPlayerStore = this.store.of('churarenPlayers')
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    this.clearGhostModePlayers()
    resetChurarenPlayersStore(this.store)
    resetPlayerItemStore(this.store)
  }

  private readonly skipDamage = (ev: LivingDamageEvent): void => {
    if (!(ev.cause instanceof ChurarenEnemyDamageCause)) return
    if (!isPlayer(ev.target)) return
    const player = ev.target
    if (this.churarenPlayerStore.ghostModePlayers.has(player.id)) return
    if (this.inviciblePlayersList.includes(player.id)) {
      ev.cancel()
    } else {
      this.changeInvincible(player.id)
      const invicibleTimeMessage = new InvicibleTimeMessage({
        playerId: player.id,
        invicibleTime: this.INVICIBLE_TIME,
      })
      this.networkPluginStore.messageSender.send(invicibleTimeMessage)
    }
  }

  private readonly getItem = (ev: GetChurarenItemEvent): void => {
    if (this.churarenPlayerStore.ghostModePlayers.has(ev.playerId)) return
    if (this.playerItemStore.alchemyItem.get(ev.playerId) !== undefined) return
    const itemCount = this.playerItemStore.materialItems.getAllItem(ev.playerId).length
    if (itemCount >= MAX_ITEMS) return
    this.playerItemStore.materialItems.set(ev.playerId, ev.item)
    this.itemPluginStore.items.delete(ev.item.itemId)
    const getItemData: GetChurarenItemData = {
      playerId: ev.playerId,
      itemId: ev.item.id,
    }
    const getItemMessage = new GetChurarenItemMessage(getItemData)
    this.networkPluginStore.messageSender.send(getItemMessage)
  }

  private readonly dropItem = (ev: DropChurarenItemEvent): void => {
    const player = this.playerPluginStore.players.get(ev.playerId)
    if (player === undefined) return
    this.playerItemStore.materialItems.delete(player.id, ev.itemId)
  }

  private readonly onChurarenDamageFromBoss = (ev: LivingDamageEvent): void => {
    if (!(ev.cause instanceof ChurarenEnemyDamageCause)) return
    if (ev.cause.name !== 'collisionBoss') return
    if (isPlayer(ev.target) && isBoss(ev.cause.entity)) {
      const player = ev.target
      const damageCause = new ChurarenDamageMessage({
        targetId: player.id,
        cause: ev.cause.name,
        sourceId: ev.cause.entity.id,
        amount: ev.amount,
      })
      this.networkPluginStore.messageSender.send(damageCause)

      // 即時に死亡していればそのままゴースト化
      if (player.isDead) {
        this.changeGhostPlayer(player)
      }
    }
  }

  private readonly onChurarenDamageFromBossAttack = (ev: LivingDamageEvent): void => {
    if (!(ev.cause instanceof ChurarenEnemyDamageCause)) return
    if (ev.cause.name !== 'bossAttack') return
    if (isPlayer(ev.target) && isBossAttack(ev.cause.entity)) {
      const player = ev.target
      const damageCause = new ChurarenDamageMessage({
        targetId: player.id,
        cause: ev.cause.name,
        sourceId: ev.cause.entity.id,
        amount: ev.amount,
      })
      this.networkPluginStore.messageSender.send(damageCause)
      // 即時に死亡していればそのままゴースト化
      if (player.isDead) {
        this.changeGhostPlayer(player)
      }
    }
  }

  private changeGhostPlayer(player: Player): void {
    if (player === undefined) return
    this.churarenPlayerStore.ghostModePlayers.set(player.id, player)
    player.isCollidable = false
    this.deleteItems(player.id)
    if (
      this.churarenPlayerStore.ghostModePlayers.size ===
      this.gamePluginStore.games.get(this.gameId)?.joinedPlayerIds.length
    ) {
      const updateChurarenUi = new ChurarenResultEvent('gameOver')
      this.bus.post(updateChurarenUi)
    }
  }

  private readonly onUseRevivalItem = (ev: UseRevivalItemEvent): void => {
    if (this.churarenPlayerStore.ghostModePlayers.size === 0) {
      const healAmount = 100
      const player = this.playerPluginStore.players.get(ev.playerId)
      if (player === undefined) return
      player.heal(healAmount)
      this.networkPluginStore.messageSender.send(new PlayerHealMessage({ playerId: player.id, healAmount }))
    } else {
      const revivalPlayerId = this.churarenPlayerStore.ghostModePlayers.getRandomPlayerId()
      const revivalPlayer = this.playerPluginStore.players.get(revivalPlayerId)
      if (revivalPlayer === undefined) return
      this.churarenPlayerStore.ghostModePlayers.delete(revivalPlayerId)
      revivalPlayer.isCollidable = true
      const revivalItemMessage = new PlayerRevivalMessage({ playerId: revivalPlayer.id })
      this.networkPluginStore.messageSender.send(revivalItemMessage)
    }
  }

  private clearGhostModePlayers(): void {
    this.churarenPlayerStore.ghostModePlayers.getAllId().forEach((playerId) => {
      const player = this.playerPluginStore.players.get(playerId)
      if (player === undefined) return
      player.isCollidable = true
    })
    this.churarenPlayerStore.ghostModePlayers.clear()
  }

  private deleteItems(playerId: string): void {
    this.playerItemStore.materialItems.clear(playerId)
    this.playerItemStore.alchemyItem.delete(playerId)
  }

  // 無敵のプレイヤーを追加
  private changeInvincible(playerId: string): void {
    this.inviciblePlayersList.push(playerId)
    setTimeout(() => {
      this.inviciblePlayersList.shift()
    }, this.INVICIBLE_TIME)
  }
}
