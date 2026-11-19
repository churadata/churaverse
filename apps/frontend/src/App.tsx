import { Churaverse } from 'churaverse-engine-client'
import { defineConfig } from './defineConfig'
import './App.scss'

const App: React.FC = () => {
  defineConfig()

  // canvasをAppendするdivコンポーネント
  return <Churaverse></Churaverse>
}

export default App
