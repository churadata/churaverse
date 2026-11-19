import type React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { NotFound } from './components/NotFound'

export const RouterConfig: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
