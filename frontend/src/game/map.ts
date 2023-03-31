import 'phaser'

export class Map {
  constructor(private readonly import_path: string) {
    this.import_path = import_path
  }

  public map?: Phaser.Tilemaps.Tilemap
  public tiles?: Phaser.Tilemaps.Tileset

  // 20 * 40

  /**
   * mapのパス
   * @returns import_pathを返す
   */

  public get getMapPath(): string {
    return this.import_path
  }
}
