import type { Player } from '@churaverse/player-plugin-client'
import { DomManager, type IEventBus, type IMainScene } from 'churaverse-engine-client'
import KICK_ICON_PATH from '../../assets/exit.png'
import { RequestKickPlayerEvent } from '../../event/requestKickPlayerEvent'
import { KickButtonComponent } from './components/KickButtonComponent'

export class KickButton {
  public readonly node: HTMLButtonElement

  public constructor(visible: boolean, ownPlayer: Player, kickPlayer: Player, eventBus: IEventBus<IMainScene>) {
    this.node = DomManager.jsxToDom(KickButtonComponent({ visible, iconPath: KICK_ICON_PATH })) as HTMLButtonElement

    this.node.onclick = () => {
      const isPlayerKicked = window.confirm(`「${kickPlayer.name}」 を退出させますか？`)
      if (isPlayerKicked) {
        eventBus.post(new RequestKickPlayerEvent(kickPlayer, ownPlayer))
      }
    }
  }
}
