import { Position } from 'churaverse-engine-server'

export type LayerName = 'Collision' | 'Spawn' | 'Base'

export class WorldMap {
  private readonly spawnablePoint: number[][] = []
  private readonly walkablePoint: number[][] = []

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
    this.walkablePoint = this.getWalkablePoint()
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

  public getWalkablePoint(): number[][] {
    const collisionLayerArray = this.layerProperty.get('Collision')
    const freePoints: number[][] = []
    if (collisionLayerArray !== undefined) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (collisionLayerArray[x]?.[y] !== undefined) {
            if (!collisionLayerArray[x][y]) {
              freePoints.push([x, y])
            }
          }
        }
      }
    }

    return freePoints
  }

  /**
   * ランダムな座標を取得するメソッド
   * @param execludeCollision (optional) true: 侵入不可マスを除外するか
   */
  public getRandomPoint(execludeCollision: boolean = true): Position {
    // デフォルトでは、侵入不可マスを除外する
    if (!execludeCollision) {
      const randomX = Math.floor(Math.random() * this.width)
      const randomY = Math.floor(Math.random() * this.height)
      return new Position(randomX, randomY)
    }

    if (this.walkablePoint.length === 0) {
      throw new Error('walkableな座標が存在しません')
    }

    const [i, j] = this.walkablePoint[Math.floor(Math.random() * this.walkablePoint.length)]
    const randomPos = new Position(0, 0)
    randomPos.gridX = j
    randomPos.gridY = i
    return randomPos
  }
}
