import type { KeyAction } from '@churaverse/keyboard-plugin-client'

declare module '@churaverse/keyboard-plugin-client' {
  export interface MainKeyActionMap {
    ToggleDebugScreen: KeyAction
  }
}
