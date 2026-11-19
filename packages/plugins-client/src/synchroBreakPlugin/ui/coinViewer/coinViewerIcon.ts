import type { IMainScene, Store } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import '@churaverse/player-plugin-client'
import { PlayerRendererNotFoundError } from '@churaverse/player-plugin-client'
import { CoinViewer } from './coinViewer'

/**
 * 各プレイヤーの周りにボイスチャット関連のアイコンを配置するクラス
 */
export class CoinViewerIcon {
  public readonly coinViewer?: CoinViewer
  public constructor(scene: Scene, store: Store<IMainScene>, playerId: string) {
    const playerRenderer = store.of('playerPlugin').playerRenderers.get(playerId)
    if (playerRenderer === undefined) throw new PlayerRendererNotFoundError(playerId)

    this.coinViewer = new CoinViewer(scene, playerRenderer)
  }
}
