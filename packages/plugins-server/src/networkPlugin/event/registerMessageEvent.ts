import { CVEvent, type IMainScene, type ITitleScene, type Scenes } from 'churaverse-engine-server'
import type { IMessageRegister } from '../interface/IMessageRegister'

/**
 * メッセージクラスの登録を行うフェーズ
 */
export class RegisterMessageEvent<Scene extends Scenes> extends CVEvent<Scenes> {
  public constructor(public readonly messageRegister: IMessageRegister<Scene>) {
    super('registerMessage', false)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    registerMessage: RegisterMessageEvent<IMainScene>
  }
  export interface CVTitleEventMap {
    registerMessage: RegisterMessageEvent<ITitleScene>
  }
}
