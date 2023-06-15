import { Camera } from '../../domain/model/localDevice/camera'

/**
 * カメラを切り替えるセレクタ
 */
export interface ICameraSelector {
  /**
   * 選択肢の内容を更新する
   */
  updateLocalCameras: (cameras: Camera[]) => void
}
