// 参考: https://qiita.com/suin/items/79fab432f605e1f3fc6c

/**
 * index signatureをもつinterfaceからindex signature以外のkey名のUnion型を作る
 *
 * index signature対応版のkeyof
 */
export type KnownKeyOf<T> = RemoveNever<KeyOrNever<T>>

/**
 * `{ key: value }`を`{ key: key }`にする. ただし、keyがindex signatureの場合は`{ key: never }`になる
 *
 * ---
 *
 * 例:
 * ```
 * interface Input {
 *  a: number
 *  b: string
 *  c: undefined
 *  [key: string]: any
 *  [key: number]: any
 * }
 *
 * type Output = KeyOrNever<Input>
 * Output = {
 *  [x: string]: never;
 *  [x: number]: never;
 *  a: "a";
 *  b: "b";
 *  c: "c";
 * }
 * ```
 */
type KeyOrNever<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K
}

/**
 * TのvalueのUnion型を作る. ただし、valueがneverの場合は除外する
 *
 * ---
 *
 * 例:
 * ```
 * interface Input {
 *   a: number
 *   b: string
 *   c: never
 *   d: undefined
 *   e: number
 * }
 *
 * type Output = RemoveNever<Input>
 * Output = string | number | undefined
 * ```
 */
type RemoveNever<T> = T extends { [_ in keyof T]: infer X } ? X : never
