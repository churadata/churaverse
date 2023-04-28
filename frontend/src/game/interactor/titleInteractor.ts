import { ITransitionManager } from './ITransitionManager'
import { TitleToMainData } from './SceneTransitionData/titleToMain'
import { ITitleNameFieldRender } from '../domain/IRender/ITitlenamefieldRender'
import { Player } from '../domain/model/player'
import { Position } from '../domain/position'
import { Direction } from '../domain/direction'
import { IPlayerSetupInfoReader } from './IPlayerSetupInfoReader'
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
    const ownPlayer = new Player(pos, direction)
    const color = this.playerSetupInfoReader.read().color
    if (color !== undefined) {
      ownPlayer.setColor(color)
    }
    ownPlayer.setName(this.titleNamaFieldRender.getName())

    return ownPlayer
  }
}
