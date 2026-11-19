import type { UseAlchemyItemEvent } from '@churaverse/churaren-alchemy-plugin-client'
import { BaseAlchemyItemPlugin, ClearAlchemyItemBoxEvent } from '@churaverse/churaren-alchemy-plugin-client'
import { SocketController } from './controller/socketController'
import { REVIVAL_ITEM, RevivalItem } from './domain/revivalItem'
import { UseRevivalItemMessage } from './message/useRevivalItemMessage'
import type { RevivalItemPluginStore } from './store/defRevivalItemPluginStore'
import { initRevivalPluginStore, resetRevivalPluginStore } from './store/initRevivalPluginStore'

export class RevivalItemPlugin extends BaseAlchemyItemPlugin {
  private revivalItemPluginStore!: RevivalItemPluginStore
  private socketController?: SocketController
  protected alchemyItem = REVIVAL_ITEM

  public listenEvent(): void {
    super.listenEvent()

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
  }

  protected handleGameStart(): void {
    initRevivalPluginStore(this.store)
    this.revivalItemPluginStore = this.store.of('churarenRevivalItemPlugin')
  }

  protected handleGameTermination(): void {
    resetRevivalPluginStore(this.store)
  }

  protected handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'revivalItem') return
    const revival = new RevivalItem(
      ev.alchemyItem.itemId,
      ev.ownPlayer.id,
      ev.ownPlayer.position,
      ev.ownPlayer.direction,
      Date.now()
    )
    this.revivalItemPluginStore.revivalItems.set(revival.revivalItemId, revival)

    if (revival.ownerId === this.store.of('playerPlugin').ownPlayerId) {
      const useRevivalItemMessage = new UseRevivalItemMessage({ playerId: revival.ownerId })
      this.store.of('networkPlugin').messageSender.send(useRevivalItemMessage)
    }

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)
  }
}
