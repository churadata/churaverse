import type { PlayerRole } from '@churaverse/shared-types-client'

export interface IJoinButtonRenderer {
  changeButtonColor: (role: PlayerRole) => void
}
