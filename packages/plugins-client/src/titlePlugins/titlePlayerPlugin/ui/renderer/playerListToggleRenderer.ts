import { DomManager } from 'churaverse-engine-client'
import type { IPlayerListToggleRenderer } from '../../domain/IPlayerListToggleRenderer'
import type { PlayerNameColor } from '../../message/titlePriorPlayerDataMessage'
import { PLAYER_LIST_HEADER_ID, PlayerListPanel } from '../components/PlayerListPanel'

/**
 * 参加中プレイヤー一覧をアコーディオン形式で表示する
 */
export class PlayerListToggleRenderer implements IPlayerListToggleRenderer {
  private players: PlayerNameColor[] = []
  private isOpen = false
  private panelElement?: HTMLElement

  public update(players: PlayerNameColor[]): void {
    this.players = players
    this.render()
  }

  private toggle(): void {
    this.isOpen = !this.isOpen
    this.render()
  }

  private render(): void {
    this.panelElement?.remove()
    this.panelElement = DomManager.addJsxDom(PlayerListPanel({ players: this.players, isOpen: this.isOpen }))
    const headerElement = DomManager.getElementById<HTMLElement>(PLAYER_LIST_HEADER_ID)
    headerElement.onclick = () => {
      this.toggle()
    }
  }
}
