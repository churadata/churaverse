import { BaseMessage, type Sendable, type SendableObject } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface PlayerWalkData extends SendableObject {
  startPos: Vector & Sendable
  direction: Direction
  speed: number
}

export class PlayerWalkMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerWalkData) {
    super('playerWalk', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerWalk: PlayerWalkMessage
  }
}
