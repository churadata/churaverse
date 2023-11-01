import { IPlayerRender } from '../../domain/IRender/IPlayerRender'

export interface IWebRtc {
  disconnect: () => Promise<void>
  setInitialState: (playerRenders: Map<string, IPlayerRender>) => void
}
