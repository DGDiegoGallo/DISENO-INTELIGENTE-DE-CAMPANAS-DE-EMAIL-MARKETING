import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaSync } from 'react-icons/fa';
import crmService from '../../../services/crmService';
import { CrmAnalysisContact, CrmStats } from '../../../interfaces/crm';
import StatsCards from './StatsCards';
import AnalyticsCharts from './AnalyticsCharts';
import ContactsTable from './ContactsTable';
import StatusMessage from './StatusMessage';
import CampaignDataSimulator from '../../../components/CampaignDataSimulator';
import { 
  viewStyle, 
  headerStyle, 
  titleContainerStyle, 
  backIconStyle, 
  titleStyle,
  refreshButtonStyle,
  refreshIconStyle
} from './styles';

// Uso de interfaces importadas desde interfaces/crm.ts

const CrmAnalysisView: React.FC = () => {
  // Estados para los datos del CRM
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [crmStats, setCrmStats] = useState<CrmStats | null>(null);
  const [crmContacts, setCrmContacts] = useState<CrmAnalysisContact[]>([]);
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

  // Función auxiliar para obtener el nombre del mes actual y los 4 anteriores
  const getPastMonthsLabels = useCallback((): string[] => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    // Obtener 5 meses: el actual y los 4 anteriores
    const monthLabels = [];
    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12; // Manejo circular del índice
      monthLabels.push(months[monthIndex]);
    }
    
    return monthLabels;
  }, []);

  // Función para agrupar contactos por mes basado en lastPurchaseDate o fecha de campaña
  const groupContactsByMonth = useCallback((contacts: CrmAnalysisContact[]): Record<number, CrmAnalysisContact[]> => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Inicializar grupos para los últimos 5 meses (incluido el actual)
    const monthGroups: Record<number, CrmAnalysisContact[]> = {};
    for (let i = 0; i < 5; i++) {
      const monthKey = (currentMonth - i + 12) % 12;
      monthGroups[monthKey] = [];
    }
    
    // Asignar contactos a sus meses correspondientes
    contacts.forEach(contact => {
      let contactDate: Date | null = null;
      
      // Usar la fecha de la campaña si está disponible
      if (contact.campaign && contact.campaign.date) {
        contactDate = new Date(contact.campaign.date);
      } 
      // Si no, usar la fecha de última compra
      else if (contact.lastPurchaseDate) {
        contactDate = new Date(contact.lastPurchaseDate);
      }
      
      if (contactDate) {
        const contactMonth = contactDate.getMonth();
        const contactYear = contactDate.getFullYear();
        
        // Solo considerar contactos de los últimos 5 meses
        const monthDiff = (currentYear - contactYear) * 12 + (currentMonth - contactMonth);
        if (monthDiff >= 0 && monthDiff < 5) {
          monthGroups[contactMonth].push(contact);
        }
      }
    });
    
    return monthGroups;
  }, []);

  // Actualiza los datos de los gráficos
  const updateChartData = useCallback((contacts: CrmAnalysisContact[], stats: CrmStats) => {
    if (contacts.length > 0 && stats) {
      // Obtener etiquetas de meses para los gráficos
      const monthLabels = getPastMonthsLabels();
      
      // Agrupar contactos por mes
      const contactsByMonth = groupContactsByMonth(contacts);
      const currentMonth = new Date().getMonth();
      
      // Calcular ingresos por mes
      const monthlyRevenue = monthLabels.map((_, index) => {
        const monthIndex = (currentMonth - (4 - index) + 12) % 12;
        const monthContacts = contactsByMonth[monthIndex] || [];
        
        // Sumar los ingresos de todos los contactos de este mes
        return monthContacts.reduce((sum, contact) => sum + (contact.totalSpent || 0), 0);
      });
      
      // Datos para el gráfico de barras (Ingresos)
      setBarData({
        labels: monthLabels,
        datasets: [{
          label: 'Ingresos',
          data: monthlyRevenue,
          backgroundColor: '#F21A2B'
        }]
      });
      
      // Datos para el gráfico de donut (Deals)
      setDoughnutData({
        labels: ['Acuerdos ganados', 'Acuerdos en proceso'],
        datasets: [{
          data: [stats.dealsWon, stats.dealsPipeline],
          backgroundColor: ['#F21A2B', '#f9d0d3'],
          borderWidth: 0
        }]
      });
      
      // Datos para el gráfico de línea (Puntuación)
      // Calcular promedio de puntuación de interacción por mes
      const monthlyScores = monthLabels.map((_, index) => {
        const monthIndex = (currentMonth - (4 - index) + 12) % 12;
        const monthContacts = contactsByMonth[monthIndex] || [];
        
        if (monthContacts.length === 0) return 0;
        
        const totalScore = monthContacts.reduce(
          (sum, contact) => sum + (contact.interactionScore || 0), 
          0
        );
        
        return totalScore / monthContacts.length;
      });
      
      setLineData({
        labels: monthLabels,
        datasets: [{
          label: 'Puntuación promedio',
          data: monthlyScores,
          borderColor: '#F21A2B',
          backgroundColor: 'rgba(242, 26, 43, 0.1)',
          tension: 0.3,
          fill: true
        }],
      });
    }
  }, [getPastMonthsLabels, groupContactsByMonth]);

  // Cargar datos de CRM desde las campañas existentes
  const loadCrmData = useCallback(async () => {
    setIsLoading(true);
    setDataLoadedMsg('');
    
    try {
      // Obtener los contactos y estadísticas desde el servicio CRM
      const [contacts, stats] = await Promise.all([
        crmService.getCrmContacts(),
        crmService.getCrmStats()
      ]);
      
      setCrmContacts(contacts);
      setCrmStats(stats);
      
      // Actualizar los gráficos con los datos obtenidos
      updateChartData(contacts, stats);
      
      setDataLoadedMsg('Datos CRM cargados correctamente.');
    } catch (error) {
      console.error('Error al cargar datos CRM:', error);
      setDataLoadedMsg('Error al cargar datos CRM. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [updateChartData]);

  // Refrescar datos del CRM
  const refreshCrmData = useCallback(async () => {
    setDataLoadedMsg('Actualizando datos CRM...');
    await loadCrmData();
  }, [loadCrmData]);

  // Cargar datos cuando el componente se monte
  useEffect(() => {
    loadCrmData();
  }, [loadCrmData]);

  return (
    <div style={viewStyle}>
      {/* Título con Flecha y botón de recarga */} 
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <FaArrowLeft style={backIconStyle} />
          <h2 style={titleStyle}>Análisis CRM</h2>
        </div>
        
        {crmContacts.length > 0 && (
          <button
            onClick={refreshCrmData}
            style={refreshButtonStyle}
          >
            <FaSync style={refreshIconStyle} /> Actualizar datos
          </button>
        )}
      </div>
      
      {/* Mensaje de estado */}
      {dataLoadedMsg && (
        <StatusMessage message={dataLoadedMsg} />
      )}
      
      {/* Resumen de estadísticas del CRM */}
      {crmStats && <StatsCards stats={crmStats} />}
      
      {/* Gráficos de Análisis */} 
      <AnalyticsCharts 
        barData={barData} 
        doughnutData={doughnutData} 
        lineData={lineData} 
      />

      {/* Simulador de Datos de Campaña */}
      <div className="mt-4 mb-4">
        <CampaignDataSimulator />
      </div>

      {/* Tabla de contactos CRM */}
      {crmContacts.length > 0 && (
        <ContactsTable contacts={crmContacts} />
      )}

      {/* Botón de actualización cuando no hay contactos */}
      {!crmContacts.length && (
        <div className="d-flex justify-content-center mt-4">
          <button 
            className="btn" 
            style={{ backgroundColor: '#F21A2B', color: 'white' }}
            onClick={loadCrmData}
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Cargar datos CRM'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CrmAnalysisView;
