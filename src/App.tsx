import React from 'react';
import logo from './logo.svg';
import './App.css';
import ButtonAppBar from './components/ButtonAppBar/ButtonAppBar';
import { Drawer } from '@mui/material';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    // <BrowserRouter>
    //   <Drawer
    //     open={false}
    //   ></Drawer>
    //   <ButtonAppBar />
    //   <Switch>
    //     <Route path="/bill">bill</Route>
    //     <Route path="/">collection</Route>
    //   </Switch>
    // </BrowserRouter>
    <Dashboard></Dashboard>
  );
}

export default App;
