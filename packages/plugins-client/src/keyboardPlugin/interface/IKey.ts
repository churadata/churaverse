export interface IKey {
  duration: number
  keyCode: string
  isJustDown: boolean
  isDown: boolean
  isHold: boolean
  resetHoldTime: () => void
  updateHoldTime: (dt: number) => void
}
