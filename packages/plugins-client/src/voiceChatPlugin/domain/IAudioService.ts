import type { RemoteAudioTrack, Room } from 'livekit-client'

/**
 * 音声処理の挿入口を一元管理するための契約インターフェース。
 * 上位層は LiveKit の詳細や <audio> 要素を触らず、この契約だけを使う。
 */
export interface IAudioService {
  /**
   * ユーザー操作から呼び出して自動再生制限を解除する。
   * AudioContext の resume や room.startAudio() を内部で行う。
   */
  unlock: () => Promise<void>

  /**
   * 受信した遠隔プレイヤーの音声トラックを管線に接続する。
   */
  addRemoteTrack: (playerId: string, track: RemoteAudioTrack) => void

  /**
   * 遠隔プレイヤーの音声トラックを管線から外し、関連リソースをクリーンアップする。
   */
  removeRemoteTrack: (playerId: string) => void

  /**
   * プレイヤーごとの音量（0-1）を設定する。Web Audio の GainNode を経由。
   */
  setRemoteVolume: (playerId: string, volume: number) => void

  /**
   * ローカルマイクの送信チェーンを構築して LiveKit に publish する。
   */
  startLocalMic: () => Promise<boolean>

  /**
   * ローカルマイクの送信チェーンを停止し、LiveKit から unpublish する。
   */
  stopLocalMic: () => Promise<boolean>

  /**
   * 送受信チェーン・AudioContext をまとめて解放する。ルーム離脱/プラグイン停止時に呼び出す。
   */
  dispose: () => Promise<void>
}

/**
 * AudioService を構築する際に LiveKit の Room を渡したいケース向けの型補助。
 */
export type AudioServiceFactory = (room?: Room) => IAudioService
