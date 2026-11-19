export class TextChat {
  public readonly id: string
  public readonly playerId: string
  private _name: string
  private _message: string

  public constructor(id: string, playerId: string, name: string, message: string) {
    this.id = id
    this.playerId = playerId
    this._name = name
    this._message = message
  }

  public editPlayerName(name: string): void {
    this._name = name
  }

  public editPlayerMessage(message: string): void {
    this._message = message
  }

  public get name(): string {
    return this._name
  }

  public get message(): string {
    return this._message
  }
}
