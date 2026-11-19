import type { IMainScene, ITitleScene, KnownKeyOf, Scenes } from 'churaverse-engine-client'
import type { BaseMessage } from './baseMessage'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TitleMessageMap {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MainMessageMap {}
export type MessageMap<Scene extends Scenes> = Scene extends ITitleScene
  ? TitleMessageMap & { [type: string]: BaseMessage<ITitleScene> }
  : Scene extends IMainScene
    ? MainMessageMap & { [type: string]: BaseMessage<IMainScene> }
    : never

export type MessageType<Scene extends Scenes> = KnownKeyOf<MessageMap<Scene>>
