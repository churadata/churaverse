import { DomManager } from '../../domManager'
import { DebugDetailScreen } from './debugDetailScreen'
import { IDebugDetailScreenRender } from '../../../../domain/IRender/IDebugRender/IDebugDetailScreenRender'
import {
  IBombCountDebugDetailScreen,
  ISharkCountDebugDetailScreen,
} from '../../../../domain/IRender/IDebugRender/ISharkInfoDebugDetailScreen'
import { DebugDetailScreenComponent } from './components/DebugDetailScreenComponent'
import { SharkCountDebugDetailScreen } from './sharkInfo/sharkCountDebugDetailScreen'
import { BombCountDebugDetailScreen } from './bombInfo/bombCountDebugDetailScreen'
import {
  ICollisionCountDebugDetailScreen,
  ISpawnCountDebugDetailScreen,
} from '../../../../domain/IRender/IDebugRender/IMapInfoDebugDetailScreen'
import { CollisionCountCountDebugDetailScreen } from './mapInfo/collisionCountDebugDetailScreen'
import { MapManager } from '../../../map/mapManager'
import { SpawnCountCountDebugDetailScreen } from './mapInfo/spawnCountDebugDetailScreen'
import { IInvincibilityMyStatusDebugDetailScreen } from '../../../../domain/IRender/IDebugRender/IInvincibleModeInfoDebugDetailScreen'
import {
  IWebCameraIdDebugDetailScreen,
  IWebCameraMyStatusDebugDetailScreen,
} from '../../../../domain/IRender/IDebugRender/IWebCameraInfoDebugDetailScreen'
import {
  IScreenShareIdDebugDetailScreen,
  IScreenShareMyStatusDebugDetailScreen,
} from '../../../../domain/IRender/IDebugRender/IScreenShareInfoDebugDetailScreen'
import { IMicrophoneMyStatusDebugDetailScreen } from '../../../../domain/IRender/IDebugRender/IMicrophoneInfoDebugDetailScreen'
import { IMegaphoneMyStatusDebugDetailScreen } from '../../../../domain/IRender/IDebugRender/IMegaphoneInfoDebugDetailScreen'
import { InvincibleModeMyStatusDebugDetailScreen } from './invincibleModeInfo/invincibleModeMyStatusDebugDetailScreen'
import { WebCameraStatusDebugDetailScreen } from './webCameraInfo/webCameraMyStatusDebugDetailScreen'
import { ScreenShareMyStatusDebugDetailScreen } from './screenShareInfo/screenShareMyStatusDebugDetailScreen'
import { MicrophoneStatusDebugDetailScreen } from './microphoneInfo/microphoneMyStatusDebugDetailScreen'
import { MegaphoneStatusDebugDetailScreen } from './megaphoneInfo/megaphoneMyStatusDebugDetailScreen'
import { WebCameraIdDebugDetailScreen } from './webCameraInfo/webCameraIdDebugDetailScreen'
import { ScreenShareIdDebugDetailScreen } from './screenShareInfo/screenShareIdDebugDetailScreen'

export const DEBUG_DETAIL_SCREEN_CONTAINER_ID = 'debug-detail-screen'

export class DebugDetailScreenRender implements IDebugDetailScreenRender {
  public sharkCount: ISharkCountDebugDetailScreen
  public bombCount: IBombCountDebugDetailScreen
  public collisionCount: ICollisionCountDebugDetailScreen
  public spawnCount: ISpawnCountDebugDetailScreen
  public invincibleModeMyStatus: IInvincibilityMyStatusDebugDetailScreen
  public webCameraMyStatus: IWebCameraMyStatusDebugDetailScreen
  public webCameraId: IWebCameraIdDebugDetailScreen
  public screenShareMyStatus: IScreenShareMyStatusDebugDetailScreen
  public screenShareId: IScreenShareIdDebugDetailScreen
  public microphoneMyStatus: IMicrophoneMyStatusDebugDetailScreen
  public megaphoneMyStatus: IMegaphoneMyStatusDebugDetailScreen

  public constructor(mapManager: MapManager, settingDialog: DebugDetailScreen) {
    const sharkContent = DomManager.jsxToDom(DebugDetailScreenComponent())
    const bombContent = DomManager.jsxToDom(DebugDetailScreenComponent())
    const mapContent = DomManager.jsxToDom(DebugDetailScreenComponent())
    const invincibleModeContent = DomManager.jsxToDom(DebugDetailScreenComponent())
    const webCameraContent = DomManager.jsxToDom(DebugDetailScreenComponent())
    const screenShareContent = DomManager.jsxToDom(DebugDetailScreenComponent())
    const microphoneContent = DomManager.jsxToDom(DebugDetailScreenComponent())
    const megaphoneContent = DomManager.jsxToDom(DebugDetailScreenComponent())

    settingDialog.addContent('sharkInfo', sharkContent)
    settingDialog.addContent('bombInfo', bombContent)
    settingDialog.addContent('mapInfo', mapContent)
    settingDialog.addContent('invincibleModeInfo', invincibleModeContent)
    settingDialog.addContent('webCameraInfo', webCameraContent)
    settingDialog.addContent('screenShareInfo', screenShareContent)
    settingDialog.addContent('microphoneInfo', microphoneContent)
    settingDialog.addContent('megaphoneInfo', megaphoneContent)

    this.sharkCount = SharkCountDebugDetailScreen.build(settingDialog)
    this.bombCount = BombCountDebugDetailScreen.build(settingDialog)
    this.collisionCount = CollisionCountCountDebugDetailScreen.build(mapManager, settingDialog)
    this.spawnCount = SpawnCountCountDebugDetailScreen.build(mapManager, settingDialog)
    this.invincibleModeMyStatus = InvincibleModeMyStatusDebugDetailScreen.build(settingDialog)
    this.webCameraMyStatus = WebCameraStatusDebugDetailScreen.build(settingDialog)
    this.webCameraId = WebCameraIdDebugDetailScreen.build(settingDialog)
    this.screenShareMyStatus = ScreenShareMyStatusDebugDetailScreen.build(settingDialog)
    this.screenShareId = ScreenShareIdDebugDetailScreen.build(settingDialog)
    this.microphoneMyStatus = MicrophoneStatusDebugDetailScreen.build(settingDialog)
    this.megaphoneMyStatus = MegaphoneStatusDebugDetailScreen.build(settingDialog)
  }

  public static async build(
    mapManager: MapManager,
    settingDialog: DebugDetailScreen
  ): Promise<DebugDetailScreenRender> {
    return new DebugDetailScreenRender(mapManager, settingDialog)
  }
}
