import type { IDialog } from '@churaverse/core-ui-plugin-client'
import type { DebugSummaryScreenSection } from '../debugSummaryScreenSection'

export interface IDebugSummaryScreenContainer extends IDialog<DebugSummaryScreenSection> {}

export interface DebugScreenSettingSectionMap {}

export type DebugScreenSectionId = keyof DebugScreenSettingSectionMap & string
