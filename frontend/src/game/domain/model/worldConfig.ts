export const GRID_SIZE = 40

export class WorldConfig {
  private _currentMapName: string

  public constructor(currentMap: string) {
    this._currentMapName = currentMap
  }

  public setMap(mapName: string): void {
    this._currentMapName = mapName
  }

  public get currentMap(): string {
    return this._currentMapName
  }
}
