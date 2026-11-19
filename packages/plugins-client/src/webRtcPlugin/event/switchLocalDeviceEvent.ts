import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { Device } from '../domain/localDevice/device'

/**
 * アクティブなデバイスを切り替えるイベント
 */
export class SwitchLocalDeviceEvent extends CVEvent<IMainScene> {
  public constructor(public readonly device: Device) {
    super('switchLocalDevice', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    switchLocalDevice: SwitchLocalDeviceEvent
  }
}
