import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Crear from './components/Crear';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/crear' element={<Crear />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
