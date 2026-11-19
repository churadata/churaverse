import type { JSXFunc } from 'churaverse-engine-client'
import bossImage from '../../../assets/ruleDescriptionImages/churaren_attack_to_boss.png'
import ghostImage from '../../../assets/ruleDescriptionImages/churaren_ghost_player.png'
import itemImage from '../../../assets/ruleDescriptionImages/churaren_item_with_player.png'
import alchemyImage from '../../../assets/ruleDescriptionImages/churaren_items_with_alchemy.png'
import playingImage from '../../../assets/ruleDescriptionImages/churaren_playing.png'
import style from './RuleExplanationWindowComponent.module.scss'

export const POPUP_GAME_START_WINDOW_BUTTON_ID = 'churaren-game-start-form-open-button'
export const GAME_START_BUTTON = 'churaren-game-start-button'

export const RuleExplanationWindowComponent: JSXFunc = () => {
  return (
    <div className={style.container} id={POPUP_GAME_START_WINDOW_BUTTON_ID}>
      <h2 className={style.title}>ちゅられん</h2>
      <p className={style.description}>みんなで協力し、制限時間内に強大なモンスターに立ち向かう協力型バトルゲーム！</p>
      <div className={style.section}>
        <img src={playingImage} alt="プレイ中の様子を写した画像" className={style.headerImage} />
      </div>

      <h2 className={style.churarenRule}>⚔️ちゅられんルール説明⚔️</h2>
      <ol className={style.sectionList}>
        <li className={style.stepItem}>
          <p className={style.stepTitle}>アイテムを集めよう！</p>
          <p>ボスモンスター(※1)の攻撃を掻い潜りながら、フィールドに落ちている錬金アイテムを集めます。</p>
          <img src={itemImage} alt="アイテムとプレイヤーの写った画像" className={style.image} />
        </li>

        <li className={style.stepItem}>
          <p className={style.stepTitle}>錬金窯で攻撃を錬金！</p>
          <p>集めた錬金アイテムを錬金窯に投入すると、攻撃を錬金することができます。</p>
          <img src={alchemyImage} alt="錬金窯とアイテムを持ったプレイヤーの写った画像" className={style.image} />
        </li>

        <li className={style.stepItem}>
          <p className={style.stepTitle}>錬金した攻撃でボスモンスターを撃破！</p>
          <p>錬金した攻撃(※2)を使って、ボスモンスターにダメージを与えましょう！</p>
          <img src={bossImage} alt="錬金した攻撃とボスの写った画像" className={style.image} />
        </li>
      </ol>
      <hr className={style.divider} />
      <h3 className={style.churarenMode}>👻霊界（観戦モード）👻</h3>
      <div className={style.section}>
        <p>
          ゲーム途中でボスモンスターの攻撃によってHPがゼロになってしまったプレイヤーは、霊体となって霊界(※3)でゲーム終了まで、他のプレイヤーの戦いを観戦します。
        </p>
        <img src={ghostImage} alt="霊体となったプレイヤーの画像" className={style.image} />
      </div>
      <hr className={style.divider} />

      <h2 className={style.churarenJudgeHeader}>🚩勝敗判定🚩</h2>
      <div className={style.section}>
        <h4 className={`${style.churarenJudge} ${style.win}`}>勝利条件</h4>
        <ul className={style.resultList}>
          <li>制限時間3分以内にボスモンスターのHPをゼロにする</li>
        </ul>

        <h4 className={`${style.churarenJudge} ${style.lose}`}>敗北条件</h4>
        <ul className={style.resultList}>
          <li>制限時間経過後にボスモンスターのHPが残っている</li>
          <li>参加プレイヤー全員が霊界に移行した</li>
        </ul>
      </div>
      <div className={style.section}>
        <h5>補足</h5>
        <ul className={style.supplementList}>
          <li>(※1) 参加者が多いほど、それに応じてボスモンスターのHPも増加します</li>
          <li>(※2) 錬金に使うアイテムの組み合わせによって、攻撃の種類が変わります</li>
          <li>(※3) 霊界では攻撃・錬金などのアクションは無効になります</li>
        </ul>
      </div>
    </div>
  )
}
