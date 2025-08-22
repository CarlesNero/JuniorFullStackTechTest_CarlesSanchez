import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Auth from './features/auth/pages/AuthPage'
import ProtectedRoute from './features/auth/context/ProtectedRoute'
import HomePage from './features/game/pages/HomePage'
import { AuthProvider } from './features/auth/context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />


          <Route path="/auth" element={<Auth />} />


          <Route 
            path="/home"
            element={
              <ProtectedRoute>
                
                <HomePage />
         
              </ProtectedRoute>
            }
            />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </AuthProvider>
  )
}

export default App
