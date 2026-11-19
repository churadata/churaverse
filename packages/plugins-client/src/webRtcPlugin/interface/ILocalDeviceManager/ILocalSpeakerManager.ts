import type { Speaker } from '../../domain/localDevice/speaker'
import type { IBaseLocalDeviceManager } from './IBaseLocalDeviceManager'

/**
 * 接続されているスピーカーを管理する
 */
export interface ILocalSpeakerManager extends IBaseLocalDeviceManager<Speaker> {}
