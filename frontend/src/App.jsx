import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import Overview from './pages/Overview'
import UserRoutes from './pages/UserRoutes'
import AdminRoutes from './pages/AdminRoutes'
import Feedback from './pages/Feedback'
import NotFound from './pages/NotFound'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<NotFound />} ></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
