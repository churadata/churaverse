import { Section } from '@churaverse/core-ui-plugin-client'
import type { GameDialogSectionMap } from './gameDialog'

export class GameSection extends Section<keyof GameDialogSectionMap> {}
