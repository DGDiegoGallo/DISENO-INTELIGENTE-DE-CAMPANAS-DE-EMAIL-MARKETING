import React, { useState } from 'react';
import { Button, Alert, Spinner, Card, ProgressBar } from 'react-bootstrap';
import { FaRandom, FaSync } from 'react-icons/fa';
import strapiService from '../../services/strapiService';
import { Campaign as BaseCampaign } from '../../services/campaignService';
import { extractStrapiData } from '../../interfaces/strapi';

// Extender la interfaz Campaign para incluir documentId y Fechas
interface Campaign extends BaseCampaign {
  documentId?: string;
  Fechas?: string; // Campo de fecha programada en formato ISO
}

const CampaignDataSimulator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    message: string;
    type: 'success' | 'danger' | 'info' | 'warning' | '';
    details?: string;
  }>({ message: '', type: '' });
  const [progress, setProgress] = useState(0);
  const [processedCampaigns, setProcessedCampaigns] = useState<{
    total: number;
    success: number;
    failed: number;
  }>({ total: 0, success: 0, failed: 0 });

  // Función para actualizar campaña usando documentId en lugar de id numérico
  const updateCampaignByDocumentId = async (endpoint: string, documentId: string, data: Record<string, unknown>) => {
    try {
      // Usar axios directamente para hacer la solicitud PUT con documentId
      const API_URL = 'http://34.238.122.213:1337';
      
      // Obtener el token de autenticación del localStorage
      const authData = localStorage.getItem('auth-storage');
      let token = '';
      if (authData) {
        const parsedData = JSON.parse(authData);
        token = parsedData?.state?.token;
      }
      
      // Configurar headers con el token de autenticación
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      };
      
      // Hacer la solicitud PUT utilizando documentId
      const response = await fetch(`${API_URL}/api/${endpoint}/${documentId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar ${endpoint} con documentId ${documentId}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error al actualizar ${endpoint} con documentId ${documentId}:`, error);
      throw error;
    }
  };
  
  // Función para obtener las campañas del usuario actual
  const getUserCampaigns = async (): Promise<Campaign[]> => {
    try {
      // Obtener el ID del usuario desde localStorage
      let userId: number | undefined;
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const parsedData = JSON.parse(authData);
        userId = parsedData?.state?.user?.id;
      }

      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.');
      }

      // Obtener las campañas del usuario
      const queryParams: Record<string, string | number> = {
        'pagination[limit]': 100, // Obtener hasta 100 campañas
        'populate': '*',
        'filters[usuario][id]': userId
      };

      const response = await strapiService.getCollection<Campaign>('proyecto-56s', queryParams);
      
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Formato de respuesta inesperado al obtener campañas');
      }

      // Extraer y transformar los datos de Strapi
      return response.data.map(item => extractStrapiData(item));
    } catch (error) {
      console.error('Error al obtener campañas del usuario:', error);
      throw error;
    }
  };

  // Genera un valor aleatorio para se_registro_en_pagina (true/false)
  const generateRandomRegistration = (): boolean => {
    return Math.random() > 0.5;
  };

  // Genera un valor aleatorio para dinero_gastado (entre 0 y 5000)
  const generateRandomSpending = (): number => {
    const baseAmount = Math.floor(Math.random() * 1000);
    const multiplier = Math.floor(Math.random() * 5) + 1;
    return baseAmount * multiplier;
  };

  // Genera datos aleatorios de interacción para un email
  const generateInteractionData = (): {
    clicks: number;
    opens: number;
    dinero_gastado: number;
    se_registro_en_pagina: boolean;
  } => {
    return {
      clicks: Math.floor(Math.random() * 10),
      opens: Math.floor(Math.random() * 20) + 1,
      dinero_gastado: generateRandomSpending(),
      se_registro_en_pagina: generateRandomRegistration()
    };
  };

  // Genera datos aleatorios para una campaña
  const generateRandomCampaignData = (campaign: Campaign): Partial<Campaign> => {
    // Verificar si hay contactos
    if (!campaign.contactos) {
      return {
        interaccion_destinatario: {},
        se_registro_en_pagina: false,
        dinero_gastado: "0"
      };
    }

    // Procesar cada email en contactos
    const emails = campaign.contactos.split(',').map(email => email.trim());
    const interactionData: Record<string, unknown> = {};
    
    let totalSpent = 0;
    let anyRegistration = false;

    emails.forEach(email => {
      if (email) {
        // Usar el email como clave, reemplazando caracteres especiales
        const emailKey = email.replace('@', '_').replace(/\./g, '_');
        const userData = generateInteractionData();
        
        interactionData[emailKey] = userData;
        
        // Actualizar totales
        totalSpent += userData.dinero_gastado;
        if (userData.se_registro_en_pagina) {
          anyRegistration = true;
        }
      }
    });

    return {
      interaccion_destinatario: interactionData,
      se_registro_en_pagina: anyRegistration,
      dinero_gastado: totalSpent.toString()
    };
  };

  /**
   * Verifica si una campaña ya ha sido enviada (su fecha de envío está en el pasado)
   * Toma en cuenta la zona horaria de Argentina (UTC-3) para la comparación
   */
  const isCampaignSent = (campaign: Campaign): boolean => {
    // Verificar que exista la fecha programada y sea válida
    if (!campaign.Fechas) {
      return false;
    }
    
    try {
      // Obtener la fecha de envío de la campaña (está almacenada en UTC)
      const scheduledDateUTC = new Date(campaign.Fechas);
      
      // Obtener la fecha y hora actual
      const now = new Date();
      
      // Método directo: restar 3 horas a la hora UTC para obtener hora Argentina
      // Argentina es UTC-3, así que restamos 3 horas (en milisegundos) a la hora UTC
      const hoursInMs = 3 * 60 * 60 * 1000; // 3 horas en milisegundos
      
      // La fecha actual en UTC
      const currentUTC = new Date(now.getTime());
      // Convertir a fecha en Argentina (restar 3 horas)
      const currentDateInArgentina = new Date(currentUTC.getTime() - hoursInMs);
      
      // Para mostrar la hora Argentina de manera más confiable, usar el formato local
      const argentinaTimeString = `${currentDateInArgentina.getFullYear()}-${String(currentDateInArgentina.getMonth() + 1).padStart(2, '0')}-${String(currentDateInArgentina.getDate()).padStart(2, '0')} ${String(currentDateInArgentina.getHours()).padStart(2, '0')}:${String(currentDateInArgentina.getMinutes()).padStart(2, '0')}:${String(currentDateInArgentina.getSeconds()).padStart(2, '0')}`;
      
      // Informar para depuración
      console.log(`Campaña: ${campaign.nombre}`);
      console.log(`Fecha programada (UTC): ${scheduledDateUTC.toISOString()}`);
      console.log(`Fecha programada (Argentina): ${new Date(scheduledDateUTC.getTime() - hoursInMs).toISOString()}`);
      console.log(`Hora actual (UTC): ${currentUTC.toISOString()}`);
      console.log(`Hora actual (Argentina): ${argentinaTimeString}`);
      console.log(`¿Campaña enviada?: ${scheduledDateUTC < now ? 'Sí' : 'No'}`);
      
      // Comprobar si la fecha programada está en el pasado
      // Para mayor precisión, comparamos fechas UTC directamente
      return scheduledDateUTC < now;
    } catch (error) {
      console.error(`Error al verificar fecha de campaña ${campaign.id}:`, error);
      return false;
    }
  };
  
  // Actualiza los datos de todas las campañas del usuario
  const updateCampaignsData = async () => {
    setIsLoading(true);
    setStatus({ 
      message: 'Obteniendo campañas del usuario...', 
      type: 'info' 
    });
    setProgress(0);
    setProcessedCampaigns({ total: 0, success: 0, failed: 0 });

    try {
      // Obtener las campañas del usuario
      const allCampaigns = await getUserCampaigns();
      
      if (allCampaigns.length === 0) {
        setStatus({ 
          message: 'No se encontraron campañas para actualizar.', 
          type: 'warning' 
        });
        setIsLoading(false);
        return;
      }
      
      // Filtrar solo las campañas que ya han sido enviadas (fecha en el pasado)
      const sentCampaigns = allCampaigns.filter(campaign => isCampaignSent(campaign));
      const futureCampaigns = allCampaigns.filter(campaign => !isCampaignSent(campaign));
      
      if (sentCampaigns.length === 0) {
        setStatus({ 
          message: 'No hay campañas disponibles para generar datos.', 
          type: 'warning',
          details: 'Solo se pueden generar datos para campañas que ya han sido enviadas (con fecha de envío en el pasado).'
        });
        setIsLoading(false);
        return;
      }
      
      // Informar al usuario sobre campañas futuras si las hay
      if (futureCampaigns.length > 0) {
        console.info(`Se omitirán ${futureCampaigns.length} campañas programadas para fechas futuras.`);
      }

      setStatus({ 
        message: `Actualizando ${sentCampaigns.length} campañas con datos simulados...`, 
        type: 'info' 
      });
      
      setProcessedCampaigns(prev => ({ ...prev, total: sentCampaigns.length }));
      
      // Actualizar cada campaña con datos simulados
      let successCount = 0;
      let failedCount = 0;
      
      for (let i = 0; i < sentCampaigns.length; i++) {
        const campaign = sentCampaigns[i];
        try {
          // Verificar que la campaña tenga un documentId válido
          if (!campaign.documentId) {
            console.error('Campaña sin documentId válido:', campaign);
            failedCount++;
            setProcessedCampaigns(prev => ({ ...prev, failed: failedCount }));
            continue;
          }
          
          // Generar datos aleatorios para la campaña
          const randomData = generateRandomCampaignData(campaign);
          
          // Formatear los datos para Strapi
          const strapiData = {
            data: randomData
          };
          
          // Actualizar la campaña en Strapi utilizando documentId
          await updateCampaignByDocumentId('proyecto-56s', campaign.documentId, strapiData);
          
          successCount++;
          setProcessedCampaigns(prev => ({ ...prev, success: successCount }));
        } catch (error) {
          console.error(`Error al actualizar campaña ${campaign.id}:`, error);
          failedCount++;
          setProcessedCampaigns(prev => ({ ...prev, failed: failedCount }));
        }

        // Actualizar progreso
        const progressPercentage = Math.floor(((i + 1) / sentCampaigns.length) * 100);
        setProgress(progressPercentage);
      }

      // Actualizar estado final
      setStatus({ 
        message: `Actualización completada. ${successCount} campañas actualizadas correctamente.`, 
        type: 'success',
        details: failedCount > 0 ? `${failedCount} campañas no se pudieron actualizar.` : undefined
      });
    } catch (error) {
      console.error('Error durante la actualización de datos:', error);
      setStatus({ 
        message: 'Error al actualizar datos de campañas', 
        type: 'danger',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-white">
        <h5 className="mb-0 d-flex align-items-center">
          <FaRandom className="me-2 text-danger" />
          Simulador de Datos de Campaña
        </h5>
      </Card.Header>
      <Card.Body>
        <p className="text-muted">
          Esta herramienta genera datos aleatorios de interacción para tus campañas <strong>ya enviadas</strong>.
          Actualiza los siguientes campos:
        </p>
        <ul className="small text-muted">
          <li><strong>interaccion_destinatario</strong>: Datos de clicks, aperturas, etc.</li>
          <li><strong>se_registro_en_pagina</strong>: Si algún destinatario se registró</li>
          <li><strong>dinero_gastado</strong>: Total gastado por destinatarios</li>
        </ul>
        <div className="alert alert-info mt-2 p-2 small">
          <strong>Nota:</strong> Solo se pueden generar datos para campañas cuya fecha programada ya haya pasado.
          Las campañas con fechas futuras no serán procesadas.
        </div>

        {status.message && (
          <Alert variant={status.type} className="mb-3">
            {status.message}
            {status.details && (
              <div className="small mt-1">{status.details}</div>
            )}
          </Alert>
        )}

        {isLoading && progress > 0 && (
          <div className="mb-3">
            <ProgressBar 
              now={progress} 
              label={`${progress}%`} 
              variant="danger" 
              className="mb-2" 
            />
            <div className="d-flex justify-content-between text-muted small">
              <span>Procesadas: {processedCampaigns.success + processedCampaigns.failed}/{processedCampaigns.total}</span>
              <span>Exitosas: {processedCampaigns.success}</span>
              <span>Fallidas: {processedCampaigns.failed}</span>
            </div>
          </div>
        )}

        <Button 
          variant="danger" 
          onClick={updateCampaignsData} 
          disabled={isLoading}
          className="d-flex align-items-center"
        >
          {isLoading ? (
            <>
              <Spinner 
                as="span" 
                animation="border" 
                size="sm" 
                role="status" 
                aria-hidden="true" 
                className="me-2" 
              />
              Actualizando datos...
            </>
          ) : (
            <>
              <FaSync className="me-2" /> Generar Datos Aleatorios
            </>
          )}
        </Button>
      </Card.Body>
      <Card.Footer className="bg-white text-muted small">
        <strong>Nota:</strong> Esto sobrescribirá cualquier dato existente en las campañas seleccionadas.
        Los datos generados son aleatorios y solo para fines de demostración.
      </Card.Footer>
    </Card>
  );
};

export default CampaignDataSimulator;
