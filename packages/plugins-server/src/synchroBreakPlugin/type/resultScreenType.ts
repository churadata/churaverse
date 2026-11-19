export const RESULT_SCREEN_TYPES = {
  TURN: 'turn',
  FINAL: 'final',
} as const

export type ResultScreenType = (typeof RESULT_SCREEN_TYPES)[keyof typeof RESULT_SCREEN_TYPES]
