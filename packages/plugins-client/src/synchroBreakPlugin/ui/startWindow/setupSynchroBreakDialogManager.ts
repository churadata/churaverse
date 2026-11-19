import { DomManager, type IEventBus, type IMainScene, type Store } from 'churaverse-engine-client'
import { RuleExplanationWindowComponent } from './component/RuleExplanationWindowComponent'
import { PopupSynchroBreakRule } from './popupSynchroBreakRule'

/**
 * ゲームリストにシンクロブレイクを追加する関数
 */
export function setupSynchroBreakDialogManager(bus: IEventBus<IMainScene>, store: Store<IMainScene>): void {
  const explanation = DomManager.addJsxDom(RuleExplanationWindowComponent())
  const popupSynchroBreakRule = new PopupSynchroBreakRule(bus, store)
  popupSynchroBreakRule.createGameDescription(explanation)
  store.of('gamePlugin').gameDescriptionDialogManager.add('synchroBreak', popupSynchroBreakRule)
}
