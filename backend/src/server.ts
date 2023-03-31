import http from 'http'
import socketio from 'socket.io'
import express from 'express'

import OutputDataQueue from './queueData'
import EventQueue from './eventQueue'
import Database from './database'
import { ErrorHandle } from './errorHandle'

export type MainLoopTaskType = 'event' | 'cutin' | 'main'
export type ActionNameSendEveryone =
  | 'shark'
  | 'bomb'
  | 'walk'
  | 'profile'
  | 'turn'
export type ActionNameSendOther = 'chat'

interface ReceivedAction {
  type: ActionNameSendEveryone | ActionNameSendOther
  infos: any[]
}
export interface ReceivedPacket {
  id: string
  emitTime: number
  actions: ReceivedAction[]
}

const app = express()
const server: http.Server = http.createServer(app)

const io: socketio.Server = new socketio.Server(server, {
  cors: {
    origin: process.env.BACKEND_CORS,
  },
})

const queueData = new OutputDataQueue()

const errorHandle: ErrorHandle = new ErrorHandle()

const db = new Database()

let mainLoopTaskType: MainLoopTaskType = 'main'
const eventQueue = new EventQueue()

io.on('connection', (socket: socketio.Socket) => {
  console.log('connect')
  console.log('id:', socket.id)
  console.log('ip: ' + socket.handshake.address)

  socket.on('enterPlayer', function () {
    queueData.addUserQueueData(socket.id)
    db.addPlayer(socket.id)
    socket.broadcast.emit(
      'newPlayer',
      db.playerManager.allPlayerInfos.get(socket.id)
    )
  })

  /**
   * 切断時の処理: id参照してプレイヤー情報を削除
   * disconnectのイベントはsocket.io由来
   * https://socket.io/docs/v4/server-socket-instance/#disconnect
   */
  socket.on('disconnect', function () {
    db.removePlayer(socket.id)

    io.emit('disconnected', socket.id)
  })

  socket.on('requestPreloadedData', (callback) => {
    const emitData = {
      existPlayers: Object.fromEntries(db.playerManager.allPlayerInfos),
    }
    try {
      callback(emitData)
    } catch (err) {
      errorHandle.showErrorLog(err)
    }
  })

  socket.on('checkConnect', (callback) => {
    const emitData = {
      // どうしてmethodで実装してないんですか
      existPlayers: db.playerManager.allPlayerInfos,
    }
    try {
      callback(emitData)
    } catch (err) {
      errorHandle.showErrorLog(err)
    }
  })

  // 受信キュー
  socket.on('emitAction', function (data: ReceivedPacket) {
    try {
      db.updateWhenReceivePacket(data, socket, errorHandle)
      void queueData.insertReceiveQueueData(data, 'sendOther')
    } catch (err: any) {
      errorHandle.showErrorLog(err, db.playerManager.allPlayerInfos)
    }
  })

  socket.on('emitAllPlayersAction', function (data: ReceivedPacket) {
    try {
      void queueData.insertReceiveQueueData(data, 'sendEveryone')
    } catch (err: any) {
      errorHandle.showErrorLog(err, db.playerManager.allPlayerInfos)
    }
  })
})

// msミリ秒待つ関数
const wait = async (ms: number): Promise<number> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

// 10ms毎に返すメインループ
void (async (): Promise<void> => {
  while (true) {
    switch (mainLoopTaskType) {
      case 'event': {
        // console.log('イベントの実施');
        mainLoopTaskType = await eventQueue.executeEvent(mainLoopTaskType)
        break
      }
      case 'cutin': {
        // console.log('カットイン');
        mainLoopTaskType = 'main'
        break
      }
      case 'main': {
        const sendData = await queueData.getQueueData()
        const playerInfo = db.playerManager.allPlayerInfos.keys()
        for (const socketId of playerInfo) {
          if (sendData[socketId].length !== 0) {
            await io.to(socketId).emit('playersAct', sendData[socketId])
            queueData.initTargetData(socketId)
          }
        }
        const now = Date.now()
        // どうしてplayerの情報をここで渡しているんですか?
        db.bombManager.update(now, db.playerManager)
        db.sharkManager.update(now, db.playerManager)
        db.playerManager.update(now)
        break
      }
      default: {
        const strangeValue: never = mainLoopTaskType
        // mainLoopTaskTypeが存在しない型のときに検知できるようにするためnever型にしてます。
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`${strangeValue} is not mainLoopTaskType`)
      }
    }
    await wait(10)
  }
})()

// イベントをテストするためのAPI
app.get('/timestop', (req: express.Request, res: express.Response) => {
  mainLoopTaskType = 'event'
  eventQueue.insertEventQueue('timestop')
  res.send(JSON.stringify('OK'))
})

app.get('/version', (req: express.Request, res: express.Response) => {
  res.send(process.env.APP_VERSION)
})

const port = 12100
server.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
