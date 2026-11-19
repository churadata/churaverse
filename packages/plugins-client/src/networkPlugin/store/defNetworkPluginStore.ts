import type { IMainScene, ITitleScene, Scenes } from 'churaverse-engine-client'
import type { IMessageSender } from '../interface/IMessageSender'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    networkPlugin: NetworkPluginStore<IMainScene>
  }

  export interface StoreInTitle {
    networkPlugin: NetworkPluginStore<ITitleScene>
  }
}

export interface NetworkPluginStore<Scene extends Scenes> {
  readonly messageSender: IMessageSender<Scene>
  readonly socketId: string
}
