import { DomManager } from '../../domManager'
import { DebugSummaryScreen } from './debugSummaryScreen'
import { DebugScreenComponent } from './components/DebugScreenComponent'
import { Player } from '../../../../domain/model/player'
import { PlayerIdDebugScreen } from './playerInfo/playerIdDebugScreen'
import { PlayerNameDebugScreen } from './playerInfo/playerNameDebugScreen'
import { PlayerPositionDebugScreen } from './playerInfo/playerPositionDebugScreen'
import { PlayerHpDebugScreen } from './playerInfo/playerHpDebugScreen'
import { IDebugScreenRender } from '../../../../domain/IRender/IDebugRender/IDebugScreenRender'
import {
  IPlayerColorDebugScreen,
  IPlayerDirectionDebugScreen,
  IPlayerHpDebugScreen,
  IPlayerIdDebugScreen,
  IPlayerNameDebugScreen,
  IPlayerPositionDebugScreen,
  IPlayerRoleDebugScreen,
} from '../../../../domain/IRender/IDebugRender/IPlayerInfoDebugScreen'
import {
  IWorldFpsDebugScreen,
  IWorldNameDebugScreen,
  IWorldSizeDebugScreen,
  IWorldFrontendVersionDebugScreen,
  IWorldDeployVersionDebugScreen,
  IWorldBackendVersionDebugScreen,
  IPlayerCountInWorld,
} from '../../../../domain/IRender/IDebugRender/IWorldInfoDebugScreen'
import { WorldNameDebugScreen } from './worldInfo/worldNameDebugScreen'
import { WorldConfig } from '../../../../domain/model/worldConfig'
import { WorldSizeDebugScreen } from './worldInfo/worldSizeDebugScreen'
import { Scene } from 'phaser'
import { WorldFpsDebugScreen } from './worldInfo/worldFpsDebugScreen'
import { WorldFrontendVersionDebugScreen } from './worldInfo/worldFrontendVersionDebugScreen'
import { WorldDeployVersionDebugScreen } from './worldInfo/worldDeployVersionDebugScreen'
import { WorldBackendVersionDebugScreen } from './worldInfo/worldBackendVersionDebugScreen'
import { PlayerColorDebugScreen } from './playerInfo/playerColorDebugScreen'
import { PlayerDirectionDebugScreen } from './playerInfo/playerDirectionDebugScreen'
import { PlayerRoleDebugScreen } from './playerInfo/playerRoleDebugScreen'
import { PlayerCountInWorld } from './worldInfo/playerCountInWorldDebugScreen'

export const DEBUG_SCREEN_CONTAINER_ID = 'debug-screen'

export class DebugScreenRender implements IDebugScreenRender {
  public playerId: IPlayerIdDebugScreen
  public playerName: IPlayerNameDebugScreen
  public playerColor: IPlayerColorDebugScreen
  public playerHp: IPlayerHpDebugScreen
  public playerPosition: IPlayerPositionDebugScreen
  public playerDirection: IPlayerDirectionDebugScreen
  public playerRole: IPlayerRoleDebugScreen
  public worldName: IWorldNameDebugScreen
  public worldSize: IWorldSizeDebugScreen
  public worldFps: IWorldFpsDebugScreen
  public playerCountInWorld: IPlayerCountInWorld
  public worldDeployVersion: IWorldDeployVersionDebugScreen
  public worldFrontendVersion: IWorldFrontendVersionDebugScreen
  public worldBackendVersion: IWorldBackendVersionDebugScreen

  public constructor(
    private readonly scene: Scene,
    Id: string,
    player: Player,
    worldConfig: WorldConfig,
    settingDialog: DebugSummaryScreen
  ) {
    const playerContent = DomManager.jsxToDom(DebugScreenComponent())
    const worldContent = DomManager.jsxToDom(DebugScreenComponent())
    settingDialog.addContent('playerInfo', playerContent)
    this.playerId = PlayerIdDebugScreen.build(Id, settingDialog)
    this.playerName = PlayerNameDebugScreen.build(player.name, settingDialog)
    this.playerColor = PlayerColorDebugScreen.build(player.color, settingDialog)
    this.playerHp = PlayerHpDebugScreen.build(player.hp, settingDialog)
    this.playerPosition = PlayerPositionDebugScreen.build(player.position, settingDialog)
    this.playerDirection = PlayerDirectionDebugScreen.build(player.direction, settingDialog)
    this.playerRole = PlayerRoleDebugScreen.build(player.role, settingDialog)
    settingDialog.addContent('worldInfo', worldContent)
    this.worldFps = WorldFpsDebugScreen.build(scene, settingDialog)
    this.worldName = WorldNameDebugScreen.build(worldConfig.currentMap, settingDialog)
    this.worldSize = WorldSizeDebugScreen.build(scene, settingDialog)
    this.playerCountInWorld = PlayerCountInWorld.build(settingDialog)
    this.worldDeployVersion = WorldDeployVersionDebugScreen.build(settingDialog)
    this.worldFrontendVersion = WorldFrontendVersionDebugScreen.build(settingDialog)
    this.worldBackendVersion = WorldBackendVersionDebugScreen.build(settingDialog)
  }

  public static async build(
    scene: Scene,
    Id: string,
    player: Player,
    worldConfig: WorldConfig,
    settingDialog: DebugSummaryScreen
  ): Promise<DebugScreenRender> {
    return new DebugScreenRender(scene, Id, player, worldConfig, settingDialog)
  }
}
