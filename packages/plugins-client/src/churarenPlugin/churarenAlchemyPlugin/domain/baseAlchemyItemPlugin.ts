import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-client'
import { BaseGamePlugin } from '@churaverse/game-plugin-client'
import type { PhaserLoadAssets } from 'churaverse-engine-client'
import { AlchemyItemManager } from '../alchemyItemManager'
import type { UseAlchemyItemEvent } from '../event/useAlchemyItemEvent'
import type { IAlchemyItem } from './IAlchemyItem'
import '@churaverse/churaren-core-plugin-client'
import '../store/defAlchemyPluginStore'

/**
 * 錬金アイテムのプラグインのベースクラス
 */
export abstract class BaseAlchemyItemPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  protected abstract alchemyItem: IAlchemyItem

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAlchemyItemAssets.bind(this))
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('churarenStartCountdown', this.setupAlchemyItem)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenStartCountdown', this.setupAlchemyItem)
  }

  private loadAlchemyItemAssets(ev: PhaserLoadAssets): void {
    AlchemyItemManager.loadAssets(ev.scene, this.alchemyItem.kind, this.alchemyItem.image)
  }

  private readonly setupAlchemyItem = (): void => {
    this.store.of('alchemyPlugin').alchemyItemManager.set(this.alchemyItem.kind, this.alchemyItem)
  }

  /**
   * 錬金アイテムを使用した際の錬金アイテム特有の処理
   */
  protected abstract useAlchemyItem(ev: UseAlchemyItemEvent): void
}
