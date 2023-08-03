import { PlayerRoleName } from '../model/types'

export interface IJoinButtonRender {
  changeButtonColor: (role: PlayerRoleName) => void
}
