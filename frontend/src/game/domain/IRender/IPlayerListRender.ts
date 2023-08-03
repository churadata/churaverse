import { Player } from '../model/player'

export interface IPlayerListRender {
  updatePlayerList: (ownPlayerId: string, players: Map<string, Player>) => void
}
