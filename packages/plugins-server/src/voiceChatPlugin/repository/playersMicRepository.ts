/**
 * 各プレイヤーのミュート状態を格納する場所
 */
export class PlayersMicRepository {
  private readonly playersMic = new Map<string, boolean>()

  public set(id: string, isUnmute: boolean): void {
    this.playersMic.set(id, isUnmute)
  }

  public delete(id: string): void {
    this.playersMic.delete(id)
  }

  public get(id: string): boolean | undefined {
    return this.playersMic.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.playersMic.keys())
  }
}
