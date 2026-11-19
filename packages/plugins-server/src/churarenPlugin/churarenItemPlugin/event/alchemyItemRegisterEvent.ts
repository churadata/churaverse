import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { IAlchemyItemRegister } from '../interface/IAlchemyItemRegister'

export class AlchemyItemRegisterEvent extends CVEvent<IMainScene> {
  public constructor(public readonly alchemyItemRegister: IAlchemyItemRegister) {
    super('alchemyItemRegister', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    alchemyItemRegister: AlchemyItemRegisterEvent
  }
}
