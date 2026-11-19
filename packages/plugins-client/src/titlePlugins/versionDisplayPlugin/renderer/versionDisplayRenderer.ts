import { createUIContainer } from 'churaverse-engine-client'
import type { Scene } from 'phaser'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class VersionDisplayRenderer {
  public constructor(scene: Scene) {
    const frontendVersionLabel = scene.add.text(10, -70, 'Frontend Version: ', {
      color: '0x000000',
    })
    const backendLabel = scene.add.text(10, -50, 'Backend Version: ', {
      color: '0x000000',
    })
    const deployVersionLabel = scene.add.text(10, -30, 'Deploy Version: ', {
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
    fetch(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/version`)
      .then((response) => {
        if (response === null) {
          return 'Versionの取得ができませんでした。'
        }
        response
          .text()
          .then((version) => {
            backendLabel.setText(`Backend Version: ${version}`)
          })
          .catch(() => {
            return 'Versionの取得ができませんでした。'
          })
      })
      .catch(() => {
        return null
      })

    // バージョンのラベルを画面左下のコンテナに追加
    const container = createUIContainer(scene, 0, 1)
    container.add(frontendVersionLabel)
    container.add(backendLabel)
    container.add(deployVersionLabel)
  }
}
