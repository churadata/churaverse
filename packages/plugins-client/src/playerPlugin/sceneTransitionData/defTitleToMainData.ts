import type { Player } from '../domain/player'

declare module '@churaverse/transition-plugin-client' {
  export interface TitleToMainData {
    ownPlayer: Player
  }
}
