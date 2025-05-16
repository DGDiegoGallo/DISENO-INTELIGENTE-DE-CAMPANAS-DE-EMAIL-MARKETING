import React from 'react';
import LandingNavbar from '../components/LandingNavbar/LandingNavbar';
import { 
  Hero, 
  Features, 
  Benefits, 
  IntegrationPartners, 
  CallToAction 
} from '../components/LandingPage';

// Importamos los logos
import logoChimp from '../assets/images/logos de adheridos/Vector.png';
import logoHubspot from '../assets/images/logos de adheridos/2622ff960f179f0d7d7af1900044992c 1.png';
import logoSlack from '../assets/images/logos de adheridos/Layer 2.png';
import logoSalesforce from '../assets/images/logos de adheridos/App-Icon-1200x1200-salesforce 1.png';
import logoOpenIA from '../assets/images/logos de adheridos/OpenIA 1.png';
import logoOptimizely from '../assets/images/logos de adheridos/Optimizely_Logo 1.png';

const partners = [
  { logo: logoChimp, name: 'MailChimp' },
  { logo: logoSlack, name: 'Slack' },
  { logo: logoHubspot, name: 'HubSpot' },
  { logo: logoSalesforce, name: 'Salesforce' },
  { logo: logoOpenIA, name: 'OpenAI' },
  { logo: logoOptimizely, name: 'Optimizely' }
];

const features = [
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
];

const benefits = [
  { text: "Mejora la efectividad y aumenta la conversión de leads en clientes" },
  { text: "Optimiza recursos y reduce costos asociados con campañas ineficaces" },
  { text: "Aumenta la competitividad y adapta a las expectativas de los consumidores" },
  { text: "Incrementa el retorno de la inversión (ROI) mediante la optimización de tus campañas" }
];

const LandingPage: React.FC = () => {
  // Función para manejar el clic en los botones
  const handleButtonClick = () => {
    console.log('Botón clickeado');
    // Aquí podrías agregar lógica como redireccionar o mostrar un formulario
  };

  return (
    <>
      <LandingNavbar />
      <Hero 
        title="Conecta con tus clientes, porque cada correo puede marcar la diferencia"
        description="Nuestra plataforma utiliza inteligencia artificial para gestionar y optimizar tus campañas de correo electrónico, analizando datos del CRM para convertir leads en clientes de manera eficiente."
        buttonText="Comenzar"
      />
      <div id="caracteristicas">
        <Features 
          mainTitle="¿Cansado de tomar decisiones basadas en intuición?"
          mainDescription="Nuestra interfaz intuitiva te permite aprovechar el poder de la IA sin necesidad de ser un experto. Descubre nuestras herramientas:"
          features={features}
        />
      </div>
      <div id="beneficios">
        <Benefits 
          title={`Optimiza tus campañas
y ahorra tiempo`}
          benefits={benefits}
        />
      </div>
      <div id="integraciones">
        <IntegrationPartners 
          partners={partners} 
          title="Conecta tus herramientas favoritas" 
        />
      </div>
      <CallToAction 
        title={`Automatiza, personaliza y
conquista: tu nueva manera de
hacer email marketing`}
        buttonText="Comenzar"
        onButtonClick={handleButtonClick} 
      />
    </>
  );
};

export default LandingPage; 