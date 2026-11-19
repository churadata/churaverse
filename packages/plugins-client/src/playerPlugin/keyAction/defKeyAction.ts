import type { KeyAction } from '@churaverse/keyboard-plugin-client'

declare module '@churaverse/keyboard-plugin-client' {
  export interface MainKeyActionMap {
    walkDown: KeyAction
    walkUp: KeyAction
    walkLeft: KeyAction
    walkRight: KeyAction
  }
}
