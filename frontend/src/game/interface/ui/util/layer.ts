export function getLayerPosition(layerInterval: number, layerNumber: number): number {
  // 各抽象レイヤーの持つ領域の範囲
  const abstractLayerRange: number = 2 * layerInterval
  return layerInterval + layerNumber * (abstractLayerRange + 1)
}

// 与えられたzIndexの絶対値がlayerIntervalより大きい場合、符号は維持し、zIndexの絶対値をlayerIntervalに修正
export function getAbstractZIndex(zIndex: number, layerInterval: number): number {
  const result: number = limitValue(Math.abs(zIndex), layerInterval)
  if (zIndex !== result) {
    console.warn(`表示する要素のzIndexは絶対値${layerInterval}の間でのみ指定可能です。`)
  }
  return result
}

// valueがlimitValueよりも大きい場合limitValueを返す。そうでなければvalueを返す
function limitValue(value: number, limitValue: number): number {
  if (value > limitValue) {
    return limitValue
  } else {
    return value
  }
}
