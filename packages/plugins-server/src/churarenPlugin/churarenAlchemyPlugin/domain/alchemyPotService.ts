import { uniqueId } from '@churaverse/churaren-core-plugin-server'
import type { WorldMap } from '@churaverse/map-plugin-server'
import type { SendableObject } from '@churaverse/network-plugin-server'
import { Position, type Vector } from 'churaverse-engine-server'
import type { AlchemyPotMap } from '../message/alchemyPotSpawnMessage'
import { AlchemyPot } from './alchemyPot'
import type { IAlchemyPotRepository } from './IAlchemyPotRepository'

/**
 * @function calculateAlchemyPotPositions で計算した位置にalchemyPotsの生成を行う
 * @param alchemyPot - 生成された錬金釜を登録するためのリポジトリ
 * @param worldMap - 錬金釜を配置するワールドマップのデータ（幅と高さを使用）
 * @returns 生成された錬金釜の配列
 */
export function generatedAlchemyPot(alchemyPot: IAlchemyPotRepository, worldMap: WorldMap): AlchemyPot[] {
  const pots = []
  const alchemyPotPosition = calculatePositions(worldMap.width, worldMap.height)

  for (const pos of alchemyPotPosition) {
    const pot = new AlchemyPot(uniqueId(), new Position(pos.x, pos.y))
    alchemyPot.set(pot.id, pot)
    pots.push(pot)
  }
  return pots
}

/**
 * 受け取ったAlchemyPotの配列をSendableObjectに変換する
 * @param pots 錬金釜の配列
 */
export function alchemyPotInfoToSendableObject(pots: AlchemyPot[]): AlchemyPotMap {
  const info: AlchemyPotMap = {}
  pots.forEach((pot) => {
    info[pot.id] = {
      potId: pot.id,
      spawnPos: pot.position.toVector() as Vector & SendableObject,
    }
  })
  return info
}

function calculatePositions(width: number, height: number): Vector[] {
  const centerX = width / 2
  const centerY = height / 2
  const offsetX = width / 20
  const offsetY = height / 20

  return [
    { x: centerX, y: offsetY }, // 上
    { x: centerX, y: height - offsetY }, // 下
    { x: offsetX, y: centerY }, // 左
    { x: width - offsetX, y: centerY }, // 右
    { x: centerX, y: centerY }, // 中央
  ]
}
