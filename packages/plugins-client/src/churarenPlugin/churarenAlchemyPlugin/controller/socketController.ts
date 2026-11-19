import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import { BaseSocketController } from '@churaverse/network-plugin-client'
import { type IEventBus, type IMainScene, Position, type Store } from 'churaverse-engine-client'
import type { AlchemyItemKind } from '../domain/alchemyItemKind'
import { AlchemyPot } from '../domain/alchemyPot'
import { AlchemizeEvent } from '../event/alchemizeEvent'
import { AlchemyPotSpawnEvent } from '../event/alchemyPotSpawnEvent'
import { ClearAlchemyItemBoxEvent } from '../event/clearAlchemyItemBox'
import { AlchemizeMessage } from '../message/alchemizeMessage'
import { type AlchemyPotInfo, AlchemyPotSpawnMessage } from '../message/alchemyPotSpawnMessage'
import { ClearAlchemyItemBoxMessage } from '../message/clearAlchemyItemBoxMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('alchemyPotSpawn', AlchemyPotSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('alchemize', AlchemizeMessage, 'queue')
    ev.messageRegister.registerMessage('clearAlchemyItemBox', ClearAlchemyItemBoxMessage, 'queue')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('alchemyPotSpawn', this.alchemySpawn)
    this.messageListenerRegister.on('alchemize', this.alchemize)
    this.messageListenerRegister.on('clearAlchemyItemBox', this.clearAlchemyItemBox)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('alchemyPotSpawn', this.alchemySpawn)
    this.messageListenerRegister.off('alchemize', this.alchemize)
    this.messageListenerRegister.off('clearAlchemyItemBox', this.clearAlchemyItemBox)
  }

  private readonly alchemySpawn = (msg: AlchemyPotSpawnMessage): void => {
    const alcheyPots: AlchemyPot[] = []
    for (const [potId, potInfo] of Object.entries(msg.data.pots)) {
      alcheyPots.push(this.setAlchemhyPot(potId, potInfo))
    }
    const alchemySpawnEvent = new AlchemyPotSpawnEvent(alcheyPots)
    this.eventBus.post(alchemySpawnEvent)
  }

  private setAlchemhyPot(potId: string, potInfo: AlchemyPotInfo): AlchemyPot {
    const pos = new Position(potInfo.spawnPos.x, potInfo.spawnPos.y)
    const pot = new AlchemyPot(potId, pos)
    return pot
  }

  private readonly alchemize = (msg: AlchemizeMessage): void => {
    const data = msg.data
    const alchmizeEvent = new AlchemizeEvent(
      data.playerId,
      data.itemId,
      data.kind as AlchemyItemKind,
      data.deletedItemIds
    )
    this.eventBus.post(alchmizeEvent)
  }

  private readonly clearAlchemyItemBox = (msg: ClearAlchemyItemBoxMessage): void => {
    const data = msg.data
    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(data.playerId)
    this.eventBus.post(clearAlchemyItemBoxEvent)
  }
}
