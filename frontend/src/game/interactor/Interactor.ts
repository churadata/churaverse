import { Direction } from '../domain/model/core/direction'
import { IBadge } from '../domain/IRender/IBadge'
import { IBombRender } from '../domain/IRender/IBombRender'
import { IChatBoardRender } from '../domain/IRender/IChatBoardRender'
import { IChatInputRender } from '../domain/IRender/IChatInputRender'
import { IDialog } from '../domain/IRender/IDialog'
import { IMapRender } from '../domain/IRender/IMapRender'
import { IPlayerRender } from '../domain/IRender/IPlayerRender'
import { IServerErrorRender } from '../domain/IRender/IServerErrorRender'
import { ISharkRender } from '../domain/IRender/ISharkRender'
import { Bomb } from '../domain/model/bomb'
import { GRID_WALK_DURATION_MS, Player } from '../domain/model/player'
import { Shark, SHARK_SPEED, SHARK_WALK_LIMIT_GRIDS } from '../domain/model/shark'
import { TextChat } from '../domain/model/textChat'
import { PlayerColorName } from '../domain/model/types'
import { Position } from '../domain/model/core/position'
import { BombService } from '../domain/service/bombService'
import { PlayersService } from '../domain/service/playersService'
import { SharkService } from '../domain/service/sharkService'
import { TextChatService } from '../domain/service/textChatService'
import { IPlayerSetupInfoWriter } from './playerSetupInfo/IPlayerSetupInfoWriter'
import { ISocketEmitter } from './ISocketEmitter'
import { IDomInputObserver } from './IDomInputObserver'
import { ILocalDevice } from './ILocalDeviceManager/ILocalDevice'
import { Microphone } from '../domain/model/localDevice/microphone'
import { Camera } from '../domain/model/localDevice/camera'
import { Speaker } from '../domain/model/localDevice/speaker'
import { IMicSelector } from './ILocalDeviceSelector/IMicSelector'
import { ISpeakerSelector } from './ILocalDeviceSelector/ISpeakerSelector'
import { ICameraSelector } from './ILocalDeviceSelector/ICameraSelector'
import { IKeyboardSettingPopUpWindow } from '../domain/IRender/IKeySettingPopUpWindow'
import { IKeyboardSetupInfoWriter } from './keyboardSetupInfo/IKeyboardSetupInfoWriter'
import { IKeyConfiguration } from './IKeyConfiguration'
import { IVoiceChatSender } from './voiceChat/IVoiceChatSender'
import { ISharedScreenRender } from '../domain/IRender/ISharedScreenRender'
import { IScreenShareSender } from './screenShare/IScreenShareSender'
import { IFocusableRender } from '../domain/IRender/IFocusableRender'
import { PlayerColorChangeUseCase } from '../usecase/playerColorChangeUseCase'
import { KeyCode, KeyEvent } from '../domain/model/core/types'
import { IVoiceChatVolumeController } from './voiceChat/IVoiceChatVolumeController'
import { ITransitionManager } from './ITransitionManager'
import { TitleToMainData } from './sceneTransitionData/titleToMain'
import { DeathLog } from '../domain/model/deathLog'
import { DamageCause, IDeathLogRender } from '../domain/IRender/IDeathLogRender'
import { DeathLogService } from '../domain/service/deathLogService'
import { ICameraVideoListRender } from '../domain/IRender/ICameraVideoListRender'
import { CameraEffectId, ICameraVideoSender } from './webCamera/ICameraVideoSender'
import { IWebRtc } from './webRtc/IWebRtc'
import { IPlayerListRender } from '../domain/IRender/IPlayerListRender'
import { IMapRenderFactory } from '../domain/IRenderFactory/IMapRenderFactory'
import { IMapSelector } from '../domain/IRender/IMapSelector'
import { GRID_SIZE, WorldConfig } from '../domain/model/worldConfig'
import { IJoinLeaveLogRender } from '../domain/IRender/IJoinLeaveLogRender'
import { IFadeOutLogRender } from '../domain/IRender/IFadeOutLogRender'
import { DomManager } from '../interface/ui/util/domManager'
import { ITopBarIconRender } from './IDialogIconRender'
import { IInvincibleWorldModeSwitch } from './adminSetting/IInvincibleWorldModeSwitch'

