/**
 * 自プレイヤーのWebカメラ映像の開始・終了を送信するクラス
 */

export const CAMERA_EFFECT_IDS = ['dummy', 'blur', 'virtualBackground'] as const
export type CameraEffectId = typeof CAMERA_EFFECT_IDS[number]

export interface ICameraVideoSender {
  /**
   * Webカメラ映像を開始する.
   * 開始に失敗した場合はfalseを返す
   */
  startStream: () => Promise<boolean>

  /**
   * Webカメラ映像を終了する.
   * 終了に失敗した場合はfalseを返す
   */
  stopStream: () => Promise<boolean>

  /**
   * エフェクトの変更
   */
  setEffect: (effectName: CameraEffectId) => Promise<void>
}
