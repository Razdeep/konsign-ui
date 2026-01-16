import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { colors } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/login/Login'
import AuthProvider from './context/AuthProvider'
import RequireAuth from './components/RequireAuth'

const konsignTheme = createTheme({
  palette: {
    primary: {
      main: '#0A4D68',
    },
    secondary: {
      main: '#00FFCA',
    },
    background: {
      default: colors.grey[50],
      paper: '#00FFCA',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={konsignTheme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/*"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path="/" element={<Login />} />
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            toastStyle={{
              background: 'transparent',
              boxShadow: 'none',
              padding: 0,
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