/**
 * Interactor
 * イベント駆動の中心地
 * ロジックは基本ここかdomainに書かれる
 * イベントは呼び出しによって発火する
 * 入力は関数の引数
 * 出力はDIされたRenderやEmitter(もしくは返り値)
 */
export class Interactor implements PlayerColorChangeUseCase {
  /** serverからエラーを受け取ったか */
  private isReceivedError = false
  private mapRender?: IMapRender

  public constructor(
    private readonly ownPlayerId: string,
    private readonly emitter: ISocketEmitter,
    private readonly mapSelector: IMapSelector,
    private readonly mapRenderFactory: IMapRenderFactory,
    private readonly domInputObserver: IDomInputObserver,
    private readonly chatBoardRender: IChatBoardRender,
    private readonly chatInputRender: IChatInputRender,
    private readonly chatBadge: IBadge,
    private readonly chatDialog: IDialog,
    private readonly invincibleWorldModeSwitch: IInvincibleWorldModeSwitch,
    private readonly localDevice: ILocalDevice,
    private readonly micSelector: IMicSelector,
    private readonly speakerSelector: ISpeakerSelector,
    private readonly cameraSelector: ICameraSelector,
    private readonly cameraVideoListRender: ICameraVideoListRender,
    private readonly cameraVideoSender: ICameraVideoSender,
    private readonly voiceChatSender: IVoiceChatSender,
    private readonly voiceChatVolumeController: IVoiceChatVolumeController,
    private readonly screenShareSender: IScreenShareSender,
    private readonly screenShareIcon: ITopBarIconRender,
    private readonly invincibleModeIndicator: ITopBarIconRender,
    private readonly playerSetupInfoWriter: IPlayerSetupInfoWriter,
    private readonly keyboardSetupInfoWriter: IKeyboardSetupInfoWriter,
    private readonly keySettingPopUpWindow: IKeyboardSettingPopUpWindow,
    private readonly keyConfiguration: IKeyConfiguration,
    private readonly deathLogRender: IDeathLogRender,
    private readonly playerList: IPlayerListRender,
    worldConfig: WorldConfig,
    private readonly joinLeaveLogRender: IJoinLeaveLogRender,
    private readonly fadeOutLogRender: IFadeOutLogRender,
    private readonly player: Player,
    playerRender: IPlayerRender,
    private readonly transitionManager: ITransitionManager<TitleToMainData, undefined>,
    private readonly webRtc: IWebRtc
  ) {
    // Playerに焦点を当てる
    playerRender.focus()
    this.focusedRender = playerRender
    this.players.join(this.ownPlayerId, player)
    this.playerRenders.set(this.ownPlayerId, playerRender)
    this.joinLeaveLogRender.join(this.ownPlayerId, this.players.getPlayerName(this.ownPlayerId) ?? 'name')

    // serverに既存プレイヤーの要求
    void emitter.requestPreloadedData().then((data) => {
      void this.mapRenderFactory.build(data.mapName).then((mapRender) => {
        this.mapRender = mapRender
      })
      data.existPlayers.forEach(([id, player, playerRender]) => {
        if (this.ownPlayerId === id) {
          // 自分のspriteだった場合だけ捨てる
          this.player.position.x = player.position.x
          this.player.position.y = player.position.y
          playerRender.destroy()
        } else {
          this.players.join(id, player)
          this.playerRenders.set(id, playerRender)
        }
      })
      this.updatePlayerList()

      const megaphoneActiveMap: Map<string, boolean> = new Map(Object.entries(data.megaphoneUsers))

      megaphoneActiveMap.forEach((active, id) => {
        this.toggleMegaphone(id, active)
      })
      this.toggleMegaphone(this.ownPlayerId, true)

      if (player.role === 'admin') {
        this.mapSelector.initialMap(data.mapName)
        worldConfig.setMap(data.mapName)
      }
      this.invincibleWorldModeSwitch.initState(data.invincibleWorldModeInfo.active)

      // serverにjoinの通知
      emitter.join(this.player, this.ownPlayerId)

      this.webRtc.setInitialState(this.playerRenders)
    })

    this.startVoiceChatVolumeControl(300)
  }

