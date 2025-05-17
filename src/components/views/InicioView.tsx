import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Iniciodesign from './InicioView/Iniciodesign';
import Iniciocharts from './InicioView/Iniciocharts';
import useAuth from '../../hooks/useAuth';
import campaignService from '../../services/campaignService'; // No-op change, re-saving
import { StrapiResponse, extractStrapiData } from '../../interfaces/strapi'; // No-op change, re-saving
import { DetailedCampaign, InteraccionDestinatario } from '../../interfaces/campaign'; 
import useLoadingStore from '../../store/useLoadingStore';
import { useNavigate } from 'react-router-dom';

const InicioView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<DetailedCampaign[]>([]);
  const [dataLoadedMsg, setDataLoadedMsg] = useState<string>('');
  const { startLoading, stopLoading } = useLoadingStore();

  const [totalClicks, setTotalClicks] = useState(0);
  const [totalOpens, setTotalOpens] = useState(0);
  const [totalDineroGastado, setTotalDineroGastado] = useState(0);

  const loadDashboardData = useCallback(async () => {
    if (!user || !user.id) {
      setDataLoadedMsg('Usuario no autenticado. No se pueden cargar los datos.');
      console.error('User or user.id is undefined.');
      return;
    }

    startLoading('Cargando datos del dashboard...');
    setDataLoadedMsg('');
    try {
      const response: StrapiResponse<DetailedCampaign> = 
        await campaignService.getUserCampaigns(1, 20, user.id);
      
      let processedData: DetailedCampaign[] = [];
      if (response && response.data) {
        processedData = response.data.map(item => {
          const extracted = extractStrapiData(item);
          return {
            ...extracted,
            interaccion_destinatario: typeof extracted.interaccion_destinatario === 'object' && extracted.interaccion_destinatario !== null
                                      ? extracted.interaccion_destinatario as InteraccionDestinatario
                                      : null, 
          } as DetailedCampaign;
        });
      }

      setCampaigns(processedData);

      let aggClicks = 0;
      let aggOpens = 0;
      let aggDinero = 0;

      processedData.forEach(campaign => {
        if (campaign.interaccion_destinatario) {
          Object.values(campaign.interaccion_destinatario).forEach(interaction => {
            aggOpens += interaction.opens || 0;
            aggClicks += interaction.clicks || 0;
            aggDinero += interaction.dinero_gastado || 0; 
          });
        }
      });

      setTotalClicks(aggClicks);
      setTotalOpens(aggOpens);
      setTotalDineroGastado(aggDinero);

      if (processedData.length === 0) {
        setDataLoadedMsg('No se encontraron campañas para mostrar.');
      } else {
        setDataLoadedMsg(''); 
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDataLoadedMsg('Error al cargar los datos del dashboard. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      stopLoading();
    }
  }, [user, startLoading, stopLoading]);

  useEffect(() => {
    if (user && user.id) {
      loadDashboardData();
    } else if (user === null) { 
        setDataLoadedMsg('Por favor, inicie sesión para ver el dashboard.');
    }
  }, [user, loadDashboardData]); 

  const handleEditCampaign = (id: number | string) => {
    navigate(`/ruta-editar-campana/${id}`); 
  };

  const handleDeleteCampaign = async (id: number | string) => {
    if (typeof id !== 'number') {
      console.error('Invalid campaign ID for deletion');
      return;
    }
    startLoading('Eliminando campaña...');
    try {
      await campaignService.deleteCampaign(id); 
      loadDashboardData();
      setDataLoadedMsg('Campaña eliminada exitosamente.');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setDataLoadedMsg('Error al eliminar la campaña.');
    } finally {
      stopLoading();
    }
  };

  if (!user) {
    return (
      <Container fluid className="p-4" style={{ background: 'linear-gradient(to right, #6C9AFF, #3267E3)', color: '#fff', minHeight: '100vh' }}>
        <Alert variant="info" className="text-center">Cargando información del usuario...</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4" style={{ background: 'linear-gradient(to right, #F0F4FF, #E2E9FF)', color: '#333', minHeight: '100vh' }}>
      <h2 style={{ color: '#282A5B', fontWeight: 'bold', marginBottom: '2rem' }}>Dashboard de Campañas</h2>
      
      {dataLoadedMsg && (
        <Alert variant={dataLoadedMsg.startsWith('Error') ? 'danger' : 'info'} className="mb-4">
          {dataLoadedMsg}
        </Alert>
      )}

      <Row className="mb-4 gx-4">
        <Col md={12}>
          <Iniciocharts 
            totalClicks={totalClicks} 
            totalOpens={totalOpens} 
            totalDineroGastado={totalDineroGastado} 
          />
        </Col>
      </Row>
      <Row className="gx-4">
        <Col md={12}>
          <Iniciodesign 
            campaigns={campaigns} 
            onEditCampaign={handleEditCampaign} 
            onDeleteCampaign={handleDeleteCampaign} 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default InicioView;