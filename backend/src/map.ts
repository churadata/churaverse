import * as mapJSON from '../maps/Map.json'

export class MapManager {
  private heightTileNum!: number
  private widthTileNum!: number

  private readonly collisionMap: boolean[][] = [] // collisionが設定されているマスはtrue, そうでなければfalse

  private worldWidth!: number
  private worldHeight!: number

  static GRID_SIZE = 40

  constructor(mapName: string) {
    this.loadMap(mapName)
  }

  public reloadMap(mapName: string): void {
    this.loadMap(mapName)
  }

  private loadMap(mapName: string): void {
    let mapArray: any = mapJSON.layers[0].data
    this.heightTileNum = mapJSON.height
    this.widthTileNum = mapJSON.width

    this.worldHeight = MapManager.GRID_SIZE * this.heightTileNum
    this.worldWidth = MapManager.GRID_SIZE * this.widthTileNum

    mapArray = this.reshape(mapArray, this.heightTileNum, this.widthTileNum)

    const collisionIds: number[] = []

    const firstgid = mapJSON.tilesets[0].firstgid

    for (const tile of mapJSON.tilesets[0].tiles) {
      for (const property of tile.properties) {
        if (property.name === 'collision' && property.value) {
          collisionIds.push(tile.id + firstgid) // firstIdで指定した分だけtiles内の各idがずれる？
          break
        }
      }
    }

    for (let i = 0; i < this.heightTileNum; i++) {
      const row = []
      for (let j = 0; j < this.widthTileNum; j++) {
        if (collisionIds.includes(mapArray[i][j])) {
          row.push(true)
        } else {
          row.push(false)
        }
      }
      this.collisionMap.push(row)
    }
  }

  // 侵入可能なマスならtrueを返す
  public canEnter(low: number, col: number): boolean {
    return !this.collisionMap[low][col]
  }

  // ワールド内のランダムなタイル番号を返す
  // withoutCollisionTileがtrueなら侵入不可マスは返さない
  public getRandomTileNum(
    excludeCollisionTile: boolean = true
  ): [number, number] {
    const indices = this.shuffle([
      ...Array(this.HeightTileNum * this.widthTileNum).keys(),
    ])
    for (const index of indices) {
      const i = Math.floor(index / this.WidthTileNum)
      const j = index % this.WidthTileNum

      if (this.canEnter(i, j) || !excludeCollisionTile) {
        return [i, j]
      }
    }

    console.log('すべてのタイルにcollisionが設定されている')
    return [-1, -1]
  }

  // ワールド内のランダムな座標を返す
  // 必ずマス目の中心の座標を返す
  // withoutCollisionTileがtrueなら侵入不可マスは返さない
  public getRandomPos(excludeCollisionTile: boolean = true): {
    x: number
    y: number
  } {
    const [i, j] = this.getRandomTileNum(excludeCollisionTile)
    const spawnPos = {
      x: j * MapManager.GRID_SIZE,
      y: i * MapManager.GRID_SIZE,
    }
    return spawnPos
  }

  private shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  private reshape(array1d: number[], rows: number, cols: number): number[][] {
    const array2d: number[][] = []

    for (let r = 0; r < rows; r++) {
      const row = []
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        if (i < array1d.length) {
          row.push(array1d[i])
        }
      }
      array2d.push(row)
    }

    return array2d
  }

  public get WorldHeight(): number {
    return this.worldHeight
  }

  public get WorldWidth(): number {
    return this.worldWidth
  }

  public get HeightTileNum(): number {
    return this.heightTileNum
  }

  public get WidthTileNum(): number {
    return this.widthTileNum
  }
}
