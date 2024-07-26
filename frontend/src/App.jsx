import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Activate from './pages/Activate'
import ResetPassword from './pages/ResetPassword'
import ResetPasswordConfirm from './pages/ResetPasswordConfirm'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/register' element={<Register />} />
          <Route path='/password/reset' element={<ResetPassword />} />
          <Route path='/activate/:uid/:token' element={<Activate />} />
          <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default App
