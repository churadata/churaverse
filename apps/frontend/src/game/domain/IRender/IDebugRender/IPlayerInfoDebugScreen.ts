import { Direction } from '../../model/core/direction'
import { Position } from '../../model/core/position'
import { PlayerColorName, PlayerRoleName } from '../../model/types'

export interface IPlayerIdDebugScreen {
  update: (id: string) => void
  dump: () => string
}

export interface IPlayerNameDebugScreen {
  update: (name: string) => void
  dump: () => string
}

export interface IPlayerPositionDebugScreen {
  update: (position: Position) => void
  dump: () => string
}

export interface IPlayerHpDebugScreen {
  update: (hp: number) => void
  dump: () => string
}

export interface IPlayerDirectionDebugScreen {
  update: (direction: Direction) => void
  dump: () => string
}

export interface IPlayerRoleDebugScreen {
  update: (role: PlayerRoleName) => void
  dump: () => string
}

export interface IPlayerColorDebugScreen {
  update: (color: PlayerColorName) => void
  dump: () => string
}
