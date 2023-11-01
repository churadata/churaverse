import { Player } from '../domain/model/player'
import { IPlayerRepository } from '../domain/IRepository/IPlayerRepository'
import { ExistPlayersInfo, PlayerInfo, PreloadedData } from '../interface/socket/eventTypes'
import { IMegaphoneUserRepository } from '../domain/IRepository/IMegaphoneUserRepository'

/**
 * 入室直後のプレイヤーに送信するデータを作成する
 */
export function makePreloadedData(
  players: IPlayerRepository,
  megaphoneUsers: IMegaphoneUserRepository,
  mapName: string,
  invincibleWorldMode: boolean
): PreloadedData {
  // 引数で受け取ったplayersから送信用のデータを作成
  const existPlayers: ExistPlayersInfo = {}
  for (const id of players.getAllId()) {
    const player = players.get(id)
    if (player !== undefined) {
      existPlayers[id] = convertForEmitPlayerInfo(id, player)
    }
  }

  const preloadedData: PreloadedData = {
    existPlayers,
    mapName,
    megaphoneUsers: megaphoneUsers.toObject(),
    invincibleWorldModeInfo: { active: invincibleWorldMode },
  }
  return preloadedData
}

/**
 * playerから送信用のデータを生成
 */
function convertForEmitPlayerInfo(playerId: string, player: Player): PlayerInfo {
  const info: PlayerInfo = {
    hp: player.hp,
    x: player.position.x,
    y: player.position.y,
    direction: player.direction,
    playerId,
    heroColor: player.color,
    heroName: player.name,
  }

  return info
}
