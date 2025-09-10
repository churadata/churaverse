/**
 * プレイヤー名の検証に関する定数と関数（サーバーサイド）
 */

export const PLAYER_NAME_MIN_LENGTH = 1
export const PLAYER_NAME_MAX_LENGTH = 20

/**
 * プレイヤー名が有効かどうかを検証する
 * @param name 検証する名前
 * @returns 有効な場合はtrue、無効な場合はfalse
 */
export function validatePlayerName(name: string): boolean {
  const trimmedName = name.trim()
  return trimmedName.length >= PLAYER_NAME_MIN_LENGTH && 
         trimmedName.length <= PLAYER_NAME_MAX_LENGTH
}

/**
 * プレイヤー名を正規化する（前後の空白を削除）
 * @param name 正規化する名前
 * @returns 正規化された名前
 */
export function normalizePlayerName(name: string): string {
  return name.trim()
}
