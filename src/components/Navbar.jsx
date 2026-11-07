import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar" style={{ flexWrap: 'wrap', gap: '15px' }}>
      <div className="logo-container">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="logo-text">Xtreme<span className="yellow-text">Fun</span></h1>
        </Link>
      </div>
      <ul className="nav-links" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <li><Link to="/reservas"> Reservas</Link></li>
        <li><Link to="/control"> Control Acceso</Link></li>
        <li><Link to="/eventos"> Eventos</Link></li>
        <li><Link to="/admin"> Panel Admin</Link></li>
        
        <li style={{ color: '#FFD100', margin: '0 5px' }}>|</li>
        
        <li><Link to="/ventas" className="btn-nav-highlight">🧑‍💻 Cajero</Link></li>
        <li><Link to="/waiver" className="btn-primary">Waiver ↗</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;