/**
 * 各プレイヤーのメガホン状態を格納する場所
 */
export class PlayersMegaphoneRepository {
  private readonly playersMegaphone = new Map<string, boolean>()

  public set(id: string, active: boolean): void {
    this.playersMegaphone.set(id, active)
  }

  public delete(id: string): void {
    this.playersMegaphone.delete(id)
  }

  public get(id: string): boolean | undefined {
    return this.playersMegaphone.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.playersMegaphone.keys())
  }
}
