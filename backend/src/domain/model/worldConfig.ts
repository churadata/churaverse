/**
 * ワールド全体/プレイヤー全員に関わる設定
 */
export class WorldConfig {
  /** trueの時, プレイヤー全員が無敵 */
  private _isInvincibleMode: boolean = false

  public get isInvincibleMode(): boolean {
    return this._isInvincibleMode
  }

  public set isInvincibleMode(val: boolean) {
    this._isInvincibleMode = val
  }
}
