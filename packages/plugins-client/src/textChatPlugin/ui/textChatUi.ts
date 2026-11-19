import type { IBadgeHolder, IDialogSwitcher, ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client'
import { OwnPlayerUndefinedError } from '@churaverse/player-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import type { IChatBoardRenderer } from './interface/IChatBoardRenderer'
import type { ITextChatUi } from './interface/ITextChatUi'
import { TextChatBoard } from './textChatBoard/textChatBoard'
import { Badge } from './textChatDialog/badge'
import { TextChatDialog } from './textChatDialog/textChatDialog'
import { TextChatIcon } from './textChatDialog/textChatIcon'
import type { IChatInputRenderer } from './textChatInput/IChatInputRenderer'
import { TextChatInput } from './textChatInput/textChatInput'
import { TextChatToast } from './textChatToast/textChatToast'

export class TextChatUi implements ITextChatUi {
  public textChatDialog: TextChatDialog
  public textChatBoard: IChatBoardRenderer
  public textChatInput: IChatInputRenderer
  public textChatIcon: ITopBarIconRenderer & IBadgeHolder
  public textChatToast: TextChatToast
  private readonly switcher: IDialogSwitcher
  public constructor(
    private readonly store: Store<IMainScene>,
    eventBus: IEventBus<IMainScene>
  ) {
    this.textChatDialog = new TextChatDialog()
    this.textChatBoard = new TextChatBoard(store.of('playerPlugin').ownPlayerId, this.textChatDialog)

    const coreUiPluginStore = store.of('coreUiPlugin')
    this.switcher = coreUiPluginStore.switcher
    const playerPluginStoreUi = store.of('playerPlugin')
    const player = playerPluginStoreUi.players.get(playerPluginStoreUi.ownPlayerId)
    if (player === undefined) throw new OwnPlayerUndefinedError()

    this.textChatInput = new TextChatInput(playerPluginStoreUi.ownPlayerId, player.name, this.textChatDialog, eventBus)

    this.textChatIcon = new TextChatIcon(
      this.switcher,
      this.textChatDialog,
      coreUiPluginStore.topBarIconContainer,
      new Badge(store),
      () => this.openChatDialog(),
      () => this.closeChatDialog()
    )

    this.textChatToast = new TextChatToast(() => this.openChatDialog())
  }

  private openChatDialog(): void {
    this.switcher.open('chat', () => {
      this.textChatIcon.activate()
      this.textChatIcon.badge.deactivate()

      const textChatStore = this.store.of('textChatPlugin')
      const unreadCount = textChatStore.unreadCount
      if (unreadCount > 0) {
        const allChat = textChatStore.textChatService.allChat()
        const firstUnread = allChat[Math.max(0, allChat.length - unreadCount)]
        if (firstUnread !== undefined) {
          this.textChatBoard.showUnreadDivider(firstUnread.id)
        }
        textChatStore.unreadCount = 0
      }
    })
  }

  private closeChatDialog(): void {
    this.textChatBoard.removeUnreadDivider()
  }
}
