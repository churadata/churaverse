export interface IGhostPlayerListUi {
  initialize: () => void
  show: () => void
  updateGhostPlayerList: (playerNames: string[]) => void
  remove: () => void
}
