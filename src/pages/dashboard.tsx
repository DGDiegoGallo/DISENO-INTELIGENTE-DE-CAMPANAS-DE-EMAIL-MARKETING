import { useState, useRef } from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar/Sidebar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CSSTransition } from 'react-transition-group';

// Importar las vistas
import InicioView from '../components/views/InicioView';
import CampaignsView from '../components/views/CampaignsView';
import CreateCampaignView from '../components/views/CreateCampaignView';
import ContactView from '../components/views/ContactView';
import CrmDataView from '../components/views/ABTestingView'; // Importar CrmDataView desde el archivo ABTestingView.tsx
import ABTestingListView from '../components/views/ABTestingListView'; // Importar la nueva vista de lista para Pruebas A/B
import CreateABTestView from '../components/views/CreateABTestView'; // Importar la nueva vista de creación
import MetricsView from '../components/views/MetricsView'; // Importar la vista real de Métricas
import TrainingView from '../components/views/TrainingView'; // Importar la vista real de Capacitación
import RecommendationView from '../components/views/RecommendationView'; // Importar la nueva vista de Recomendación
import SentimentAnalysisView from '../components/views/SentimentAnalysisView'; // Importar la nueva vista de Análisis de sentimiento
import SegmentationView from '../components/views/SegmentationView'; // Importar la nueva vista de Segmentación de campañas

// Importar Layout
import DashboardLayout from '../layouts/DashboardLayout';

// --- Componentes Placeholder (Movidos fuera) ---
const SupportView = () => <div style={{padding: '20px'}}>Contenido de Soporte</div>;

// --- Datos Estáticos (Movidos fuera) ---
// TODO: Estos datos deberían venir de una API o estado global en una app real
const emailChartData = {
  labels: ['Correo electrónicos abiertos', 'Correo electrónicos no abiertos'],
  datasets: [
    {
      data: [74, 26],
      backgroundColor: [
        '#282A5B',
        '#F21A2B',
      ],
      borderWidth: 0,
    },
  ],
};

// Definir ChartInstance fuera o importarla si es global
interface ChartInstance {
  data: {
    labels: string[];
    datasets: Array<{
      backgroundColor: string[];
      [key: string]: unknown;
    }>;
  };
  getDatasetMeta: (index: number) => {
    controller: {
      getStyle: (index: number) => {
        borderColor: string;
        borderWidth: number;
      };
    };
  };
}

const emailChartOptions = {
  cutout: '70%',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      align: 'center' as const,
      labels: {
        boxWidth: 10,
        padding: 15,
        usePointStyle: true,
        font: {
          size: 16,
        },
        generateLabels: function(chart: ChartInstance) { 
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map(function(_label: string, i: number) {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              
              return {
                text: i === 0 ? 'Correo electrónicos abiertos' : 'Correo electrónicos no abiertos',
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: false,
                index: i
              };
            });
          }
          return [];
        }
      },
    },
  },
};

const campaignData = [
  { id: 1, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
  { id: 2, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
  { id: 3, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
];

// Registramos los componentes necesarios para Chart.js (Podría moverse a App.tsx si es global)
ChartJS.register(ArcElement, Tooltip, Legend);

// --- Componente Principal Dashboard ---
function Dashboard() {
  // Estado para controlar la vista activa
  const [activeView, setActiveView] = useState('Inicio');
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [showCreateCampaign, setShowCreateCampaign] = useState(false); 
  const nodeRef = useRef(null); // Ref para transición principal
  const createCampaignNodeRef = useRef(null); // Ref para transición de slide

  // Función para cambiar la vista con animación
  const handleViewChange = (viewName: string) => {
    if (viewName === activeView) return;

    if (showCreateCampaign) {
      setShowCreateCampaign(false);
      setTimeout(() => {
        setActiveView(viewName);
      }, 50);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveView(viewName);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Funciones para mostrar/ocultar la vista de creación
  const handleShowCreateCampaign = () => {
    // Si cambiamos de vista principal mientras se muestra Create, ocultarla primero
    if (isTransitioning) {
        setTimeout(() => setShowCreateCampaign(true), 50); // Esperar a que termine la transición principal
    } else {
        setShowCreateCampaign(true);
    }
  };

  const handleBackFromCreate = () => {
    setShowCreateCampaign(false);
  };

  // Función para renderizar la vista activa DENTRO DE LA TRANSICIÓN PRINCIPAL
  const renderActiveViewContent = () => {
    switch (activeView) {
      case 'Inicio':
        return <InicioView 
                  emailChartData={emailChartData} 
                  emailChartOptions={emailChartOptions} 
                  campaignData={campaignData} 
               />;
      case 'Campañas':
        return <CampaignsView onShowCreate={handleShowCreateCampaign} />;
      case 'Contactos':
        return <ContactView />;
      case 'Datos CRM':
        return <CrmDataView />; // Usar CrmDataView importado
      case 'Pruebas A/B': 
        // Pasar la función de navegación
        return <ABTestingListView onNavigate={handleViewChange} />;
      case 'Crear pruebas A/B':
        return <CreateABTestView onNavigate={handleViewChange} />;
      case 'Metricas': 
        // Ahora usa el componente importado
        return <MetricsView />;
      case 'Capacitacion': 
        return <TrainingView />;
      case 'Recomendacion': 
        return <RecommendationView />;
      case 'Analisis': 
        return <SentimentAnalysisView />;
      case 'Segmentacion': 
        return <SegmentationView />;
      case 'Soporte': 
        return <SupportView />;
      default:
        return <div>Vista no encontrada</div>;
    }
  };

  return (
    <DashboardLayout
      sidebar={<Sidebar activeView={activeView} onNavigate={handleViewChange} />}
    >
      {/* El contenido principal ahora es el children del Layout */}
      {/* Contenedor Wrapper para manejar posicionamiento absoluto y overflow */}
      <div className="view-wrapper">
        {/* Transición para las VISTAS PRINCIPALES (fade/vertical slide) */}
        <CSSTransition
          nodeRef={nodeRef}
          in={!showCreateCampaign && !isTransitioning} // Activa solo si NO se muestra Crear y NO está transicionando
          timeout={300} 
          classNames="view-transition" 
          unmountOnExit
        >
          <div ref={nodeRef}>
             {/* Renderiza el contenido de la vista principal activa */} 
            {renderActiveViewContent()} 
          </div>
        </CSSTransition>

        {/* Transición para la VISTA CREAR CAMPAÑA (slide horizontal) */}
        <CSSTransition
          nodeRef={createCampaignNodeRef}
          in={showCreateCampaign} // Controlada por el estado showCreateCampaign
          timeout={300} 
          classNames="slide" // Usa las nuevas clases 'slide-*'
          unmountOnExit
        >
          <div ref={createCampaignNodeRef}>
            <CreateCampaignView onBack={handleBackFromCreate} />
          </div>
        </CSSTransition>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;