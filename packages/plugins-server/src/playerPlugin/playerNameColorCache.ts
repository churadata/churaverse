/**
 * TitleScene クライアントへ返すプレイヤー名・色・会社名のキャッシュ。
 * playerPlugin パッケージに置くことで、プレイヤーのドメイン知識を
 * playerPlugin に閉じた設計にしている。
 *
 * tsx(esbuild)はシンボリックリンク経由のインポートと相対パスのインポートを
 * 別モジュールとしてキャッシュすることがあるため、globalThis を使って
 * プロセス全体で確実に単一の Map を共有する。
 */

import { EventEmitter } from 'events'
//暫定的対応としてEventEmitterを利用しているが、根本的にはEventBusやNetworkPlugin側を改修する必要がある
export interface PlayerNameColor {
  name: string
  color: string
  company?: string // SSO 導入後に会社名が入る。現時点では常に undefined
}

const GLOBAL_KEY = '__churaverse_playerNameColorCache__'

function getCache(): Map<string, PlayerNameColor> {
  const g = globalThis as unknown as Record<string, Map<string, PlayerNameColor>>
  if (g[GLOBAL_KEY] === undefined) {
    g[GLOBAL_KEY] = new Map<string, PlayerNameColor>()
  }
  return g[GLOBAL_KEY]
}

const EVENT_EMITTER_GLOBAL_KEY = '__churaverse_playerNameColorCache_eventEmitter__'

function getEventEmitter(): EventEmitter {
  const g = globalThis as unknown as Record<string, EventEmitter>
  if (g[EVENT_EMITTER_GLOBAL_KEY] === undefined) {
    g[EVENT_EMITTER_GLOBAL_KEY] = new EventEmitter()
  }
  return g[EVENT_EMITTER_GLOBAL_KEY]
}

export const eventEmitter = getEventEmitter()

export const playerNameColorCache = {
  set(id: string, data: PlayerNameColor): void {
    getCache().set(id, data)
    eventEmitter.emit('titleParticipantUpdate')
  },
  delete(id: string): void {
    getCache().delete(id)
    eventEmitter.emit('titleParticipantUpdate')
  },
  getAll(): PlayerNameColor[] {
    return [...getCache().values()]
  },
}
