import { TextChat } from '../model/textChat'

export interface IChatBoardRender {
  add: (textChat: TextChat, textColor?: string) => void
  redraw: (allChat: TextChat[]) => void
}
