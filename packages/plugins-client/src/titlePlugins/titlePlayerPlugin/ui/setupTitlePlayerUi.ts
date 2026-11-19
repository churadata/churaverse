import type { IEventBus, ITitleScene, Store } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { TitleArrowButtonRenderer } from './renderer/titleArrowButtonRenderer'
import { TitlePlayerBackgroundContainerRenderer } from './renderer/titlePlayerBackgroundContainerRenderer'

export function setupTitlePlayerUi(scene: Scene, store: Store<ITitleScene>, eventBus: IEventBus<ITitleScene>): void {
  // プレイヤープレビューと色変更ボタンを配置するコンテナの生成
  const titlePlayerBackGroundContainerRenderer = new TitlePlayerBackgroundContainerRenderer(scene)
  // プレイヤープレビューをコンテナに追加
  const previewPlayer = store.of('titlePlayerPlugin').previewPlayer
  previewPlayer.setParentContainer(titlePlayerBackGroundContainerRenderer.container)
  // 色変更ボタンの描画とコンテナへの追加
  const titleArrowButtonRenderer = new TitleArrowButtonRenderer(scene, store, eventBus)
  titleArrowButtonRenderer.setParentContainer(titlePlayerBackGroundContainerRenderer.container)
}
