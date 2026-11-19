import { useEffect, useState } from 'react'
import style from './GhostPlayerListComponent.module.scss'

interface GhostPlayerListComponentProps {
  playerNames: string[]
}

/** 折りたたみ時にデフォルトで表示する直近の死亡者数 */
const COLLAPSED_DISPLAY_COUNT = 5

export const GhostPlayerListComponent: React.FC<GhostPlayerListComponentProps> = ({ playerNames }) => {
  const [isListOpen, setIsListOpen] = useState(true)
  const [isFullListShown, setIsFullListShown] = useState(false)

  // 空配列化（ゲームリセット）を検知して展開状態を初期化
  useEffect(() => {
    if (playerNames.length === 0) {
      setIsListOpen(true)
      setIsFullListShown(false)
    }
  }, [playerNames])

  // 新しい死亡者が先頭に来るよう反転
  const latestPlayers = [...playerNames].reverse()

  const hasHiddenPlayers = latestPlayers.length > COLLAPSED_DISPLAY_COUNT

  const visiblePlayers =
    isFullListShown || !hasHiddenPlayers ? latestPlayers : latestPlayers.slice(0, COLLAPSED_DISPLAY_COUNT)

  return (
    <div className={style.container} style={{ display: playerNames.length > 0 ? 'flex' : 'none' }}>
      <button
        type="button"
        className={`defaultStyle ${style.header}`}
        aria-expanded={isListOpen}
        onClick={() => {
          setIsListOpen((prev) => !prev)
        }}
      >
        <span className={style.headerText}>
          <span className={style.headerTitle}>霊界</span>
          <span className={style.headerSubtitle}>倒されたプレイヤー</span>
        </span>
        <span className={`${style.iconButton} ${isListOpen ? '' : style.panelCollapsed}`}>
          <span className={style.chevron} />
        </span>
      </button>

      {isListOpen && (
        <>
          <div className={style.nameContainer}>
            {visiblePlayers.map((playerName, index) => {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: no unique id available
                <div key={index} className={style.ghostPlayerNameBlock}>
                  {playerName}
                </div>
              )
            })}
          </div>
          {hasHiddenPlayers && (
            <button
              type="button"
              className={`defaultStyle ${style.expandButton} ${isFullListShown ? '' : style.listCollapsed}`}
              aria-expanded={isFullListShown}
              onClick={() => {
                setIsFullListShown((prev) => !prev)
              }}
            >
              <span>{isFullListShown ? '閉じる' : '一覧を表示'}</span>
              <span className={style.chevron} />
            </button>
          )}
        </>
      )}
    </div>
  )
}
