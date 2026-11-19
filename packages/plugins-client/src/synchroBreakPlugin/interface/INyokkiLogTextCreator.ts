export interface INyokkiLogTextCreator {
  createNyokkiLogText: (playerIds: string[], isSuccess: boolean, nyokkiTime: number) => string | undefined
  createNoNyokkiLogText: (playerIds: string[]) => string
}
