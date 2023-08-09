import { PlayerColorName } from '../domain/model/types'

export interface PlayerColorChangeUseCase {
  changePlayerColor: (id: string, color: PlayerColorName) => void
}
