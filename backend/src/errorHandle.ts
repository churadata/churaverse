import { Socket } from 'socket.io'
import Database from './database'
import { PlayerInfo, Players } from './playerManager'
import { ReceivedPacket } from './server'

export class ErrorHandle {
  players: Players = new Map<string, PlayerInfo>()

  public inviteReload(socket: Socket, db: Database): void {
    socket.emit('NotExistsPlayer', db.playerManager.allPlayerInfos)
  }

  public showErrorLog(err: any, players?: Players): void {
    if (err instanceof TypeError) {
      console.log(err.name + ': ' + err.message)
      if (players !== undefined) {
        console.log('player-list', Object.keys(players))
      }
      console.log(err.stack) // 存在しないsocket idを参照した際に出るエラー
    } else {
      console.log(err.name.concat(':', err.message))
      console.log('未確認なエラー'.concat(err.stack))
    }
  }

  public inviteReloadIfNoneExistedId(
    data: ReceivedPacket,
    socket: Socket,
    db: Database
  ): void {
    if (this.players.get(data.id) === undefined) {
      console.log(this.players)
      console.log('存在しないidです')
      this.inviteReload(socket, db)
    }
  }
}
