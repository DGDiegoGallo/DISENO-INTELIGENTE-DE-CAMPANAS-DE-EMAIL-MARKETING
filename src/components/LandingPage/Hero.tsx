import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import heroImage from '../../assets/images/img_hero 1.png';

interface UserState {
  isAuthenticated: boolean;
}

interface HeroProps {
  title: string;
  description: string;
  buttonText: string;
}

const Hero: React.FC<HeroProps> = ({ 
  title = "Conecta con tus clientes, porque cada correo puede marcar la diferencia",
  description = "Nuestra plataforma utiliza inteligencia artificial para gestionar y optimizar tus campañas de correo electrónico, analizando datos del CRM para convertir leads en clientes de manera eficiente.",
  buttonText = "Comenzar",
}) => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state: UserState) => state.isAuthenticated);

  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-section d-flex flex-column align-items-center justify-content-center text-white"
         style={{
           background: 'linear-gradient(to bottom, #282A5B, rgba(114, 32, 10, 0.5))',
           minHeight: '100vh',
           padding: '2rem 1rem'
         }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-4">{title}</h1>
            <p className="lead mb-4">
              {description}
            </p>
            <button 
              className="btn btn-lg px-5 py-3" 
              style={{ backgroundColor: '#E84C24', color: 'white' }}
              onClick={handleRedirect}
            >
              {buttonText}
            </button>
          </div>
          <div className="col-lg-6 d-flex justify-content-center">
            <img 
              src={heroImage} 
              alt="Email Marketing Hero" 
              className="img-fluid" 
              style={{ maxHeight: '500px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 