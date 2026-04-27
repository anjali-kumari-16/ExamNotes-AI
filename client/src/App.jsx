import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from "react-router-dom"

import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import getCurrentUser from './services/api.js'
import { useDispatch, useSelector } from "react-redux"
import { serverUrl } from './utils/config.js'
import Pricing from './pages/Pricing.jsx'
import History from './pages/History.jsx'
import Notes from './pages/Notes.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'

import PaymentFail from './pages/PaymentFaild.jsx'



function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    getCurrentUser(dispatch)
  }, [dispatch])
  const { userData } = useSelector((state) => state.user)
  console.log(userData)

  return (
    <>
      <Routes>
        <Route path='/' element={userData ? <Home /> : <Navigate to="/auth" replace />} />
        {/*<Route path='/' element={<Home />} />*/}

        <Route path='/auth' element={userData ? <Navigate to='/' replace /> : <Auth />} />
        <Route path='/history' element={userData ? <History /> : <Navigate to="/auth" replace />} />
        <Route path='/notes' element={userData ? <Notes /> : <Navigate to="/auth" replace />} />
        <Route path='/pricing' element={userData ? <Pricing /> : <Navigate to="/auth" replace />} />
        <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/payment-fail' element={<PaymentFail />} />
        {/*} <Route path='*' element={<Navigate to="/" replace />} />*/}





      </Routes>

    </>
  )
}

export default App
