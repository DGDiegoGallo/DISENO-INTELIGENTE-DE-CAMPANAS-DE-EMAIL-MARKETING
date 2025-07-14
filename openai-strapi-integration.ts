/**
 * INTEGRACIÓN DE OPENAI CON STRAPI - GUÍA DE IMPLEMENTACIÓN
 * --------------------------------------------------------
 * 
 * Este documento explica cómo implementar una integración entre OpenAI y Strapi
 * basada en el código del repositorio RPA-s.
 */

import axios from 'axios';

/**
 * Interfaz para los mensajes del chat
 */
interface ChatMessage {
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
}

/**
 * Interfaz para el formato del payload que se envía a Strapi
 */
interface ConversationPayload {
  data: {
    type: 'pregunta' | 'response';
    content: string;
  }[];
}

/**
 * Interfaz para la respuesta de la API de Strapi/OpenAI
 */
interface AIResponse {
  autos?: {
    data?: {
      content: string;
    }[];
  }[];
}

/**
 * FUNCIÓN PRINCIPAL: Enviar mensaje a OpenAI a través de Strapi
 * 
 * Esta función toma un historial de mensajes y un nuevo mensaje del usuario,
 * los formatea correctamente, y los envía al endpoint de Strapi que se comunica con OpenAI.
 * 
 * @param messages Historial de mensajes previos
 * @param newUserMessage Nuevo mensaje del usuario
 * @returns La respuesta generada por la IA
 */
export async function sendMessageToAI(
  messages: ChatMessage[],
  newUserMessage: string
): Promise<string> {
  try {
    // Formatear el historial de mensajes y el nuevo mensaje para el payload
    const conversationPayload: ConversationPayload = {
      data: messages
        .filter(msg => msg.sender !== 'system')
        .map(msg => ({
          type: msg.sender === 'user' ? 'pregunta' : 'response',
          content: msg.text
        }))
        .concat({ type: 'pregunta', content: newUserMessage })
    };

    // URL del endpoint de Strapi que maneja la comunicación con OpenAI
    const strapiEndpoint = 'https://strapi.useteam.io/api/open-ai/49';

    // Realizar la petición a Strapi
    const { data } = await axios.post<AIResponse>(strapiEndpoint, conversationPayload);

    // Extraer la respuesta de la IA
    const aiResponse = data?.autos?.[0]?.data?.[0]?.content ?? 
      "Lo siento, no encontré una respuesta válida.";

    return aiResponse;
  } catch (error) {
    console.error("Error al comunicarse con la IA:", error);
    return "Ha ocurrido un error al comunicarse con el asistente.";
  }
}

/**
 * EJEMPLO DE USO
 * 
 * Este ejemplo muestra cómo utilizar la función sendMessageToAI
 * para mantener una conversación con el asistente.
 */

// Ejemplo de historial de mensajes
const exampleMessages: ChatMessage[] = [
  {
    text: "¡Hola! Soy tu asistente RPA's. ¿En qué puedo ayudarte hoy?",
    sender: 'ai',
    timestamp: new Date()
  }
];

// Función de ejemplo para demostrar el uso
async function exampleConversation() {
  const userQuestion = "¿Cómo puedo configurar una automatización para procesar facturas?";
  
  console.log("Usuario:", userQuestion);
  
  try {
    // Enviar mensaje al asistente
    const aiResponse = await sendMessageToAI(exampleMessages, userQuestion);
    
    console.log("Asistente:", aiResponse);
    
    // Actualizar el historial de mensajes con la pregunta del usuario
    exampleMessages.push({
      text: userQuestion,
      sender: 'user',
      timestamp: new Date()
    });
    
    // Actualizar el historial de mensajes con la respuesta del asistente
    exampleMessages.push({
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error en la conversación de ejemplo:", error);
  }
}

/**
 * EJEMPLO DE BODY PARA INSOMNIA/POSTMAN
 * 
 * Para probar directamente la API con una herramienta como Insomnia o Postman,
 * puedes usar el siguiente formato de body:
 * 
 * URL: https://strapi.useteam.io/api/open-ai/49
 * Método: POST
 * Headers: Content-Type: application/json
 * 
 * Body:
 * {
 *   "data": [
 *     {
 *       "type": "response",
 *       "content": "¡Hola! Soy tu asistente RPA's. ¿En qué puedo ayudarte hoy?"
 *     },
 *     {
 *       "type": "pregunta",
 *       "content": "¿Cómo puedo solucionar un error de conexión a la base de datos?"
 *     },
 *     {
 *       "type": "response",
 *       "content": "Para solucionar un error de conexión a la base de datos, puedes seguir estos pasos: 1) Verifica que las credenciales sean correctas, 2) Comprueba que el servidor esté funcionando, 3) Revisa la configuración de red para asegurarte que los puertos necesarios estén abiertos."
 *     },
 *     {
 *       "type": "pregunta",
 *       "content": "¿Y si sigue sin funcionar después de revisar eso?"
 *     }
 *   ]
 * }
 */

/**
 * IMPLEMENTACIÓN COMPLETA EN UN COMPONENTE REACT
 * 
 * Para implementar esta funcionalidad en un componente React, puedes usar
 * el siguiente esquema como base:
 */

/*
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
}

export const ChatComponent = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "¡Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Función para enviar mensaje a la IA
  const sendMessageToAI = async (message: string) => {
    try {
      const conversationPayload = {
        data: messages
          .filter(msg => msg.sender !== 'system')
          .map(msg => ({
            type: msg.sender === 'user' ? 'pregunta' : 'response',
            content: msg.text
          }))
          .concat({ type: 'pregunta', content: message })
      };

      const { data } = await axios.post(
        'https://strapi.useteam.io/api/open-ai/49', 
        conversationPayload
      );

      return data?.autos?.[0]?.data?.[0]?.content ?? 
        "Lo siento, no encontré una respuesta válida.";
    } catch (error) {
      console.error("Error al comunicarse con la IA:", error);
      return "Ha ocurrido un error al comunicarse con el asistente.";
    }
  };

  // Función para manejar el envío del mensaje
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage = {
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI(newMessage);
      
      const aiMessage = {
        text: aiResponse,
        sender: 'ai' as const,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        text: "Lo siento, hubo un problema al conectar con el asistente.",
        sender: 'ai' as const,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll al último mensaje cuando la lista se actualiza
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div>
      {/* Aquí va el componente de UI para el chat *//*}
    </div>
  );
};
*/
