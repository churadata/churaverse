import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface BossAttackHitData extends SendableObject {
  bossAttackId: string
}

export class BossAttackHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossAttackHitData) {
    super('bossAttackHit', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    bossAttackHit: BossAttackHitMessage
  }
}
