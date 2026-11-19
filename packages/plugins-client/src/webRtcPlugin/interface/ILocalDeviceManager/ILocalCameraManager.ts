import type { Camera } from '../../domain/localDevice/camera'
import type { IBaseLocalDeviceManager } from './IBaseLocalDeviceManager'

/**
 * 接続されているカメラを管理する
 */
export interface ILocalCameraManager extends IBaseLocalDeviceManager<Camera> {}