  public players = new PlayersService()
  public playerRenders = new Map<string, IPlayerRender>()
  public shark = new SharkService()
  public sharkRenders = new Map<string, ISharkRender>()
  public bombs = new BombService()
  public bombRenders = new Map<string, IBombRender>()
  public sharedScreenRenders = new Map<string, ISharedScreenRender>()

  public textChat = new TextChatService()
  public deathLog = new DeathLogService()
  private focusedRender: IFocusableRender | undefined
  public joinPlayer(id: string, player: Player, render: IPlayerRender): void {
    this.players.join(id, player)
    this.playerRenders.set(id, render)
    this.players.changePlayerName(id, player.name ?? 'name')
    this.updatePlayerList()
    this.toggleMegaphone(id, true)
    this.voiceChatVolumeController.activateMegaphone(id)
    this.joinLeaveLogRender.join(id, player.name)
  }

  public leavePlayer(id: string): void {
    this.joinLeaveLogRender.leave(id, this.players.getPlayerName(id) ?? 'name')
    this.players.leave(id)
    this.playerRenders.get(id)?.destroy()
    this.playerRenders.delete(id)
    this.updatePlayerList()
  }

  public transitionToTitle(): void {
    this.fadeOutLogRender.destroy()
    DomManager.removeAll()
    this.transitionManager.transitionTo('Title')
  }

  public handleKickEvent(kickedId: string, kickerId: string): void {
    const kickerPlayer = this.players.getPlayer(kickerId)
    if (kickerPlayer === undefined) return
    this.savePlayerInfo()
    this.saveKeyboardInfo()
    this.leavePlayer(kickedId)
    this.transitionToTitle()
    this.webRtcDisconnect()
    window.alert(`「${kickerPlayer.name}」 にキックされました`)
  }

  public changeMapAlert(newMap: string): void {
    window.alert(`マップが変更されました。再度入場してください。`)
    this.exitOwnPlayer()
  }

  public exitOwnPlayer(): void {
    this.emitter.exitOwnPlayer(this.ownPlayerId)
    this.savePlayerInfo()
    this.saveKeyboardInfo()
    this.leavePlayer(this.ownPlayerId)
    this.transitionToTitle()
    this.webRtcDisconnect()
  }

  public webRtcDisconnect(): void {
    void this.webRtc.disconnect()
  }

  public requestKickPlayer(kickedId: string): void {
    this.emitter.requestKickPlayer(kickedId, this.ownPlayerId)
  }

  public turnPlayer(id: string, direction: Direction): void {
    if (this.isPlayerDead(id)) return

    this.players.turn(id, direction)

    this.playerRenders.get(id)?.turn(direction)

    if (this.ownPlayerId === id && !this.isReceivedError) {
      this.emitter.turnPlayer(direction)
    }
  }

  public walkPlayer(id: string, direction: Direction, speed?: number, source?: Position): void {
    if (this.isPlayerDead(id)) return
    if (this.domInputObserver.isInputting) return

    const player = this.players.getPlayer(id)

    if (player === undefined) {
      return
    }

    // 自プレイヤーの場合は歩行の上書きは行わない
    if (this.ownPlayerId === id && player.isWalking) return

    // 向きが違う場合は合わせるように
    if (player.direction !== direction) {
      this.turnPlayer(id, direction)
    }

    // speedがundefinedの場合はデフォルトの値を代入
    speed ??= GRID_SIZE / GRID_WALK_DURATION_MS

    const startPos = player.position.copy()

    // 開始位置と実際のプレイヤーの位置がこの値を超えた場合は移動前にteleportで補正
    const limitToIgnoreCorrection = 40

    // 一方向に一定以上ずれている時とｘｙの両方向ずれている場合は瞬間移動して補正
    // この条件式に当てはまらない場合は加速して補正される
    if (
      source !== undefined &&
      (player.position.distanceTo(source) >= limitToIgnoreCorrection ||
        (source?.x !== player.position.x && source?.y !== player.position.y))
    ) {
      player.teleport(source)
      this.playerRenders.get(id)?.teleport(source)
    }

    const dest = player.position.copy()
    dest.gridX += direction.x
    dest.gridY += direction.y

    if (this.mapRender !== undefined)
      if (this.mapRender.hasBlockingTile(dest))
        // 移動先が通行不可マスの場合は移動しない
        return

    if (this.ownPlayerId === id && !this.isReceivedError) {
      // 移動開始時の座標をemitする必要がある
      this.emitter.walkPlayer(startPos, direction, speed)
    }

    const playerRender = this.playerRenders.get(id)
    if (playerRender !== undefined) {
      // tweenのonUpdateより先にkeyboardControllerの次のupdateが呼ばれてしまうため
      // 前もってplayer.IsWalkingをtrueにする
      player.startWalk()
      playerRender.walk(
        dest,
        direction,
        speed,
        (pos) => {
          player.walk(pos, direction)
        },
        () => {
          player.stop()
          if (this.ownPlayerId === id && !this.isReceivedError) {
            this.emitter.stopPlayer(player.position, player.direction)
          }
        }
      )
    } else {
      // renderが存在しなくても動く方法
      player.walk(dest, direction)
    }
  }

