import React from 'react';
import beneficiosImage from '../../assets/images/img_Beneficios 1.png';

interface Benefit {
  text: string;
}

interface BenefitsProps {
  title: string;
  benefits: Benefit[];
}

const Benefits: React.FC<BenefitsProps> = ({
  title = "Optimiza tus campañas\ny ahorra tiempo",
  benefits = [
    { text: "Mejora la efectividad y aumenta la conversión de leads en clientes" },
    { text: "Optimiza recursos y reduce costos asociados con campañas ineficaces" },
    { text: "Aumenta la competitividad y adapta a las expectativas de los consumidores" },
    { text: "Incrementa el retorno de la inversión (ROI) mediante la optimización de tus campañas" }
  ]
}) => {
  return (
    <div className="py-5" style={{ background: 'rgba(216, 60, 18, 0.5)', color: 'white' }}>
      <div className="container py-4">
        <div className="row align-items-center">
          {/* Texto a la izquierda */}
          <div className="col-lg-6">
            <h2 className="display-5 fw-bold text-center mb-5" style={{ color: '#282A5B' }}>
              {title.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            
            <div className="row">
              {benefits.map((benefit, index) => (
                <div className="col-md-6 mb-4" key={index}>
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="bg-white rounded-circle mb-3 d-flex align-items-center justify-content-center" 
                         style={{ width: '50px', height: '50px' }}>
                      <span className="text-primary fw-bold" style={{ color: '#282A5B' }}>✓</span>
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#282A5B' }}>{benefit.text}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Imagen a la derecha */}
          <div className="col-lg-6 d-flex justify-content-center mt-5 mt-lg-0">
            <img 
              src={beneficiosImage} 
              alt="Beneficios de optimización" 
              className="img-fluid" 
              style={{ maxWidth: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits; 