import { Scene } from 'phaser'
import { SharedScreenRender } from '../Render/entity/sharedScreenRender'
import { Position } from '../../../domain/model/core/position'
import { GRID_SIZE, WorldConfig } from '../../../domain/model/worldConfig'

// マップごとの画面共有位置を指定
const SCREEN_POSITION: Map<string, Position> = new Map<string, Position>([
  ['Map.json', new Position(800 - GRID_SIZE / 2, 400 - GRID_SIZE / 2)],
  ['Map2.json', new Position(800 - GRID_SIZE / 2, 800 - GRID_SIZE / 2)],
])

export class SharedScreenRenderFactory {
  public constructor(private readonly scene: Scene, private readonly worldConfig: WorldConfig) {}

  public async build(stream: MediaStream): Promise<SharedScreenRender> {
    return await SharedScreenRender.build(this.scene, stream, SCREEN_POSITION.get(this.worldConfig.currentMap))
  }
}
