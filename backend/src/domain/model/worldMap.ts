import { Position } from '../core/position'

export class WorldMap {
  public constructor(
    public readonly height: number,
    public readonly width: number,
    public readonly heightTileNum: number,
    public readonly widthTileNum: number,
    public readonly gridSize: number,
    public readonly collision: boolean[][] // trueの場合通行不可マス
  ) {}

  /**
   * 侵入可能なマスならtrueを返す
   */
  public canEnter(low: number, col: number): boolean {
    return !this.collision[low][col]
  }

  /**
   * ワールド内のランダムなタイル番号を返す
   * withoutCollisionTileがtrueなら侵入不可マスは返さない
   */
  public getRandomTileNum(excludeCollisionTile = true): [number, number] {
    const indices = this.shuffle([
      ...Array(this.heightTileNum * this.widthTileNum).keys(),
    ])
    for (const index of indices) {
      const i = Math.floor(index / this.widthTileNum)
      const j = index % this.widthTileNum

      // excludeCollisionTileがfalseの場合, canEnter()=falseでもreturn
      if (this.canEnter(i, j) || !excludeCollisionTile) {
        return [i, j]
      }
    }

    console.log('すべてのタイルにcollisionが設定されている')
    return [-1, -1]
  }

  /**
   * ワールド内のランダムな座標を返す
   * 必ずマス目の中心の座標を返す
   * withoutCollisionTileがtrueなら侵入不可マスは返さない
   */
  public getRandomPos(excludeCollisionTile = true): Position {
    const [i, j] = this.getRandomTileNum(excludeCollisionTile)
    const spawnPos = new Position(0, 0)
    spawnPos.gridX = j
    spawnPos.gridY = i
    return spawnPos
  }

  private shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
}
