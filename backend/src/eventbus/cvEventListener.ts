import { CVEvent } from '../event/cvEvent'
import { Scenes } from '../scene/types'

/**
 * subscribeEventで登録するcallback. 紐づけたイベントがpostされた時に実行される.
 *
 * postされたイベントを引数にとる.
 */
export type CVEventListener<Ev extends CVEvent<Scenes>> = (event: Ev) => void

/**
 * subscribeEventで登録する非同期callback. 紐づけたイベントがasyncPostされた時に実行される.
 *
 * asyncPostされたイベントを引数にとる.
 */
export type CVAsyncEventListener<Ev extends CVEvent<Scenes>> = (event: Ev) => Promise<void>
