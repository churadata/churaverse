import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * カメラ、マイク、スピーカーなどのメディア機器が接続・切断されるたびにpostされる
 */
export class ChangeLocalDeviceEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('changeLocalDevice', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    changeLocalDevice: ChangeLocalDeviceEvent
  }
}