  public stopPlayer(id: string): void {
    const player = this.players.getPlayer(id)
    player?.stop()
    this.playerRenders.get(id)?.stop()
  }

  public damagePlayer(targetId: string, attackerId: string, cause: DamageCause, amount: number): void {
    this.players.damage(targetId, amount)
    const currentHp = this.players.getPlayerHp(targetId) ?? 0
    this.playerRenders.get(targetId)?.damage(amount, currentHp)
    if (this.isPlayerDead(targetId)) {
      this.diePlayer(targetId)
      const killer = this.players.getPlayer(attackerId)
      const victim = this.players.getPlayer(targetId)
      if (killer === undefined || victim === undefined || cause === undefined) {
        return
      }
      this.addDeathLog(victim, killer, cause)
    }
  }

  public changePlayerName(id: string, name: string): void {
    this.players.changePlayerName(id, name)
    this.playerRenders.get(id)?.applyPlayerName(name)

    if (this.ownPlayerId === id && !this.isReceivedError) {
      const player = this.players.getPlayer(id)
      if (player === undefined) {
        return
      }

      this.emitter.updatePlayerProfile(name, player.color)
    }
    this.updatePlayerList()
  }

  public changePlayerColor(id: string, color: PlayerColorName): void {
    this.players.changePlayerColor(id, color)
    this.playerRenders.get(id)?.applyPlayerColor(color)

    if (this.ownPlayerId === id && !this.isReceivedError) {
      const player = this.players.getPlayer(id)
      if (player === undefined) {
        return
      }

      this.emitter.updatePlayerProfile(player.name, color)
    }
  }

  public diePlayer(id: string): void {
    this.stopPlayer(id)
    this.playerRenders.get(id)?.dead()
  }

  public respawnPlayer(id: string, position: Position, direction: Direction): void {
    this.players.respawn(id, position, direction)
    const currentHp = this.players.getPlayerHp(id) ?? 100
    this.playerRenders.get(id)?.respawn(position, direction, currentHp)
  }

  public isPlayerDead(id: string): boolean {
    return this.players.isDead(id)
  }

  public savePlayerInfo(): void {
    const ownPlayer = this.players.getPlayer(this.ownPlayerId)
    if (ownPlayer === undefined) {
      return
    }
    this.playerSetupInfoWriter.save(ownPlayer.name, ownPlayer.color, ownPlayer.role)
  }

  public saveKeyboardInfo(): void {
    const keys = this.keyConfiguration
    this.keyboardSetupInfoWriter.save(keys)
  }

