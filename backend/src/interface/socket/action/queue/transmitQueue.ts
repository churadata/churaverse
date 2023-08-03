import AsyncLock from 'async-lock'
import {
  SocketEmitOnlyActionType,
  ActionFromServer,
  EmitData,
} from '../actionTypes'
import { ITransmitQueue, TransmitQueueBuffers } from './ITransmitQueue'

const TRANSMIT_QUEUE_ASYNC_LOCK_KEY = 'transmitQueue'

export class TransmitQueue implements ITransmitQueue {
  private readonly lock = new AsyncLock({ timeout: 1000 * 30 })

  // 送信キューは受信キューとは違いプレイヤーの数だけ存在する
  private readonly packets: TransmitQueueBuffers = new Map()

  /**
   * 全プレイヤーの送信キューにパケットを追加
   */
  public push(sendDData: EmitData): void {
    void this.lock.acquire('TransmitQueue', () => {
      for (const playerId of this.packets.keys()) {
        this.pushAt(playerId, sendDData)
      }
    })
  }

  /**
   * 指定したプレイヤーの送信キューにパケットを追加
   */
  public pushAt(playerId: string, sendData: EmitData): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      this.packets.get(playerId)?.push(...sendData)
    })
  }

  /**
   * 全プレイヤーの送信キューにActionデータを追加
   */
  public insert<T extends SocketEmitOnlyActionType>(
    sendActionData: ActionFromServer<T>
  ): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      for (const playerId of this.packets.keys()) {
        this.insertAt(playerId, sendActionData)
      }
    })
  }

  /**
   * 指定したプレイヤーの送信キューにActionデータを追加
   */
  public insertAt<T extends SocketEmitOnlyActionType>(
    playerId: string,
    sendActionData: ActionFromServer<T>
  ): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      this.packets.get(playerId)?.push(sendActionData)
    })
  }

  /**
   * 指定したプレイヤー以外の送信キューにActionデータを追加
   */
  public insertWithout<T extends SocketEmitOnlyActionType>(
    excludeId: string,
    sendActionData: ActionFromServer<T>
  ): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      for (const playerId of this.packets.keys()) {
        if (excludeId === playerId) continue
        this.insertAt(playerId, sendActionData)
      }
    })
  }

  /**
   * 全プレイヤーの送信キュー内にある全パケットを取り出し、キューを空にする
   */
  public async pop(): Promise<TransmitQueueBuffers> {
    const allPlayerTransmitQueue: TransmitQueueBuffers = new Map()

    await this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      for (const playerId of this.packets.keys()) {
        allPlayerTransmitQueue.set(playerId, this.popAt(playerId))
      }
    })

    return allPlayerTransmitQueue
  }

  /**
   * 指定したプレイヤーの送信キュー内にある全パケットを取り出し、キューを空にする
   */
  public popAt(playerId: string): EmitData {
    let poppedPacket: EmitData = []

    // 文字列化してdeep copyするこの方法ではシリアライズ可能なオブジェクトのみコピー可能
    // socket.ioで通信できるのもシリアライズ可能なオブジェクトのみなのでこの方法でdeep copyしている
    poppedPacket = JSON.parse(
      JSON.stringify(this.packets.get(playerId))
    ) as EmitData
    // 中身を空に
    this.packets.set(playerId, [])
    return poppedPacket
  }

  // 新規プレイヤー追加時に送信キューを追加
  public addQueue(playerId: string): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      if (this.packets.has(playerId)) {
        return
      }
      this.packets.set(playerId, [])
    })
  }

  // プレイヤー退出時に送信キューを削除
  public removeQueue(playerId: string): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      this.packets.delete(playerId)
    })
  }

  public getDestination(): string[] {
    return Array.from(this.packets.keys())
  }
}
