import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/Horiz.Negativo.png'; // Importar la imagen del logo negativo
import 'bootstrap/dist/css/bootstrap.min.css'; // Importamos Bootstrap explícitamente

const LandingNavbar: React.FC = () => {
  return (
    <nav className="navbar navbar-dark" style={{ backgroundColor: '#282A5B', padding: '10px 20px' }}>
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={logoImage} alt="TISYIKI" height="40" />
        </Link>
        
        {/* Enlaces de información sobre el producto/servicio */}
        <div className="navbar-nav mx-auto flex-row d-none d-md-flex">
          <a className="nav-link text-white px-3" href="#caracteristicas">Características</a>
          <a className="nav-link text-white px-3" href="#beneficios">Beneficios</a>
          <a className="nav-link text-white px-3" href="#integraciones">Integraciones</a>
        </div>
        
        {/* Botones de acción */}
        <div className="d-flex">
          <Link to="/login" className="btn btn-outline-light me-2">
            Iniciar sesión
          </Link>
          <Link to="/register" className="btn btn-danger" style={{ backgroundColor: '#F21A2B', borderColor: '#F21A2B' }}>
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;