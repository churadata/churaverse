/** 接頭辞とプレイヤーIDを組み合わせ一意のHTML要素を生成する */
export const generateId = (prefix: string, playerId: string): string => `${prefix}-${playerId}`
