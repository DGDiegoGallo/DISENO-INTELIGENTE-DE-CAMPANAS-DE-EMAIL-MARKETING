import React, { useEffect, useState } from 'react';
import CrmAnalysisView from './CrmAnalysis/CrmAnalysisView';
import { getCampaigns } from '../../services/crmService';

const ABTestingView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // Verificar la conexión con Strapi al cargar el componente
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('ABTestingView: Verificando conexión con Strapi...');
        const campaigns = await getCampaigns();
        console.log('ABTestingView: Campañas obtenidas:', campaigns.length);
        setDataLoaded(true);
      } catch (error) {
        console.error('ABTestingView: Error al conectar con Strapi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Cargando datos...</div>
      ) : (
        <>
          {!dataLoaded && (
            <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
              Advertencia: No se pudieron cargar los datos de Strapi. Verifique la conexión.
            </div>
          )}
          <CrmAnalysisView />
        </>
      )}
    </div>
  );
};

export default ABTestingView;
