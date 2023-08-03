/**
 * 使用できるキー名一覧
 */
export type KeyCode = keyof typeof Phaser.Input.Keyboard.KeyCodes

/**
 * キーを押下したときに発火するCallbackの型
 */
export type KeyDownCallback = () => void

export const KEY_EVENT_NAME = [
  'ShotShark',
  'DropBomb',
  'WalkUp',
  'WalkDown',
  'WalkLeft',
  'WalkRight',
  'EnterText',
  'FocusShareScreen',
] as const
/**
 * キーに紐付いたcallback関数の型
 */
export type KeyEvent = typeof KEY_EVENT_NAME[number]
