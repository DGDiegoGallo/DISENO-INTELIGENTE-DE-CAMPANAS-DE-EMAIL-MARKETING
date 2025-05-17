import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import Sidebar from '../components/Sidebar/Sidebar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CSSTransition } from 'react-transition-group';

// Importar las vistas
import InicioView from '../components/views/InicioView';
import CampaignsView from '../components/views/CampaignsView';
import CreateCampaignView from '../components/views/CreateCampaignView';
import ContactView from '../components/views/ContactView';
import MetricsView from '../components/views/MetricsView';
import TrainingView from '../components/views/TrainingView'; // Importar la vista real de Capacitación

import SupportView from '../components/views/SupportView'; // Importar la nueva vista de Soporte con IA
import ProfileView from '../components/views/ProfileView'; // Importar la vista de perfil de usuario
// ABTestingListView import removed
import ABTestingView from '../components/views/ABTestingView'; // Import for the main A/B testing container view
// CreateABTestView import removed as it's now handled by ABTestingView
import CrmAnalysisView from '../components/views/CrmAnalysis/CrmAnalysisView'; // Importar la vista de Análisis CRM
import AdminView from '../components/views/AdminView/AdminView'; // Importar la vista de Administración

// Importar Layout
import DashboardLayout from '../layouts/DashboardLayout';

// Ya no necesitamos el componente placeholder de SupportView porque importamos el real

// --- Datos Estáticos (Movidos fuera) ---
// TODO: Estos datos deberían venir de una API o estado global en una app real
/* Comentado para evitar error de linting - variable no utilizada
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
*/

// Definir ChartInstance fuera o importarla si es global
/* Comentado para evitar error de linting - interfaz no utilizada
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
};
*/

/* Comentado para evitar error de linting - variable no utilizada
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
*/

/* Comentado para evitar error de linting - variable no utilizada
const campaignData = [
  { id: 1, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...' },
  { id: 2, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...' },
  { id: 3, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...' },
];
*/

// Registramos los componentes necesarios para Chart.js (Podría moverse a App.tsx si es global)
ChartJS.register(ArcElement, Tooltip, Legend);

// --- Mappings for URL paths and View names ---
// Defined outside the component so they are stable and don't cause re-renders.
const viewToPathMap: Record<string, string> = {
  'Inicio': '/dashboard',
  'Campañas': '/dashboard/campaigns',
  'Contactos': '/dashboard/contacts',
  'Metricas': '/dashboard/metrics',
  'Capacitacion': '/dashboard/training',
  'Soporte': '/dashboard/support',
  'Perfil': '/dashboard/profile',
  'Datos CRM': '/dashboard/crm-data', // Assuming path, adjust if different
  'Pruebas A/B': '/dashboard/ab-testing',
  'Administracion': '/dashboard/admin',
};

const pathToViewMap: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/dashboard/': 'Inicio', // Handle trailing slash for dashboard root
  '/dashboard/campaigns': 'Campañas',
  '/dashboard/contacts': 'Contactos',
  '/dashboard/metrics': 'Metricas',
  '/dashboard/training': 'Capacitacion',
  '/dashboard/support': 'Soporte',
  '/dashboard/profile': 'Perfil',
  '/dashboard/crm-data': 'Datos CRM',
  '/dashboard/ab-testing': 'Pruebas A/B',
  '/dashboard/admin': 'Administracion',
};

// --- Componente Principal Dashboard ---
function Dashboard() {
  const location = useLocation(); // Get location object
  const navigate = useNavigate(); // Get navigate function

  // Estado para controlar la vista activa
  const [activeView, setActiveView] = useState('Inicio');
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [showCreateCampaign, setShowCreateCampaign] = useState(false); 
  const nodeRef = useRef(null); // Ref para transición principal
  const createCampaignNodeRef = useRef(null); // Ref para transición de slide

  // Effect to update activeView based on URL changes
  useEffect(() => {
    const currentPath = location.pathname;
    const newView = pathToViewMap[currentPath] || 'Inicio'; // Default to 'Inicio' if path not mapped

    if (newView !== activeView) {
      // Logic adapted from original handleViewChange for smooth transitions
      if (showCreateCampaign) {
        setShowCreateCampaign(false);
        // Delay setting active view to allow create campaign to transition out
        setTimeout(() => {
          setActiveView(newView);
        }, 50); 
      } else {
        setIsTransitioning(true);
        setActiveView(newView); // Set active view immediately for content swap
        // Transition effect will apply to the new content
        setTimeout(() => {
          setIsTransitioning(false); // End transition state after visual effect duration
        }, 300); 
      }
    }
  }, [location.pathname, activeView, showCreateCampaign]); // Dependencies - Removed pathToViewMap as it's now stable

  // Función para cambiar la vista con animación
  const handleViewChange = (viewName: string) => {
    const targetPath = viewToPathMap[viewName];
    if (targetPath && targetPath !== location.pathname) {
      navigate(targetPath);
      // The useEffect above will handle setting activeView and transitions
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
        return <InicioView />;
      case 'Campañas':
        return <CampaignsView onShowCreate={handleShowCreateCampaign} />;
      case 'Contactos':
        return <ContactView />;
      case 'Metricas': 
        // Ahora usa el componente importado
        return <MetricsView />;
      case 'Capacitacion': 
        return <TrainingView />;
      
      case 'Soporte': 
        return <SupportView />;
      case 'Perfil':
        return <ProfileView />;
      case 'Datos CRM':
        return <CrmAnalysisView />;
      case 'Pruebas A/B': // Now renders the main ABTestingView which contains CreateABTestView
        return <ABTestingView />;
      // 'Crear pruebas A/B' case removed as ABTestingView is now the sole entry point
      case 'Administracion':
        return <AdminView />;
      default:
        return <div>Vista no encontrada</div>;
    }
  };

  return (
    <DashboardLayout
      sidebar={<Sidebar activeView={activeView} onNavigate={handleViewChange} />} // Pass the synchronized activeView
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