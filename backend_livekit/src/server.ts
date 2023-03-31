import chalk from 'chalk'
import cors from 'cors'
import express from 'express'
import { AccessToken } from 'livekit-server-sdk'

if (
  process.env.LIVEKIT_API_KEY == null ||
  process.env.LIVEKIT_API_SECRET == null
) {
  console.error(
    chalk.red('Error: No value set for LIVEKIT_API_KEY or LIVEKIT_API_SECRET')
  )
}

const apiKey = process.env.LIVEKIT_API_KEY
const apiSecret = process.env.LIVEKIT_API_SECRET

function getAccessToken(roomName: string, userName: string): string {
  const at = new AccessToken(apiKey, apiSecret, {
    identity: userName,
  })
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  })
  return at.toJwt()
}

const app = express()
const port = process.env.PORT ?? 12150
const corsOptions: cors.CorsOptions = {
  origin: process.env.ALLOW_ORIGIN,
}

app.use(cors(corsOptions))

app.get('/', (req, res) => {
  const { roomName, userName } = req.query

  if (typeof roomName !== 'string' || typeof userName !== 'string') {
    res.status(400).send('400 Bad Request')
    return
  }

  const token = getAccessToken(roomName, userName)
  res.json({ token })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
