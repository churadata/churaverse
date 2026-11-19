import { uniqueId } from '@churaverse/churaren-core-plugin-server'
import type { WorldMap } from '@churaverse/map-plugin-server'
import type { IMessageSender } from '@churaverse/network-plugin-server'
import { Direction, EntitySpawnEvent, type IEventBus, type IMainScene, Position } from 'churaverse-engine-server'
import { type BossAttackSpawnData, BossAttackSpawnMessage } from '../message/bossAttackSpawnMessage'
import { BossAttack } from './bossAttack'
import type { IBossAttackRepository } from './IBossAttackRepository'

/**
 * 衝突した or 消滅時間に達したボス攻撃を削除
 * @param onDelete 削除時に実行する関数.引数に削除されるボス攻撃のインスタンスとidを取る
 */
export function removeDieBossAttack(
  bossAttacks: IBossAttackRepository,
  onDelete: (bossAttackId: string) => void
): void {
  bossAttacks.getAllId().forEach((bossAttackId) => {
    const bossAttack = bossAttacks.get(bossAttackId)
    if (bossAttack?.isDead ?? false) {
      bossAttacks.delete(bossAttackId)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onDelete(bossAttackId) // null合体でundefinedでないことは確定
    }
  })
}

/**
 * BossAttackRepository内の全ボス攻撃を微小時間分だけ移動
 * その際にワールド外に出たボス攻撃をdie
 */
export function moveBossAttacks(dt: number, bossAttacks: IBossAttackRepository, worldMap: WorldMap): void {
  bossAttacks.getAllId().forEach((bossAttackId) => {
    const bossAttack = bossAttacks.get(bossAttackId)
    if (bossAttack !== undefined && !bossAttack.isDead) {
      bossAttack.move(dt)
      if (
        bossAttack.position.x < 0 ||
        bossAttack.position.x > worldMap.width ||
        bossAttack.position.y < 0 ||
        bossAttack.position.y > worldMap.height
      ) {
        bossAttack.die()
      }
      // 常に位置を更新（当たり判定システムに反映）
      bossAttacks.updateActor(bossAttackId, bossAttack)
    }
  })
}

/**
 * ボス攻撃生成をfrontendに通知する
 */
export function sendSpawnedBossAttack(
  messageSender: IMessageSender<IMainScene>,
  eventBus: IEventBus<IMainScene>,
  startPos: Position,
  bossId: string
): void {
  if (startPos === undefined) return
  // 四方向に攻撃を生成
  const gap = 100
  Object.values(Direction).forEach((direction) => {
    const position = new Position(startPos.x + gap * direction.x, startPos.y + gap * direction.y)
    const bossAttack = new BossAttack(uniqueId(), bossId, position, direction, Date.now())
    const bossAttackSpawnData: BossAttackSpawnData = {
      bossAttackId: bossAttack.bossAttackId,
      startPos: { x: bossAttack.position.x, y: bossAttack.position.y },
      direction: bossAttack.direction,
      spawnTime: bossAttack.spawnTime,
    }
    const bossAttackSpawnEvent = new EntitySpawnEvent(bossAttack)
    eventBus.post(bossAttackSpawnEvent)
    const bossAttackSpawnMessage = new BossAttackSpawnMessage(bossAttackSpawnData)
    messageSender.send(bossAttackSpawnMessage)
  })
}
