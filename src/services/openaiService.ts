/**
 * OpenAI Service
 * 
 * Servicio para interactuar con la API de OpenAI a través de Strapi.
 */

// import { API_URL } from './strapiService'; // No longer needed as AI_CHAT_ENDPOINT is hardcoded

// URL de la API de Strapi para el chat con IA (específico para técnico-56)
const AI_CHAT_ENDPOINT = 'http://34.238.122.213:1337/api/open-ai/tecnico-56';

export interface ChatMessage {
  type: 'pregunta' | 'response'; // More specific types
  content: string;
}

// Interface for the raw response from the AI endpoint
interface RawAIAPIResponse {
  autos: {
    chat: {
      type: 'respuesta'; // As per Insomnia response
      content: string;
    }[];
  }[];
}

/**
 * Envía un mensaje al chat de IA y obtiene una respuesta
 * @param mensaje - Mensaje del usuario
 * @returns Promise con el contenido de la respuesta de la IA (string)
 */
export const sendMessageToAI = async (
  mensaje: string
): Promise<string> => {
  try {
    // Prepare los datos para enviar a la API, según la prueba de Insomnia
    const requestData = {
      data: {
        chat: [
          { type: "pregunta", content: mensaje }
        ]
      }
    };
    
    // Token de autenticación desde localStorage
    const token = localStorage.getItem('jwt');
    
    // Enviar solicitud a Strapi
    const response = await fetch(AI_CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Asegúrate de que tu endpoint requiera autenticación si envías el token.
        // Si el endpoint es público o usa otra auth, ajusta esto.
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido en la API de chat' }));
      console.error('API Error Response:', errorData);
      throw new Error(`Error en la API de chat: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }
    
    const data: RawAIAPIResponse = await response.json();
    
    // Extraer el contenido de la respuesta de la IA según la estructura de Insomnia
    if (data.autos && data.autos[0] && data.autos[0].chat && data.autos[0].chat[0] && data.autos[0].chat[0].content) {
      return data.autos[0].chat[0].content;
    } else {
      console.error('Respuesta inesperada de la API de IA:', data);
      throw new Error('Respuesta inesperada de la API de IA: formato no reconocido.');
    }
  } catch (error) {
    console.error('Error al comunicarse con la API de OpenAI:', error);
    // Asegurarse de que el error que se propaga es una instancia de Error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al procesar la solicitud de IA.');
  }
};

/**
 * Obtiene todas las conversaciones de chat
 * @TODO: This function needs to be updated if chat history fetching is required,
 * as the AIResponse type and potentially the endpoint/response structure have changed.
 * Commenting out for now to resolve lint errors and focus on sendMessageToAI.
 */
// export const getChatHistory = async (): Promise<AIResponse[]> => {
//   try {
//     const token = localStorage.getItem('jwt');
    
//     const response = await fetch(`${AI_CHAT_ENDPOINT}?populate=*`, { // Note: AI_CHAT_ENDPOINT here might need to be different for history
//       method: 'GET',
//       headers: {
//         ...(token && { 'Authorization': `Bearer ${token}` }),
//       },
//     });
    
//     if (!response.ok) {
//       throw new Error(`Error al obtener historial de chat: ${response.status}`);
//     }
    
//     const data = await response.json();
//     // Ensure data.data matches the expected structure for chat history entries.
//     return data.data; 
//   } catch (error) {
//     console.error('Error al obtener historial de chat:', error);
//     return [];
//   }
// };

export default {
  sendMessageToAI,
  // getChatHistory // Commented out as the function is currently commented out
};
