import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Ventas from './pages/Ventas';
import Waiver from './pages/Waiver';
import Reservas from './pages/Reservas';         // NUEVO
import ControlAcceso from './pages/ControlAcceso'; // NUEVO
import Eventos from './pages/Eventos'; // NUEVO
import Admin from './pages/Admin';  
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/waiver" element={<Waiver />} />
        <Route path="/reservas" element={<Reservas />} />           {/* NUEVO */}
        <Route path="/control" element={<ControlAcceso />} />       {/* NUEVO */}
        <Route path="/eventos" element={<Eventos />} /> {/* NUEVO */}
        <Route path="/admin" element={<Admin />} />  
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;