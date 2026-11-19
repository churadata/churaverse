import { DomManager, type IEventBus, type IMainScene, type Store } from 'churaverse-engine-client'
import { CHURAREN_CONSTANTS } from '../../constants/churarenConstants'
import { ChurarenDescriptionDialog } from './churarenDescriptionDialog'
import { RuleExplanationWindowComponent } from './component/RuleExplanationWindowComponent'

/**
 * ゲームリストにちゅられんを追加する関数
 */
export function setupChurarenDialog(bus: IEventBus<IMainScene>, store: Store<IMainScene>): void {
  const explanation = DomManager.addJsxDom(RuleExplanationWindowComponent())
  const popupChurarenRule = new ChurarenDescriptionDialog(bus, store)
  popupChurarenRule.createGameDescription(explanation)
  store.of('gamePlugin').gameDescriptionDialogManager.add(CHURAREN_CONSTANTS.GAME_ID, popupChurarenRule)
}
