/**
 * 使用できるキー名一覧
 */
export type KeyCode = keyof typeof Phaser.Input.Keyboard.KeyCodes

/**
 * キーを押下したときに発火するCallbackの型
 */
export type KeyDownCallback = () => void
