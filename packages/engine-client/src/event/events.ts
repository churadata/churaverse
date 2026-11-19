import type { IMainScene } from '../scene/IScene/IMainScene'
import type { ITitleScene } from '../scene/IScene/ITitleScene'
import type { Scenes } from '../scene/types'
import type { KnownKeyOf } from '../utilTypes/knownKeyOf'
import type { CVEvent } from './cvEvent'

/**
 * TitleSceneのEvent
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CVTitleEventMap {}

/**
 * MainSceneのEvent
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CVMainEventMap {}
export type CVEventMap<Scene extends Scenes> = Scene extends ITitleScene
  ? CVTitleEventMap & { [type: string]: CVEvent<ITitleScene> }
  : Scene extends IMainScene
    ? CVMainEventMap & { [type: string]: CVEvent<IMainScene> }
    : never

export type CVEventType<Scene extends Scenes> = KnownKeyOf<CVEventMap<Scene>>
