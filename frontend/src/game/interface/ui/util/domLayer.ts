import { getLayerPosition, getAbstractZIndex } from './layer'

// 各抽象レイヤーの基準値からの範囲
const layerInterval: number = 1000

// layerの管理をしたいDOM要素を次のDOMの抽象レイヤーを基準に、zIndexを用いて上下を調整する
const abstractDOMLayerOrders = ['lowest', 'lower', 'low', 'middle', 'high', 'higher', 'highest']

export type AbstractDOMLayerNames = typeof abstractDOMLayerOrders[number]

export function domLayerSetting(
  element: HTMLElement,
  abstractDOMLayerName: AbstractDOMLayerNames,
  zIndex: number = 0
): void {
  const layerNumber = abstractDOMLayerOrders.indexOf(abstractDOMLayerName)
  const layerPosition = getLayerPosition(layerInterval, layerNumber)
  zIndex = getAbstractZIndex(zIndex, layerInterval) + layerPosition
  element.style.zIndex = String(zIndex)
}
