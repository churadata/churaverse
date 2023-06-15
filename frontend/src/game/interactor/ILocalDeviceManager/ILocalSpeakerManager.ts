import { Speaker } from '../../domain/model/localDevice/speaker'
import { IBaseLocalDeviceManager } from './IBaseLocalDeviceManager'

/**
 * 接続されているスピーカーを管理する
 */
export interface ILocalSpeakerManager extends IBaseLocalDeviceManager<Speaker> {}
