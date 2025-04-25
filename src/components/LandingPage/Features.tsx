import React from 'react';
import funcionesImage from '../../assets/images/img_Funciones 1.png';

interface Feature {
  title: string;
  description: string;
}

interface FeaturesProps {
  mainTitle: string;
  mainDescription: string;
  features: Feature[];
}

const Features: React.FC<FeaturesProps> = ({
  mainTitle = "¿Cansado de tomar decisiones basadas en intuición?",
  mainDescription = "Nuestra interfaz intuitiva te permite aprovechar el poder de la IA sin necesidad de ser un experto. Descubre nuestras herramientas:",
  features = [
    {
      title: "Conoce a fondo a tus clientes:",
      description: "la IA identifica patrones y segmenta clientes de manera inteligente, ayudándote a personalizar tus estrategias."
    },
    {
      title: "Ten experiencias personalizadas:",
      description: "recibe recomendaciones de campañas basadas en datos históricos y predicciones, asegurando la relevancia y efectividad de cada mensaje."
    },
    {
      title: "Optimiza tus acciones:",
      description: "valida tus hipótesis y optimiza resultados con pruebas A/B automáticas para tomar decisiones informadas."
    },
    {
      title: "Visualiza tu éxito:",
      description: "accede a KPIs claros y reportes dinámicos que te permiten evaluar y mejorar el desempeño de tus campañas."
    }
  ]
}) => {
  return (
    <div className="py-5" style={{ background: 'white' }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Imagen a la izquierda */}
          <div className="col-lg-6 d-flex justify-content-center mb-4 mb-lg-0">
            <div className="position-relative" style={{ width: '100%', maxWidth: '500px' }}>
              <img 
                src={funcionesImage} 
                alt="Funcionalidades de la plataforma" 
                className="img-fluid"
              />
            </div>
          </div>
          
          {/* Texto a la derecha */}
          <div className="col-lg-6">
            <div style={{ maxWidth: '100%', paddingRight: '10%' }}>
              <h2 className="h3 fw-bold mb-2" style={{ color: '#E84C24' }}>
                {mainTitle}
              </h2>
              <p className="mb-2" style={{ color: '#333', fontSize: '0.95rem' }}>
                {mainDescription}
              </p>
              
              {features.map((feature, index) => (
                <div className="mb-1" key={index}>
                  <h5 className="fw-bold" style={{ color: '#282A5B', fontSize: '0.95rem', marginBottom: '0.1rem' }}>
                    {feature.title}
                  </h5>
                  <p style={{ color: '#333', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 