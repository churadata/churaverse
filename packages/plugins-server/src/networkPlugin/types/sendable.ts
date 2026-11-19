/**
 * NetworkPluginでServer/Clientに対して送受信できるデータの型
 */
export type Sendable = number | string | boolean | SendableObject | Sendable[]

/**
 * NetworkPluginでServer/Clientに対して送受信できるObject型
 */
export interface SendableObject {
  [key: string]: Sendable
}
