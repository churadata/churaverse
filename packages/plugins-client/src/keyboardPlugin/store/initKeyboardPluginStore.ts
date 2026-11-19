import { type Scenes, SceneUndefinedError, type Store } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type { IKeyStateGetter } from '../interface/IKeyStateGetter'
import type { KeyActionManager } from '../keyActionManager'

export function initKeyboardPluginStore(
  store: Store<Scenes>,
  scene: Scene | undefined,
  keyActionManager: KeyActionManager<Scenes>,
  keyStateGetter: IKeyStateGetter
): void {
  if (scene === undefined) throw new SceneUndefinedError()

  // const cookieRepository = new CookieStore()
  // const keyboardSettingSetupInfoReader = new KeyboardSetupInfoReader(cookieRepository)
  // const keyConfiguration = new KeyConfiguration(keyboardSettingSetupInfoReader)
  // const keyboardHelper = new KeyboardHelper(scene, keyConfiguration)

  store.setInit('keyboardPlugin', {
    keyActionRebinder: keyActionManager,
    keyFactorySetter: keyActionManager,
    keyActionDispatcher: keyActionManager,
    keyStateGetter,
    keySettingWindow: undefined,
  })
}
