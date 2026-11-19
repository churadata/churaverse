import type { IPlayerListRenderer, PlayerListPluginStore } from '@churaverse/player-list-plugin-client'
import type { Player, PlayerPluginStore } from '@churaverse/player-plugin-client'
import { OwnPlayerUndefinedError, PlayerNotExistsInPlayerRepositoryError } from '@churaverse/player-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { KickButton } from './kickButton/kickButton'

export class KickPluginUi {
  private readonly playerPluginStore: PlayerPluginStore
  private readonly playerListPluginStore: PlayerListPluginStore

  public constructor(
    readonly eventBus: IEventBus<IMainScene>,
    private readonly store: Store<IMainScene>
  ) {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.playerListPluginStore = this.store.of('playerListPlugin')

    this.addKickButtonToPlayerList(eventBus, this.playerListPluginStore.playerListUi.playerList)
  }

  private addKickButtonToPlayerList(eventBus: IEventBus<IMainScene>, playerListRenderer: IPlayerListRenderer): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) throw new OwnPlayerUndefinedError()

    playerListRenderer.addRowContentCreator((playerId) => {
      const player = this.playerPluginStore.players.get(playerId)
      if (player === undefined) throw new PlayerNotExistsInPlayerRepositoryError(playerId)

      const shouldDisplay = this.hasKickPermission(ownPlayer) && ownPlayer.id !== player.id
      const button = new KickButton(shouldDisplay, ownPlayer, player, eventBus)

      return button.node
    })
  }

  private hasKickPermission(player: Player): boolean {
    if (player.role === 'admin') {
      return true
    } else {
      return false
    }
  }
}
