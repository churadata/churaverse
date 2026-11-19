import {
  BaseSocketController,
  type NetworkDisconnectEvent,
  type NetworkPluginStore,
  type PriorDataRequestMessage,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
  type SendableObject,
} from '@churaverse/network-plugin-server'
import {
  EntityDespawnEvent,
  EntitySpawnEvent,
  type IEventBus,
  type IMainScene,
  Position,
  type Store,
  type Vector,
} from 'churaverse-engine-server'
import { Player } from '../domain/player'
import { PlayerColorChangeEvent } from '../event/playerColorChangeEvent'
import { PlayerNameChangeEvent } from '../event/playerNameChangeEvent'
import { PlayerStopEvent } from '../event/playerStopEvent'
import { PlayerTurnEvent } from '../event/playerTurnEvent'
import { PlayerWalkEvent } from '../event/playerWalkEvent'
import { PlayerColorChangeMessage } from '../message/playerColorChangeMessage'
import { PlayerDieMessage } from '../message/playerDieMessage'
import { PlayerHealMessage } from '../message/playerHealMessage'
import { PlayerInvincibleTimeMessage } from '../message/playerInvincibleTimeMessage'
import { type PlayerJoinData, PlayerJoinMessage } from '../message/playerJoinMessage'
import { PlayerLeaveMessage } from '../message/playerLeaveMessage'
import { PlayerNameChangeMessage } from '../message/playerNameChangeMessage'
import { PlayerRespawnMessage } from '../message/playerRespawnMessage'
import { PlayerStopMessage } from '../message/playerStopMessage'
import { PlayerTurnMessage } from '../message/playerTurnMessage'
import { PlayerWalkMessage } from '../message/playerWalkMessage'
import { type ExistPlayers, type PriorPlayerData, PriorPlayerDataMessage } from '../message/priorPlayerDataMessage'
import { WeaponDamageMessage } from '../message/weaponDamageMessage'
import type { PlayerPluginStore } from '../store/defPlayerPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private playerPluginStore!: PlayerPluginStore

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
    eventBus.subscribeEvent('networkDisconnect', this.sendPlayerLeaveMessage.bind(this))
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('playerJoin', PlayerJoinMessage, 'others')
    ev.messageRegister.registerMessage('playerLeave', PlayerLeaveMessage, 'allClients')
    ev.messageRegister.registerMessage('priorPlayerData', PriorPlayerDataMessage, 'onlySelf')
    ev.messageRegister.registerMessage('playerWalk', PlayerWalkMessage, 'others')
    ev.messageRegister.registerMessage('playerStop', PlayerStopMessage, 'others')
    ev.messageRegister.registerMessage('playerTurn', PlayerTurnMessage, 'others')
    ev.messageRegister.registerMessage('playerNameChange', PlayerNameChangeMessage, 'others')
    ev.messageRegister.registerMessage('playerColorChange', PlayerColorChangeMessage, 'others')

    ev.messageRegister.registerMessage('weaponDamage', WeaponDamageMessage, 'allClients')
    ev.messageRegister.registerMessage('playerHeal', PlayerHealMessage, 'allClients')
    ev.messageRegister.registerMessage('playerDie', PlayerDieMessage, 'allClients')
    ev.messageRegister.registerMessage('playerRespawn', PlayerRespawnMessage, 'allClients')
    ev.messageRegister.registerMessage('playerInvincibleTime', PlayerInvincibleTimeMessage, 'allClients')
  }

  private getStores(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  private sendPlayerLeaveMessage(ev: NetworkDisconnectEvent): void {
    this.networkPluginStore.messageSender.send(new PlayerLeaveMessage({ playerId: ev.socketId }))
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('requestPriorData', this.sendPriorPlayerData.bind(this))
    ev.messageListenerRegister.on('playerJoin', this.playerJoin.bind(this))
    ev.messageListenerRegister.on('playerLeave', this.onPlayerLeave.bind(this))
    ev.messageListenerRegister.on('playerWalk', this.onPlayerWalk.bind(this))
    ev.messageListenerRegister.on('playerStop', this.onPlayerStop.bind(this))
    ev.messageListenerRegister.on('playerTurn', this.onPlayerTurn.bind(this))
    ev.messageListenerRegister.on('playerNameChange', this.onPlayerNameChange.bind(this))
    ev.messageListenerRegister.on('playerColorChange', this.onPlayerColorChange.bind(this))
  }

  private sendPriorPlayerData(_msg: PriorDataRequestMessage, senderId: string): void {
    const players = this.playerPluginStore.players
    const existPlayers: ExistPlayers = {}
    for (const id of players.getAllId()) {
      const player = players.get(id)
      if (player !== undefined) {
        existPlayers[id] = this.playerDomainToSendableObject(player)
      }
    }

    const data: PriorPlayerData = {
      existPlayers,
    }

    this.networkPluginStore.messageSender.send(new PriorPlayerDataMessage(data), senderId)
  }

  /**
   * playerから送信用のデータを生成
   */
  private playerDomainToSendableObject(player: Player): PlayerJoinData {
    const info: PlayerJoinData = {
      hp: player.hp,
      position: player.position.toVector() as Vector & SendableObject,
      direction: player.direction,
      playerId: player.id,
      heroColor: player.color,
      heroName: player.name,
      role: player.role,
      spawnTime: player.spawnTime,
    }

    return info
  }

  private playerJoin(msg: PlayerJoinMessage): void {
    const playerInfo = msg.data
    const pos = new Position(playerInfo.position.x, playerInfo.position.y)

    const newPlayer = new Player(
      playerInfo.playerId,
      pos,
      playerInfo.direction,
      playerInfo.heroName,
      playerInfo.heroColor,
      playerInfo.hp,
      playerInfo.role,
      playerInfo.spawnTime
    )

    const joinEvent = new EntitySpawnEvent(newPlayer)
    this.eventBus.post(joinEvent)
  }

  private onPlayerLeave(msg: PlayerLeaveMessage): void {
    const data = msg.data
    const leavePlayer = this.playerPluginStore.players.get(data.playerId)
    if (leavePlayer !== undefined) {
      this.eventBus.post(new EntityDespawnEvent(leavePlayer))
    }
  }

  private onPlayerWalk(msg: PlayerWalkMessage, senderId: string): void {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const playerWalkEvent = new PlayerWalkEvent(senderId, position, data.direction, data.speed)
    this.eventBus.post(playerWalkEvent)
  }

  private onPlayerStop(msg: PlayerStopMessage, senderId: string): void {
    const data = msg.data
    const position = new Position(data.stopPos.x, data.stopPos.y)
    const playreStopEvent = new PlayerStopEvent(senderId, position, data.direction)
    this.eventBus.post(playreStopEvent)
  }

  private onPlayerTurn(msg: PlayerTurnMessage, senderId: string): void {
    const data = msg.data
    const playerTurnEvent = new PlayerTurnEvent(senderId, data.direction)
    this.eventBus.post(playerTurnEvent)
  }

  private onPlayerNameChange(msg: PlayerNameChangeMessage, senderId: string): void {
    const data = msg.data
    const playerNameChangeEvent = new PlayerNameChangeEvent(senderId, data.name)
    this.eventBus.post(playerNameChangeEvent)
  }

  private onPlayerColorChange(msg: PlayerColorChangeMessage, senderId: string): void {
    const data = msg.data
    const playerColorChangeEvent = new PlayerColorChangeEvent(senderId, data.color)
    this.eventBus.post(playerColorChangeEvent)
  }
}
