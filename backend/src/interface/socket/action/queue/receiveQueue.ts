import AsyncLock from 'async-lock'
import { ReceiveData } from '../actionTypes'
import { IReceiveQueue } from './IReceiveQueue'

const RECEIVE_QUEUE_ASYNC_LOCK_KEY = 'receiveQueue'

export class ReceiveQueue implements IReceiveQueue {
  private readonly lock = new AsyncLock({
    timeout: 1000 * 30,
    maxPending: Infinity,
  })

  private readonly packets: ReceiveData[] = []

  /**
   * 受信キューにパケットを追加
   */
  public push(receivedData: ReceiveData): void {
    void this.lock.acquire(RECEIVE_QUEUE_ASYNC_LOCK_KEY, () => {
      this.packets.push(receivedData)
    })
  }

  /**
   * 受信キュー内にある全パケットを取り出し、キューを空にする
   */
  public pop(): ReceiveData[] {
    let poppedPacket: ReceiveData[] = []
    void this.lock.acquire(RECEIVE_QUEUE_ASYNC_LOCK_KEY, () => {
      // 文字列化してdeep copyするこの方法ではシリアライズ可能なオブジェクトのみコピー可能
      // socket.ioで通信できるのもシリアライズ可能なオブジェクトのみなのでこの方法でdeep copyしている
      poppedPacket = JSON.parse(JSON.stringify(this.packets)) as ReceiveData[]
      this.packets.length = 0
    })

    // 中身を空に
    return poppedPacket
  }
}
