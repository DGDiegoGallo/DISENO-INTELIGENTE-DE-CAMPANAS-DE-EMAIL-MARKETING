import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { UserCampaignsData } from '../services/reportService';
import { API_URL } from '../config/api';


interface AiRecommendationsProps {
  reportData: UserCampaignsData | null;
}

interface AiRequestPayload {
  data: {
    chat: Array<{
      type: 'pregunta' | 'respuesta' | 'contexto';
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

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
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
      fullText += `    - Dinero Gastado (por interacciones): $${Number(totalInteractionDineroGastado || 0).toFixed(2)}\n`;
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

// Component to show loading dots
const LoadingDots: React.FC = () => (
  <div className="loading-dots">
    <span>.</span><span>.</span><span>.</span>
  </div>
);

const AiRecommendations: React.FC<AiRecommendationsProps> = ({ reportData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const STRAPI_AI_ENDPOINT = `${API_URL}/api/open-ai/chat-proyecto-56`;

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

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        type: 'ai',
        content: 'Este es un servicio de recomendaciones basado en los informes de métricas de tus campañas. Puedes consultar sobre el rendimiento de tus campañas, tendencias identificadas o solicitar sugerencias para mejorar tus resultados.',
        timestamp: new Date()
      }
    ]);
  }, []);

  // Auto-scroll to the last message
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // Effect to save reportData whenever it changes and is available
  useEffect(() => {
    if (reportData) {
      saveReportDataToLocalStorage(reportData);
    }
  }, [reportData]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      return;
    }

    // Add user message to the conversation
    const userMessage: ChatMessage = { 
      type: 'user', 
      content: inputMessage.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    let campaignDataContext = '';
    try {
      const storedTextData = localStorage.getItem('campaignReportDataForAI');
      if (storedTextData) {
        campaignDataContext = storedTextData;
        const MAX_CONTEXT_LENGTH = 4000;
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

    const fullContent = `${campaignDataContext}\n\nPregunta: ${inputMessage}`.trim();

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
        },
      });

      if (response.data && response.data.autos && response.data.autos[0] && response.data.autos[0].chat && response.data.autos[0].chat[0]) {
        const aiResponseContent = response.data.autos[0].chat[0].content;
        
        // Add AI response to the conversation
        const aiResponseMessage: ChatMessage = {
          type: 'ai',
          content: aiResponseContent,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponseMessage]);
      } else {
        setError('La respuesta de la IA no tuvo el formato esperado.');
        console.error('Unexpected AI response structure:', response.data);
        
        // Add error message to the conversation
        const errorMessage: ChatMessage = {
          type: 'ai',
          content: 'Lo siento, no pude procesar tu consulta correctamente. Por favor, intenta de nuevo.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('Error sending query to AI:', err);
      let errorMessage = 'Ocurrió un error al comunicarse con el servicio de IA.';
      
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = `Error de la API: ${err.response.status} - ${JSON.stringify(err.response.data)}`;
      }
      
      setError(errorMessage);
      
      // Add error message to the conversation
      const aiErrorMessage: ChatMessage = {
        type: 'ai',
        content: errorMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // This space intentionally left blank

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h5><i className="fas fa-lightbulb me-2"></i>Recomendaciones y Consultas IA</h5>
      </div>
      <div className="card-body">
        <p className="card-text">
          Consulta a la IA sobre tus campañas. Los datos actuales del informe se guardan en localStorage y se pueden usar como contexto para obtener recomendaciones personalizadas.
        </p>
        
        {/* Chat history */}
        <div 
          className="chat-history mb-4 p-3 border rounded" 
          ref={chatHistoryRef}
          style={{ maxHeight: '350px', overflowY: 'auto' }}
        >
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`message-bubble p-3 mb-3 rounded ${message.type === 'user' ? 'user-message bg-danger text-white ms-auto' : 'ai-message bg-primary text-white'}`}
                    style={{ 
                      maxWidth: '80%', 
                      float: message.type === 'user' ? 'right' : 'left',
                      clear: 'both'
                    }}
                  >
                    {message.content}
                  </div>
                ))}
                
                {isLoading && (
                  <div 
                    className="message-bubble p-3 mb-3 rounded ai-message bg-primary text-white" 
                    style={{ 
                      maxWidth: '80%', 
                      float: 'left',
                      clear: 'both' 
                    }}
                  >
                    <LoadingDots />
                  </div>
                )}
                <div style={{ clear: 'both' }}></div>
        </div>

        {/* Input for new message */}
        <div className="mb-3">
          <label htmlFor="userQuestionArea" className="form-label">Tu Consulta:</label>
          <textarea 
            id="userQuestionArea" 
            className="form-control" 
            rows={3}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ej: ¿Qué campaña tuvo el mejor rendimiento? ¿Cómo puedo mejorar mis tasas de apertura?"
            disabled={isLoading}
            style={{ resize: 'none', overflowY: 'auto' }}
          />
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Consultando...
            </>
          ) : 'Enviar Consulta'}
        </button>
        
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiRecommendations;
