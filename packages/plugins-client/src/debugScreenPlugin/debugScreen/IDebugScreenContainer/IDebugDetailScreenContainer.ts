import type { IDialog } from '@churaverse/core-ui-plugin-client'
import type { DebugDetailScreenSection } from '../debugDetailScreenSection'

export interface IDebugDetailScreenContainer extends IDialog<DebugDetailScreenSection> {}

export interface DebugDetailScreenSettingSectionMap {}

export type DebugDetailScreenSectionId = keyof DebugDetailScreenSettingSectionMap & string
