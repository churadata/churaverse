import { Direction } from '../model/core/direction'
import { PlayerColorName } from '../model/types'
import { Player } from '../model/player'
import { Position } from '../model/core/position'

/**
 * Playerのインスタンスを格納する場所
 * 関数名はPlayerが主語
 */
export class PlayersService {
  public players = new Map<string, Player>()

  /**
   * Player参加
   * @param id Playerのid
   * @param player Player
   */
  public join(id: string, player: Player): void {
    this.players.set(id, player)
  }

  /**
   * Player退出
   * @param id 対象となるPlayerのid
   */
  public leave(id: string): void {
    this.players.get(id)?.leave()
    this.players.delete(id)
  }

  public getPlayer(id: string): Player | undefined {
    return this.players.get(id)
  }

  public forEach(callback: (player: Player, id: string) => void): void {
    this.players.forEach(callback)
  }

  public getDirection(id: string): Direction | undefined {
    return this.players.get(id)?.direction
  }

  public turn(id: string, direction: Direction): void {
    this.players.get(id)?.turn(direction)
  }

  public walk(id: string, position: Position, direction: Direction): void {
    this.players.get(id)?.walk(position, direction)
  }

  public damage(id: string, amount: number): void {
    this.players.get(id)?.damage(amount)
  }

  public changePlayerName(id: string, name: string): void {
    this.players.get(id)?.setName(name)
  }

  public changePlayerColor(id: string, color: PlayerColorName): void {
    this.players.get(id)?.setColor(color)
  }

  public getPlayerName(id: string): string | undefined {
    return this.players.get(id)?.name
  }

  public getPlayerHp(id: string): number | undefined {
    return this.players.get(id)?.hp
  }

  /**
   * プレイヤーが死んでいるか確認する関数
   * @param isDead
   */
  public isDead(id: string): boolean {
    return this.players.get(id)?.isDead ?? true
  }

  public respawn(id: string, position: Position, direction: Direction): void {
    this.players.get(id)?.respawn(position, direction)
  }
}
