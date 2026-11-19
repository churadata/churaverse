import type http from 'node:http'
import type { BaseScene } from './scene/IScene/baseScene'
import { scenes } from './scene/sceneConfig'

export async function startScenes(server: http.Server): Promise<void> {
  const sceneAry: BaseScene[] = Object.values(scenes)

  for (const scene of sceneAry) {
    await scene.initialization(server)
  }

  let prevTime = Date.now()
  setInterval(() => {
    try {
      const now = Date.now()
      const dt = now - prevTime
      prevTime = now

      sceneAry.forEach((scene: BaseScene) => {
        scene.update(now, dt)
      })
    } catch (err) {
      if (err instanceof Error) console.error(err)
      else console.log('err is not Error instance')
    }
  }, 10)
}
