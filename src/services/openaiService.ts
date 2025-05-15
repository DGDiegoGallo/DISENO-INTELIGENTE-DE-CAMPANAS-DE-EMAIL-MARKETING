/**
 * OpenAI Service
 * 
 * Servicio para interactuar con la API de OpenAI a través de Strapi.
 */

import { API_URL } from './strapiService';

// URL de la API de Strapi para los chats con IA
const AI_CHAT_ENDPOINT = `${API_URL}/api/open-ais`;

export interface ChatMessage {
  type: string;
  content: string;
}

export interface AIResponse {
  id: number;
  schema: { chat: ChatMessage[] };
  prompt: string;
  proyecto: string;
}

/**
 * Envía un mensaje al chat de IA y obtiene una respuesta
 * @param mensaje - Mensaje del usuario
 * @param historial - Historial de mensajes previos (opcional)
 * @returns Promise con la respuesta de la IA
 */
export const sendMessageToAI = async (
  mensaje: string, 
  historial: ChatMessage[] = []
): Promise<AIResponse> => {
  try {
    // Crear un nuevo historial con el mensaje del usuario
    const newChat = [
      ...historial,
      { type: "pregunta", content: mensaje }
    ];
    
    // Prepare los datos para enviar a la API
    const requestData = {
      data: {
        schema: { chat: newChat },
        prompt: "Eres un asistente virtual especializado en marketing por email para una plataforma CRM. Proporciona respuestas concisas, profesionales y útiles sobre campañas de email marketing, segmentación de audiencias, métricas de rendimiento, mejores prácticas, optimización de tasas de apertura y conversión, y estrategias para evitar filtros de spam. Mantén tus respuestas enfocadas en el marketing por email y ayuda a resolver problemas técnicos relacionados con la plataforma de email marketing.",
        proyecto: "chat-proyecto-56",
      }
    };
    
    // Token de autenticación desde localStorage
    const token = localStorage.getItem('jwt');
    
    // Enviar solicitud a Strapi
    const response = await fetch(AI_CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      throw new Error(`Error en la API de chat: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Procesar la respuesta de la API
    // En una implementación real, la respuesta vendría directamente de la API
    // Aquí simulamos una respuesta mientras se integra completamente
    const aiResponse = {
      ...data.data,
      schema: {
        chat: [
          ...newChat,
          { 
            type: "response", 
            content: "¡Hola! Soy tu asistente virtual de Email Marketing. ¿En qué puedo ayudarte hoy con tus campañas de email?" 
          }
        ]
      }
    };
    
    return aiResponse;
  } catch (error) {
    console.error('Error al comunicarse con la API de OpenAI:', error);
    throw error;
  }
};

/**
 * Obtiene todas las conversaciones de chat
 */
export const getChatHistory = async (): Promise<AIResponse[]> => {
  try {
    const token = localStorage.getItem('jwt');
    
    const response = await fetch(`${AI_CHAT_ENDPOINT}?populate=*`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener historial de chat: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error al obtener historial de chat:', error);
    return [];
  }
};

export default {
  sendMessageToAI,
  getChatHistory
};
