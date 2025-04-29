import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Icono de usuario de ejemplo
import logoImage from '../../assets/images/Horiz.Preferente.png'; // Importar la imagen del logo

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-light bg-white border-bottom" style={{ position: 'fixed', width: '100%', height: '50px', zIndex: 1001, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#" style={{ marginLeft: '10px' }}>
          <img 
            src={logoImage} 
            alt="TISYIKI" 
            height="30"
            className="d-inline-block align-middle"
          />
        </a>
      </div>
    </nav>
  );
};

export default Navbar; 