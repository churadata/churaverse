export interface ICollisionCountDebugDetailScreen {
  update: (collision: number | undefined) => void
  dump: () => string
}
export interface ISpawnCountDebugDetailScreen {
  update: (spawn: number | undefined) => void
  dump: () => string
}
