import { ISocketActionEmitter } from './ISocketActionEmitter'
import { ISocketEventEmitter } from './ISocketEventEmitter'

export type ISocketEmitter = ISocketEventEmitter & ISocketActionEmitter
