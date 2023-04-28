import { Camera } from '../../domain/model/localDevice/camera'

/**
 * 接続されているカメラを管理する
 */
export interface ILocalCameraManager {
  /**
   * 接続されているカメラ一覧を取得する
   */
  getCameras: () => Promise<Camera[]>

  /**
   * アクティブなカメラを切り替える
   */

  switchCamera: (mic: Camera) => void
  /**
   * 現在アクティブになっているカメラ
   * アクティブになっているカメラが存在しない場合はnullを返す
   */
  current: Camera | null
}
