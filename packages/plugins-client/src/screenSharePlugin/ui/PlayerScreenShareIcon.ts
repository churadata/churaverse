import type { IPlayerRenderer } from '@churaverse/player-plugin-client'
import type { Scene } from 'phaser'

export class PlayerScreenShareIcon {
  private readonly icon: Phaser.GameObjects.Text
  private readonly playerRenderer: IPlayerRenderer

  public constructor(scene: Scene, playerRenderer: IPlayerRenderer) {
    this.playerRenderer = playerRenderer
    this.icon = scene.add
      .text(0, 0, '⚫︎', {
        fontSize: '16px', // playerRendererのDEFAULT_NAMEPLATE_FONT_SIZEに合わせた値
        color: '#ff5a01',
        stroke: '#403c3c',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setVisible(false)
    playerRenderer.addToNameplateContainer(this.icon)
  }

  public show(): void {
    this.icon.setVisible(true)
    this.playerRenderer.realignNameplate()
  }

  public hide(): void {
    this.icon.setVisible(false)
    this.playerRenderer.realignNameplate()
  }
}
