export interface IGameAbortAlertConfirm {
  showAlert: () => boolean
  setGameAbortMessage: (gameName: string) => void
}
