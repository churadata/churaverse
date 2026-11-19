import { IInvincibilityMyStatusDebugDetailScreen } from './IInvincibleModeInfoDebugDetailScreen'
import { ICollisionCountDebugDetailScreen, ISpawnCountDebugDetailScreen } from './IMapInfoDebugDetailScreen'
import { IMegaphoneMyStatusDebugDetailScreen } from './IMegaphoneInfoDebugDetailScreen'
import { IMicrophoneMyStatusDebugDetailScreen } from './IMicrophoneInfoDebugDetailScreen'
import {
  IScreenShareIdDebugDetailScreen,
  IScreenShareMyStatusDebugDetailScreen,
} from './IScreenShareInfoDebugDetailScreen'
import { IBombCountDebugDetailScreen, ISharkCountDebugDetailScreen } from './ISharkInfoDebugDetailScreen'
import { IWebCameraIdDebugDetailScreen, IWebCameraMyStatusDebugDetailScreen } from './IWebCameraInfoDebugDetailScreen'

export interface IDebugDetailScreenRender {
  sharkCount: ISharkCountDebugDetailScreen
  bombCount: IBombCountDebugDetailScreen
  collisionCount: ICollisionCountDebugDetailScreen
  spawnCount: ISpawnCountDebugDetailScreen
  invincibleModeMyStatus: IInvincibilityMyStatusDebugDetailScreen
  webCameraMyStatus: IWebCameraMyStatusDebugDetailScreen
  webCameraId: IWebCameraIdDebugDetailScreen
  screenShareMyStatus: IScreenShareMyStatusDebugDetailScreen
  screenShareId: IScreenShareIdDebugDetailScreen
  microphoneMyStatus: IMicrophoneMyStatusDebugDetailScreen
  megaphoneMyStatus: IMegaphoneMyStatusDebugDetailScreen
}
