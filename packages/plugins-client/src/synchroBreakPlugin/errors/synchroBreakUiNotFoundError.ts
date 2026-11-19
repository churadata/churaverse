import { SynchroBreakPluginError } from './synchroBreakPluginError'

export class SynchroBreakUiNotFoundError extends SynchroBreakPluginError {
  public constructor(componentName: string) {
    super(`${componentName}のUIコンポーネントが存在しません`)
  }
}
