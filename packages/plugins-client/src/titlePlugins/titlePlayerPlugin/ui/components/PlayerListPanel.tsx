import type React from 'react'
import styles from './PlayerListPanel.module.scss'

interface PlayerNameColor {
  name: string
  color: string
  company?: string // SSO 導入後に会社名が入る。それまでは undefined
}

interface Props {
  players: PlayerNameColor[]
  isOpen: boolean
}

export const PLAYER_LIST_HEADER_ID = 'player-list-header'

const colorClassMap: Record<string, string | undefined> = {
  basic: styles.colorBasic,
  red: styles.colorRed,
  black: styles.colorBlack,
  blue: styles.colorBlue,
  gray: styles.colorGray,
}

export function PlayerListPanel({ players, isOpen }: Props): React.JSX.Element {
  return (
    <div className={styles.panel}>
      <div id={PLAYER_LIST_HEADER_ID} className={styles.header}>
        <span className={styles.statusText}>{players.length}人が参加しています</span>
        <span className={styles.toggleIcon}>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <>
          <div className={styles.divider} />
          <ul className={styles.list}>
            {players.length === 0 ? (
              <li className={styles.emptyItem}>
                <p className={styles.empty}>No one has joined yet.</p>
              </li>
            ) : (
              players.map((player, index) => (
                <li key={index} className={styles.item}>
                  <span className={colorClassMap[player.color] ?? styles.colorBasic} />
                  <div className={styles.playerInfo}>
                    <span className={styles.name}>{player.name}</span>
                    {player.company !== undefined && <span className={styles.company}>{player.company}</span>}
                  </div>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  )
}
