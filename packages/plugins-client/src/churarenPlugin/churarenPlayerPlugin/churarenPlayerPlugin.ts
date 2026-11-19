import { BaseGamePlugin } from '@churaverse/game-plugin-client'
import './keyAction/defKeyAction'
import { CHURAREN_CONSTANTS, ChurarenEnemyDamageCause } from '@churaverse/churaren-core-plugin-client'
import type { Item, ItemPluginStore } from '@churaverse/churaren-item-plugin-client'
import { materialItemImage } from '@churaverse/churaren-item-plugin-client'
import type { KeyboardPluginStore } from '@churaverse/keyboard-plugin-client'
import type { NetworkPluginStore } from '@churaverse/network-plugin-client'
import type {
  PlayerNameChangeEvent,
  PlayerPluginStore,
  PlayerRespawnEvent,
  PlayerWalkEvent,
} from '@churaverse/player-plugin-client'
import { DeathLogRepository, GRID_WALK_DURATION_MS, isPlayer } from '@churaverse/player-plugin-client'
import { GRID_SIZE, type IMainScene, type LivingDamageEvent, type Position } from 'churaverse-engine-client'
import { KeyboardController } from './controller/keyboardController'
import { SocketController } from './controller/socketController'
import type { InvicibleTimeEvent } from './event/invicibleTimeEvent'
import type { ChurarenPlayersStore } from './store/defChurarenPlayersStore'
import { initChurarenPlayersStore, resetChurarenPlayersStore } from './store/initChurarenPlayersStore'
import { GhostModeIndicatorUi } from './ui/ghostModeIndicatorUi'
import '@churaverse/churaren-core-plugin-client'
import type { DeathLog } from '@churaverse/player-plugin-client'
import type { DropChurarenItemEvent } from './event/dropChurarenItemEvent'
import type { GetChurarenItemEvent } from './event/getChurarenItemEvent'
import { type DropChurarenItemData, DropChurarenItemMessage } from './message/dropChurarenItemMessage'
import type { PlayerItemsStore } from './store/defPlayerItemsStore'
import { initPlayerItemStore, resetPlayerItemStore } from './store/initPlayerItemsStore'

