import { Scene } from 'phaser'
import { ExistPlayersInfo } from '../scene/main'
import {
  Player,
  PlayerInfo,
  ReceivedDieInfo,
  ReceivedRespawnInfo,
} from './player'
import { BaseReceiveInfo, Socket } from '../socket'
import { FRAME_RATE } from '../const'
import { layerSetting } from '../layer'
import { EmitProfileInfo } from '../ui/playerSettingsPanel'
import { EmitWalkInfo } from './ownPlayer'

export class OtherPlayer extends Player {
  // 他のプレイヤー
  static otherPlayers = new Map<string, OtherPlayer>()

  /**
   * 他のプレイヤーを追加する関数
   */
  public static addOtherPlayers(scene: Scene, playerInfo: PlayerInfo): void {
    const addedPlayer = new OtherPlayer()

    // 他プレイヤーのスプライトを追加
    const sprite = scene.add
      .sprite(playerInfo.x, playerInfo.y, 'follower')
      .setOrigin(0.5)
      .setDisplaySize(40, 40)
    addedPlayer.hero = sprite
    addedPlayer.id = playerInfo.playerId
    addedPlayer.playerName = playerInfo.heroName
    addedPlayer.playerNameArea = scene.add
      .text(
        playerInfo.x + addedPlayer.returnAdjustPosition.x,
        playerInfo.y + addedPlayer.returnAdjustPosition.y,
        addedPlayer.playerName
      )
      .setOrigin(0.5)
    addedPlayer.playerColor = playerInfo.heroColor
    for (const heroAnim of addedPlayer.getAnims) {
      if (
        addedPlayer.hero.anims.create(
          addedPlayer.AnimConfig(
            heroAnim,
            scene,
            FRAME_RATE,
            `${addedPlayer.playerColor}Hero`
          )
        ) === false
      )
        continue
    }
    addedPlayer.turn(playerInfo.direction)
    OtherPlayer.otherPlayers.set(addedPlayer.id, addedPlayer)

    // otherplayerの深度設定
    layerSetting(sprite, 'OtherPlayer')
    layerSetting(addedPlayer.playerNameArea, 'PlayerName')

    Player.addPlayer(addedPlayer.id, addedPlayer)

  }

  /**
   * idで指定したプレイヤーを削除する
   * @param id 削除するプレイヤーのid
   */
  static deletePlayer(id: string): void {
    const deletedPlayer = OtherPlayer.otherPlayers.get(id)
    if (deletedPlayer !== undefined) {
      deletedPlayer.playerNameArea?.destroy()
      deletedPlayer.hero?.destroy()
    }
    OtherPlayer.otherPlayers.delete(id)
  }

  /**
   * サーバから受け取った他プレイヤーの座標情報を更新
   */
  private static updatePlayerMoved(
    scene: Scene,
    moveInfo: EmitWalkInfo & BaseReceiveInfo
  ): void {
    const otherPlayer = OtherPlayer.otherPlayers.get(moveInfo.id)
    if (otherPlayer !== undefined) {
      otherPlayer.gridWalkTween(
        scene,
        otherPlayer,
        moveInfo.walkSpeed,
        moveInfo.animState,
        () => {},
        moveInfo.startPos
      )
    }
  }

  private static updateOtherPlayerAvatar(
    scene: Scene,
    profileInfo: EmitProfileInfo & BaseReceiveInfo
  ): void {
    // 他プレイヤーのアバター変更処理と名前変更処理
    const otherPlayer = OtherPlayer.otherPlayers.get(profileInfo.id)

    if (otherPlayer !== undefined) {
      if (profileInfo.heroColor !== otherPlayer.playerColor) {
        otherPlayer.removeWalkAnim()

        const frame = otherPlayer.hero!.frame.name
        otherPlayer.hero!.setTexture(`${profileInfo.heroColor}Hero`, frame)
        otherPlayer.playerColor = profileInfo.heroColor

        for (const heroAnim of otherPlayer.getAnims) {
          if (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            otherPlayer.hero!.anims.create(
              otherPlayer.AnimConfig(
                heroAnim,
                scene,
                FRAME_RATE,
                `${profileInfo.heroColor}Hero`
              )
            ) === false
          )
            continue
        }
      }

      // サーバーから送られてきた他プレイヤーの名前と、ローカルの他プレイヤーの名前が違うときは名前変更処理を行う
      if (profileInfo.heroName !== otherPlayer.playerName) {
        otherPlayer.playerName = profileInfo.heroName
        otherPlayer.playerNameArea?.setText(otherPlayer.playerName)
      }
    }
  }

  public static updatePlayerDirection(
    scene: Scene,
    turnInfo: any
  ): void {
    const otherPlayer = OtherPlayer.otherPlayers.get(turnInfo.id)
    if (otherPlayer !== undefined) {
      otherPlayer.turn(turnInfo.direction)
    }
  }

  public static die(scene: Scene, dieInfo: ReceivedDieInfo): void {
    const otherPlayer = OtherPlayer.otherPlayers.get(dieInfo.id)
    if (otherPlayer !== undefined) {
      otherPlayer.die()
    }
  }

  public static respawn(
    scene: Scene,
    respawnInfo: ReceivedRespawnInfo
  ): void {
    const otherPlayer = OtherPlayer.otherPlayers.get(respawnInfo.id)
    if (otherPlayer !== undefined) {
      otherPlayer.revive()
      otherPlayer.warp(
        respawnInfo.respawnPos.x,
        respawnInfo.respawnPos.y,
        respawnInfo.respawnPos.direction
      )
    }
  }

  // プレイヤー入室時に呼び出される関数
  public static addExistPlayers(
    scene: Scene,
    players: ExistPlayersInfo,
    ownPlayerId: string
  ): void {

    Object.keys(players).forEach(function (id: string) {
      if (id !== ownPlayerId) {
        OtherPlayer.addOtherPlayers(scene, players[id])
      }
    })
  }

  public static socketOn(scene: Scene, socket: Socket): void {
    super.socketOn(scene, socket)
    socket.on('profile', OtherPlayer.updateOtherPlayerAvatar)
    socket.on('walk', OtherPlayer.updatePlayerMoved)
    socket.on('turn', OtherPlayer.updatePlayerDirection)
    socket.on('otherPlayerDie', OtherPlayer.die)
    socket.on('otherPlayerRespawn', OtherPlayer.respawn)

    socket.singleOn('newPlayer', function (playerInfo: PlayerInfo) {
      OtherPlayer.addOtherPlayers(scene, playerInfo)
    })

    socket.singleOn('disconnected', function (playerId: string) {
      OtherPlayer.deletePlayer(playerId)
    })
  }
}
