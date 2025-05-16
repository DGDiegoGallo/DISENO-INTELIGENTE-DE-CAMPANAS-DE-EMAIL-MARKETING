import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCampaignsData } from '../services/reportService'; // Assuming this might be used later

interface AiRecommendationsProps {
  // Props will be added later, e.g., to receive campaign data
  reportData: UserCampaignsData | null; // To be used for context later
}

interface AiRequestPayload {
  data: {
    chat: Array<{
      type: 'pregunta' | 'respuesta' | 'contexto'; // Added 'contexto' for campaign data
      content: string;
    }>;
  };
}

interface AiApiResponse {
  autos: Array<{
    chat: Array<{
      type: 'respuesta';
      content: string;
    }>;
  }>;
}

const formatDateForAI = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    // Using a more verbose format might be better for AI understanding
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (error) {
    console.error('Error formatting date for AI context:', dateString, error);
    return 'Fecha inválida';
  }
};

const transformReportDataToText = (data: UserCampaignsData | null): string => {
  if (!data) return 'No hay datos de campaña disponibles para el contexto.';

  let fullText = "Contexto del Informe de Campañas de Email Marketing:\n";
  fullText += "========================================\n";
  fullText += "Resumen General:\n";
  fullText += `- Total de campañas: ${data.totalCampaigns}\n`;
  fullText += `- Campañas en borrador: ${data.campaignStats.draft}\n`;
  fullText += `- Campañas programadas: ${data.campaignStats.scheduled}\n`;
  fullText += `- Campañas enviadas: ${data.campaignStats.sent}\n`;
  fullText += `- Campañas canceladas: ${data.campaignStats.cancelled}\n`;
  fullText += `- Total de contactos (general): ${data.totalContacts}\n\n`;

  if (data.campaigns && data.campaigns.length > 0) {
    fullText += "Detalle de Campañas Individuales:\n";
    fullText += "-------------------------------------\n";
    data.campaigns.forEach((campaign, index) => {
      fullText += `\nCampaña #${index + 1}:\n`;
      fullText += `  Nombre: ${campaign.nombre || 'Sin nombre'} (ID: ${campaign.id})\n`;
      fullText += `  Estado: ${campaign.estado || 'N/A'}\n`;
      fullText += `  Fecha de envío/programación: ${formatDateForAI(campaign.Fechas)}\n`;
      fullText += `  Dinero Gastado (Total en esta campaña): $${parseFloat(campaign.dinero_gastado || '0').toFixed(2)}\n`;
      fullText += `  Hubo Registro en Página (Total en esta campaña): ${campaign.se_registro_en_pagina ? 'Sí' : 'No'}\n`;

      let totalInteractionClicks = 0;
      let totalInteractionOpens = 0;
      let totalInteractionDineroGastado = 0;
      let totalInteractionRegistrations = 0;

      if (campaign.interaccion_destinatario) {
        Object.values(campaign.interaccion_destinatario).forEach(interaction => {
          if (interaction) {
            totalInteractionClicks += interaction.clicks || 0;
            totalInteractionOpens += interaction.opens || 0;
            totalInteractionDineroGastado += interaction.dinero_gastado || 0;
            if (interaction.se_registro_en_pagina) {
              totalInteractionRegistrations++;
            }
          }
        });
      }
      fullText += "  Métricas de Interacción de Destinatarios (para esta campaña):\n";
      fullText += `    - Total de Clicks: ${totalInteractionClicks}\n`;
      fullText += `    - Total de Aperturas: ${totalInteractionOpens}\n`;
      fullText += `    - Dinero Gastado (por interacciones): $${totalInteractionDineroGastado.toFixed(2)}\n`;
      fullText += `    - Registros en Página (por interacciones): ${totalInteractionRegistrations}\n`;

      if (campaign.gruposdecontactosJSON && campaign.gruposdecontactosJSON.grupos && campaign.gruposdecontactosJSON.grupos.length > 0) {
        fullText += "  Grupos de Contactos asociados a esta Campaña:\n";
        campaign.gruposdecontactosJSON.grupos.forEach(grupo => {
          fullText += `    - Nombre del Grupo: ${grupo.nombre || 'Grupo sin nombre'}, Número de Contactos: ${grupo.contactos ? grupo.contactos.length : 0}\n`;
        });
      } else {
        fullText += "  No hay grupos de contactos específicos asociados a esta campaña.\n";
      }
    });
  } else {
    fullText += "No hay campañas individuales para detallar.\n";
  }
  fullText += "\n========================================\nFin del Contexto del Informe.";
  return fullText.trim();
};

