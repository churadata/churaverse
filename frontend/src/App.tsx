import { CSSProperties, useEffect } from 'react'
import 'phaser'
import TitleScene from './game/scene/title'
import MainScene from './game/scene/main'
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'
import PropTypes from 'prop-types'

// Phaserの設定
const config: Phaser.Types.Core.GameConfig = {
  width: 1280,
  height: 720,
  type: Phaser.AUTO,
  pixelArt: true,
  backgroundColor: 0xcdcdcd,

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_VERTICALLY,
    parent: 'game',
    fullscreenTarget: 'game',
  },

  plugins: {
    global: [NineSlicePlugin.DefaultCfg],
  },

  dom: {
    createContainer: true,
  },

  fps: {
    target: 60,
    forceSetTimeOut: true,
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      tileBias: 40,
    },
  },
  // ここで読み込むシーンを取得する
  // 今回は軽いテストなので、MainSceneのみ
  scene: [TitleScene, MainScene],
}

/**
 * ゲームを描写するDivコンポーネント
 */
const App: React.FC<{ className?: string }> = ({ className }) => {
  // お手軽にCSSの設定（フルスクリーンで、Canvasを中央寄せにする）
  const style: CSSProperties = {
    width: '100vw',
    height: '100vh',
    textAlign: 'center',
  }

  App.propTypes = {
    className: PropTypes.string.isRequired,
  }

  // 画面の発描写時に実行する
  // 画面の終了時にはGameをDestroyする
  useEffect(() => {
    const g = new Phaser.Game(config)
    return () => {
      g?.destroy(true)
    }
  }, [])

  // canvasをAppendするdivコンポーネント
  return (
    <div id="game" className={className} style={style}></div>
  )
}

export default App
