import { styleText } from 'node:util'
import cors from 'cors'
import express from 'express'
import { AccessToken } from 'livekit-server-sdk'

if (process.env.LIVEKIT_API_KEY == null || process.env.LIVEKIT_API_SECRET == null) {
  console.error(styleText('red', 'Error: No value set for LIVEKIT_API_KEY or LIVEKIT_API_SECRET'))
}

const apiKey = process.env.LIVEKIT_API_KEY
const apiSecret = process.env.LIVEKIT_API_SECRET

async function getAccessToken(roomName: string, userName: string): Promise<string> {
  const at = new AccessToken(apiKey, apiSecret, {
    identity: userName,
  })
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  })
  return await at.toJwt()
}

const app = express()
const port = process.env.PORT ?? 12150
const corsOptions: cors.CorsOptions = {
  origin: process.env.ALLOW_ORIGIN,
}

app.use(cors(corsOptions))

app.get('/', (req, res, next) => {
  const { roomName, userName } = req.query

  if (typeof roomName !== 'string' || typeof userName !== 'string') {
    res.status(400).send('400 Bad Request')
    return
  }

  getAccessToken(roomName, userName)
    .then((token) => res.json({ token }))
    .catch(next)
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function shutdown(): void {
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(0), 3000).unref()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
