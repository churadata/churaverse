import type { KnownKeyOf } from 'churaverse-engine-client'
import type { IDialog } from '../domain/interface/IRender/IDialog'

export interface IDialogSwitcher {
  add: (name: DialogType, dialog: IDialog<any>, postClose: () => void) => void
  open: (name: DialogType, postOpen: () => void) => void
  close: () => void
}

export interface DialogMap {
  [key: string]: IDialog<any>
}

export type DialogType = KnownKeyOf<DialogMap>
