import { Dialog } from '../dialog/dialog'
import { PlayerListSection } from './playerListSection'
import { Props } from '../dialog/components/Panel'

/**
 * Playerの一覧に関するUI
 */
export class PlayerListDialog extends Dialog<keyof PlayerListDialogSectionMap, PlayerListSection> {
  private constructor() {
    const props: Props = {
      dialogName: '参加者一覧',
    }
    super(props)
  }

  public static build(): Dialog<keyof PlayerListDialogSectionMap, PlayerListSection> {
    return new PlayerListDialog()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PlayerListDialogSectionMap {}