  public spawnShark(
    id: string,
    playerId: string,
    render: ISharkRender,
    position?: Position,
    direction?: Direction,
    spawnTime?: number
  ): void {
    const source = this.players.getPlayer(playerId)
    if (source === undefined) {
      render.dead()
      return
    }
    // 自プレイヤーの位置からgap分だけ前にずらしてサメを出す
    // 他プレイヤーの場合は、サメの位置をそのまま受信しているためgap分ずらす必要がないので0
    const gap = position !== undefined && direction !== undefined ? 0 : 65
    const startPos = source.position.copy()
    // positionがない場合は、自プレイヤーのサメのポジション
    position ??= new Position(startPos.x + gap * source.direction.x, startPos.y + gap * source.direction.y)
    // directionがない場合は、自プレイヤーのサメの方向
    direction ??= source.direction
    spawnTime ??= Date.now()
    // 受信時のサメの出現位置を補正
    position.x += SHARK_SPEED * direction.x
    position.y += SHARK_SPEED * direction.y
    const shark = new Shark(source, position, direction, spawnTime)
    this.shark.spawn(id, shark)
    this.sharkRenders.set(id, render)

    if (playerId === this.ownPlayerId && !this.isReceivedError) {
      this.emitter.spawnShark(id, position, direction)
    }

    // spawnしたら動き出す
    this.walkShark(shark, render)
  }

  public walkShark(shark: Shark, render: ISharkRender): void {
    const dest = shark.position.copy()
    dest.x = shark.direction.x * SHARK_WALK_LIMIT_GRIDS * GRID_SIZE + shark.position.x
    dest.y = shark.direction.y * SHARK_WALK_LIMIT_GRIDS * GRID_SIZE + shark.position.y

    render.walk(shark.position, dest, shark.direction, (pos) => {
      shark.walk(pos)
    })
  }

  public dieShark(id: string): void {
    this.shark.die(id)
    this.sharkRenders.get(id)?.dead()
  }

  public dropBomb(bombId: string, playerId: string, render: IBombRender, position?: Position): void {
    const source = this.players.getPlayer(playerId)
    if (source === undefined) {
      render.destroy()
      return
    }
    // positionがない場合は、自プレイヤーの位置
    position ??= source.position.copy()

    const bomb = new Bomb(source, position)

    this.bombRenders.set(bombId, render)
    this.bombs.drop(bombId, bomb)

    if (this.ownPlayerId === playerId && !this.isReceivedError) {
      this.emitter.spawnBomb(bombId, position)
    }

    render.drop(position)

    setTimeout(() => {
      render.explode()
      this.bombRenders.delete(bombId)
      this.bombs.explode(bombId)
    }, bomb.timeLimit)
  }

  public addTextChat(name: string, message: string, textColor?: string): void {
    const textChat = new TextChat(name, message)
    this.textChat.addChat(textChat)
    this.chatBoardRender.add(textChat, textColor)
    if (!this.chatDialog.isOpen) {
      this.chatBadge.activate()
    }
  }

  /**
   * serverからErrorを受け取った時
   */
  public receiveServerError(render: IServerErrorRender): void {
    this.isReceivedError = true
    render.show()
  }

  public isTextInputting(): boolean {
    return this.domInputObserver.isInputting
  }

  /**
   * actionをまとめて送信させる
   */
  public flushActions(): void {
    if (this.isReceivedError) {
      return
    }
    this.emitter.flushActions()
  }

  /**
   * メッセージを送信する。
   * 空文字のときには送信できない。
   */
  public sendChat(playerId: string, message: string): void {
    if (message !== '') {
      this.emitter.chat(this.players.getPlayerName(playerId) ?? 'name', message)
      this.emitter.flushActions()
    }
    this.chatInputRender.clearMessage()
  }

  /**
   * textChatRenderから入力欄の文字列を取得する。
   */
  public getMessage(): string {
    return this.chatInputRender.getMessage()
  }

  /**
   * 接続するマイクを変更する
   */
  public switchMicrophone(mic: Microphone): void {
    this.localDevice.microphoneManager.switchDevice(mic)
  }

  /**
   * 接続するカメラを変更する
   */
  public switchCamera(camera: Camera): void {
    this.localDevice.cameraManager.switchDevice(camera)
  }

  /**
   * 接続するスピーカーを変更する
   */
  public switchSpeaker(speaker: Speaker): void {
    this.localDevice.speakerManager.switchDevice(speaker)
  }

