import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface BossWalkData extends SendableObject {
  startPos: Vector & SendableObject
  dest: Vector & SendableObject
  direction: Direction
  speed: number
  bossId: string
}

export class BossWalkMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossWalkData) {
    super('bossWalk', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    bossWalk: BossWalkMessage
  }
}
