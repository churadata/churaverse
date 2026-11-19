import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface FlamePillarHitData extends SendableObject {
  flamePillarId: string
}

export class FlamePillarHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlamePillarHitData) {
    super('flamePillarHit', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    flamePillarHit: FlamePillarHitMessage
  }
}
