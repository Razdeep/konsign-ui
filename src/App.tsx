import React from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import AuthProvider from './context/AuthProvider';
import RequireAuth from './components/RequireAuth'
import { colors } from '@mui/material';

const konsignTheme = createTheme({
  palette: {
    primary: {
      main: '#0A4D68'
    },
    secondary: {
      main: '#00FFCA'
    },
    background: {
      default: colors.grey[50],
      paper: '#00FFCA',
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={konsignTheme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/dashboard/*" element={
              <RequireAuth>
                <Dashboard/>
              </RequireAuth>
            } />
            <Route path="/" element={<Login/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
