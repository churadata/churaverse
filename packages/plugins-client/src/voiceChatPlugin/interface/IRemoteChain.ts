import type { RemoteAudioTrack } from 'livekit-client'

export interface RemoteChain {
  audioEl?: HTMLAudioElement
  track: RemoteAudioTrack
  inputTrack: MediaStreamTrack
  source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode
  gain: GainNode
}
