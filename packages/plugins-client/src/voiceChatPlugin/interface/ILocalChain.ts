export interface LocalChain {
  stream: MediaStream
  inputTrack: MediaStreamTrack
  processedTrack: MediaStreamTrack
  source?: MediaStreamAudioSourceNode
  gain?: GainNode
  destination?: MediaStreamAudioDestinationNode
}
