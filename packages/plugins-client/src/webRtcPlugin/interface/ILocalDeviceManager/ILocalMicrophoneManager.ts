import type { Microphone } from '../../domain/localDevice/microphone'
import type { IBaseLocalDeviceManager } from './IBaseLocalDeviceManager'

/**
 * 接続されているマイクを管理する
 */
export interface ILocalMicrophoneManager extends IBaseLocalDeviceManager<Microphone> {}