export class ChurarenPlayerPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private playerItemStore!: PlayerItemsStore
  private isGameStarted = false
  private itemPluginStore!: ItemPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private playerPluginStore!: PlayerPluginStore
  private churarenPlayerStore!: ChurarenPlayersStore
  private keyboardStore!: KeyboardPluginStore<IMainScene>
  private ghostModeIndicatorUi?: GhostModeIndicatorUi
  private readonly deathLog: DeathLogRepository = new DeathLogRepository()
  private socketController?: SocketController
  private keyboardController?: KeyboardController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.keyboardController = new KeyboardController(this.bus, this.store)
    this.bus.subscribeEvent(
      'registerKayAction',
      this.keyboardController.registerKeyAction.bind(this.keyboardController)
    )
    this.bus.subscribeEvent(
      'registerKeyActionListener',
      this.keyboardController.setupKeyActionListenerRegister.bind(this.keyboardController)
    )
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.keyboardStore = this.store.of('keyboardPlugin')
  }

  private setupKeyAction(): void {
    this.keyboardStore.keySettingWindow.addKeyAction('dropItem1', '1のアイテムを捨てる')
    this.keyboardStore.keySettingWindow.addKeyAction('dropItem2', '2のアイテムを捨てる')
    this.keyboardStore.keySettingWindow.addKeyAction('dropItem3', '3のアイテムを捨てる')
  }

  private resetKeyAction(): void {
    this.keyboardStore.keySettingWindow.removeKeyAction('dropItem1')
    this.keyboardStore.keySettingWindow.removeKeyAction('dropItem2')
    this.keyboardStore.keySettingWindow.removeKeyAction('dropItem3')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('getChurarenItem', this.getItem)
    this.bus.subscribeEvent('dropChurarenItem', this.dropItem)
    this.bus.subscribeEvent('livingDamage', this.logPlayerDeathByBoss)
    this.bus.subscribeEvent('invicibleTime', this.onInvicibleTime)
    this.bus.subscribeEvent('playerWalk', this.playerItemChase)
    this.bus.subscribeEvent('playerRespawn', this.changeGhostMode, 'LOW')
    this.bus.subscribeEvent('playerNameChange', this.onChangePlayerName)
    this.bus.subscribeEvent('churarenResult', this.onChurarenResult)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('getChurarenItem', this.getItem)
    this.bus.unsubscribeEvent('dropChurarenItem', this.dropItem)
    this.bus.unsubscribeEvent('livingDamage', this.logPlayerDeathByBoss)
    this.bus.unsubscribeEvent('invicibleTime', this.onInvicibleTime)
    this.bus.unsubscribeEvent('playerWalk', this.playerItemChase)
    this.bus.unsubscribeEvent('playerRespawn', this.changeGhostMode)
    this.bus.unsubscribeEvent('playerNameChange', this.onChangePlayerName)
    this.bus.unsubscribeEvent('churarenResult', this.onChurarenResult)
  }

  protected handleGameStart(): void {
    this.isGameStarted = true
    initPlayerItemStore(this.store)
    initChurarenPlayersStore(this.store)
    this.playerItemStore = this.store.of('playerItemStore')
    this.itemPluginStore = this.store.of('churarenItemPlugin')
    this.churarenPlayerStore = this.store.of('churarenPlayerStore')
    this.ghostModeIndicatorUi = new GhostModeIndicatorUi(this.store)
    this.playerItemStore.materialItemBoxContainer.initialize()
    this.playerItemStore.alchemyItemBoxContainer.initialize()
    this.churarenPlayerStore.ghostPlayerListUi.initialize()
    this.ghostModeIndicatorUi.ghostModeIcon.deactivate()
    this.socketController?.registerMessageListener()
    this.keyboardController?.getStores()
    this.keyboardController?.registerKeyActionListener()
    this.setupKeyAction()
  }

  protected handleGameTermination(): void {
    this.isGameStarted = false
    this.keyboardController?.unregisterKeyActionListener()
    this.resetKeyAction()
    this.socketController?.unregisterMessageListener()
    this.playerItemStore.materialItemBoxContainer.remove()
    this.playerItemStore.alchemyItemBoxContainer.remove()
    this.churarenPlayerStore.ghostPlayerListUi.remove()
    this.clearPlayerItemBox()
    this.showAllGhostPlayers()
    this.ghostModeIndicatorUi?.ghostModeIcon.deactivate()
    resetChurarenPlayersStore(this.store)
    resetPlayerItemStore(this.store)
  }

  protected handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  private readonly onChurarenResult = (): void => {
    this.hideItemBox()
    this.clearPlayerItemBox()
    this.ghostModeIndicatorUi?.ghostModeIcon.deactivate()
    this.churarenPlayerStore.ghostPlayerListUi.updateGhostPlayerList([])
    this.showAllGhostPlayers()
  }

  private readonly changeGhostMode = (ev: PlayerRespawnEvent): void => {
    if (!this.isGameStarted) return
    // プレイヤーの透明化処理
    const player = this.playerPluginStore.players.get(ev.id)
    if (player === undefined) return

    this.clearPlayerItemBox(player.id)
    this.churarenPlayerStore.ghostModePlayerRepository.set(player.id, player)
    if (this.playerPluginStore.ownPlayerId === player.id) {
      this.ghostModeIndicatorUi?.ghostModeIcon.activate()
      this.hideItemBox()
    }
    this.changeGhostPlayer(player.id)
    this.updateGhostPlayerList()
  }

  private readonly INVINCIBLE_BLINK_CYCLE_MS = 200

  private readonly onInvicibleTime = (ev: InvicibleTimeEvent): void => {
    const playerId = ev.id
    this.playerPluginStore.playerRenderers.get(playerId)?.blinkTarget(ev.invicibleTime, this.INVINCIBLE_BLINK_CYCLE_MS)
  }

  private readonly getItem = (ev: GetChurarenItemEvent): void => {
    const item = this.itemPluginStore.items.get(ev.itemId)
    const renderer = this.itemPluginStore.itemRenderers.get(ev.itemId)
    const alchemyItem = this.playerItemStore.alchemyItem.get(ev.playerId)

    if (item === undefined || renderer === undefined || alchemyItem !== undefined) return

    this.playerItemStore.materialItems.set(ev.playerId, item)
    this.playerItemStore.materialItemRenderers.set(ev.itemId, renderer)
    this.itemPluginStore.items.delete(ev.itemId)
    this.itemPluginStore.itemRenderers.delete(ev.itemId)
    if (ev.playerId === this.playerPluginStore.ownPlayerId) {
      this.updateMaterialItemBox(ev.playerId)
    }
  }

  private readonly playerItemChase = (ev: PlayerWalkEvent): void => {
    if (!this.isGameStarted) return
    const player = this.playerPluginStore.players.get(ev.id)
    if (player === undefined) return
    const speed = ev.speed ?? GRID_SIZE / GRID_WALK_DURATION_MS

    const alchemyItem = this.playerItemStore.alchemyItem.get(ev.id)
    if (alchemyItem !== undefined) {
      const renderer = this.playerItemStore.alchemyItemRenderers.get(alchemyItem.itemId)
      const dest = player.position.copy()
      renderer?.chase(dest, speed, (pos: Position) => {
        alchemyItem.position.x = pos.x
        alchemyItem.position.y = pos.y
      })
    } else {
      const items = this.playerItemStore.materialItems.getAllItem(ev.id)
      items.forEach((item: Item, index: number) => {
        if (item === undefined) return
        const renderer = this.playerItemStore.materialItemRenderers.get(item.itemId)
        const dest = index === 0 ? player.position.copy() : items[index - 1].position.copy()
        renderer?.chase(dest, speed, (pos: { x: number; y: number }) => {
          item.position.x = pos.x
          item.position.y = pos.y
        })
      })
    }
  }

  private readonly dropItem = (ev: DropChurarenItemEvent): void => {
    const renderer = this.playerItemStore.materialItemRenderers.get(ev.itemId)
    if (renderer == null) return
    renderer.destroy()
    this.playerItemStore.materialItemRenderers.delete(ev.itemId)
    this.playerItemStore.materialItems.delete(ev.playerId, ev.itemId)

    if (ev.playerId === this.playerPluginStore.ownPlayerId) {
      this.updateMaterialItemBox(ev.playerId)
      const dropItemData: DropChurarenItemData = { playerId: ev.playerId, itemId: ev.itemId }
      const dropItemMessage = new DropChurarenItemMessage(dropItemData)
      this.networkPluginStore.messageSender.send(dropItemMessage)
    }
  }

  private readonly logPlayerDeathByBoss = (ev: LivingDamageEvent): void => {
    if (!(ev.cause instanceof ChurarenEnemyDamageCause)) return
    if (isPlayer(ev.target) && ev.target.isDead) {
      const deathLog: DeathLog = {
        victim: ev.target,
        killer: ev.cause.entityName,
        cause: ev.cause.entityName,
        diedTime: new Date(),
      }
      this.playerPluginStore.deathLogRenderer.add(deathLog)
      this.playerPluginStore.deathLogRepository.addDeathLog(deathLog)
    }
  }

  private readonly onChangePlayerName = (_ev: PlayerNameChangeEvent): void => {
    if (!this.isGameStarted) return
    this.updateGhostPlayerList()
  }

  private clearPlayerItemBox(playerId?: string): void {
    if (playerId === undefined) {
      this.playerItemStore.materialItemRenderers.forEach((renderer) => {
        renderer.destroy()
      })
      this.playerItemStore.alchemyItemRenderers.forEach((renderer) => {
        renderer.destroy()
      })
      this.playerItemStore.materialItems.clearAll()
      this.playerItemStore.alchemyItem.clear()
    } else {
      const materialItems = [...this.playerItemStore.materialItems.getAllItem(playerId)]
      materialItems.forEach((item) => {
        const renderer = this.playerItemStore.materialItemRenderers.get(item.itemId)
        if (renderer !== undefined) {
          renderer.destroy()
          this.playerItemStore.materialItemRenderers.delete(item.itemId)
          this.playerItemStore.materialItems.delete(playerId, item.itemId)
        }
      })

      const alchemyItem = this.playerItemStore.alchemyItem.get(playerId)
      if (alchemyItem === undefined) return
      const alchemyRenderer = this.playerItemStore.alchemyItemRenderers.get(alchemyItem.itemId)
      if (alchemyRenderer !== undefined) {
        alchemyRenderer.destroy()
        this.playerItemStore.alchemyItemRenderers.delete(alchemyItem.itemId)
        this.playerItemStore.alchemyItem.delete(playerId)
      }
    }
  }

  private updateMaterialItemBox(playerId: string): void {
    const items = this.playerItemStore.materialItems.getAllItem(playerId)
    const itemImageList = items.map((item) => materialItemImage[item.kind])
    this.playerItemStore.materialItemBoxContainer.updateMaterialItemBox(itemImageList)
  }

  private showPlayer(playerId: string): void {
    this.playerPluginStore.playerRenderers.get(playerId)?.setSpriteAlpha(1)
  }

  private showAllGhostPlayers(): void {
    this.churarenPlayerStore.ghostModePlayerRepository.getAllId().forEach((id) => {
      this.showPlayer(id)
    })
  }

  private changeGhostPlayer(playerId: string): void {
    this.playerPluginStore.playerRenderers.get(playerId)?.setSpriteAlpha(0.4)
  }

  private updateGhostPlayerList(): void {
    const playerNames = this.churarenPlayerStore.ghostModePlayerRepository.getPlayerNames()
    this.churarenPlayerStore.ghostPlayerListUi.updateGhostPlayerList(playerNames)
  }

  private hideItemBox(): void {
    this.playerItemStore.materialItemBoxContainer.hide()
    this.playerItemStore.alchemyItemBoxContainer.hide()
  }
}
