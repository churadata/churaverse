// fileNameはdefaultで 'index.tsx' なのでCamelCaseでないエラーは無視してます
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterConfig } from './RouterConfig'
import reportWebVitals from './reportWebVitals'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <RouterConfig />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
