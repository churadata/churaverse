import type { JSXFunc } from 'churaverse-engine-client'
import ruleDescription from '../../../assets/rule_description.png'
import style from './RuleExplanationWindowComponent.module.scss'
export const POPUP_GAME_START_WINDOW_BUTTON_ID = 'gameStartForm-open-button'

export interface FrameInfo {
  name: string
  x: number
  y: number
  width: number
  height: number
}

const ruleEntries = [
  {
    text: '制限時間内に、各プレイヤーは一度だけニョッキボタンを押します。',
    frame: { x: 0, y: 932, width: 326, height: 132 },
    displaySize: { width: 200, height: 80 },
  },
  {
    text: '他のプレイヤーと同時にニョッキボタンを押すor時間内に押さなかった場合は、失敗となります。',
    frame: { x: 0, y: 499, width: 500, height: 432 },
    displaySize: { width: 200, height: 150 },
  },
  {
    text: 'ニョッキ成功したプレイヤーの中で、ニョッキボタンを早く押した人から順に順位が決まります。',
    frame: { x: 0, y: 0, width: 790, height: 498 },
    displaySize: { width: 200, height: 110 },
  },
] as const

const ruleDescriptionSize = { width: 790, height: 1064 }

export const RuleExplanationWindowComponent: JSXFunc = () => {
  return (
    <div className={style.container} id={POPUP_GAME_START_WINDOW_BUTTON_ID}>
      <p className={style.nyokkigameCaption}>
        タイミングを読んでニョッキし、
        <br />
        多くのコインを集めよう！💰
      </p>
      <ol>
        <li>下記の「シンクロブレイク開始」を押すと、ゲームが開始します。</li>
        <br />
        <li>ゲーム開始者が、ターン数と制限時間数を指定します。</li>
        <br />
        <li>全プレイヤーがベットコイン数を入力すると、ニョッキゲームが開始します。</li>
        <br />
        <li>ニョッキ順とベットコイン数によって、コインがreturnします。</li>
      </ol>
      <p className={style.nyokkigameIntro}>🍄ニョッキゲームルール🍄</p>
      <ol>
        {ruleEntries.map(({ text, frame, displaySize }, idx) => {
          const scaleX = displaySize.width / frame.width
          const scaleY = displaySize.height / frame.height
          return (
            <li key={idx}>
              <p>{text}</p>
              <div
                className={style.ruleDescription}
                style={{
                  backgroundImage: `url(${ruleDescription})`,
                  width: `${displaySize.width}px`,
                  height: `${displaySize.height}px`,
                  backgroundSize: `${ruleDescriptionSize.width * scaleX}px ${ruleDescriptionSize.height * scaleY}px`,
                  backgroundPosition: `-${frame.x * scaleX}px -${frame.y * scaleY}px`,
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </li>
          )
        })}
        <li>
          順位の高い順に高い倍率が付与され、「ベットコイン×倍率」がreturnします。
          <br />
          ※ニョッキに失敗した場合は倍率が0となり、ベットコインは戻りません。
        </li>
      </ol>
    </div>
  )
}
