import { AdminSettingIcon, type CoreUiPluginStore } from '@churaverse/core-ui-plugin-client'
import { CookieStore } from '@churaverse/data-persistence-plugin-client'
import type { DebugScreenPluginStore, DumpDebugDataEvent } from '@churaverse/debug-screen-plugin-client'
import { DebugSummaryScreenSection } from '@churaverse/debug-screen-plugin-client'
import type { MapPluginStore } from '@churaverse/map-plugin-client'
import type { NetworkPluginStore, Sendable } from '@churaverse/network-plugin-client'
import type { TransitionPluginStore } from '@churaverse/transition-plugin-client'
import {
  BasePlugin,
  type DamageCauseType,
  EntityDespawnEvent,
  EntitySpawnEvent,
  EVENT_PRIORITY,
  GRID_SIZE,
  type IMainScene,
  type InitEvent,
  type ITitleScene,
  type LivingDamageEvent,
  type LivingHealEvent,
  type PartialWritable,
  type PhaserLoadAssets,
  type PhaserSceneInit,
  type Position,
  type StartEvent,
  type UtilStoreInMain,
  type Vector,
  vectorToName,
  WeaponDamageCause,
} from 'churaverse-engine-client'
import { PlayerSetupInfoWriter } from './interface/playerSetupInfoWriter'
import '@churaverse/transition-plugin-client'
import { KeyboardController } from './controller/keyboardController'
import { SocketController } from './controller/socketController'
import type {
  IPlayerColorDebugScreen,
  IPlayerDirectionDebugScreen,
  IPlayerHpDebugScreen,
  IPlayerIdDebugScreen,
  IPlayerNameDebugScreen,
  IPlayerPositionDebugScreen,
  IPlayerRoleDebugScreen,
} from './debugScreen/IDebugScreen/IPlayerInfoDebugScreen'
import { PlayerColorDebugScreen } from './debugScreen/playerColorDebugScreen'
import { PlayerDirectionDebugScreen } from './debugScreen/playerDirectionDebugScreen'
import { PlayerHpDebugScreen } from './debugScreen/playerHpDebugScreen'
import { PlayerIdDebugScreen } from './debugScreen/playerIdDebugScreen'
import { PlayerNameDebugScreen } from './debugScreen/playerNameDebugScreen'
import { PlayerPositionDebugScreen, PlayerPositionGridDebugScreen } from './debugScreen/playerPositionDebugScreen'
import { PlayerRoleDebugScreen } from './debugScreen/playerRoleDebugScreen'
import { GRID_WALK_DURATION_MS, Player } from './domain/player'
import { OwnPlayerUndefinedError } from './errors/ownPlayerUndefinedError'
import { PlayerRendererNotFoundError } from './errors/playerRendererNotFoundError'
import type { PlayerColorChangeEvent } from './event/playerColorChangeEvent'
import type { PlayerDieEvent } from './event/playerDieEvent'
import type { PlayerInvincibleTimeEvent } from './event/playerInvincibleTimeEvent'
import type { PlayerNameChangeEvent } from './event/playerNameChangeEvent'
import type { PlayerRespawnEvent } from './event/playerRespawnEvent'
import { PlayerTurnEvent } from './event/playerTurnEvent'
import type { PlayerWalkEvent } from './event/playerWalkEvent'
import { PlayerColorChangeMessage } from './message/playerColorChangeMessage'
import { type PlayerJoinData, PlayerJoinMessage } from './message/playerJoinMessage'
import { PlayerLeaveMessage } from './message/playerLeaveMessage'
import { PlayerNameChangeMessage } from './message/playerNameChangeMessage'
import { PlayerStopMessage } from './message/playerStopMessage'
import { PlayerTurnMessage } from './message/playerTurnMessage'
import { PlayerWalkMessage } from './message/playerWalkMessage'
import { PlayerRenderer } from './renderer/playerRenderer'
import { PlayerRendererFactory } from './renderer/playerRendererFactory'
import type { PlayerPluginStore } from './store/defPlayerPluginStore'
import { initPlayerPluginStore } from './store/initPlayerPluginStore'
import type { DeathLog } from './ui/deathLog/deathLog'
import { DeathLogRepository } from './ui/deathLog/deathLogRepository'
import type { JoinLeaveLogRenderer } from './ui/joinLeaveLogRenderer/joinLeaveLogRenderer'
import { PlayerUi } from './ui/setupPlayerUi'

