import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * VideoChat用に、カメラアイコンをクリックするときに発火させるためのイベント
 */
export class TriggerVideoSendingEvent extends CVEvent<IMainScene> {
  public constructor(public readonly status: boolean) {
    super('triggerVideoSending', true)
  }
}

declare module 'churaverse-engine-client' {
  interface CVMainEventMap {
    triggerVideoSending: TriggerVideoSendingEvent
  }
}
