import { CVEvent, type Scenes } from 'churaverse-engine-server'

/**
 * frontendとの通信接続時にpostされる
 */
export class NetworkConnectionEvent extends CVEvent<Scenes> {
  public constructor(public readonly socketId: string) {
    super('networkConnection', false)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVTitleEventMap {
    networkConnection: NetworkConnectionEvent
  }
  export interface CVMainEventMap {
    networkConnection: NetworkConnectionEvent
  }
}
