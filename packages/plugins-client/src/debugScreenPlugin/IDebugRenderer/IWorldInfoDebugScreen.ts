export interface IWorldNameDebugScreen {
  update: (name: string) => void
  dump: () => string
}

export interface IWorldSizeDebugScreen {
  update: (map: Phaser.Tilemaps.Tilemap) => void
  dump: () => string
}

export interface IWorldFpsDebugScreen {
  update: () => void
  dump: () => string
}

export interface IWorldFrontendVersionDebugScreen {
  update: () => void
  dump: () => string
}

export interface IWorldBackendVersionDebugScreen {
  update: () => void
  dump: () => string
}

export interface IWorldDeployVersionDebugScreen {
  update: () => void
  dump: () => string
}

export interface IPlayerCountInWorld {
  update: (playerCount: number) => void
  dump: () => string
}
