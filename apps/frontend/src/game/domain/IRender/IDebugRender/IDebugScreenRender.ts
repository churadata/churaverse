import {
  IPlayerColorDebugScreen,
  IPlayerDirectionDebugScreen,
  IPlayerHpDebugScreen,
  IPlayerIdDebugScreen,
  IPlayerNameDebugScreen,
  IPlayerPositionDebugScreen,
  IPlayerRoleDebugScreen,
} from './IPlayerInfoDebugScreen'
import {
  IWorldFpsDebugScreen,
  IWorldNameDebugScreen,
  IWorldSizeDebugScreen,
  IWorldFrontendVersionDebugScreen,
  IWorldDeployVersionDebugScreen,
  IWorldBackendVersionDebugScreen,
  IPlayerCountInWorld,
} from './IWorldInfoDebugScreen'

export interface IDebugScreenRender {
  playerId: IPlayerIdDebugScreen
  playerName: IPlayerNameDebugScreen
  playerColor: IPlayerColorDebugScreen
  playerHp: IPlayerHpDebugScreen
  playerPosition: IPlayerPositionDebugScreen
  playerDirection: IPlayerDirectionDebugScreen
  playerRole: IPlayerRoleDebugScreen
  worldName: IWorldNameDebugScreen
  worldSize: IWorldSizeDebugScreen
  worldFps: IWorldFpsDebugScreen
  playerCountInWorld: IPlayerCountInWorld
  worldFrontendVersion: IWorldFrontendVersionDebugScreen
  worldBackendVersion: IWorldBackendVersionDebugScreen
  worldDeployVersion: IWorldDeployVersionDebugScreen
}
