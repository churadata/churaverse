import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface FlamePillarHitData extends SendableObject {
  flamePillarId: string
}

export class FlamePillarHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlamePillarHitData) {
    super('flamePillarHit', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    flamePillarHit: FlamePillarHitMessage
  }
}