const AiRecommendations: React.FC<AiRecommendationsProps> = ({ reportData }) => {
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const STRAPI_AI_ENDPOINT = 'http://34.238.122.213:1337/api/open-ai/chat-proyecto-56';

  // Function to save reportData to localStorage
  const saveReportDataToLocalStorage = (data: UserCampaignsData | null) => {
    if (data) {
      try {
        const detailedTextContext = transformReportDataToText(data);
        localStorage.setItem('campaignReportDataForAI', detailedTextContext);
        console.log('Detailed report data (as text) saved to localStorage for AI context.');
      } catch (e) {
        console.error('Failed to transform or save detailed report data to localStorage:', e);
        setError('Error al procesar o guardar datos detallados de campaña para la IA.');
      }
    }
  };

  // Effect to save reportData whenever it changes and is available
  useEffect(() => {
    if (reportData) {
      saveReportDataToLocalStorage(reportData);
    }
  }, [reportData]);

  const handleSubmitQuery = async () => {
    if (!userQuestion.trim()) {
      setError('Por favor, introduce una pregunta.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse('');

    let campaignDataContext = '';
    try {
      const storedTextData = localStorage.getItem('campaignReportDataForAI');
      if (storedTextData) {
        campaignDataContext = storedTextData; // Directly use the detailed text string
        // Increased limit for more detailed context, adjust as needed based on AI API limits
        const MAX_CONTEXT_LENGTH = 4000; // Example: 4000 characters
        if (campaignDataContext.length > MAX_CONTEXT_LENGTH) { 
            campaignDataContext = campaignDataContext.substring(0, MAX_CONTEXT_LENGTH) + '\n... (Contexto truncado para no exceder el límite)';
            console.warn(`Campaign context data was truncated to ${MAX_CONTEXT_LENGTH} characters for AI prompt.`);
        }
      } else {
        campaignDataContext = 'No hay datos de campaña almacenados localmente para proporcionar contexto.';
      }
    } catch (e) {
      console.error('Error reading detailed campaign data (as text) from localStorage:', e);
      campaignDataContext = 'Error al leer el contexto de campañas desde el almacenamiento local.';
    }

    const fullContent = `${campaignDataContext}\n\nPregunta: ${userQuestion}`.trim();

    const payload: AiRequestPayload = {
      data: {
        chat: [
          { type: 'pregunta', content: fullContent },
        ],
      },
    };

    try {
      const response = await axios.post<AiApiResponse>(STRAPI_AI_ENDPOINT, payload, {
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if required by your Strapi setup
          // 'Authorization': 'Bearer YOUR_STRAPI_API_TOKEN',
        },
      });

      if (response.data && response.data.autos && response.data.autos[0] && response.data.autos[0].chat && response.data.autos[0].chat[0]) {
        setAiResponse(response.data.autos[0].chat[0].content);
      } else {
        setError('La respuesta de la IA no tuvo el formato esperado.');
        console.error('Unexpected AI response structure:', response.data);
      }
    } catch (err) {
      console.error('Error sending query to AI:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Error de la API: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else {
        setError('Ocurrió un error al comunicarse con el servicio de IA.');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h5><i className="fas fa-lightbulb me-2"></i>Recomendaciones y Consultas IA</h5>
      </div>
      <div className="card-body">
        <p className="card-text">
          Consulta a la IA sobre tus campañas. Los datos actuales del informe se guardan en localStorage y se pueden usar como contexto (actualmente de forma básica).
        </p>
        <div className="mb-3">
          <label htmlFor="userQuestionArea" className="form-label">Tu Pregunta:</label>
          <textarea
            id="userQuestionArea"
            className="form-control"
            rows={3}
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="Ej: ¿Qué campaña tuvo el peor rendimiento en clics? ¿Cómo puedo mejorar mis asuntos?"
            disabled={isLoading}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSubmitQuery}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Consultando...
            </>
          ) : (
            'Enviar Consulta'
          )}
        </button>

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        {aiResponse && !isLoading && (
          <div className="mt-4">
            <h6>Respuesta de la IA:</h6>
            <div className="card bg-light">
              <div className="card-body" style={{ whiteSpace: 'pre-wrap' }}>
                {aiResponse}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiRecommendations;
