import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Icono de usuario de ejemplo
import logoImage from '../../assets/images/Horiz.Preferente.png'; // Importar la imagen del logo

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-lg w-100" style={{ boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)' }}>
      <div className="container-fluid">
        {/* Logo/Nombre de la Marca */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img 
            src={logoImage} 
            alt="Logo de la empresa" 
            height="40"
            className="me-2"
          />
        </a>
        
        {/* Botón hamburguesa para móviles */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Menú de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Elementos del menú irán aquí */}
          </ul>
          
          {/* Icono de Usuario en el lado derecho */}
          <div className="d-flex align-items-center">
            <a href="#" className="text-decoration-none me-3">Iniciar Sesión</a>
            <FaUserCircle size={28} className="text-secondary cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 