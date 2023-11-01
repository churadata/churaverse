/**
 * バッファのタイプの型
 */
/* eslint-disable */
export const BufferType = {
  FirstOnly: 'firstOnly',
  LastOnly: 'lastOnly',
  Queue: 'queue',
  Stack: 'stack',
} as const
/* eslint-enable */

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BufferType = typeof BufferType[keyof typeof BufferType]
