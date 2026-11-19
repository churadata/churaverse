import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface ExplosionBombData extends SendableObject {
  bombId: string
}

export class BombExplosionMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ExplosionBombData) {
    super('bombExplosion', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    bombExplosion: BombExplosionMessage
  }
}
