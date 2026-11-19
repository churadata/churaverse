import type { KeyAction } from '@churaverse/keyboard-plugin-client'

declare module '@churaverse/keyboard-plugin-client' {
  export interface MainKeyActionMap {
    dropItem1: KeyAction
    dropItem2: KeyAction
    dropItem3: KeyAction
  }
}
