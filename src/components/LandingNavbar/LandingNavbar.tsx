import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Icono de usuario para login
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/Horiz.Negativo.png'; // Importar la imagen del logo negativo
import 'bootstrap/dist/css/bootstrap.min.css'; // Importamos Bootstrap explícitamente

const LandingNavbar: React.FC = () => {
  return (
    <nav className="navbar navbar-dark" style={{ backgroundColor: '#282A5B', padding: '10px 20px' }}>
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="#">
          <img src={logoImage} alt="TISYIKI" height="40" />
        </a>
        
        {/* Enlaces centrales */}
        <div className="navbar-nav mx-auto flex-row">
          <a className="nav-link text-white px-3" href="#">Inicio</a>
          <a className="nav-link text-white px-3" href="#">Campaña</a>
          <a className="nav-link text-white px-3" href="#">Capacitación</a>
          <a className="nav-link text-white px-3" href="#">Soporte</a>
        </div>
        
        {/* Icono de usuario */}
        <Link to="/login" className="text-white">
          <FaUserCircle size={25} />
        </Link>
      </div>
    </nav>
  );
};

export default LandingNavbar; 