/**
 * webカメラの映像一覧を表示するためのインターフェース
 */
export interface ICameraVideoListRender {
  /**
   * 映像をリストに追加する
   */
  addVideo: (id: string, stream: MediaStream) => void

  /**
   * 映像をリストから削除する
   */
  removeVideo: (id: string) => void
}
