import {
  DomManager,
  domLayerSetting,
  type IMainScene,
  makeLayerHigherTemporary,
  type Store,
} from 'churaverse-engine-client'
import type { IOwnRankingBoard } from '../../interface/IOwnRankingBoard'
import type { NyokkiStatus } from '../../type/nyokkiStatus'
import { OwnRankingElement } from './component/OwnRankingElement'

/** 自分のランキング全体のUI */
export const OWN_RANKING_CONTAINER_ID = 'own-ranking-container'
/** 自分の順位表示要素ID */
export const OWN_RANKING_RANK_ID = 'own-ranking-rank'
/** 自分の名前表示要素ID */
export const OWN_RANKING_NAME_ID = 'own-ranking-name'
/** 自分のコイン表示要素ID */
export const OWN_RANKING_COINS_ID = 'own-ranking-coins'
/** 自分のニョッキステータス表示要素ID */
export const OWN_RANKING_STATUS_ID = 'own-ranking-status'

export class OwnRankingBoard implements IOwnRankingBoard {
  public element!: HTMLElement
  public readonly visible: boolean = true

  public constructor(public readonly store: Store<IMainScene>) {}

  public initialize(): void {
    this.setupOwnRanking()

    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })

    this.element.style.display = 'flex'
  }

  /**
   * プレイヤーのニョッキステータスを変更する
   */
  public changeNyokkiStatus(playerId: string, status: NyokkiStatus): void {
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    if (playerId !== ownPlayerId) return

    const ownRankingStatus = DomManager.getElementById(OWN_RANKING_STATUS_ID)
    ownRankingStatus.textContent = status
    ownRankingStatus.dataset.status = status
  }

  /**
   * 自身のランキングボード情報を更新する
   */
  public updateRanking(): void {
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    const sortedPlayersCoin = this.store.of('synchroBreakPlugin').playersCoinRepository.getPlayersSortedByCoins()

    let currentRank = 1
    let previousCoins = sortedPlayersCoin[0]?.coins ?? 0
    let myRank = 0
    let myCoins = 0

    // 自分のランキングを計算
    sortedPlayersCoin.forEach((player, index) => {
      if (index > 0 && player.coins < previousCoins) {
        currentRank = index + 1
      }
      if (player.playerId === ownPlayerId) {
        myRank = currentRank
        myCoins = player.coins
      }
      previousCoins = player.coins
    })

    const ownRankingRank = DomManager.getElementById(OWN_RANKING_RANK_ID)
    const ownRankingName = DomManager.getElementById(OWN_RANKING_NAME_ID)
    const ownRankingCoins = DomManager.getElementById(OWN_RANKING_COINS_ID)

    ownRankingRank.textContent = `${myRank}位`
    ownRankingRank.className = this.getRankColorClass(myRank)

    const myName = this.store.of('playerPlugin').players.get(ownPlayerId)?.name ?? '自分'
    ownRankingName.textContent = myName

    ownRankingCoins.textContent = `${myCoins}コイン`
  }

  /**
   * ニョッキステータスをyetにする
   */
  public resetNyokkiStatus(playerIds: string[]): void {
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    if (playerIds.includes(ownPlayerId)) {
      this.changeNyokkiStatus(ownPlayerId, 'yet')
    }
  }

  private setupOwnRanking(): void {
    this.element = DomManager.addJsxDom(OwnRankingElement())
  }

  private readonly getRankColorClass = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'gold'
      case 2:
        return 'silver'
      case 3:
        return 'bronze'
      default:
        return 'black'
    }
  }

  /**
   * ランキングボードを削除する
   */
  public remove(): void {
    this.element.remove()
  }
}
