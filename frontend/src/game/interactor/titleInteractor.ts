import { ITransitionManager } from './ITransitionManager'
import { TitleToMainData } from './sceneTransitionData/titleToMain'
import { ITitleNameFieldRender } from '../domain/IRender/ITitlenamefieldRender'
import { Player } from '../domain/model/player'
import { Position } from '../domain/model/core/position'
import { Direction } from '../domain/model/core/direction'
import { IPlayerSetupInfoReader } from './playerSetupInfo/IPlayerSetupInfoReader'
import { PLAYER_COLOR_NAMES } from '../domain/model/types'
/**
 * TitleSceneのInteractor
 * イベント駆動の中心地
 * ロジックは基本ここかdomainに書かれる
 * イベントは呼び出しによって発火する
 * 入力は関数の引数
 * 出力はDIされたRenderやEmitter(もしくは返り値)
 */
export class TitleInteractor {
  // prettier-ignore
  public constructor(
    private readonly transitionManager: ITransitionManager<undefined, TitleToMainData>,
    private readonly titleNamaFieldRender: ITitleNameFieldRender,
    private readonly playerSetupInfoReader: IPlayerSetupInfoReader
  ){}

  /**
   * MainSceneに遷移
   */
  public transitionToMain(): void {
    const ownPlayer = this.createOwnPlayer()
    this.transitionManager.transitionTo('Main', { ownPlayer })
  }

  private createOwnPlayer(): Player {
    const pos = new Position(800, 440)
    const direction = Direction.down
    const color = this.playerSetupInfoReader.read().color
    const ownPlayer = new Player(pos, direction, this.titleNamaFieldRender.getName(), color ?? PLAYER_COLOR_NAMES[0])
    return ownPlayer
  }
}
