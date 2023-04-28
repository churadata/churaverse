import { ActionExecuter } from './actionExecuter'
import {
  ActionEmitTypeTable,
  ActionListenTypeTable,
  SocketListenActionType,
  ReceiveData,
  SocketEmitOnlyActionType,
} from './actionTypes'
import { SocketEmitEventType, SocketListenEventType } from '../eventTypes'
import {
  convertForTransmit,
  convertForTransmitWithoutDestSorting,
} from './packetConverter'
import { IReceiveQueue } from './queue/IReceiveQueue'
import { ITransmitQueue, TransmitQueueBuffers } from './queue/ITransmitQueue'
import { ReceiveQueue } from './queue/receiveQueue'
import { TransmitQueue } from './queue/transmitQueue'
import { Socket } from '../socket'

export class ActionHelper {
  private readonly emitAllPlayersActReceiveQueue: IReceiveQueue =
    new ReceiveQueue()

  private readonly receiveQueue: IReceiveQueue = new ReceiveQueue()
  private readonly transmitQueue: ITransmitQueue = new TransmitQueue()
  private readonly actionExecuter: ActionExecuter = new ActionExecuter()

  /**
   * Actionに関するEventをlisten
   */
  public listenActionEvent(socket: Socket): void {
    socket.listenEvent(SocketListenEventType.EmitAction, (data) => {
      this.receiveQueue.push(data)
    })
    socket.listenEvent(SocketListenEventType.EmitAllPlayersAction, (data) => {
      this.emitAllPlayersActReceiveQueue.push(data)
    })
  }

  /**
   * 送信キューから送信パケットを取り出す
   */
  public async getSendData(): Promise<TransmitQueueBuffers> {
    return await this.transmitQueue.pop()
  }

  /**
   * 受信キューから受信パケットを取り出す
   */
  public getReceivedData(): ReceiveData[] {
    return this.receiveQueue.pop()
  }

  /**
   * 送信者も含めた全プレイヤーへ送信するデータ用の受信キューから受信パケットを取り出す
   */
  public getEmitAllPlayersActReceiveQueue(): ReceiveData[] {
    return this.emitAllPlayersActReceiveQueue.pop()
  }

  /**
   * 受信キューの中身を受け取って送信用の構造に変換、送信キューに格納
   */
  public storePacketsToTransmitQueue(packets: ReceiveData[]): void {
    if (packets.length === 0) return

    // パケット構造を送信用に変換
    const sendPackets = convertForTransmit(
      packets,
      this.transmitQueue.getDestination()
    )

    // 送信キューに格納
    // 送信先の振り分けを行う場合
    for (const playerId of this.transmitQueue.getDestination()) {
      const sendPacket = sendPackets.get(playerId)
      if (sendPacket !== undefined && sendPacket.length > 0) {
        this.transmitQueue.pushAt(playerId, sendPacket)
      }
    }
  }

  /**
   * emitAllPlayersActReceiveQueueの中身を受け取って送信用の構造に変換、全プレイヤーの送信キューに格納
   */
  public storeEmitAllPlayersActPacketsToTransmitQueue(
    packets: ReceiveData[]
  ): void {
    if (packets.length === 0) return

    // パケット構造を送信用に変換
    const sendPackets = convertForTransmitWithoutDestSorting(packets)

    this.transmitQueue.push(sendPackets)
  }

  /**
   * 受信キューの中身を受け取って各actionデータ毎にcallbackを実行
   */
  public execActions(packets: ReceiveData[]): void {
    packets.forEach((packet) => {
      packet.actions.forEach((action) => {
        action.infos.forEach((info) => {
          this.actionExecuter.exec(
            action.type,
            Object.assign(info, { id: packet.id }) // パケット送信者のidを受信したActionのInfoに付加
          )
        })
      })
    })
  }

  /**
   * 送信キュー内のパケットをClientに送信
   */
  public async emitTransmitQueue(socket: Socket): Promise<void> {
    // 送信先の振り分けを行わない場合
    // socket.EmitEvent(SocketEmitEventType.PlayersAct, sendPackets)

    // 送信先の振り分けを行う場合
    // 全プレイヤーの送信キューを取り出し、キューの中身を各プレイヤーに送信
    const transmitQueue = await this.transmitQueue.pop()
    for (const [playerId, packet] of transmitQueue.entries()) {
      if (packet.length > 0) {
        socket.emitEventTo(SocketEmitEventType.PlayersAct, playerId, packet)
      }
    }
  }

  /**
   * Action受信時に実行されるcallbackを登録
   */
  public listenAction<K extends SocketListenActionType>(
    actionName: K,
    callback: ActionListenTypeTable[K]
  ): void {
    this.actionExecuter.registerCallback(actionName, callback)
  }

  /**
   * 全プレイヤーの送信キューにデータを格納
   */
  public emitAction<Ac extends SocketEmitOnlyActionType>(
    actionName: Ac,
    obj: Parameters<ActionEmitTypeTable[Ac]>[0]
  ): void {
    const emitData = {
      type: actionName,
      info: obj,
    }

    this.transmitQueue.insert(emitData)
  }

  /**
   * 指定したプレイヤーの送信キューにデータを格納
   */
  public emitActionTo<Ac extends SocketEmitOnlyActionType>(
    playerId: string,
    actionName: Ac,
    obj: Parameters<ActionEmitTypeTable[Ac]>[0]
  ): void {
    const emitData = {
      type: actionName,
      info: obj,
    }

    this.transmitQueue.insertAt(playerId, emitData)
  }

  /**
   * 指定したプレイヤー以外の送信キューにデータを格納
   */
  public emitActionWithout<Ac extends SocketEmitOnlyActionType>(
    playerId: string,
    actionName: Ac,
    obj: Parameters<ActionEmitTypeTable[Ac]>[0]
  ): void {
    const emitData = {
      type: actionName,
      info: obj,
    }

    this.transmitQueue.insertWithout(playerId, emitData)
  }

  /**
   * 送信キューを追加
   */
  public addQueue(id: string): void {
    this.transmitQueue.addQueue(id)
  }

  /**
   * 送信キューを削除
   */
  public removeQueue(id: string): void {
    this.transmitQueue.removeQueue(id)
  }
}
