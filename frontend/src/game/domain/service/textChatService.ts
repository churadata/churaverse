import { TextChat } from '../model/textChat'

export class TextChatService {
  public readonly textChats: TextChat[] = []

  public addChat(message: TextChat): void {
    this.textChats.push(message)
  }

  public allChat(): TextChat[] {
    return [...this.textChats]
  }
}
