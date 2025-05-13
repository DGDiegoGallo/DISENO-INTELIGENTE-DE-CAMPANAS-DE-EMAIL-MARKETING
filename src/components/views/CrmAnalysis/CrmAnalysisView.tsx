import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaSync } from 'react-icons/fa';
import hubspotService, { HubSpotContact } from '../../../services/hubspotService';
import StatsCards from './StatsCards';
import AnalyticsCharts from './AnalyticsCharts';
import ContactsTable from './ContactsTable';
import StatusMessage from './StatusMessage';
import ActionButtons from './ActionButtons';
import { 
  viewStyle, 
  headerStyle, 
  titleContainerStyle, 
  backIconStyle, 
  titleStyle,
  refreshButtonStyle,
  refreshIconStyle
} from './styles';

// Interfaces para los datos del CRM
interface CrmAnalysisContact {
  id: string;
  name: string;
  email: string;
  lastPurchaseDate?: string;
  totalSpent?: number;
  interactionScore?: number;
  leadStatus?: 'Prospecto' | 'Contactado' | 'Calificado' | 'Perdido' | 'Ganado';
}

interface CrmStats {
  totalContacts: number;
  totalRevenue: number;
  avgInteractionScore: number;
  dealsWon: number;
  dealsPipeline: number;
}

