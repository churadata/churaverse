import { Microphone } from '../../domain/model/localDevice/microphone'

export interface IMicSelector {
  updateLocalMicrophones: (microphones: Microphone[]) => void
}