  /**
   * 接続機器に変更があった場合に実行する処理
   */
  public async deviceChange(): Promise<void> {
    this.micSelector.updateLocalMicrophones(await this.localDevice.microphoneManager.getDevices())
    this.speakerSelector.updateLocalSpeakers(await this.localDevice.speakerManager.getDevices())
    this.cameraSelector.updateLocalCameras(await this.localDevice.cameraManager.getDevices())
  }

  /**
   * プレイヤーがボイスチャットを開始した時に実行される
   *
   * @param playerId ボイスチャットを開始したプレイヤーのid
   * @param voice ボイスチャットの音声データ
   */
  public joinVoiceChat(playerId: string, voice: HTMLMediaElement): void {
    this.playerRenders.get(playerId)?.handleMicIcons(true)
    this.voiceChatVolumeController.addVoice(playerId, voice)
  }

  public onUnmute(playerId: string): void {
    this.playerRenders.get(playerId)?.handleMicIcons(true)
  }

  public onMute(playerId: string): void {
    this.playerRenders.get(playerId)?.handleMicIcons(false)
  }

  /**
   * プレイヤーがボイスチャットを終了した時に実行される
   * @param playerId ボイスチャットを終了したプレイヤーのid
   */
  public leaveVoiceChat(playerId: string): void {
    this.voiceChatVolumeController.deleteVoice(playerId)
  }

  /**
   * 自プレイヤーのボイスチャットを開始する
   */
  public async startVoiceStream(): Promise<boolean> {
    this.playerRenders.get(this.ownPlayerId)?.handleMicIcons(true)
    return await this.voiceChatSender.startStream()
  }

  /**
   * 自プレイヤーのボイスチャットを終了する
   */
  public async stopVoiceStream(): Promise<boolean> {
    this.playerRenders.get(this.ownPlayerId)?.handleMicIcons(false)
    return await this.voiceChatSender.stopStream()
  }

  /**
   * ボイスチャットの音量を距離に応じて調整する
   * @param updateIntervalMs 音量を更新する間隔(ms)
   */
  private startVoiceChatVolumeControl(updateIntervalMs: number): void {
    const ownPlayer = this.players.getPlayer(this.ownPlayerId)
    if (ownPlayer === undefined) return

    setInterval(() => {
      this.voiceChatVolumeController.updateAccordingToDistance(this.ownPlayerId, this.players)
    }, updateIntervalMs)
  }

  /**
   * メガホン機能のON/OFFを切り替える
   * @param playerId メガホン機能をトグルするプレイヤー
   * @param active trueの時メガホン機能をON
   */
  public toggleMegaphone(playerId: string, active: boolean): void {
    // PlayerRenderのアイコン切り替え
    this.playerRenders.get(playerId)?.handleMegaphone(active)

    // 自プレイヤーが切り替えた場合は他プレイヤーに通知するだけ
    if (playerId === this.ownPlayerId) {
      this.emitter.toggleMegaphone(active)
      return
    }

    if (active) {
      this.voiceChatVolumeController.activateMegaphone(playerId)
    } else {
      this.voiceChatVolumeController.deactivateMegaphone(playerId)
    }
  }

  /**
   * 全プレイヤー無敵モードのON/OFFを切り替える
   */
  public toggleInvincibleWorldMode(playerId: string, active: boolean): void {
    this.invincibleWorldModeSwitch.setChecked(active)
    // 自プレイヤーが切り替えた場合のみemit
    if (playerId === this.ownPlayerId) {
      this.emitter.toggleInvincibleWorldMode(active)
    }
    if (active) {
      this.invincibleModeIndicator.activate()
    } else {
      this.invincibleModeIndicator.deactivate()
    }
  }

  /**
   * プレイヤーがWebカメラを開始した時に実行される
   *
   * @param playerId Webカメラを開始したプレイヤーのid
   * @param video 共有されている画面映像
   */
  public joinCameraVideo(playerId: string, stream: MediaStream): void {
    this.cameraVideoListRender.addVideo(playerId, stream)
  }

  /**
   * プレイヤーがWebカメラを終了した時に実行される
   * @param playerId Webカメラを終了したプレイヤーのid
   */
  public leaveCameraVideo(playerId: string): void {
    this.cameraVideoListRender.removeVideo(playerId)
  }

