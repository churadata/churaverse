import { Section } from '@churaverse/core-ui-plugin-client'
import type { PlayerListDialogSectionMap } from './playerListDialog'

export class PlayerListSection extends Section {
  public constructor(
    public readonly sectionId: keyof PlayerListDialogSectionMap,
    sectionLabel: string
  ) {
    super(sectionId, sectionLabel)
  }
}
