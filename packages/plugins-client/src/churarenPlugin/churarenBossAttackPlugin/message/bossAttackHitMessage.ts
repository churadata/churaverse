import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface BossAttackHitData extends SendableObject {
  bossAttackId: string
}

export class BossAttackHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossAttackHitData) {
    super('bossAttackHit', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    bossAttackHit: BossAttackHitMessage
  }
}
