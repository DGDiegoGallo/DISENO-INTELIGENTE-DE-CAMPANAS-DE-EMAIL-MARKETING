import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import RegisterForm from '../components/Register/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />

      <div className="container flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="card shadow-sm border-0 rounded-3 p-4" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="card-body">
            {/* Formulario de registro modular con todos los campos */}
            <RegisterForm />
            
            {/* Login link */}
            <div className="text-center mt-4">
              <span>¿Ya tienes cuenta? </span>
              <Link to="/login" className="text-decoration-none text-danger">Inicia sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 