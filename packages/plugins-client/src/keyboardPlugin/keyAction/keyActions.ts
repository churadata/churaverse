import type { IMainScene, ITitleScene, KnownKeyOf, Scenes } from 'churaverse-engine-client'
import type { KeyAction } from './keyAction'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TitleKeyActionMap {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MainKeyActionMap {}

export type KeyActionMap<Scene extends Scenes> = Scene extends ITitleScene
  ? TitleKeyActionMap & { [type: string]: KeyAction<ITitleScene> }
  : Scene extends IMainScene
    ? MainKeyActionMap & { [type: string]: KeyAction<IMainScene> }
    : never

export type KeyActionType<Scene extends Scenes> = KnownKeyOf<KeyActionMap<Scene>>
