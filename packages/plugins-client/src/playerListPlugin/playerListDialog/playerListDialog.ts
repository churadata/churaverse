import { Dialog, type Props } from '@churaverse/core-ui-plugin-client'
import type { IPlayerListDialog } from '../interface/IPlayerListDialog'
import type { PlayerListSection } from './playerListSection'

/**
 * Playerの一覧に関するUI
 */
export class PlayerListDialog extends Dialog<PlayerListSection> implements IPlayerListDialog {
  public constructor() {
    const props: Props = {
      dialogName: '参加者一覧',
    }
    super(props)
  }

  public static build(): Dialog<PlayerListSection> {
    return new PlayerListDialog()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PlayerListDialogSectionMap {}
