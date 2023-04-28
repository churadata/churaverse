import { IPlayerRepository } from '../IRepository/IPlayerRepository'

/**
 * PlayerRepository内の全プレイヤーを微小時間分だけ移動
 */
export function movePlayers(dt: number, players: IPlayerRepository): void {
  players.getAllId().forEach((playerId) => {
    const player = players.get(playerId)
    if (player !== undefined) {
      player.move(dt)
      players.updateActor(playerId, player)
    }
  })
}
