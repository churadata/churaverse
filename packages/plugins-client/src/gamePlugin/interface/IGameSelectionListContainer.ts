import type { GameSelectionListItemRenderer } from '../ui/gameList/gameSelectionListItemRenderer'

export interface IGameSelectionListContainer {
  node: HTMLElement
  addGame: (game: GameSelectionListItemRenderer) => void
}
