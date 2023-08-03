/**
 * 各種プレイヤーの色を格納する配列
 * 最初の要素は初期色
 */
export const PLAYER_COLOR_NAMES = ['basic', 'red', 'black', 'blue', 'gray'] as const
/** プレイヤーの色の型 */
export type PlayerColorName = typeof PLAYER_COLOR_NAMES[number]

/**
 * 各種プレイヤーの役割を格納する配列
 */
export const PLAYER_ROLE_NAMES = ['admin', 'user'] as const
/** 各種プレイヤーの役割の型 */
export type PlayerRoleName = typeof PLAYER_ROLE_NAMES[number]
