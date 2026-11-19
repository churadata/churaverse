/**
 * 各種プレイヤーの役割を格納する配列
 */
export const PLAYER_ROLE_NAMES = ['admin', 'user'] as const
/** 各種プレイヤーの役割の型 */
export type PlayerRole = (typeof PLAYER_ROLE_NAMES)[number]
