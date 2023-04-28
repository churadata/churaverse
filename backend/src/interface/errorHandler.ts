import { Socket } from './socket/socket'
import { IPlayerRepository } from '../domain/IRepository/IPlayerRepository'
import { SocketEmitEventType } from './socket/eventTypes'

/**
 * プレイヤーに画面のリロードを要求する
 */
export function inviteReload(socket: Socket, id: string): void {
  socket.emitEventTo(SocketEmitEventType.NotExistsPlayer, id)
}

export function error(err: Error): void {
  if (err instanceof TypeError) {
    console.log(err.name + ': ' + err.message)

    console.log(err.stack) // 存在しないsocket idを参照した際に出るエラー
  } else {
    console.log(err.name.concat(':', err.message))
    console.log('未確認なエラー'.concat(err.stack ?? 'stack is undefined'))
  }
}

export function showPlayers(players: IPlayerRepository): void {
  console.log('player-list', players.getAllId())
}
