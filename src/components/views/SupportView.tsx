import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToAI, ChatMessage } from '../../services/openaiService';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../views/viewStyles/SupportView.css';

const SupportView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Inicializar con un mensaje de bienvenida
  useEffect(() => {
    setMessages([
      { 
        type: 'response' as const, // Use 'as const' for literal type assertion 
        content: '¡Hola! Soy tu asistente virtual de Email Marketing. ¿Cómo puedo ayudarte hoy?' 
      }
    ]);
  }, []);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Agregar mensaje del usuario a la conversación
    const userMessage: ChatMessage = { type: 'pregunta', content: inputMessage.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Llamar al servicio de OpenAI (ahora solo toma el mensaje del usuario)
      const aiContentString = await sendMessageToAI(inputMessage.trim());
      
      // Crear el objeto de mensaje de la IA con el contenido recibido
      const aiResponseMessage: ChatMessage = { 
        type: 'response',
        content: aiContentString
      };
      
      // Añadir respuesta a los mensajes
      setMessages(prevMessages => [...prevMessages, aiResponseMessage]);
    } catch (err) { // Changed 'error' to 'err' to avoid conflict with global Error object if any
      let displayErrorMessage = 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta nuevamente.';
      if (err instanceof Error) {
        displayErrorMessage = err.message; 
      }
      console.error('Error al obtener respuesta de IA:', err);
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          type: 'response' as const, 
          content: displayErrorMessage
        }
      ]);
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

  // Componente para mostrar los puntos de carga
  const LoadingDots = () => (
    <div className="loading-dots">
      <span>.</span><span>.</span><span>.</span>
    </div>
  );

  return (
    <Container fluid className="py-4 bg-light" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm chat-container">
            <Card.Header className="bg-white border-bottom-0">
              <h4 className="mb-0 text-primary">Soporte de Email Marketing</h4>
            </Card.Header>
            
            <Card.Body>
              {/* Historial de chat */}
              <div 
                className="chat-history mb-4 p-3" 
                ref={chatHistoryRef}
                style={{ height: '400px', overflowY: 'auto' }}
              >
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`message-bubble p-3 mb-3 rounded ${message.type === 'pregunta' ? 'user-message bg-danger text-white ms-auto' : 'ai-message bg-primary text-white'}`}
                    style={{ 
                      maxWidth: '80%', 
                      float: message.type === 'pregunta' ? 'right' : 'left',
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
                      float: 'left', // Align like other AI messages
                      clear: 'both' 
                    }}
                  >
                    <LoadingDots />
                  </div>
                )}
                <div style={{ clear: 'both' }}></div>
              </div>

              {/* Input para nuevo mensaje */}
              <Form className="mt-4">
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe tu consulta aquí..."
                        disabled={isLoading}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="auto" className="d-flex align-items-end">
                    <Button 
                      variant="danger"
                      className="px-4 py-2"
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                    >
                      Enviar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SupportView;
