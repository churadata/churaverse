import { Scene } from 'phaser'
import { OwnPlayer } from '../domain/ownPlayer'
import { Bomb } from '../domain/bomb'
import { Shark } from '../domain/shark'
import { Socket } from '../socket'
import MainScene from '../scene/main'
import { KeyCode } from '../keyboard'
import { Direction } from '../domain/player'
import { uniqueId } from '../domain/util/uniqueId'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LoadTest {
  public static sharkParty(
    scene: Scene,
    mainScene: MainScene,
    ownPlayer: OwnPlayer,
    socket: Socket,
    key: KeyCode
  ): void {
    if (mainScene.keyboard.isDown(key)) {
      if (ownPlayer.hero === undefined) return

      if (
        mainScene.keyboard.isJustDown(key) ||
        mainScene.keyboard.holdFrame(key) >= 50
      ) {
        const ownPlayerStartx = ownPlayer.hero.x
        const ownPlayerStarty = ownPlayer.hero.y
        let ownPlayerx = ownPlayer.hero?.x
        let ownPlayery = ownPlayer.hero?.y
        for (let i = 0; i < 100; i++) {
          if (ownPlayer.direction === 'up') {
            ownPlayerx -= 50
            if (i % 10 === 0) {
              ownPlayerx = ownPlayerStartx
              ownPlayery -= 50
            }
          } else if (ownPlayer.direction === 'down') {
            ownPlayerx += 50
            if (i % 10 === 0) {
              ownPlayerx = ownPlayerStartx
              ownPlayery += 50
            }
          } else if (ownPlayer.direction === 'left') {
            ownPlayery -= 50
            if (i % 10 === 0) {
              ownPlayery = ownPlayerStarty
              ownPlayerx -= 50
            }
          } else if (ownPlayer.direction === 'right') {
            ownPlayery += 50
            if (i % 10 === 0) {
              ownPlayery = ownPlayerStarty
              ownPlayerx += 50
            }
          }
          const shark = new Shark(
            scene,
            uniqueId(),
            ownPlayerx,
            ownPlayery,
            ownPlayer.direction
          )
          socket.emit('shark', shark.info)
          console.log('ok')
        }
      }
    }
  }

  public static bombParty(
    scene: Scene,
    mainScene: MainScene,
    heroIsWalking: boolean,
    ownPlayer: OwnPlayer,
    socket: Socket,
    key: KeyCode
  ): void {
    if (mainScene.keyboard.isDown(key)) {
      if (heroIsWalking || ownPlayer.hero === undefined) return

      if (
        mainScene.keyboard.isJustDown(key) ||
        mainScene.keyboard.holdFrame(key) >= 50
      ) {
        let bombx = ownPlayer.hero?.x
        let bomby = ownPlayer.hero?.y
        const direction: Direction = ownPlayer.direction
        for (let i = 0; i < 100; i++) {
          bombx += 40
          if (i % 10 === 0) {
            bombx = ownPlayer.hero?.x
            bomby += 40
          }
          const bomb = new Bomb(scene, bombx, bomby, direction)
          socket.emit('bomb', bomb.info)
          console.log('ok')
        }
      }
    }
  }
}
