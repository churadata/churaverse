import type http from 'node:http'
import type { IEventBus, Scenes } from 'churaverse-engine-server'
import socketio from 'socket.io'
import { NetworkConnectionEvent } from '../event/networkConnectionEvent'
import { NetworkDisconnectEvent } from '../event/networkDisconnectEvent'
import type { Packet } from './packet'

const SEND_PACKET_TO_SERVER = 'sendPacketToServer'
const SEND_PACKET_TO_CLIENT = 'sendPacketToClient'

/**
 * socket.ioのSocketクラスのラッパー
 */
export class Socket<Scene extends Scenes> {
  private static instance: Socket<Scenes>
  private readonly io: socketio.Server

  private constructor(server: http.Server) {
    this.io = new socketio.Server(server)
  }

  public static build<Scene extends Scenes>(server: http.Server): Socket<Scene> {
    if (Socket.instance !== undefined) {
      return Socket.instance
    }

    Socket.instance = new Socket(server)
    return Socket.instance
  }

  public listenPacket(packetListener: (packet: Packet<Scene>) => void): void {
    this.io.on('connection', (iosocket) => {
      iosocket.on(SEND_PACKET_TO_SERVER, packetListener)
    })
  }

  /**
   * socketIdで指定したプレイヤーに対してemit
   */
  public emitPacketTo(socketId: string, packet: Packet<Scene>): void {
    this.io.to(socketId).emit(SEND_PACKET_TO_CLIENT, packet)
  }

  /**
   * socketIdで指定したプレイヤーを除いた全プレイヤーに対してemit
   */
  public emitPacketBroadCastFrom(socketId: string, packet: Packet<Scene>): void {
    void this.io.fetchSockets().then((sockets) => {
      sockets.forEach((socket) => {
        if (socket.id !== socketId) {
          this.emitPacketTo(socketId, packet)
        }
      })
    })
  }

  /**
   * 全プレイヤーに対してemit
   */
  public emitPacketBroadCast(packet: Packet<Scene>): void {
    this.io.emit(SEND_PACKET_TO_CLIENT, packet)
  }

  /**
   * socket.ioのイベントをEventBusのイベントに変換する.
   *
   * socket.ioのデフォルトのイベントであるconnectionとdisconnectをEventBusのイベントに変換
   */
  public socketEventToBusEvent(eventBus: IEventBus<Scenes>): void {
    this.io.on('connection', (iosocket) => {
      eventBus.post(new NetworkConnectionEvent(iosocket.id))

      iosocket.on('disconnect', () => {
        eventBus.post(new NetworkDisconnectEvent(iosocket.id))
      })
    })
  }
}
