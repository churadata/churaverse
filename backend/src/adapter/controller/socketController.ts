import { Bomb } from '../../domain/model/bomb'
import { Player } from '../../domain/model/player'
import { Shark } from '../../domain/model/shark'
import { Position } from '../../domain/core/position'
import { Interactor } from '../../interactor/interactor'

import {
  SocketListenEventType,
  PreloadedData,
  ReceiveJoinData,
  RequestKickPlayerInfo,
  exitOwnPlayerInfo,
  MapInfo,
} from '../../interface/socket/eventTypes'
import {
  ReceiveBaseInfo,
  BombInfo,
  SharkInfo,
  TurnInfo,
  WalkInfo,
  SocketListenActionType,
  StopInfo,
  ProfileInfo,
  MegaphoneInfo,
  InvincibleWorldModeInfo,
} from '../../interface/socket/action/actionTypes'

import { makePreloadedData } from '../preloadedDataFactory'
import { ISocket } from '../ISocket'

export class SocketController {
  public constructor(private readonly interactor: Interactor, private readonly socket: ISocket) {
    // eventとactionのlisten
    // 無名関数にしないと実行時にエラーが出ます https://christina04.hatenablog.com/entry/2017/11/08/020545
    this.socket.listenEvent(SocketListenEventType.RequestPreloadedData, this.replyPreloadData.bind(this))

    this.socket.listenEvent(SocketListenEventType.EnterPlayer, this.playerJoin.bind(this))

    this.socket.listenEvent(SocketListenEventType.CheckConnect, this.replyCheckConnect.bind(this))

    this.socket.listenEvent(SocketListenEventType.DisConnect, this.leavePlayer.bind(this))

    this.socket.listenEvent(SocketListenEventType.RequestKickPlayer, this.requestKickPlayer.bind(this))

    this.socket.listenEvent(SocketListenEventType.RequestNewMap, this.updateMap.bind(this))

    this.socket.listenEvent(SocketListenEventType.ExitOwnPlayer, this.exitOwnPlayer.bind(this))

    this.socket.listenAction(SocketListenActionType.Walk, this.playerWalk.bind(this))

    this.socket.listenAction(SocketListenActionType.Stop, this.stopPlayer.bind(this))

    this.socket.listenAction(SocketListenActionType.Turn, this.turnPlayer.bind(this))

    this.socket.listenAction(SocketListenActionType.Profile, this.updatePlayerProfile.bind(this))

    this.socket.listenAction(SocketListenActionType.Shark, this.spawnShark.bind(this))

    this.socket.listenAction(SocketListenActionType.Bomb, this.dropBomb.bind(this))

    this.socket.listenAction(SocketListenActionType.Megaphone, this.toggleMegaphone.bind(this))

    this.socket.listenAction(SocketListenActionType.InvincibleWorldMode, this.toggleInvincibleWorldMode.bind(this))
  }

  private replyPreloadData(callback: (data: PreloadedData) => void): void {
    const ingredients = this.interactor.getPreloadedDataIngredients()
    const preloadedData = makePreloadedData(
      ingredients.players,
      ingredients.megaphoneUsers,
      ingredients.mapName,
      ingredients.worldConfig.isInvincibleMode
    )
    callback(preloadedData)
  }

  private replyCheckConnect(callback: (data: string[]) => void): void {
    const replyData = this.interactor.getCheckConnectIngredients()
    callback(replyData)
  }

  private playerJoin(receiveJoinData: ReceiveJoinData, socketId: string): void {
    const player = new Player(
      new Position(receiveJoinData.playerInfo.x, receiveJoinData.playerInfo.y),
      receiveJoinData.playerInfo.direction
    )
    player.setPlayerColor(receiveJoinData.playerInfo.heroColor)
    player.setPlayerName(receiveJoinData.playerInfo.heroName)

    this.interactor.joinPlayer(socketId, player)
  }

  private playerWalk(data: WalkInfo & ReceiveBaseInfo): void {
    this.interactor.walkPlayer(data.id, new Position(data.startPos.x, data.startPos.y), data.direction, data.speed)
  }

  private leavePlayer(reason: string, socketId: string): void {
    // reasonはデフォルトの引数
    // disconnectイベントはfrontendから自動的にemitされるためreasonが送られる

    this.interactor.leavePlayer(socketId)
  }

  private stopPlayer(data: StopInfo & ReceiveBaseInfo): void {
    const position = new Position(data.stopPos.x, data.stopPos.y)
    this.interactor.stopPlayer(data.id, position, data.direction)
  }

  private turnPlayer(data: TurnInfo & ReceiveBaseInfo): void {
    this.interactor.turnPlayer(data.id, data.direction)
  }

  private updatePlayerProfile(data: ProfileInfo & ReceiveBaseInfo): void {
    this.interactor.changePlayerColor(data.id, data.heroColor)
    this.interactor.changePlayerName(data.id, data.heroName)
  }

  private spawnShark(data: SharkInfo & ReceiveBaseInfo): void {
    const position = new Position(data.startPos.x, data.startPos.y)
    const shark = new Shark(data.id, position, data.direction, data._emitTime)
    shark.move(Date.now() - data._emitTime) // 遅延分移動
    this.interactor.spawnShark(data.sharkId, shark)
  }

  private dropBomb(data: BombInfo & ReceiveBaseInfo): void {
    const position = new Position(data.position.x, data.position.y)

    const bomb = new Bomb(data.id, position, data._emitTime)
    this.interactor.dropBomb(data.bombId, bomb)
  }

  private toggleMegaphone(data: MegaphoneInfo & ReceiveBaseInfo): void {
    this.interactor.toggleMegaphone(data.id, data.active)
  }

  private toggleInvincibleWorldMode(data: InvincibleWorldModeInfo & ReceiveBaseInfo): void {
    this.interactor.toggleInvincibleWorldMode(data.active)
  }

  private requestKickPlayer(data: RequestKickPlayerInfo): void {
    this.interactor.requestKickPlayer(data.kickedId, data.kickerId)
  }

  private exitOwnPlayer(data: exitOwnPlayerInfo): void {
    this.interactor.leavePlayer(data.playerId)
  }

  private async updateMap(data: MapInfo): Promise<void> {
    return await this.interactor.newMap(data.mapName)
  }

  /**
   * メインループのループ毎に実行される
   * 受信キューの中身を取り出してデータに応じてcallbackを実行、Clientに送信
   */
  public update(): void {
    this.socket.update()
  }
}
