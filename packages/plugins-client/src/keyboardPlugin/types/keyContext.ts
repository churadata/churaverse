/**
 * KeyActionが有効になる条件
 *
 * ---
 *
 * |||
 * |-|-|
 * |universal|常に有効|
 * |gui      |ダイアログを開いている時など, UIを操作している時のみ有効|
 * |inGame   |UIを操作していない時のみ有効|
 */
export type KeyContext = 'universal' | 'gui' | 'inGame'
