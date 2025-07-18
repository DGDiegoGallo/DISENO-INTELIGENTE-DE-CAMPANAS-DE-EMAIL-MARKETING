import React, { useState } from 'react';
import { Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import { FaSync } from 'react-icons/fa';
import strapiService from '../../services/strapiService';
import { Campaign as BaseCampaign } from '../../services/campaignService';
import { API_URL } from '../../config/api';
import { extractStrapiData } from '../../interfaces/strapi';

// Extender la interfaz Campaign para incluir documentId y Fechas
interface CampaignDataSimulatorProps {
  onDataSimulated?: () => void;
}

interface Campaign extends BaseCampaign {
  documentId?: string;
  Fechas?: string; // Campo de fecha programada en formato ISO
}

const CampaignDataSimulator: React.FC<CampaignDataSimulatorProps> = ({ onDataSimulated }) => {
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
      // Configurar headers sin el token de autenticación
      const headers = {
        'Content-Type': 'application/json',
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

  // Genera un valor aleatorio para dinero_gastado (entre 0 y 500)
  const generateRandomSpending = (): number => {
    // Generar un número aleatorio entre 0 y 499
    return Math.floor(Math.random() * 500);
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
        dinero_gastado: "0",
        estado: "enviado" // Cambiar el estado a enviado
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
      dinero_gastado: totalSpent.toString(),
      estado: "enviado" // Cambiar el estado a enviado
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
        message: `Actualizando ${sentCampaigns.length} campañas con datos...`, 
        type: 'info' 
      });
      
      setProcessedCampaigns(prev => ({ ...prev, total: sentCampaigns.length }));
      
      // Actualizar cada campaña con datos
      let successCount = 0;
      let skippedCount = 0;
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
          
          // Verificar si la campaña ya tiene ingresos (dinero_gastado)
          if (campaign.dinero_gastado && parseFloat(campaign.dinero_gastado) > 0) {
            console.log(`Campaña ${campaign.documentId} ya tiene ingresos, omitiendo...`);
            skippedCount++;
            setProcessedCampaigns(prev => ({ ...prev, skipped: skippedCount }));
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
        message: 'Actualización completada. Campañas actualizadas correctamente.', 
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
      if (onDataSimulated) {
        onDataSimulated();
      }
    }
  };

  return (
    <div className="mb-4">
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
            <FaSync className="me-2" />
            Actualizar Datos
          </>
        )}
      </Button>
    </div>
  );
};

export default CampaignDataSimulator;
