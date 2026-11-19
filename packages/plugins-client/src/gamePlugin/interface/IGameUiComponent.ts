export interface IGameUiComponent {
  /** Uiコンポーネントの初期化処理 */
  initialize: () => void
  /** Uiコンポーネントの削除処理 */
  remove: () => void
  /** UiコンポーネントのHTML要素 */
  element: HTMLElement
  /** Uiコンポーネントの表示/非表示 */
  visible: boolean
}
