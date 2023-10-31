import { ActionListenTypeTable, SocketListenActionType } from '../interface/socket/action/actionTypes'
import { ListenEventCallbackTable, SocketListenEventType } from '../interface/socket/eventTypes'

export interface ISocket {
  update: () => void

  listenEvent: <Ev extends SocketListenEventType>(eventName: Ev, callback: ListenEventCallbackTable[Ev]) => void

  listenAction: <Ac extends SocketListenActionType>(actionName: Ac, callback: ActionListenTypeTable[Ac]) => void
}
