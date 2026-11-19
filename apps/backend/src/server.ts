import http from 'node:http'
import { startScenes } from 'churaverse-engine-server'
import express from 'express'
import { defineConfig } from './defineConfig'

const app = express()
const server: http.Server = http.createServer(app)

const port = 12100
server.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

function shutdown(): void {
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(0), 3000).unref()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

app.get('/version', (_req: express.Request, res: express.Response) => {
  res.send(process.env.APP_VERSION)
})

defineConfig()
void startScenes(server)
