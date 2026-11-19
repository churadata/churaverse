export interface IGameLogRenderer {
  gameStartLog: (gameName: string, playerId: string) => void
  gameAbortLog: (gameName: string, playerId: string) => void
  gameEndLog: (gameName: string) => void
  gameLog: (message: string, x: number) => void
  gameMidwayJoinLog: (gameName: string, joinPlayerId: string) => void
}
