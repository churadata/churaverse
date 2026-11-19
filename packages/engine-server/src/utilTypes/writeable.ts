/**
 * 全てのプロパティからreadonlyを外すMapped Type
 *
 * @example
 * interface ReadonlyType {
 * readonly a: string
 * readonly b: number
 * }
 *
 * // WritableType = { a: string; b: number; }
 * type WritableType = Writable<ReadonlyType>
 */
export type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 * 型Tのプロパティのうち、指定したキーKのみreadonlyを外すユーティリティ型
 *
 * @example
 * interface ReadonlyType {
 * readonly a: string
 * readonly b: number
 * }
 *
 * // WritableA = { a: string; readonly b: number; }
 * type WritableA = PartialWritable<ReadonlyType, 'a'>
 */
export type PartialWritable<T, K extends keyof T> = Omit<T, K> & Writable<Pick<T, K>>
