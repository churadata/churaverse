import { Speaker } from '../../domain/model/localDevice/speaker'

export interface ISpeakerSelector {
  updateLocalSpeakers: (speakers: Speaker[]) => void
}
