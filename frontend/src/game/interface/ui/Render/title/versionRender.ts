import { GameObjects, Scene } from 'phaser'
import { createUIContainer } from '../../util/container'

export class VersionRender {
  private readonly scene
  private readonly container: GameObjects.Container

  public constructor(scene: Scene) {
    this.scene = scene
    const frontendVersionLabel = this.scene.add.text(10, -60, 'Frontend Version: ', {
      color: '0x000000',
    })
    const backendLabel = this.scene.add.text(10, -40, 'Backend Version: ', {
      color: '0x000000',
    })
    const deployVersionLabel = this.scene.add.text(10, -20, 'Deploy Version: ', {
      color: '0x000000',
    })
    /** deployVersionの表示 */
    if (import.meta.env.VITE_DEPLOY_VERSION == null) {
      deployVersionLabel.setText('Deploy Version: Versionの取得ができませんでした。')
    } else {
      deployVersionLabel.setText(`Deploy Version: ${import.meta.env.VITE_DEPLOY_VERSION}`)
    }
    /** frontendVersionの表示 */
    if (import.meta.env.VITE_FRONT_VERSION == null) {
      frontendVersionLabel.setText('Frontend Version: Versionの取得ができませんでした。')
    } else {
      frontendVersionLabel.setText(`Frontend Version: ${import.meta.env.VITE_FRONT_VERSION}`)
    }
    /** backendVersionの表示 */
    void this.getBackendVersion().then((resolve) => {
      backendLabel.setText(`Backend Version: ${resolve}`)
    })

    this.container = createUIContainer(scene, 0, 1)
    this.container.add(frontendVersionLabel)
    this.container.add(backendLabel)
    this.container.add(deployVersionLabel)
  }

  public async getBackendVersion(): Promise<string> {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '') + '/version').catch(() => {
      return null
    })
    if (response === null) {
      return 'Versionの取得ができませんでした。'
    }
    return await response.text().catch(() => {
      return 'Versionの取得ができませんでした。'
    })
  }

  public static async build(scene: Scene): Promise<VersionRender> {
    return await new Promise<VersionRender>((resolve) => {
      resolve(new VersionRender(scene))
    })
  }
}
