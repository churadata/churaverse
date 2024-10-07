import { JSXFunc } from 'churaverse-engine-client'
import { DEBUG_SCREEN_DUMP_BUTTON_ID } from '../debugScreenDumpButton'
import style from './style.module.scss'

export const DebugScreenDumpButtonComponent: JSXFunc = () => {
  return (
    <button className={style.dumpButton} type="button" id={DEBUG_SCREEN_DUMP_BUTTON_ID}>
      dump
    </button>
  )
}
