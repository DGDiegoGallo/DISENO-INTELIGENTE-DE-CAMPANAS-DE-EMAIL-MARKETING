import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft, FaQuestion, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const NotFoundView: React.FC = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center text-center" 
         style={{ minHeight: "80vh" }}>
      <div className="row">
        <div className="col-md-12">
          <div className="error-template">
            <div className="mb-4 text-danger" style={{ fontSize: '5rem' }}>
              <FaExclamationTriangle />
            </div>
            <h1 className="display-1 fw-bold">404</h1>
            <h2 className="mb-4">¡Página no encontrada!</h2>
            <div className="error-details mb-4">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </div>
            <div className="error-actions">
              <Link to="/" className="btn btn-primary btn-lg me-3">
                <FaArrowLeft className="me-2" />
                Volver al inicio
              </Link>
              <Link to="/support" className="btn btn-outline-secondary btn-lg">
                Contactar soporte
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ilustración con iconos */}
      <div className="mt-5 d-flex justify-content-center">
        <div className="position-relative" style={{ width: '300px', height: '200px' }}>
          {/* Círculo principal */}
          <div className="position-absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <div style={{ fontSize: '8rem', color: '#f0f0f0' }}>
              <FaExclamationTriangle />
            </div>
          </div>
          
          {/* Iconos decorativos */}
          <div className="position-absolute" style={{ left: '10%', top: '20%', transform: 'rotate(-15deg)' }}>
            <div style={{ fontSize: '2rem', color: '#FF3A44', opacity: 0.7 }}>
              <FaQuestion />
            </div>
          </div>
          
          <div className="position-absolute" style={{ right: '15%', top: '30%', transform: 'rotate(15deg)' }}>
            <div style={{ fontSize: '2rem', color: '#282A5B', opacity: 0.7 }}>
              <FaSearch />
            </div>
          </div>
          
          <div className="position-absolute" style={{ left: '30%', bottom: '10%', transform: 'rotate(-5deg)' }}>
            <div style={{ fontSize: '2rem', color: '#282A5B', opacity: 0.7 }}>
              <FaMapMarkerAlt />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundView;
