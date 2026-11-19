/**
 * 各種プレイヤーの色を格納する配列
 * 最初の要素は初期色
 */
export const PLAYER_COLOR_NAMES = ['basic', 'red', 'black', 'blue', 'gray']
export type PlayerColor = (typeof PLAYER_COLOR_NAMES)[number]
