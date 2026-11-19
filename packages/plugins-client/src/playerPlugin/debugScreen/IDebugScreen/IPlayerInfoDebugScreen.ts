import type { IDebugScreen } from '@churaverse/debug-screen-plugin-client'
import type { Direction, Position } from 'churaverse-engine-client'
import type { PlayerColor } from '../../types/playerColor'
import type { PlayerRole } from '../../types/playerRole'

export interface IPlayerIdDebugScreen extends IDebugScreen<string> {}

export interface IPlayerNameDebugScreen extends IDebugScreen<string> {}

export interface IPlayerPositionDebugScreen extends IDebugScreen<Position> {}

export interface IPlayerHpDebugScreen extends IDebugScreen<number> {}

export interface IPlayerDirectionDebugScreen extends IDebugScreen<Direction> {}

export interface IPlayerRoleDebugScreen extends IDebugScreen<PlayerRole> {}

export interface IPlayerColorDebugScreen extends IDebugScreen<PlayerColor> {}
