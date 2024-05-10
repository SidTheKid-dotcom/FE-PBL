import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Overview from './pages/Overview'
import UserRoutes from './pages/UserRoutes'
import AdminRoutes from './pages/AdminRoutes'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<NotFound />} ></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
