export interface ISharkCountDebugDetailScreen {
  update: (sharkCount: number) => void
  dump: () => string
}

export interface IBombCountDebugDetailScreen {
  update: (bombCount: number) => void
  dump: () => string
}
