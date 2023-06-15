export interface IKey {
  isJustDown: boolean
  isDown: boolean
  isHold: boolean
  callback: () => void
  resetHoldTime: () => void
  updateHoldTime: (dt: number) => void
}
