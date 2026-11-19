export interface IPopUpScreenList {
  /**
   * {id: string, screen: HTMLVideoElement}
   * */
  addScreen: (id: string, screen: HTMLVideoElement) => void

  /**
   * 表示している画面を削除する
   * @param {id: string}
   */
  removeScreen: (id: string) => void
}