type WritableOwnPlayerId = PartialWritable<PlayerPluginStore, 'ownPlayerId'>

export class PlayerPlugin extends BasePlugin<IMainScene> {
  private rendererFactory?: PlayerRendererFactory
  // Store系のプロパティは、コンストラクタではなくinitイベントで初期化されます。
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private utilStore!: UtilStoreInMain
  private uiStore!: CoreUiPluginStore
  private transitionPluginStore!: TransitionPluginStore<IMainScene>
  private mapPluginStore!: MapPluginStore
  private debugScreenStore!: DebugScreenPluginStore
  private readonly deathLog: DeathLogRepository = new DeathLogRepository()
  private joinLeaveLogRenderer?: JoinLeaveLogRenderer
  private playerColorDebugScreen!: IPlayerColorDebugScreen
  private playerDirectionDebugScreen!: IPlayerDirectionDebugScreen
  private playerHpDebugScreen!: IPlayerHpDebugScreen
  private playerIdDebugScreen!: IPlayerIdDebugScreen
  private playerNameDebugScreen!: IPlayerNameDebugScreen
  private playerPositionDebugScreen!: IPlayerPositionDebugScreen
  private playerPositionGridDebugScreen!: IPlayerPositionDebugScreen
  private playerRoleDebugScreen!: IPlayerRoleDebugScreen
  private playerUi!: PlayerUi

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('willSceneTransition', this.willSceneTransition.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    const keyboardController = new KeyboardController(this.bus, this.store)
    this.bus.subscribeEvent('registerKayAction', keyboardController.registerKeyAction.bind(keyboardController))
    this.bus.subscribeEvent(
      'registerKeyActionListener',
      keyboardController.registerKeyActionListener.bind(keyboardController)
    )

    this.bus.subscribeEvent('entitySpawn', this.onPlayerJoin.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.onPlayerLeave.bind(this))
    this.bus.subscribeEvent('playerWalk', this.preventWalkingOverwrite.bind(this), EVENT_PRIORITY.HIGHEST)
    this.bus.subscribeEvent('playerWalk', this.onPlayerWalk.bind(this))
    this.bus.subscribeEvent('playerTurn', this.onTurnPlayer.bind(this))
    this.bus.subscribeEvent('playerDie', this.onDiePlayer.bind(this))
    this.bus.subscribeEvent('playerRespawn', this.onRespawnPlayer.bind(this))
    this.bus.subscribeEvent('playerNameChange', this.onChangePlayerName.bind(this))
    this.bus.subscribeEvent('playerColorChange', this.onChangePlayerColor.bind(this))
    this.bus.subscribeEvent('livingDamage', this.onLivingDamage.bind(this))
    this.bus.subscribeEvent('livingHeal', this.onLivingHeal.bind(this))
    this.bus.subscribeEvent('playerDie', this.onDiePlayer.bind(this))
    this.bus.subscribeEvent('playerRespawn', this.onRespawnPlayer.bind(this))
    this.bus.subscribeEvent('playerInvincibleTime', this.onInvincibleTimePlayer.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
    this.bus.subscribeEvent('networkConnect', this.onNetworkConnect.bind(this))
    this.bus.subscribeEvent('networkDisconnect', this.onNetworkDisconnect.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.rendererFactory = new PlayerRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    PlayerRenderer.loadAssets(ev.scene)
  }

  private init(_ev: InitEvent): void {
    initPlayerPluginStore(this.store, this.rendererFactory)
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
    this.utilStore = this.store.of('util')
    this.uiStore = this.store.of('coreUiPlugin')
    this.transitionPluginStore = this.store.of('transitionPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
    this.debugScreenStore = this.store.of('debugScreenPlugin')
  }

  private start(_ev: StartEvent): void {
    this.playerUi = new PlayerUi(this.store, this.bus)
    this.joinLeaveLogRenderer = this.playerUi.setupJoinLeaveLogRenderer()
    this.createOwnPlayer()
    this.setupAdminUi()
    this.setupDebugScreen()
  }

  /** ownPlayerのroleがadminの場合に管理者設定UIを生成する */
  private setupAdminUi(): void {
    const ownPlayer = this.transitionPluginStore.transitionManager.getReceivedData<ITitleScene>().ownPlayer
    void new AdminSettingIcon(
      ownPlayer.role,
      this.uiStore.switcher,
      this.uiStore.adminSettingDialog,
      this.uiStore.topBarIconContainer
    )
  }

  private createOwnPlayer(): void {
    const recievedPlayerData = this.transitionPluginStore.transitionManager.getReceivedData<ITitleScene>().ownPlayer
    const data: PlayerJoinData = {
      hp: recievedPlayerData.hp,
      position: recievedPlayerData.position.toVector() as Vector & Sendable,
      direction: recievedPlayerData.direction,
      // playerId: recievedPlayerData.id !== '' ? recievedPlayerData.id : this.networkStore.socketId,
      playerId: this.networkStore.socketId,
      heroColor: recievedPlayerData.color,
      heroName: recievedPlayerData.name,
      role: recievedPlayerData.role,
      spawnTime: recievedPlayerData.spawnTime,
    }

    this.networkStore.messageSender.send(new PlayerJoinMessage(data))
    const player = new Player(
      // recievedPlayerData.id !== '' ? recievedPlayerData.id : this.networkStore.socketId,
      this.networkStore.socketId,
      recievedPlayerData.position,
      recievedPlayerData.direction,
      recievedPlayerData.name,
      recievedPlayerData.color,
      recievedPlayerData.hp,
      recievedPlayerData.role,
      recievedPlayerData.spawnTime
    )
    this.bus.post(new EntitySpawnEvent(player))
    const playerRenderer = this.playerPluginStore.playerRenderers.get(this.playerPluginStore.ownPlayerId)
    if (playerRenderer === undefined) throw new PlayerRendererNotFoundError(this.playerPluginStore.ownPlayerId)
    this.uiStore.focusTargetRepository.addFocusTarget(playerRenderer)
    playerRenderer.focus()
    this.utilStore.focusedRenderer = playerRenderer
  }

  private setupDebugScreen(): void {
    const debugSummaryScreenContainer = this.debugScreenStore.debugSummaryScreenContainer
    debugSummaryScreenContainer.addSection(new DebugSummaryScreenSection('playerInfo', 'Player'))
    this.playerColorDebugScreen = new PlayerColorDebugScreen(debugSummaryScreenContainer)
    this.playerDirectionDebugScreen = new PlayerDirectionDebugScreen(debugSummaryScreenContainer)
    this.playerHpDebugScreen = new PlayerHpDebugScreen(debugSummaryScreenContainer)
    this.playerIdDebugScreen = new PlayerIdDebugScreen(debugSummaryScreenContainer)
    this.playerNameDebugScreen = new PlayerNameDebugScreen(debugSummaryScreenContainer)
    this.playerPositionDebugScreen = new PlayerPositionDebugScreen(debugSummaryScreenContainer)
    this.playerPositionGridDebugScreen = new PlayerPositionGridDebugScreen(debugSummaryScreenContainer)
    this.playerRoleDebugScreen = new PlayerRoleDebugScreen(debugSummaryScreenContainer)
    this.updateDebugScreenPlayerColor()
    this.updateDebugScreenPlayerDirection()
    this.updateDebugScreenPlayerHp()
    this.updateDebugScreenPlayerId()
    this.updateDebugScreenPlayerName()
    this.updateDebugScreenPlayerPosition()
    this.updateDebugScreenPlayerRole()
    setInterval(() => {
      this.updateDebugScreenPlayerPosition()
    }, 100)
  }

  private willSceneTransition(): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) throw new OwnPlayerUndefinedError()

    this.networkStore.messageSender.send(new PlayerLeaveMessage({ playerId: ownPlayer.id }))
    this.bus.post(new EntityDespawnEvent(ownPlayer))
    // this.bus.post(new SavePlayerInfoEvent(ownPlayer))
    // PlayerSetupInfoPluginを実装するまでは以下で代用
    this.savePlayerInfo(ownPlayer)
  }

  private onPlayerJoin(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Player)) {
      return
    }
    const player = ev.entity
    this.playerPluginStore.players.set(player.id, player)
    const ownPlayerSpawnTime = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)?.spawnTime ?? 0
    if (ownPlayerSpawnTime <= player.spawnTime) {
      this.joinLeaveLogRenderer?.join(player.id, player.name)
    }

    const playerRenderer = this.rendererFactory?.build(
      player.position,
      player.direction,
      player.name,
      player.color,
      player.hp
    )
    if (playerRenderer === undefined) throw new PlayerRendererNotFoundError(player.id)
    if (player.id === this.playerPluginStore.ownPlayerId) {
      playerRenderer.highlightNameplate()
    }
    this.playerPluginStore.playerRenderers.set(player.id, playerRenderer)
  }

  private onPlayerLeave(ev: EntityDespawnEvent): void {
    if (!(ev.entity instanceof Player)) return
    if (ev.entity.id !== this.playerPluginStore.ownPlayerId) {
      this.joinLeaveLogRenderer?.leave(ev.entity.id, ev.entity.name ?? 'name')
    }
    const playerRenderer = this.playerPluginStore.playerRenderers.get(ev.entity.id)
    if (playerRenderer !== undefined) {
      this.playerPluginStore.players.delete(ev.entity.id)
      playerRenderer.destroy()
      this.playerPluginStore.playerRenderers.delete(ev.entity.id)
    }
  }

  /**
   * 自プレイヤー歩行中の歩行の上書きを防止する
   */
  private preventWalkingOverwrite(ev: PlayerWalkEvent): void {
    const player = this.playerPluginStore.players.get(ev.id)
    if (player === undefined) {
      ev.cancel()
      return
    }

    if (player.id === this.playerPluginStore.ownPlayerId && player.isWalking) {
      ev.cancel()
    }
  }

  private onPlayerWalk(ev: PlayerWalkEvent): void {
    const player = this.playerPluginStore.players.get(ev.id)
    if (player === undefined || player.isDead) {
      ev.cancel()
      return
    }

    if (player.direction !== ev.direction) {
      this.bus.post(new PlayerTurnEvent(ev.id, ev.direction))
    }

    // speedがundefinedの場合はデフォルトの値を代入
    const speed = ev.speed ?? GRID_SIZE / GRID_WALK_DURATION_MS

    const startPos = player.position.copy()

    // 開始位置と実際のプレイヤーの位置がこの値を超えた場合は移動前にteleportで補正
    const limitToIgnoreCorrection = 40

    // 一方向に一定以上ずれている時とｘｙの両方向ずれている場合は瞬間移動して補正
    // この条件式に当てはまらない場合は加速して補正される
    if (
      ev.source !== undefined &&
      (player.position.distanceTo(ev.source) >= limitToIgnoreCorrection ||
        (ev.source.x !== player.position.x && ev.source.y !== player.position.y))
    ) {
      player.teleport(ev.source)
      this.playerPluginStore.playerRenderers.get(ev.id)?.teleport(ev.source)
    }

    const dest = player.position.copy()
    dest.gridX += ev.direction.x
    dest.gridY += ev.direction.y

    // 移動先が通行不可マスの場合は移動しない
    if (this.isWalkBlockingTile(dest)) return

    if (this.playerPluginStore.ownPlayerId === ev.id) {
      // 移動開始時の座標をemitする必要がある
      this.networkStore.messageSender.send(
        new PlayerWalkMessage({ startPos: startPos.toVector() as Vector & Sendable, direction: ev.direction, speed })
      )
    }

    const playerRender = this.playerPluginStore.playerRenderers.get(ev.id)
    if (playerRender !== undefined) {
      // tweenのonUpdateより先にkeyboardControllerの次のupdateが呼ばれてしまうため
      // 前もってplayer.IsWalkingをtrueにする
      player.startWalk()
      playerRender.walk(
        dest,
        ev.direction,
        speed,
        (pos) => {
          player.walk(pos, ev.direction)
        },
        () => {
          player.stop()
          if (this.playerPluginStore.ownPlayerId === ev.id) {
            this.networkStore.messageSender.send(
              new PlayerStopMessage({
                stopPos: player.position.toVector() as Vector & Sendable,
                direction: player.direction,
              })
            )
          }
        }
      )
    } else {
      // renderが存在しなくても動く方法
      player.walk(dest, ev.direction)
    }
  }

  private isWalkBlockingTile(pos: Position): boolean {
    const currentMap = this.mapPluginStore.mapManager.currentMap
    if (!currentMap.inWorld(pos.copy().alignCenter())) return true

    const collisionLayer = currentMap.layerProperty.get('Collision')
    if (collisionLayer === undefined) return false
    return collisionLayer[pos.gridY][pos.gridX]
  }

  private isPlayerDead(id: string): boolean {
    return this.playerPluginStore.players.get(id)?.isDead ?? true
  }

  private onTurnPlayer(ev: PlayerTurnEvent): void {
    // this.stopPlayer(ev.id)
    if (this.isPlayerDead(ev.id)) return

    this.playerPluginStore.players.get(ev.id)?.turn(ev.direction)

    this.playerPluginStore.playerRenderers.get(ev.id)?.turn(ev.direction)

    if (this.playerPluginStore.ownPlayerId === ev.id) {
      this.updateDebugScreenPlayerDirection()
      this.networkStore.messageSender.send(new PlayerTurnMessage({ direction: ev.direction }))
    }
  }

  private stopPlayer(id: string): void {
    const player = this.playerPluginStore.players.get(id)
    player?.stop()
    this.playerPluginStore.playerRenderers.get(id)?.stop()
  }

  private onLivingDamage(ev: LivingDamageEvent): void {
    if (!(ev.target instanceof Player)) return
    this.playerPluginStore.players.get(ev.target.id)?.damage(ev.amount)
    const currentHp = this.playerPluginStore.players.get(ev.target.id)?.hp ?? 0
    this.playerPluginStore.playerRenderers.get(ev.target.id)?.damage(ev.amount, currentHp)
    if (this.isPlayerDead(ev.target.id)) {
      if (ev.cause instanceof WeaponDamageCause) {
        const owner = this.playerPluginStore.players.get(ev.cause.weapon.ownerId)
        if (owner === undefined) return
        this.addDeathLog(ev.target, owner, ev.cause.weaponName)
      }
    }
    if (ev.target.id === this.playerPluginStore.ownPlayerId) {
      this.updateDebugScreenPlayerHp()
    }
  }

  private onLivingHeal(ev: LivingHealEvent): void {
    if (!(ev.target instanceof Player)) return
    const player = this.playerPluginStore.players.get(ev.target.id)
    if (player === undefined) return
    player.heal(ev.amount)
    this.playerPluginStore.playerRenderers.get(ev.target.id)?.heal(ev.amount, player.hp)
  }

  private onDiePlayer(ev: PlayerDieEvent): void {
    this.stopPlayer(ev.id)
    this.playerPluginStore.playerRenderers.get(ev.id)?.dead()
  }

  private onRespawnPlayer(ev: PlayerRespawnEvent): void {
    this.playerPluginStore.players.get(ev.id)?.respawn(ev.position, ev.direction)
    const currentHp = this.playerPluginStore.players.get(ev.id)?.hp ?? 100
    this.playerPluginStore.playerRenderers.get(ev.id)?.respawn(ev.position, ev.direction, currentHp)
    if (ev.id === this.playerPluginStore.ownPlayerId) {
      this.updateDebugScreenPlayerHp()
    }
  }

  private readonly INVINCIBLE_BLINK_CYCLE_MS = 200

  private onInvincibleTimePlayer(ev: PlayerInvincibleTimeEvent): void {
    const playerRenderer = this.playerPluginStore.playerRenderers.get(ev.id)
    if (playerRenderer === undefined) {
      throw new PlayerRendererNotFoundError(ev.id)
    }
    playerRenderer.blinkTarget(ev.invincibleTime, this.INVINCIBLE_BLINK_CYCLE_MS)
  }

  private onChangePlayerName(ev: PlayerNameChangeEvent): void {
    this.playerPluginStore.players.get(ev.id)?.setName(ev.name)
    this.playerPluginStore.playerRenderers.get(ev.id)?.applyPlayerName(ev.name)

    if (this.playerPluginStore.ownPlayerId === ev.id) {
      const player = this.playerPluginStore.players.get(ev.id)
      if (player === undefined) {
        return
      }
      this.updateDebugScreenPlayerName()
      this.networkStore.messageSender.send(new PlayerNameChangeMessage({ name: ev.name }))
    }
    this.updatePlayerList()
  }

  private onChangePlayerColor(ev: PlayerColorChangeEvent): void {
    this.playerPluginStore.players.get(ev.id)?.setColor(ev.color)
    this.playerPluginStore.playerRenderers.get(ev.id)?.applyPlayerColor(ev.color)

    if (this.playerPluginStore.ownPlayerId === ev.id) {
      const player = this.playerPluginStore.players.get(ev.id)
      this.updateDebugScreenPlayerColor()
      if (player === undefined) {
        return
      }
      this.networkStore.messageSender.send(new PlayerColorChangeMessage({ color: ev.color }))
    }
  }

  private savePlayerInfo(ownPlayer: Player): void {
    // TODO: PlayerSetupInfoPluginの作成
    const playerSetupInfoWriter = new PlayerSetupInfoWriter(new CookieStore())
    playerSetupInfoWriter.save(ownPlayer.name, ownPlayer.color, ownPlayer.role)
  }

  /**
   * playerの名前変更時、入退出時に実行される
   */
  private updatePlayerList(): void {
    // TODO: PlayerListPluginの作成
    // const playerPluginStore = this.store.of('playerPlugin')
    // const players = playerPluginStore.players.players
    // if (players === undefined) return
    // this.playerList.updatePlayerList(playerPluginStore.ownPlayerId, players)
  }

  /**
   * プレイヤーが死亡した時に実行される
   */
  private addDeathLog(victim: Player, killer: Player, cause: DamageCauseType): void {
    const deathLog: DeathLog = {
      victim,
      killer,
      cause,
      diedTime: new Date(),
    } as const
    this.playerPluginStore.deathLogRenderer.add(deathLog)
    this.deathLog.addDeathLog(deathLog)
  }

  private updateDebugScreenPlayerColor(): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) return
    this.playerColorDebugScreen.update(ownPlayer.color)
  }

  private updateDebugScreenPlayerDirection(): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) return
    this.playerDirectionDebugScreen.update(ownPlayer.direction)
  }

  private updateDebugScreenPlayerHp(): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) return
    this.playerHpDebugScreen.update(ownPlayer.hp)
  }

  private updateDebugScreenPlayerId(): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) return
    this.playerIdDebugScreen.update(ownPlayer.id)
  }

  private updateDebugScreenPlayerName(): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) return
    this.playerNameDebugScreen.update(ownPlayer.name)
  }

  private updateDebugScreenPlayerPosition(): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) return
    this.playerPositionDebugScreen.update(ownPlayer.position)
    this.playerPositionGridDebugScreen.update(ownPlayer.position)
  }

  private updateDebugScreenPlayerRole(): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) return
    this.playerRoleDebugScreen.update(ownPlayer.role)
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) return
    ev.dataDumper.dump('playerId', ownPlayer.id)
    ev.dataDumper.dump('playerName', ownPlayer.name)
    ev.dataDumper.dump('playerColor', ownPlayer.color)
    ev.dataDumper.dump('playerHp', ownPlayer.hp.toString())
    const positionStr = `X: ${ownPlayer.position.x.toFixed(0)}, Y: ${ownPlayer.position.y.toFixed(0)}`
    const gridStr = `GridX: ${ownPlayer.position.gridX}, GridY: ${ownPlayer.position.gridY}`
    ev.dataDumper.dump('playerPosition', `Position: ${positionStr} ${gridStr}`)
    ev.dataDumper.dump('playerDirection', vectorToName(ownPlayer.direction))
    ev.dataDumper.dump('playerRole', ownPlayer.role)
  }

  private onNetworkConnect(): void {
    const prevOwnPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (prevOwnPlayer === undefined) return
    this.playerPluginStore.players.delete(prevOwnPlayer.id)
    this.playerPluginStore.playerRenderers.get(prevOwnPlayer.id)?.destroy()
    this.playerPluginStore.playerRenderers.delete(prevOwnPlayer.id)

    const playerPluginStore = this.playerPluginStore as WritableOwnPlayerId
    playerPluginStore.ownPlayerId = this.networkStore.socketId
    this.playerUi.updatePlayerId(this.playerPluginStore.ownPlayerId)

    const data: PlayerJoinData = {
      hp: prevOwnPlayer.hp,
      position: prevOwnPlayer.position.toVector() as Vector & Sendable,
      direction: prevOwnPlayer.direction,
      playerId: this.playerPluginStore.ownPlayerId,
      heroColor: prevOwnPlayer.color,
      heroName: prevOwnPlayer.name,
      role: prevOwnPlayer.role,
      spawnTime: prevOwnPlayer.spawnTime,
    }

    this.networkStore.messageSender.send(new PlayerJoinMessage(data))
    const player = new Player(
      this.playerPluginStore.ownPlayerId,
      prevOwnPlayer.position,
      prevOwnPlayer.direction,
      prevOwnPlayer.name,
      prevOwnPlayer.color,
      prevOwnPlayer.hp,
      prevOwnPlayer.role,
      prevOwnPlayer.spawnTime
    )
    this.bus.post(new EntitySpawnEvent(player))
    const playerRenderer = this.playerPluginStore.playerRenderers.get(this.playerPluginStore.ownPlayerId)
    if (playerRenderer === undefined) throw new PlayerRendererNotFoundError(this.playerPluginStore.ownPlayerId)
    this.uiStore.focusTargetRepository.addFocusTarget(playerRenderer)
    playerRenderer.focus()
    this.utilStore.focusedRenderer = playerRenderer
  }

  private onNetworkDisconnect(): void {
    const player = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (player === undefined) return
    const renderer = this.playerPluginStore.playerRenderers.get(this.playerPluginStore.ownPlayerId)
    if (renderer === undefined) return
    this.playerPluginStore.playerRenderers.forEach((renderer, id) => {
      if (id === this.playerPluginStore.ownPlayerId) return
      renderer.destroy()
    })
    this.playerPluginStore.players.getAllId().forEach((id) => {
      if (id === this.playerPluginStore.ownPlayerId) return
      this.playerPluginStore.players.delete(id)
      this.playerPluginStore.playerRenderers.delete(id)
    })
  }
}
