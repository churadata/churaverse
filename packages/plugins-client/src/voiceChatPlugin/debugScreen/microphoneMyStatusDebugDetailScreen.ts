import type { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client'
import type { IMicrophoneMyStatusDebugDetailScreen } from './IDebugScreen/IVoiceChatInfoDebugDetailScreen'

export class MicrophoneMyStatusDebugDetailScreen
  extends BaseDebugDetailScreen
  implements IMicrophoneMyStatusDebugDetailScreen
{
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `MicrophoneIsOn: false`
    super(debugDetailScreenContainer, 'voiceChatInfo', element)
  }

  public update(isOn: boolean): void {
    this.content.textContent = `MicrophoneIsOn: ${isOn.toString()}`
  }
}
