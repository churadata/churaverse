import { loadRnnoise, RnnoiseWorkletNode } from '@sapphi-red/web-noise-suppressor'
import rnnoiseWasmUrl from '@sapphi-red/web-noise-suppressor/rnnoise.wasm?url'
import rnnoiseSimdWasmUrl from '@sapphi-red/web-noise-suppressor/rnnoise_simd.wasm?url'
/* eslint-disable import/no-unresolved -- Vite resolves `?url` imports at build time */
import rnnoiseWorkletUrl from '@sapphi-red/web-noise-suppressor/rnnoiseWorklet.js?url'
/* eslint-enable import/no-unresolved */

/**
 * RNNoise ベースのマイク用パイプライン.
 *
 * 責務:
 * - getUserMedia でローカルのマイクストリームを取得する
 * - AudioContext / AudioWorklet (RnnoiseWorkletNode) を通してノイズ抑圧を行う
 * - LiveKit に publish 可能な MediaStreamTrack を返す
 *
 * このクラスは「音声処理」に専念し、LiveKit との連携は VoiceChatSender 側に任せる。
 */
export class RnnoiseMicPipeline {
  private audioContext?: AudioContext
  private destination?: MediaStreamAudioDestinationNode
  private sourceStream?: MediaStream
  private processedTrack?: MediaStreamTrack
  private workletNode?: RnnoiseWorkletNode

  private static wasmBinaryPromise?: Promise<ArrayBuffer>

  public async start(): Promise<MediaStreamTrack> {
    if (this.processedTrack?.readyState === 'live') {
      return this.processedTrack
    }

    await this.stop()

    try {
      await this.initializePipeline()
      const track = this.getProcessedTrack()
      this.processedTrack = track
      return track
      // 例外が発生した場合は途中まで作成されたリソースを解放する
    } catch (error) {
      await this.stop()
      throw error
    }
  }

  private async initializePipeline(): Promise<void> {
    // なるべく緩い制約でマイク取得。
    // 一部環境で厳しすぎる制約を指定すると OverconstrainedError が発生するため、
    // 2ch で取得されると RNNoise が ch0 しか書き込まず ch1 が無音のまま publish され、
    // 受信側で片耳からしか聞こえなくなる。取得段階で 1ch にする
    this.sourceStream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: { ideal: 1 } },
    })
    this.audioContext = new AudioContext({ sampleRate: 48_000 })
    this.destination = this.audioContext.createMediaStreamDestination()
    this.destination.channelCount = 1
    this.destination.channelCountMode = 'explicit'

    // RNNoise の AudioWorklet をロードして処理ノードを生成
    await this.audioContext.audioWorklet.addModule(rnnoiseWorkletUrl)

    const wasmBinary = await RnnoiseMicPipeline.loadWasmBinary()
    this.workletNode = new RnnoiseWorkletNode(this.audioContext, {
      maxChannels: 1,
      wasmBinary,
    })
    // RNNoise は maxChannels: 1 なので output[0] しか書き込まない。
    // outputChannelCount 未指定の AudioWorkletNode は出力チャンネル数が入力に動的追従するため、
    // 入力を explicit に 1ch へ固定して 1ch 入力 -> 1ch 出力を確定させる。
    this.workletNode.channelCount = 1
    this.workletNode.channelCountMode = 'explicit'
    // getUserMedia のストリームを AudioContext に接続し、RNNoise 経由で destination へ流す
    const sourceNode = this.audioContext.createMediaStreamSource(this.sourceStream)

    // 型確定してから接続
    const workletAudioNode = this.workletNode as unknown as AudioNode
    sourceNode.connect(workletAudioNode).connect(this.destination)
  }

  private getProcessedTrack(): MediaStreamTrack {
    if (this.destination === undefined) {
      throw new Error('Destination node is not initialized')
    }

    const [track] = this.destination.stream.getAudioTracks()

    if (track === undefined) {
      throw new Error('Failed to create RNNoise processed microphone track')
    }

    return track
  }

  public async stop(): Promise<void> {
    // publish していたトラックを停止
    this.processedTrack?.stop()
    this.processedTrack = undefined

    // getUserMedia で取得した元のストリームも全て停止
    this.sourceStream?.getTracks().forEach((track) => {
      track.stop()
    })
    this.sourceStream = undefined

    try {
      // RNNoise の内部リソースを解放
      this.workletNode?.destroy()
      this.workletNode?.disconnect()
    } catch {
      // ignore
    }
    this.workletNode = undefined

    this.destination?.disconnect()
    this.destination = undefined

    if (this.audioContext !== undefined) {
      await this.audioContext.close()
    }
    this.audioContext = undefined
  }

  private static async loadWasmBinary(): Promise<ArrayBuffer> {
    // wasm バイナリは static にキャッシュし、複数回の start() 呼び出しで再利用する
    if (RnnoiseMicPipeline.wasmBinaryPromise === undefined) {
      RnnoiseMicPipeline.wasmBinaryPromise = loadRnnoise({ url: rnnoiseWasmUrl, simdUrl: rnnoiseSimdWasmUrl })
      RnnoiseMicPipeline.wasmBinaryPromise.catch(() => {
        // 失敗した場合は次回以降に再度ロードを試みるため、キャッシュをクリアする
        RnnoiseMicPipeline.wasmBinaryPromise = undefined
      })
    }
    return await RnnoiseMicPipeline.wasmBinaryPromise
  }
}
