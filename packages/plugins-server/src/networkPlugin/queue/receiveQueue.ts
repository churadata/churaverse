import type { Scenes } from 'churaverse-engine-server'
import type { Packet } from '../socket/packet'
import type { IReceiveQueue } from './IReceiveQueue'

export class ReceiveQueue<Scene extends Scenes> implements IReceiveQueue<Scene> {
  private readonly packets: Packet<Scene> = []

  /**
   * 受信キューにパケットを追加
   */
  public pushPacket(receivedPacket: Packet<Scene>): void {
    this.packets.push(...receivedPacket)
  }

  /**
   * 受信キュー内にある全パケットを取り出し、キューを空にする
   */
  public popPacket(): Packet<Scene> {
    // この方法ではシリアライズ可能なオブジェクトのみコピー可能
    // socket.ioで通信できるのもシリアライズ可能なオブジェクトのみなのでこの方法でdeep copyしている
    const poppedPacket = structuredClone(this.packets)
    // 中身を空に
    this.packets.length = 0
    return poppedPacket
  }

  public hasPacket(): boolean {
    return this.packets.length > 0
  }
}