const CrmAnalysisView: React.FC = () => {
  // Estados para los datos del CRM
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [crmStats, setCrmStats] = useState<CrmStats | null>(null);
  const [hubspotContacts, setHubspotContacts] = useState<HubSpotContact[]>([]);
  const [dataLoadedMsg, setDataLoadedMsg] = useState<string>('');

  // Estados para los datos de los gráficos
  const [barData, setBarData] = useState({
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
    datasets: [{ label: 'Ingresos', data: [0, 0, 0, 0, 0], backgroundColor: '#F21A2B' }],
  });
  
  const [doughnutData, setDoughnutData] = useState({
    labels: ['Acuerdos ganados', 'Acuerdos en proceso'],
    datasets: [{ data: [0, 0], backgroundColor: ['#F21A2B', '#f9d0d3'], borderWidth: 0 }],
  });
  
  const [lineData, setLineData] = useState({
    labels: ['Segmento 1', 'Segmento 2', 'Segmento 3', 'Segmento 4', 'Segmento 5'],
    datasets: [{
      label: 'Puntuación promedio',
      data: [0, 0, 0, 0, 0],
      borderColor: '#F21A2B',
      backgroundColor: 'rgba(242, 26, 43, 0.1)',
      tension: 0.3,
      fill: true,
    }],
  });

  // Cargar datos de HubSpot
  const loadHubSpotData = useCallback(async () => {
    setIsLoading(true);
    setDataLoadedMsg('');
    
    try {
      // Obtener los contactos y deals desde HubSpot
      const [contacts, /*_deals*/, stats] = await Promise.all([
        hubspotService.getHubSpotContacts(),
        hubspotService.getHubSpotDeals(),
        hubspotService.getHubSpotCrmStats()
      ]);
      
      setHubspotContacts(contacts);
      setCrmStats(stats);
      
      // Actualizar los gráficos con los datos obtenidos
      updateChartData(contacts, stats);
      
      setDataLoadedMsg('Datos de HubSpot cargados correctamente.');
    } catch (error) {
      console.error('Error al cargar datos de HubSpot:', error);
      setDataLoadedMsg('Error al cargar datos de HubSpot. Verifica tu conexión o que hayas cargado datos de prueba primero.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar datos de prueba en HubSpot
  const uploadToHubSpot = useCallback(async () => {
    setIsUploading(true);
    setDataLoadedMsg('');
    
    try {
      const result = await hubspotService.loadTestDataToHubSpot();
      
      if (result.success) {
        setDataLoadedMsg(`Datos enviados a HubSpot correctamente. ${result.message}`);
        await loadHubSpotData();
      } else {
        setDataLoadedMsg(`Error al enviar datos a HubSpot: ${result.message}`);
      }
    } catch (error) {
      console.error('Error al subir datos a HubSpot:', error);
      setDataLoadedMsg(`Error al subir datos a HubSpot: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsUploading(false);
    }
  }, [loadHubSpotData]);
  
  // Actualiza los datos de los gráficos
  const updateChartData = (contacts: HubSpotContact[], stats: CrmStats) => {
    if (contacts.length > 0 && stats) {
      // Datos para el gráfico de barras (Ingresos)
      setBarData({
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
        datasets: [{
          label: 'Ingresos por mes',
          data: [
            stats.totalRevenue * 0.15,
            stats.totalRevenue * 0.20,
            stats.totalRevenue * 0.25,
            stats.totalRevenue * 0.30,
            stats.totalRevenue * 0.10,
          ],
          backgroundColor: '#F21A2B',
        }],
      });
      
      // Datos para el gráfico de dona (Acuerdos)
      setDoughnutData({
        labels: ['Acuerdos ganados', 'Acuerdos en proceso'],
        datasets: [{
          data: [stats.dealsWon, stats.dealsPipeline],
          backgroundColor: ['#F21A2B', '#f9d0d3'],
          borderWidth: 0,
        }],
      });
      
      // Datos para el gráfico de línea (ROI)
      const interactionScores = contacts
        .map(c => parseInt(c.properties.interaction_score || '0'))
        .filter(score => !isNaN(score));
      
      const avgScores = [];
      for (let i = 0; i < 5; i++) {
        const slice = interactionScores.slice(
          i * Math.floor(interactionScores.length / 5), 
          (i + 1) * Math.floor(interactionScores.length / 5)
        );
        avgScores.push(slice.reduce((sum, score) => sum + score, 0) / (slice.length || 1));
      }
      
      setLineData({
        labels: ['Segmento 1', 'Segmento 2', 'Segmento 3', 'Segmento 4', 'Segmento 5'],
        datasets: [{
          label: 'Puntuación promedio',
          data: avgScores,
          borderColor: '#F21A2B',
          backgroundColor: 'rgba(242, 26, 43, 0.1)',
          tension: 0.3,
          fill: true,
        }],
      });
    }
  };

  // Cargar datos cuando el componente se monte
  useEffect(() => {
    const localStorageData = localStorage.getItem('email_marketing_crm_analysis_data');
    if (localStorageData) {
      loadHubSpotData();
    }
  }, [loadHubSpotData]);

  // Función para cargar datos de prueba en localStorage
  const loadCrmTestData = () => {
    const testData: CrmAnalysisContact[] = [
      { id: 'crm001', name: 'Ana Pérez', email: 'ana.perez@example.com', lastPurchaseDate: '2024-04-15', totalSpent: 150.75, interactionScore: 8, leadStatus: 'Ganado' },
      { id: 'crm002', name: 'Luis Gómez', email: 'luis.gomez@example.com', lastPurchaseDate: '2024-03-20', totalSpent: 75.50, interactionScore: 5, leadStatus: 'Contactado' },
      { id: 'crm003', name: 'Sofía Marín', email: 'sofia.marin@example.com', lastPurchaseDate: '2024-05-01', totalSpent: 300.00, interactionScore: 9, leadStatus: 'Calificado' },
      { id: 'crm004', name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', totalSpent: 25.20, interactionScore: 3, leadStatus: 'Prospecto' },
      { id: 'crm005', name: 'Elena Díaz', email: 'elena.diaz@example.com', leadStatus: 'Perdido', interactionScore: 2, lastPurchaseDate: '2023-11-10', totalSpent: 50.00 },
      { id: 'crm006', name: 'Jorge Luna', email: 'jorge.luna@example.com', lastPurchaseDate: '2024-05-05', totalSpent: 450.00, interactionScore: 10, leadStatus: 'Ganado' },
      { id: 'crm007', name: 'Laura Torres', email: 'laura.torres@example.com', interactionScore: 6, leadStatus: 'Contactado' },
    ];

    try {
      localStorage.setItem('email_marketing_crm_analysis_data', JSON.stringify(testData));
      setDataLoadedMsg('Datos CRM de prueba cargados en localStorage. Para verlos, haz clic en "Cargar Datos de HubSpot" o "Enviar a HubSpot".');
      
      loadHubSpotData();
    } catch (error) {
      console.error('Error al guardar datos CRM en localStorage:', error);
      setDataLoadedMsg('Error al cargar datos CRM de prueba en localStorage.');
    }
  };

  const hasLocalStorageData = !!localStorage.getItem('email_marketing_crm_analysis_data');

  return (
    <div style={viewStyle}>
      {/* Título con Flecha y botón de recarga */} 
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <FaArrowLeft style={backIconStyle} />
          <h2 style={titleStyle}>Análisis CRM</h2>
        </div>
        
        {hubspotContacts.length > 0 && (
          <button
            onClick={loadHubSpotData}
            style={refreshButtonStyle}
          >
            <FaSync style={refreshIconStyle} /> Actualizar datos
          </button>
        )}
      </div>
      
      {/* Mensaje de estado */}
      {dataLoadedMsg && (
        <StatusMessage 
          message={dataLoadedMsg}
          showUploadButton={hubspotContacts.length === 0}
          isUploading={isUploading}
          onUpload={uploadToHubSpot}
          hasLocalData={hasLocalStorageData}
        />
      )}
      
      {/* Resumen de estadísticas del CRM */}
      {crmStats && <StatsCards stats={crmStats} />}
      
      {/* Gráficos de Análisis */} 
      <AnalyticsCharts 
        barData={barData} 
        doughnutData={doughnutData} 
        lineData={lineData} 
      />

      {/* Tabla de contactos de HubSpot */}
      {hubspotContacts.length > 0 && (
        <ContactsTable contacts={hubspotContacts} />
      )}

      {/* Botones de acción cuando no hay contactos */}
      {!hubspotContacts.length && (
        <ActionButtons 
          onLoadTestData={loadCrmTestData}
          onUploadToHubSpot={uploadToHubSpot}
          isLoading={isLoading}
          isUploading={isUploading}
          hasLocalData={hasLocalStorageData}
        />
      )}
    </div>
  );
};

export default CrmAnalysisView;
