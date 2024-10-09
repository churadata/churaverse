import PropTypes from 'prop-types'
import { Churaverse } from 'churaverse-engine-client'
import { defineConfig } from './defineConfig'
import './App.scss'

const App: React.FC = () => {
  defineConfig()

  App.propTypes = {
    className: PropTypes.string.isRequired,
  }

  // canvasをAppendするdivコンポーネント
  return <Churaverse></Churaverse>
}

export default App
