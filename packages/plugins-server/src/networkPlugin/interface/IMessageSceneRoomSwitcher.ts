import type { SceneName } from 'churaverse-engine-server'

/**
 * Scene遷移時に通信のRoomを切り替える
 */
export interface IMessageSceneRoomSwitcher {
  didSceneTransition: (socketId: string, sceneName: SceneName) => void
}