  /**
   * 自プレイヤーのWebカメラを開始する
   */
  public async startCameraVideo(): Promise<boolean> {
    return await this.cameraVideoSender.startStream()
  }

  /**
   * 自プレイヤーのWebカメラを終了する
   */
  public async stopCameraVideo(): Promise<boolean> {
    return await this.cameraVideoSender.stopStream()
  }

  public async setCameraEffect(mode: CameraEffectId): Promise<void> {
    await this.cameraVideoSender.setEffect(mode)
  }

  /**
   * プレイヤーが画面共有を開始した時に実行される
   *
   * @param playerId 画面共有を開始したプレイヤーのid
   * @param video 共有されている画面映像
   */
  public joinScreenShare(playerId: string, sharedScreenRender: ISharedScreenRender): void {
    // 既存の画面共有を停止
    for (const sharedPlayerId of this.sharedScreenRenders.keys()) {
      if (sharedPlayerId === this.ownPlayerId) {
        void this.stopScreenShare()
        break
      }
    }
    this.sharedScreenRenders.set(playerId, sharedScreenRender)
  }

  /**
   * プレイヤーが画面共有を終了した時に実行される
   * @param playerId 画面共有を終了したプレイヤーのid
   */
  public leaveScreenShare(playerId: string): void {
    this.sharedScreenRenders.get(playerId)?.destroy()
    this.sharedScreenRenders.delete(playerId)
    if (playerId === this.ownPlayerId) {
      this.screenShareIcon.deactivate()
    }
  }

  /**
   * 自プレイヤーの画面共有を開始する
   */
  public async startScreenShare(): Promise<boolean> {
    if (this.sharedScreenRenders.size > 0) {
      const cancelScreenShare = !window.confirm(
        '他のユーザーが画面共有中です。新しく共有を開始すると、他のユーザーの共有は終了します。よろしいですか？'
      )
      if (cancelScreenShare) return false
    }
    return await this.screenShareSender.startStream()
  }

  /**
   * 自プレイヤーの画面共有を終了する
   */
  public async stopScreenShare(): Promise<boolean> {
    return await this.screenShareSender.stopStream()
  }

  /**
   * プレイヤー画面にフォーカスするか共有画面にフォーカスするかを切り替える
   */
  public toggleScreenFocus(): void {
    if (this.isTextInputting()) return
    if (this.focusedRender !== this.playerRenders.get(this.ownPlayerId)) {
      this.playerRenders.get(this.ownPlayerId)?.focus()
      this.focusedRender = this.playerRenders.get(this.ownPlayerId)
    } else {
      this.sharedScreenRenders.get(this.sharedScreenRenders.keys().next().value)?.focus()
      this.focusedRender = this.sharedScreenRenders.keys().next().value
    }
  }

  /**
   * keySettingPopUpWindowを開く
   */
  public openKeySettingPopUpWindow(): void {
    this.keySettingPopUpWindow.openPopupWindow()
  }

  /**
   * keySettingPopUpWindowを閉じる
   */
  public closeKeySettingPopUPWindow(): void {
    this.keySettingPopUpWindow.closePopupWindow()
  }

  /**
   * イベントと、それに紐づくキーコードのMapを習得
   */
  public getKeyPreference(): Map<KeyEvent, KeyCode> {
    return this.keyConfiguration.getKeyPreference()
  }

  /**
   * プレイヤーが死亡した時に実行される
   */
  public addDeathLog(victim: Player, killer: Player, cause: DamageCause): void {
    const deathLog: DeathLog = {
      victim,
      killer,
      cause,
      diedTime: new Date(),
    } as const

    this.deathLogRender.add(deathLog)
    this.deathLog.addDeathLog(deathLog)
  }

  /**
   * playerの名前変更時、入退出時に実行される
   */
  public updatePlayerList(): void {
    const players = this.players.players
    if (players === undefined) return
    this.playerList.updatePlayerList(this.ownPlayerId, players)
  }

  /**
   * 管理者がマップを変更時に実行される
   */
  public changeMap(mapName: string): void {
    this.emitter.requestNewMap(mapName)
  }
}
