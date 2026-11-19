import type { Scenes } from 'churaverse-engine-server'
import type { Packet } from '../socket/packet'

/**
 * 受信キュー
 * SocketListenEventType.EmitActionで受信したMessageのパケットが格納される
 */
export interface IReceiveQueue<Scene extends Scenes> {
  pushPacket: (packet: Packet<Scene>) => void
  popPacket: () => Packet<Scene>
  hasPacket: () => boolean
}
