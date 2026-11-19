import type { IMainScene, Store } from 'churaverse-engine-client'
import { PopUpScreenList } from '../ui/popUpScreenList'

export function initVideoStore(store: Store<IMainScene>): void {
  store.setInit('popUpScreenList', new PopUpScreenList())
}
