import {
  ActionFromClient,
  ActionFromServer,
  SocketListenActionType,
  ReceiveData,
  EmitData,
} from './actionTypes'
import { TransmitQueueBuffers } from './queue/ITransmitQueue'

/**
 * 受信キューから取り出したパケットを送信用の構造に変換する
 */
export function convertForTransmit(
  receivedPackets: ReceiveData[],
  playerIds: string[]
): TransmitQueueBuffers {
  const queueBuffers = new Map<string, EmitData>()
  for (const playerId of playerIds) {
    queueBuffers.set(playerId, [])
  }

  receivedPackets.forEach((receivedPacket) => {
    receivedPacket.actions.forEach((action) => {
      const unpackedAction = unpack<typeof action.type>(
        receivedPacket.id,
        action
      )
      for (const playerId of playerIds) {
        if (receivedPacket.id !== playerId) {
          queueBuffers.get(playerId)?.push(...unpackedAction)
        }
      }
    })
  })

  return queueBuffers
}

/**
 * 受信キューから取り出したパケットを送信用の構造に変換する
 * 送信先の振り分けをしない
 */
export function convertForTransmitWithoutDestSorting(
  receivedPackets: ReceiveData[]
): EmitData {
  const sendData: EmitData = []

  receivedPackets.forEach((receivedPacket) => {
    receivedPacket.actions.forEach((action) => {
      sendData.push(...unpack<typeof action.type>(receivedPacket.id, action))
    })
  })

  return sendData
}

/**
 * infosを分割
 * { type: shark, infos:[サメの情報1, サメの情報2, サメの情報3] }を受け取って
 * [{ type: shark, info: サメの情報1 }, { type: shark, info: サメの情報2 }, { type: shark, info: サメの情報3}]に直す関数
 */
function unpack<T extends SocketListenActionType>(
  playerId: string,
  action: ActionFromClient<T>
): Array<ActionFromServer<T>> {
  const unpackedData: Array<ActionFromServer<T>> = []

  action.infos.forEach((info) => {
    const splittedData: ActionFromServer<T> = {
      type: action.type,
      info: Object.assign(info, { id: playerId }),
    }
    unpackedData.push(splittedData)
  })

  return unpackedData
}
