import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class NetworkConnectEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('networkConnect', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    networkConnect: NetworkConnectEvent
  }
}
