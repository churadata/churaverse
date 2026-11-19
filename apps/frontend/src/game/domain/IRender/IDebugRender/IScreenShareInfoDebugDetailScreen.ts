export interface IScreenShareMyStatusDebugDetailScreen {
  update: (isOn: boolean) => void
  dump: () => string
}

export interface IScreenShareIdDebugDetailScreen {
  add: (Id: string) => void
  delete: (Id: string) => void
  dump: () => string
}
