import type { IMainScene, ITitleScene, Scenes } from 'churaverse-engine-client'
import type { IKeyActionDispatcher } from '../interface/IKeyActionDispatcher'
import type { IKeyActionKeyCodeBinder } from '../interface/IKeyActionKeyCodeBinder'
import type { IKeyFactorySetter } from '../interface/IKeyFactorySetter'
import type { IKeyStateGetter } from '../interface/IKeyStateGetter'
import type { IKeyboardSettingPopUpWindow } from '../ui/interface/IKeySettingPopUpWindow'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    keyboardPlugin: KeyboardPluginStore<IMainScene>
  }

  export interface StoreInTitle {
    keyboardPlugin: KeyboardPluginStore<ITitleScene>
  }
}

export interface KeyboardPluginStore<Scene extends Scenes> {
  readonly keyActionRebinder: IKeyActionKeyCodeBinder<Scene>
  readonly keyFactorySetter: IKeyFactorySetter
  readonly keyActionDispatcher: IKeyActionDispatcher<Scene>
  readonly keyStateGetter: IKeyStateGetter
  keySettingWindow: IKeyboardSettingPopUpWindow
}
