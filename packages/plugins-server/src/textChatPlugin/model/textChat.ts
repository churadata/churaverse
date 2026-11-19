export class TextChat {
  public readonly playerId: string
  private _message: string

  public constructor(playerId: string, message: string) {
    this.playerId = playerId
    this._message = message
  }

  public editPlayerMessage(message: string): void {
    this._message = message
  }

  public get message(): string {
    return this._message
  }
}
