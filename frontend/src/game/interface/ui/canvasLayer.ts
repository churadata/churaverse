import { getLayerPosition, getAbstractZIndex } from './layer'

type LayerbleElement =
  | Phaser.GameObjects.Text
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Graphics
  | Phaser.GameObjects.Container
  | Phaser.GameObjects.Video

// layerの管理をしたいオグジェクトを次の抽象レイヤーを基準に、zIndexを用いて上下を調整する
const abstractLayerOrders = ['ground', 'belowPlayer', 'player', 'abovePlayer', 'UI'] as const

type AbstractLayerNames = typeof abstractLayerOrders[number]

// 各抽象レイヤーの基準値からの範囲
const layerInterval: number = 1000

/**
 * 描画する要素のレイヤーを指定する関数
 * @param settingElement 配置したい要素
 * @param abstractLayerName 要素を配置する抽象レイヤー名
 * @param zIndex |zIndex| <= 100 の抽象レイヤー内におけるz値
 */
export function layerSetting(
  settingElement: LayerbleElement,
  abstractLayerName: AbstractLayerNames,
  zIndex: number = 0
): void {
  const layerNumber: number = abstractLayerOrders.indexOf(abstractLayerName)
  // 抽象レイヤーの基準値
  const layerPosition: number = getLayerPosition(layerInterval, layerNumber)
  zIndex = getAbstractZIndex(zIndex, layerInterval)
  settingElement.depth = layerPosition + zIndex
}
