import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Icono de usuario de ejemplo
import logoImage from '../../assets/images/Horiz.Negativo.png'; // Importar la imagen del logo negativo

const LandingNavbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark w-100" style={{ backgroundColor: '#282A5B' }}>
      <div className="container">
        {/* Logo a la izquierda */}
        <a className="navbar-brand" href="#">
          <img 
            src={logoImage} 
            alt="Logo de la empresa" 
            height="40"
          />
        </a>
        
        {/* Botón hamburguesa para móviles */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* División de la navbar en tres partes */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Espacio vacío a la izquierda para empujar enlaces al centro */}
          <div className="flex-fill d-flex justify-content-end">
            <div style={{ width: '100px' }}></div>
          </div>
          
          {/* Enlaces centrados */}
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link text-white fw-bold mx-3" href="#">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-bold mx-3" href="#">Campaña</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-bold mx-3" href="#">Capacitación</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-bold mx-3" href="#">Soporte</a>
            </li>
          </ul>
          
          {/* Inicio de sesión a la derecha */}
          <div className="flex-fill d-flex justify-content-end">
            <a href="#" className="text-decoration-none me-2 text-white">Iniciar Sesión</a>
            <FaUserCircle size={28} className="text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar; 