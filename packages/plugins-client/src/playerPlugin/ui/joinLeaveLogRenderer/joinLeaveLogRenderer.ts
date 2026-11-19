import type { FadeOutLogRenderer } from '@churaverse/core-ui-plugin-client'
import type { IJoinLeaveLogRenderer } from '../../interface/IJoinLeaveLogRenderer'

/**
 * 入退室のログを表示
 */
export class JoinLeaveLogRenderer implements IJoinLeaveLogRenderer {
  public constructor(private readonly fadeOutLogRenderer: FadeOutLogRenderer) {}

  /**
   * @param id を元にランダムにmessage決めてる
   */

  public join(id: string, name: string): void {
    const entryMessages = [`${name} が現れた...!`, `${name} 降臨！`, `${name} in!`]

    const message = entryMessages[id.charCodeAt(0) % entryMessages.length]
    this.fadeOutLogRenderer.add(message)
  }

  public leave(id: string, name: string): void {
    const exitMessages = [`${name} に逃げられた...!`, `さらば ${name} また会う日まで...!!`, `${name} out!`]

    const message = exitMessages[id.charCodeAt(0) % exitMessages.length]
    this.fadeOutLogRenderer.add(message)
  }
}
