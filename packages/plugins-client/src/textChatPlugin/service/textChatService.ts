import type { TextChat } from '../model/textChat'

export class TextChatService {
  public readonly textChats: TextChat[] = []

  public addChat(message: TextChat): void {
    this.textChats.push(message)
  }

  public allChat(): TextChat[] {
    return [...this.textChats]
  }

  public changePlayerName(playerId: string, name: string): void {
    for (const textChat of this.textChats) {
      if (textChat.playerId === playerId) {
        textChat.editPlayerName(name)
      }
    }
  }
}
