import type { JSXFunc } from 'churaverse-engine-client'
import { NYOKKI_BUTTON_ID } from '../nyokkiButton'
import style from './NyokkiButtonComponent.module.scss'

export const NyokkiButtonComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <button className={style.nyokkiButton} type="button" id={NYOKKI_BUTTON_ID}>
        にょっき！
      </button>
    </div>
  )
}
