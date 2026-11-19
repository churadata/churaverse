import { Position } from 'churaverse-engine-client'

export type LayerName = 'Collision' | 'Spawn' | 'Base'

export class WorldMap {
  private readonly spawnablePoint: number[][] = []

  public constructor(
    public readonly mapId: string,
    public readonly displayName: string,
    public readonly height: number,
    public readonly width: number,
    public readonly heightTileNum: number,
    public readonly widthTileNum: number,
    public readonly gridSize: number,
    public readonly layerProperty: Map<string, boolean[][]>
  ) {
    this.spawnablePoint = this.getSpawnablePoint()
  }

  /**
   * ランダムなスポーンポイントを取得するメソッド
   */
  public getRandomSpawnPoint(): Position {
    // スポーン可能な座標の配列からランダムに座標を取得する
    if (this.spawnablePoint.length === 0) {
      // 配列が空の場合、エラーを表示する
      throw new Error('spawn可能な座標が存在しません')
    }
    // スポーン可能なインデックスをランダムで取得する。
    const [i, j] = this.spawnablePoint[Math.floor(Math.random() * this.spawnablePoint.length)]
    const spawnPos = new Position(0, 0)
    spawnPos.gridX = j
    spawnPos.gridY = i
    // ランダムなスポーン座標を返す
    return spawnPos
  }

  /**
   * スポーン可能なポイントの座標情報を取得する
   */
  private getSpawnablePoint(): number[][] {
    const spawnAvailabilityArray = this.layerProperty.get('Spawn')
    // Spawn用のレイヤーが存在しない時、マップの中心座標を返す
    if (spawnAvailabilityArray === undefined) {
      const center = new Position(this.height / 2, this.width / 2)
      return [[center.gridX, center.gridY]]
    }
    // mapが変更されるたびに書き換えが行われるため
    const trueIndices: number[][] = []

    // 2次元配列を走査して true の座標を収集
    for (let i = 0; i < spawnAvailabilityArray.length; i++) {
      for (let j = 0; j < spawnAvailabilityArray[i].length; j++) {
        if (spawnAvailabilityArray[i][j]) {
          trueIndices.push([i, j])
        }
      }
    }
    // スポーン可能な座標のインデックス情報を返す
    return trueIndices
  }

  /**
   * 引数の座標がワールド内であればtrue
   */
  public inWorld(pos: Position): boolean {
    return pos.x <= this.width && pos.x >= 0 && pos.y <= this.height && pos.y >= 0
  }
}
