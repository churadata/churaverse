import http from 'http'
import express from 'express'

import { startScenes } from 'churaverse-engine-server'
import { defineConfig } from './defineConfig'

const app = express()
const server: http.Server = http.createServer(app)

const port = 12100
server.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

app.get('/version', (req: express.Request, res: express.Response) => {
  res.send(process.env.APP_VERSION)
})

defineConfig()
void startScenes(server)
