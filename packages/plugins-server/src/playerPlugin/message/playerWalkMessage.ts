import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface PlayerWalkData extends SendableObject {
  startPos: Vector & SendableObject
  direction: Direction
  speed: number
}

export class PlayerWalkMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerWalkData) {
    super('playerWalk', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerWalk: PlayerWalkMessage
  }
}
