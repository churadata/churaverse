import { Scene } from 'phaser'
import { Shark } from './domain/shark'
import { Bomb } from './domain/bomb'
import { OtherPlayer } from './domain/otherPlayer'
import { Socket } from '../game/socket'
import { OwnPlayer } from './domain/ownPlayer'
import { Player } from './domain/player'
import { TextChat } from './ui/textChat'
import { Reload } from './reload'

// このまとめ方あまりよくないかもしれない
export function mainSceneSocketOn(scene: Scene, socket: Socket): void {
  Shark.socketOn(socket)
  Bomb.socketOn(socket)
  Player.socketOn(scene, socket)
  OwnPlayer.socketOn(scene, socket)
  OtherPlayer.socketOn(scene, socket)
  TextChat.socketOn(socket)
  Reload.socketOn(scene, socket)
}
