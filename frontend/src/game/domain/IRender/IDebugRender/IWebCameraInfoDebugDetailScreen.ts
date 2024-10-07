export interface IWebCameraMyStatusDebugDetailScreen {
  update: (isOn: boolean) => void
  dump: () => string
}

export interface IWebCameraIdDebugDetailScreen {
  add: (Id: string) => void
  delete: (Id: string) => void
  dump: () => string
}
