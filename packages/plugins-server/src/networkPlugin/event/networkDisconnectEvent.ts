import { CVEvent, type Scenes } from 'churaverse-engine-server'

/**
 * frontendとの通信切断時にpostされる
 */
export class NetworkDisconnectEvent extends CVEvent<Scenes> {
  public constructor(public readonly socketId: string) {
    super('networkDisconnect', false)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVTitleEventMap {
    networkDisconnect: NetworkDisconnectEvent
  }
  export interface CVMainEventMap {
    networkDisconnect: NetworkDisconnectEvent
  }
}
