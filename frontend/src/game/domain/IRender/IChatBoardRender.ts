import { TextChat } from '../model/textChat'

export interface IChatBoardRender {
  add: (textChat: TextChat) => void
  redraw: (allChat: TextChat[]) => void
}
