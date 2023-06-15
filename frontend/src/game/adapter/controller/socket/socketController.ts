import { Player } from '../../../domain/model/player'
import { Position } from '../../../domain/model/core/position'
import { Interactor } from '../../../interactor/Interactor'
import { PlayerInfo, SocketListenEventType } from '../../../interface/socket/eventTypes'
import {
  StopInfo,
  TurnInfo,
  WalkInfo,
  BombInfo,
  ChatInfo,
  PlayerDamageInfo,
  PlayerDieInfo,
  PlayerRespawnInfo,
  ProfileInfo,
  RecieveBaseInfo,
  SharkDestroyInfo,
  SharkInfo,
  SocketChattableActionType,
  SocketListenActionType,
  SocketNormalActionType,
  MegaphoneInfo,
} from '../../../interface/socket/actionTypes'
import { ISocket } from './ISocket'
import { ISharkRenderFactory } from '../../../domain/IRenderFactory/ISharkRenderFactory'
import { IBombRenderFactory } from '../../../domain/IRenderFactory/IBombRenderFactory'
import { IPlayerRenderFactory } from '../../../domain/IRenderFactory/IPlayerRenderFactory'
import { IServerErrorRenderFactory } from '../../../domain/IRenderFactory/IServerErrorRenderFactory'

/**
 * Socketで受け取ったデータをInteractorに渡す
 * ロジックは書かない
 */
export class SocketController {
  public constructor(
    private readonly interactor: Interactor,
    private readonly socket: ISocket,
    private readonly playerRenderFactory: IPlayerRenderFactory,
    private readonly sharkRenderFactory: ISharkRenderFactory,
    private readonly bombRenderFactory: IBombRenderFactory,
    private readonly serverErrorRenderFactory: IServerErrorRenderFactory
  ) {
    // eventとactionのlisten
    // 無名関数にしないと実行時にエラーが出ます https://christina04.hatenablog.com/entry/2017/11/08/020545
    this.socket.listenEvent(SocketListenEventType.NotExistsPlayer, () => this.pageReloadRequest())
    this.socket.listenEvent(SocketListenEventType.Disconnected, (playerId) => this.playerDisconnect(playerId))
    this.socket.listenEvent(SocketListenEventType.NewPlayer, (info) => this.playerJoin(info))

    this.socket.listenAction(SocketNormalActionType.Turn, (data) => this.playerTurn(data))
    this.socket.listenAction(SocketNormalActionType.Stop, (data) => this.playerStop(data))
    this.socket.listenAction(SocketNormalActionType.Walk, (data) => this.playerWalk(data))
    this.socket.listenAction(SocketNormalActionType.Profile, (data) => this.playerProfileUpdate(data))
    this.socket.listenAction(SocketNormalActionType.Shark, (data) => this.sharkSpawn(data))
    this.socket.listenAction(SocketNormalActionType.Bomb, (data) => this.bombDrop(data))
    this.socket.listenAction(SocketChattableActionType.Chat, (data) => this.chatReceive(data))
    this.socket.listenAction(SocketNormalActionType.Megaphone, (data) => this.toggleMegaphone(data))
    this.socket.listenAction(SocketListenActionType.Damage, (data) => this.playerDamage(data))
    this.socket.listenAction(SocketListenActionType.OwnPlayerDie, (data) => this.playerDie(data))
    this.socket.listenAction(SocketListenActionType.OtherPlayerDie, (data) => this.playerDie(data))
    this.socket.listenAction(SocketListenActionType.HitShark, (data) => this.sharkHit(data))
    this.socket.listenAction(SocketListenActionType.OwnPlayerRespawn, (data) => this.playerRespawn(data))
    this.socket.listenAction(SocketListenActionType.OtherPlayerRespawn, (data) => this.playerRespawn(data))
  }

  /**
   * ページのリロードをユーザに要求する
   */
  private pageReloadRequest(): void {
    void this.serverErrorRenderFactory.build().then((render) => {
      this.interactor.receiveServerError(render)
    })
  }

  /**
   * 他playerの接続が終了したとき
   * @param playerId playerのid
   */
  private playerDisconnect(playerId: string): void {
    this.interactor.leavePlayer(playerId)
  }

  /**
   * 他プレイヤーが参加したとき
   * @param playerInfo playerの情報
   */
  private playerJoin(playerInfo: PlayerInfo): void {
    const pos = new Position(playerInfo.x, playerInfo.y)

    void this.playerRenderFactory
      .build(pos, playerInfo.direction, playerInfo.heroName, playerInfo.heroColor)
      .then((render) => {
        this.interactor.joinPlayer(
          playerInfo.playerId,
          new Player(pos, playerInfo.direction, playerInfo.heroName, playerInfo.heroColor),
          render
        )
      })
  }

  private playerTurn(data: TurnInfo & RecieveBaseInfo): void {
    this.interactor.stopPlayer(data.id)
    this.interactor.turnPlayer(data.id, data.direction)
  }

  private playerWalk(data: WalkInfo & RecieveBaseInfo): void {
    this.interactor.walkPlayer(data.id, data.direction, data.speed, new Position(data.startPos.x, data.startPos.y))
  }

  private playerStop(data: StopInfo & RecieveBaseInfo): void {
    // 他プレイヤーからのstopの受信が自画面でのtween完了時に呼ばれるstopより早い
    // 歩行アニメーションを滑らかにするためにフロント側ではtweenのstopに任せる
  }

  private playerProfileUpdate(data: ProfileInfo & RecieveBaseInfo): void {
    this.interactor.changePlayerColor(data.id, data.heroColor)
    this.interactor.changePlayerName(data.id, data.heroName)
  }

  private sharkSpawn(data: SharkInfo & RecieveBaseInfo): void {
    void this.sharkRenderFactory.build().then((render) => {
      this.interactor.spawnShark(
        data.sharkId,
        data.id,
        render,
        new Position(data.startPos.x, data.startPos.y),
        data.direction,
        data._emitTime
      )
    })
  }

  private bombDrop(data: BombInfo & RecieveBaseInfo): void {
    void this.bombRenderFactory.build().then((render) => {
      this.interactor.dropBomb(data.bombId, data.id, render, new Position(data.position.x, data.position.y))
    })
  }

  private chatReceive(data: ChatInfo & RecieveBaseInfo): void {
    this.interactor.addTextChat(data.name, data.message)
  }

  private toggleMegaphone(data: MegaphoneInfo & RecieveBaseInfo): void {
    this.interactor.toggleMegaphone(data.id, data.activate)
  }

  private playerDamage(data: PlayerDamageInfo): void {
    this.interactor.damagePlayer(data.target, data.attacker, data.cause, data.damage)
  }

  private playerDie(data: PlayerDieInfo): void {
    this.interactor.diePlayer(data.id)
  }

  private sharkHit(data: SharkDestroyInfo): void {
    this.interactor.dieShark(data.sharkId)
  }

  private playerRespawn(data: PlayerRespawnInfo): void {
    this.interactor.respawnPlayer(data.id, new Position(data.respawnPos.x, data.respawnPos.y))
  }

  public update(): void {
    const SOCKET_EMIT_INTERVAL_MS = 100
    if (this.socket.isTimeExceedingLastEmit(SOCKET_EMIT_INTERVAL_MS)) {
      this.interactor.flushActions()
    }
  }
}
