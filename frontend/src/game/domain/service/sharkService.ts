import { Shark } from '../model/shark'

/**
 * Sharkのインスタンスを格納する場所
 * 関数名はPlayerが主語
 */
export class SharkService {
  public sharks = new Map<string, Shark>()

  public spawn(id: string, shark: Shark): void {
    this.sharks.set(id, shark)
  }

  public die(id: string): void {
    this.sharks.delete(id)
  }
}
