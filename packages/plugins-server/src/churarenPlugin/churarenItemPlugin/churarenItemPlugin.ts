import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import type { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server'
import type { IGameInfo } from '@churaverse/game-plugin-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import type { Player } from '@churaverse/player-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import type { Item } from './domain/item'
import { generatedItemMap, removeItems } from './domain/itemService'
import type { ItemPluginStore } from './store/defItemPluginStore'
import { initItemPluginStore } from './store/initItemPluginStore'
import '@churaverse/churaren-core-plugin-server'
import '@churaverse/churaren-core-plugin-server'
import { AlchemyItemRegisterEvent } from './event/alchemyItemRegisterEvent'
import { GetChurarenItemEvent } from './event/getChurarenItemEvent'
import { ChurarenItemDespawnMessage } from './message/churarenItemDespawnMessage'
import { ChurarenItemSpawnMessage } from './message/churarenItemSpawnMessage'

const ITEM_GENERATE_INTERVAL_MS = 10000

export class ChurarenItemPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private itemPluginStore!: ItemPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private churarenGameInfo?: IGameInfo
  private socketController!: SocketController
  private itemGenerateIntervalId?: ReturnType<typeof setInterval>

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlap.bind(this))
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('churarenStartTimer', this.sendGenerateItems)
    this.bus.subscribeEvent('churarenResult', this.removeAllItems)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('churarenStartTimer', this.sendGenerateItems)
    this.bus.unsubscribeEvent('churarenResult', this.removeAllItems)
  }

  private init(): void {
    initItemPluginStore(this.store)
    this.itemPluginStore = this.store.of('churarenItemPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  private readonly update = (): void => {
    const itemIds = removeItems(this.itemPluginStore.items)
    const itemDespawnMessage = new ChurarenItemDespawnMessage({ itemIds })
    this.networkPluginStore.messageSender.send(itemDespawnMessage)
  }

  protected handleGameStart(): void {
    this.churarenGameInfo = this.store.of('gamePlugin').games.get(this.gameId)
    this.bus.post(new AlchemyItemRegisterEvent(this.itemPluginStore.alchemyItemRegister))
  }

  protected handleGameTermination(): void {
    this.clearItemGenerateInterval()
    this.itemPluginStore.items.clear()
    this.itemPluginStore.alchemyItemManager.reset()
  }

  private readonly sendGenerateItems = (): void => {
    const sendGenerateItemsLoop = (): void => {
      if (this.churarenGameInfo === undefined || !this.isActive) return
      const items = generatedItemMap(
        this.itemPluginStore.items,
        this.itemGenerateNum,
        this.store.of('mapPlugin').mapManager.currentMap
      )
      const itemSpawnMessage = new ChurarenItemSpawnMessage({ items })
      this.networkPluginStore.messageSender.send(itemSpawnMessage)

      this.itemGenerateIntervalId = setTimeout(sendGenerateItemsLoop, ITEM_GENERATE_INTERVAL_MS)
    }
    sendGenerateItemsLoop()
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.itemPluginStore.items,
      this.store.of('playerPlugin').players,
      this.getItem.bind(this)
    )
  }

  private getItem(item: Item, player: Player): void {
    if (this.churarenGameInfo === undefined) return
    // プレイヤーが参加者でない場合は何もしない
    if (!this.churarenGameInfo.joinedPlayerIds.includes(player.id)) return
    const getItemEvent = new GetChurarenItemEvent(player.id, item)
    this.bus.post(getItemEvent)
  }

  private readonly removeAllItems = (): void => {
    this.clearItemGenerateInterval()
    const itemIds = this.itemPluginStore.items.getAllId()
    this.networkPluginStore.messageSender.send(new ChurarenItemDespawnMessage({ itemIds }))
    this.itemPluginStore.items.clear()
  }

  private clearItemGenerateInterval(): void {
    if (this.itemGenerateIntervalId !== undefined) {
      clearTimeout(this.itemGenerateIntervalId)
      this.itemGenerateIntervalId = undefined
    }
  }

  private get itemGenerateNum(): number {
    const multiplier = 3 // プレイヤー数に掛ける倍率
    const baseOffset = 10 // 基本オフセット値
    const maxItemNum = 40 // 最大アイテム数
    return Math.min((this.churarenGameInfo?.joinedPlayerIds.length ?? 0) * multiplier + baseOffset, maxItemNum)
  }
}
