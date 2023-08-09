import { Player } from '../../domain/model/player'

export interface ISocketEventEmitter {
  emitNewPlayer: (socketId: string, player: Player) => void
  emitLeavePlayer: (socketId: string) => void
  requestKickPlayer: (kickedId: string, kickerId: string) => void
}
