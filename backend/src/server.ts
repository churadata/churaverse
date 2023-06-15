import http from 'http'
import express from 'express'

import { Socket } from './interface/socket/socket'
import { SocketController } from './adapter/controller/socketController'
import { Interactor } from './interactor/interactor'
import { PlayerRepository } from './adapter/repository/playerRepository'
import { SocketEmitter } from './interface/socket/socketEmitter'
import { SharkRepository } from './adapter/repository/sharkRepository'
import { MapManager } from './interface/map/mapManager'
import { BombRepository } from './adapter/repository/bombRepository'
import { error } from './interface/errorHandler'
import { MegaphoneUserRepository } from './adapter/repository/megaphoneUserRepository'

const app = express()
const server: http.Server = http.createServer(app)

const port = 12100
server.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

app.get('/version', (req: express.Request, res: express.Response) => {
  res.send(process.env.APP_VERSION)
})

const socket = new Socket(server)
void MapManager.build('Map.json')
  .then((mapManager) => {
    const interactor = new Interactor(
      mapManager,
      new PlayerRepository(mapManager.currentMap),
      new SharkRepository(mapManager.currentMap),
      new BombRepository(mapManager.currentMap),
      new MegaphoneUserRepository(),
      new SocketEmitter(socket)
    )

    const socketController = new SocketController(interactor, socket)
    return [interactor, socketController] as const
  })
  .then(([interactor, socketController]) => {
    let prevTime = Date.now()
    setInterval(() => {
      void new Promise<void>((resolve) => {
        const now = Date.now()
        const dt = now - prevTime
        prevTime = now
        interactor.update(dt)

        socketController.update()
        resolve()
      }).catch((err: Error) => {
        error(err)
      })
    }, 10)
  })
  .catch((err: Error) => error(err))
