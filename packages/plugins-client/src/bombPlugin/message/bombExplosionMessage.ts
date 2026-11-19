import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface ExplosionBombData extends SendableObject {
  bombId: string
}

export class BombExplosionMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ExplosionBombData) {
    super('bombExplosion', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    bombExplosion: BombExplosionMessage
  }
}
