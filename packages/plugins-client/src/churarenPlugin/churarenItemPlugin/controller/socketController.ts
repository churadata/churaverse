import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import { BaseSocketController } from '@churaverse/network-plugin-client'
import { type IEventBus, type IMainScene, Position, type Store } from 'churaverse-engine-client'
import { Item } from '../domain/item'
import { ChurarenItemDespawnEvent } from '../event/churarenItemDespawnEvent'
import { ChurarenItemSpawnEvent } from '../event/churarenItemSpawnEvent'
import { ChurarenItemDespawnMessage } from '../message/churarenItemDespawnMessage'
import { ChurarenItemSpawnMessage } from '../message/churarenItemSpawnMessage'
import type { ItemPluginStore } from '../store/defItemPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  private itemPluginStore!: ItemPluginStore
  public messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('churarenItemSpawn', ChurarenItemSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('churarenItemDespawn', ChurarenItemDespawnMessage, 'queue')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public getStore(): void {
    this.itemPluginStore = this.store.of('churarenItemPlugin')
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('churarenItemSpawn', this.itemSpawn)
    this.messageListenerRegister.on('churarenItemDespawn', this.itemDespawn)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('churarenItemSpawn', this.itemSpawn)
    this.messageListenerRegister.off('churarenItemDespawn', this.itemDespawn)
  }

  private readonly itemSpawn = (msg: ChurarenItemSpawnMessage): void => {
    const items: Item[] = []
    for (const [itemId, itemInfo] of Object.entries(msg.data.items)) {
      const pos = new Position(itemInfo.startPos.x, itemInfo.startPos.y)
      const item = new Item(itemId, pos, itemInfo.spawnTime, itemInfo.kind)
      items.push(item)
    }

    // ChurarenItemSpawnEventでまとめてアイテムを送信
    const itemSpawnEvent = new ChurarenItemSpawnEvent(items)
    this.eventBus.post(itemSpawnEvent)
  }

  private readonly itemDespawn = (msg: ChurarenItemDespawnMessage): void => {
    const data = msg.data
    const deleteItemIds = data.itemIds.filter((id) => this.itemPluginStore.items.has(id))
    const itemDespawnEvent = new ChurarenItemDespawnEvent(deleteItemIds)
    this.eventBus.post(itemDespawnEvent)
  }
}
