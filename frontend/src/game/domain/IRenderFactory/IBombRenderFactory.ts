import { IBombRender } from '../IRender/IBombRender'

export interface IBombRenderFactory {
  build: () => Promise<IBombRender>
}
