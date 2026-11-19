import { CHURAREN_CONSTANTS, uniqueId } from '@churaverse/churaren-core-plugin-server'
import type { PlayerItemsStore } from '@churaverse/churaren-player-plugin-server'
import { MAX_ITEMS } from '@churaverse/churaren-player-plugin-server'
import type { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server'
import type { MapPluginStore } from '@churaverse/map-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import type { Player } from '@churaverse/player-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import type { AlchemyPot } from './domain/alchemyPot'
import { alchemyPotInfoToSendableObject, generatedAlchemyPot } from './domain/alchemyPotService'
import { type AlchemizeData, AlchemizeMessage } from './message/alchemizeMessage'
import { AlchemyPotSpawnMessage } from './message/alchemyPotSpawnMessage'
import type { AlchemyPluginStore } from './store/defAlchemyPluginStore'
import { initAlchemyPluginStore } from './store/initAlchemyPluginStore'
import '@churaverse/churaren-core-plugin-server'
import type { ItemPluginStore } from '@churaverse/churaren-item-plugin-server'
import { AlchemyItem } from './domain/alchemyItem'
import type { ClearAlchemyItemBoxEvent } from './event/clearAlchemyItemBoxEvent'

export class ChurarenAlchemyPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private alchemyPluginStore!: AlchemyPluginStore
  private mapPluginStore!: MapPluginStore
  private playerItemStore!: PlayerItemsStore
  private itemPluginStore!: ItemPluginStore
  private socketController?: SocketController

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

  private init(): void {
    initAlchemyPluginStore(this.store)
    this.networkPluginStore = this.store.of('networkPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
    this.alchemyPluginStore = this.store.of('alchemyPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('churarenStartTimer', this.sendSpawnAlchemyPot)
    this.bus.subscribeEvent('clearAlchemyItemBox', this.clearAlchemyItem)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenStartTimer', this.sendSpawnAlchemyPot)
    this.bus.unsubscribeEvent('clearAlchemyItemBox', this.clearAlchemyItem)
  }

  protected handleGameStart(): void {
    this.playerItemStore = this.store.of('playerItemStore')
    this.itemPluginStore = this.store.of('churarenItemPlugin')
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.alchemyPluginStore.alchemyPots.clear()
    this.socketController?.unregisterMessageListener()
  }

  private readonly sendSpawnAlchemyPot = (): void => {
    const currentMap = this.mapPluginStore.mapManager.currentMap
    const pots = generatedAlchemyPot(this.alchemyPluginStore.alchemyPots, currentMap)
    const alchemyPotSpawnMessage = new AlchemyPotSpawnMessage({ pots: alchemyPotInfoToSendableObject(pots) })
    this.networkPluginStore.messageSender.send(alchemyPotSpawnMessage)
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.alchemyPluginStore.alchemyPots,
      this.store.of('playerPlugin').players,
      this.alchemize.bind(this)
    )
  }

  private alchemize(_: AlchemyPot, player: Player): void {
    const game = this.gamePluginStore.games.get(this.gameId)
    if (
      game === undefined ||
      !game.joinedPlayerIds.includes(player.id) ||
      this.playerItemStore.alchemyItem.get(player.id) !== undefined
    )
      return

    const items = this.playerItemStore.materialItems.getAllItem(player.id)
    if (items.length !== MAX_ITEMS) return

    const alchemizedItemKind = this.itemPluginStore.alchemyItemManager.getByMaterialItems(
      items.map((item) => item.kind)
    )
    const deletedItemIds: string[] = items.map((item) => item.id)
    deletedItemIds.forEach((itemId) => {
      this.playerItemStore.materialItems.delete(player.id, itemId)
    })

    const alchemizedItem = new AlchemyItem(uniqueId(), alchemizedItemKind)

    const alchemizeData: AlchemizeData = {
      playerId: player.id,
      itemId: alchemizedItem.itemId,
      kind: alchemizedItem.kind,
      deletedItemIds,
    }

    this.playerItemStore.alchemyItem.set(player.id, alchemizedItem)

    const alchemizeMessage = new AlchemizeMessage(alchemizeData)
    this.networkPluginStore.messageSender.send(alchemizeMessage)
  }

  private readonly clearAlchemyItem = (ev: ClearAlchemyItemBoxEvent): void => {
    this.playerItemStore.alchemyItem.delete(ev.playerId)
  }
}
