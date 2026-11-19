import type { IBossRepository } from './IBossRepository'

/**
 * ボスの位置を更新する
 */
export function walkBoss(dt: number, bossRepository: IBossRepository): void {
  bossRepository.getAllId().forEach((bossId: string) => {
    const boss = bossRepository.get(bossId)
    if (boss === undefined) return
    boss.move(dt)
    bossRepository.updateActor(bossId, boss)
  })
}
