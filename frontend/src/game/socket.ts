import { io, Socket as ioSocket } from 'socket.io-client'
import { mainSceneSocketOn } from './socketOn'
import { Scene } from 'phaser'

type BufferType = 'firstOnly' | 'lastOnly' | 'queue' | 'stack'

type ReceiveOnlyActionName =
  | 'ownPlayerDie'
  | 'otherPlayerDie'
  | 'damage'
  | 'hitShark'
  | 'ownPlayerRespawn'
  | 'otherPlayerRespawn' // | 'redRect' | 'blueRect'
export type ActionNameSendEveryone = 'chat'
export type ActionNameSendOther =
  | 'shark'
  | 'bomb'
  | 'walk'
  | 'profile'
  | 'turn'
  | ReceiveOnlyActionName

interface EmitData {
  id: string
  emitTime: number
  actions: Action[]
}

interface Action {
  type: ActionNameSendEveryone | ActionNameSendOther
  infos: any[]
}

// 受信時に必ず存在するプロパティを定義
export interface BaseReceiveInfo {
  id: string
  _delay: number
}

export class Socket {
  private readonly socket: ioSocket<any>
  private readonly port: number = 12100

  private readonly buffersForOtherPlayers: Map<ActionNameSendOther, Buffer> =
    new Map()

  private readonly buffersForEveryone: Map<ActionNameSendEveryone, Buffer> =
    new Map()

  private lastEmitTime: number = 0
  private firstAddTime?: number

  static onCallbacks: Map<
    ActionNameSendOther | ActionNameSendEveryone,
    (self: Scene, receivedData: object) => void
  > = new Map()

  private scene?: Scene

  private readonly connectionCheckInterval: number = 60 * 1000 // １分以上通信がない場合は確認の通信を行う

  constructor() {
    let urlString = import.meta.env.VITE_BACKEND_URL
    urlString = /^.*:\/\//.test(urlString) ? urlString : 'http://' + urlString

    const url = new URL(urlString)
    this.socket = io(url.host, {
      path: url.pathname.replace(/\/$/, '') + '/socket.io/',
    })
  }

  public initInMainScene(scene: Scene, socket: Socket): void {
    this.buffersForOtherPlayers.set('shark', new Buffer('queue'))
    this.buffersForOtherPlayers.set('bomb', new Buffer('queue'))
    this.buffersForOtherPlayers.set('walk', new Buffer('lastOnly'))
    this.buffersForOtherPlayers.set('profile', new Buffer('lastOnly'))
    this.buffersForOtherPlayers.set('turn', new Buffer('lastOnly'))
    this.buffersForEveryone.set('chat', new Buffer('queue'))

    this.scene = scene

    this.receivedAction()
    mainSceneSocketOn(scene, socket)
  }

  private emitBuffersForOtherPlayers(): void {
    const emitData: EmitData = {
      id: this.socket.id,
      emitTime: Date.now(),
      actions: [],
    }

    this.buffersForOtherPlayers.forEach((buf, bufName) => {
      const data = buf.getData()
      if (data.length > 0) {
        const _action: Action = { type: bufName, infos: [] }
        _action.infos = data
        emitData.actions.push(_action)
      }
    })

    if (emitData.actions.length > 0) {
      this.lastEmitTime = Date.now()
      this.firstAddTime = undefined
      this.socket.emit('emitAction', emitData)
      this.buffersForOtherPlayers.forEach((buf) => {
        buf.remove()
      })
    }
  }

  private emitBuffersForEveryone(): void {
    const emitData: EmitData = {
      id: this.socket.id,
      emitTime: Date.now(),
      actions: [],
    }

    this.buffersForEveryone.forEach((buf, bufName) => {
      const data = buf.getData()
      if (data.length > 0) {
        const _action: Action = { type: bufName, infos: [] }
        _action.infos = data
        emitData.actions.push(_action)
      }
    })

    if (emitData.actions.length > 0) {
      this.lastEmitTime = Date.now()
      this.firstAddTime = undefined
      this.socket.emit('emitAllPlayersAction', emitData)
      this.buffersForEveryone.forEach((buf) => {
        buf.remove()
      })
    }
  }

  /**
   * 前回emit時から100ms以上経過していた場合は即時emitする
   *
   * @returns emitした場合true
   */
  public emitIfNeeded(): boolean {
    const INTERVAL = 100
    const now = Date.now()

    if (
      now - this.lastEmitTime >= INTERVAL &&
      this.firstAddTime !== undefined
    ) {
      this.emitBuffersForOtherPlayers()
      this.emitBuffersForEveryone()
      return true
    } else {
      if (now - this.lastEmitTime >= this.connectionCheckInterval) {
        this.singleEmit('checkConnect', (response: object) => {
          console.log(response)
        })

        this.lastEmitTime = now
      }
      return false
    }
  }

  public emit(emitName: ActionNameSendOther, emitData: object): void {
    if (this.firstAddTime === undefined) {
      this.firstAddTime = Date.now()
      emitData = { ...emitData, _delay: 0 }
    } else {
      emitData = { ...emitData, _delay: Date.now() - this.firstAddTime }
    }

    this.buffersForOtherPlayers.get(emitName)?.addData(emitData)
  }

  public allPlayersEmit(
    emitName: ActionNameSendEveryone,
    emitData: object
  ): void {
    if (this.firstAddTime === undefined) {
      this.firstAddTime = Date.now()
      emitData = { ...emitData, _delay: 0 }
    } else {
      emitData = { ...emitData, _delay: Date.now() - this.firstAddTime }
    }

    const chatData = this.buffersForEveryone.get(emitName)

    if (chatData !== undefined) {
      chatData.addData(emitData)
    }
  }

  /**
   * データを纏めずに送信する
   */
  public singleEmit(
    emitName: string,
    emitData: object | undefined = undefined
  ): void {
    if (emitData === undefined) {
      this.socket.emit(emitName)
    } else {
      this.socket.emit(emitName, emitData)
    }
  }

  /**
   * サーバから受け取った際に実行する関数をセットする
   */
  public on(
    onName: ActionNameSendOther | ActionNameSendEveryone,
    onCallback: (scene: any, receivedData: any) => void
  ): void {
    Socket.onCallbacks.set(onName, onCallback)
  }

  /**
   * サーバからまとめられたデータを受け取る
   */
  private receivedAction(): void {
    const scene = this.scene
    if (scene === undefined) {
      return
    }
    this.socket.on('playersAct', function (packet: any) {
      for (const action of packet) {
        const actionName = action.type
        Socket.onCallbacks.get(actionName)?.(scene, action.info)
      }
    })
  }

  /**
   * 纏められていないデータを受信する
   */
  public singleOn(
    onName: string,
    onCallback: (receiveData?: any) => void
  ): void {
    this.socket.on(onName, onCallback)
  }

  public get id(): string {
    return this.socket.id
  }
}

class Buffer {
  private readonly bufferType: BufferType
  private buffer: object[] = []

  constructor(bufferType: BufferType) {
    this.bufferType = bufferType
    this.buffer = []
  }

  addData(data: object): void {
    switch (this.bufferType) {
      case 'firstOnly':
        if (this.buffer.length === 0) {
          this.buffer = [data]
        }
        break
      case 'lastOnly':
        this.buffer = [data]
        break
      case 'queue':
        this.buffer.push(data)
        break
      case 'stack':
        this.buffer.unshift(data)
        break
      default:
        break
    }
  }

  remove(): void {
    this.buffer.length = 0
  }

  getData(): Object[] {
    return this.buffer
  }
}
