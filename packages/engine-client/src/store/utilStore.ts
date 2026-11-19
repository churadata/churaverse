import type { IFocusableRenderer } from '../domain/interface/IFocusableRenderer'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UtilStoreInTitle {}
export interface UtilStoreInMain {
  focusedRenderer: IFocusableRenderer
}
