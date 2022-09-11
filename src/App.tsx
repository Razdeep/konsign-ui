import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Dashboard></Dashboard>
    </BrowserRouter>
  );
}

export default App;
