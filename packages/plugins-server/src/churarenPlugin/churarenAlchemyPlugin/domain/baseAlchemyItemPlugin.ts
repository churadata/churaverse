import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import type { AlchemyItemRegisterEvent } from '@churaverse/churaren-item-plugin-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server'
import type { IAlchemyItem } from './IAlchemyItem'

/**
 * 錬金アイテムプラグインのベースクラス
 * 各錬金アイテムプラグインはこのクラスを継承し、`alchemyItem` プロパティを実装する必要がある。
 * @property {IAlchemyItem} alchemyItem - 錬金アイテムの情報を持つオブジェクト
 */
export abstract class BaseAlchemyItemPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  protected abstract alchemyItem: IAlchemyItem

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('alchemyItemRegister', this.onAlchemyItemRegister)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('alchemyItemRegister', this.onAlchemyItemRegister)
  }

  private readonly onAlchemyItemRegister = (ev: AlchemyItemRegisterEvent): void => {
    ev.alchemyItemRegister.register(this.alchemyItem.recipe, this.alchemyItem.kind)
  }
}
