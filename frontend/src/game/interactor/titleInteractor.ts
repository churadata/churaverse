import { ITitleNameFieldRender } from '../domain/IRender/ITitlenamefieldRender'
import { Direction } from '../domain/model/core/direction'
import { Position } from '../domain/model/core/position'
import { DEFAULT_HP, Player } from '../plugins/playerPlugin/domain/player'
import { ITransitionManager } from './ITransitionManager'
import { IPlayerSetupInfoReader } from './playerSetupInfo/IPlayerSetupInfoReader'
import { ITitleScene } from '../scene/IScene/ITitleScene'
import { IMainScene } from '../scene/IScene/IMainScene'
import { PlayerColorName, PLAYER_COLOR_NAMES } from '../domain/model/types'
import { PlayerColorChangeUseCase } from '../usecase/playerColorChangeUseCase'
import { IJoinButtonRender } from '../domain/IRender/IJoinButtonRender'
import { IPlayerRoleRender } from '../domain/IRender/IPlayerRoleRender'
import { ITitlePlayerBackgroundContainerRender } from '../domain/IRender/ITitlePlayerBackgroundContainerRender'
import { ITitleArrowButtonRender } from '../domain/IRender/ITitleArrowButtonRender'
import { DomManager } from '../interface/ui/util/domManager'
import { IPlayerRenderer } from '../plugins/playerPlugin/domain/IPlayerRenderer'
import { validatePlayerName, normalizePlayerName } from '../domain/model/playerNameValidator'

/**
 * TitleSceneのInteractor
 * イベント駆動の中心
 * ロジックは基本ここかdomainに書かれる
 * イベントは呼び出しによって発火する
 * 入力は関数の引数
 * 出力はDIされたRenderやEmitter(もしくは返り値)
 */
export class TitleInteractor implements PlayerColorChangeUseCase {
  private readonly player: Player
  public currentPlayerColor: PlayerColorName

  // prettier-ignore
  public constructor(
    private readonly transitionManager: ITransitionManager<ITitleScene>,
    public readonly titleNamaFieldRender: ITitleNameFieldRender,
    private readonly playerSetupInfoReader: IPlayerSetupInfoReader,
    private readonly previewPlayer: IPlayerRenderer,
    private readonly playerBackgroundContainer: ITitlePlayerBackgroundContainerRender,
    private readonly arrowButtons: ITitleArrowButtonRender,
    private readonly playerRoleRender: IPlayerRoleRender,
    private readonly joinButtonRender: IJoinButtonRender,
    private readonly ownPlayerId: string
    ){
    this.player = this.createOwnPlayer()
    this.currentPlayerColor = this.player.color ?? PLAYER_COLOR_NAMES[4]
    this.previewPlayer.setParentContainer(this.playerBackgroundContainer.container)


    // コンテナ内にプレイヤーを描画
    previewPlayer.setParentContainer(playerBackgroundContainer.container)

    this.previewPlayer.setParentContainer(this.playerBackgroundContainer.container)
    this.arrowButtons.addToContainer(this.playerBackgroundContainer.container)
  }

  /**
   * MainSceneに遷移
   */
  public transitionToMain(): void {
    DomManager.removeAll()
    this.transitionManager.transitionTo<IMainScene>('MainScene', {
      ownPlayer: this.player,
    })
  }

  private createOwnPlayer(): Player {
    const pos = new Position(800, 440)
    const direction = Direction.down
    const ownPlayer = new Player(
      this.ownPlayerId,
      pos,
      direction,
      this.playerSetupInfoReader.read().name ?? '',
      this.playerSetupInfoReader.read().color ?? PLAYER_COLOR_NAMES[4],
      DEFAULT_HP,
      this.playerSetupInfoReader.read().role ?? 'user'
    )
    return ownPlayer
  }

  public toggleRole(): void {
    const role = this.player.role
    if (role === 'admin') {
      this.playerRoleRender.disappear()
      this.player.setRole('user')
    } else {
      this.playerRoleRender.appear()
      this.player.setRole('admin')
    }
    const newRole = this.player.role
    this.joinButtonRender.changeButtonColor(newRole)
  }

  public changePlayerColor(id: string, color: PlayerColorName): void {
    this.currentPlayerColor = color
    this.player.setColor(color)
    this.previewPlayer.applyPlayerColor(color)
  }

  public changePlayerName(name: string): void {
    if (!validatePlayerName(name)) {
      console.warn('Player name must be 1-20 characters')
      return
    }
    
    const normalizedName = normalizePlayerName(name)
    this.player.setName(normalizedName)
    this.previewPlayer.applyPlayerName(normalizedName)
  }
}

