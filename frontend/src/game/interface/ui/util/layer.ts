import 'phaser'

type LayerbleElement =
  | Phaser.GameObjects.Text
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Graphics
  | Phaser.GameObjects.Container
  | Phaser.GameObjects.Video
// layerの管理をしたいオグジェクトを追加したい際はリストに適宜追加. 優先度はindexに比例して上部に描画
const layerArray = [
  'Video',
  'PlayerContainer',
  'Shark',
  'Bomb',
  'PlayerFrontContainer',
  'DeathLog',
  'UIContainer',
  'WebRtcUI',
  'PlayerSettingForm',
  'PlayerList',
  'ChatBoard',
  'badge',
] as const
type LayerName = typeof layerArray[number]

export function layerSetting(settingElement: LayerbleElement, layerName: LayerName): void {
  const layerOrder = layerArray.indexOf(layerName)
  settingElement.depth = layerOrder
}
