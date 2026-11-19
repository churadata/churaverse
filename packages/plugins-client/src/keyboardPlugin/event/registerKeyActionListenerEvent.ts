import { CVEvent, type IMainScene, type ITitleScene, type Scenes } from 'churaverse-engine-client'
import type { IKeyActionListenerRegister } from '../interface/IKeyActionListenerRegister'

export class RegisterKeyActionListenerEvent<Scene extends Scenes> extends CVEvent<Scenes> {
  public constructor(public readonly keyActionListenerRegister: IKeyActionListenerRegister<Scene>) {
    super('registerKeyActionListener', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    registerKeyActionListener: RegisterKeyActionListenerEvent<IMainScene>
  }
  export interface CVTitleEventMap {
    registerKeyActionListener: RegisterKeyActionListenerEvent<ITitleScene>
  }
}
