import { CVEvent, type IMainScene, type ITitleScene, type Scenes } from 'churaverse-engine-client'
import type { IMessageListenerRegister } from '../interface/IMessageListenerRegister'

/**
 * RegisterMessageイベントで登録したMessageのListenerを登録するフェーズ
 */
export class RegisterMessageListenerEvent<Scene extends Scenes> extends CVEvent<Scenes> {
  public constructor(public readonly messageListenerRegister: IMessageListenerRegister<Scene>) {
    super('registerMessageListener', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    registerMessageListener: RegisterMessageListenerEvent<IMainScene>
  }
  export interface CVTitleEventMap {
    registerMessageListener: RegisterMessageListenerEvent<ITitleScene>
  }
}
