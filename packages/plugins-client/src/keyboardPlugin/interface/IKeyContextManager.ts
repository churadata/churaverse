import type { KeyContext } from '../types/keyContext'

export interface IKeyContextManager {
  setGui: () => void
  setInGame: () => void

  nowContext: KeyContext
}
