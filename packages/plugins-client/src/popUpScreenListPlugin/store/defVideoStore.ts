import type { IPopUpScreenList } from '../ui/interface/IpopUpScreenList'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    popUpScreenList: IPopUpScreenList
  }
}
