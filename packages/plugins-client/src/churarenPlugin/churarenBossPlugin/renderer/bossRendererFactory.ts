import type { Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type { IBossRenderer } from '../domain/IBossRenderer'
import type { IBossRendererFactory } from '../domain/IBossRendererFactory'
import { BossRenderer } from './bossRenderer'

export class BossRendererFactory implements IBossRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(position: Position, bossHP: number): IBossRenderer {
    return new BossRenderer(this.scene, position, bossHP)
  }
}
