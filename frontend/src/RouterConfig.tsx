import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotFound } from './components/NotFound'
import App from './App'

export const RouterConfig: React.VFC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
