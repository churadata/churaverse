import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class NetworkDisconnectEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('networkDisconnect', true)
  }
}

declare module 'churaverse-engine-client' {
  interface CVMainEventMap {
    networkDisconnect: NetworkDisconnectEvent
  }
}
