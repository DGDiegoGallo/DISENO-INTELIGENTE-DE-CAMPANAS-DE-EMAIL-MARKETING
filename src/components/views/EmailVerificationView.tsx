import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import emailjs from '@emailjs/browser';

const EmailVerificationView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleCloseModal = () => setShowModal(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Credenciales de EmailJS proporcionadas por el usuario
      const serviceId = 'service_0k81gmp';
      // Utiliza el ID de tu template - debes crearlo en EmailJS.com
      const templateId = 'template_verification';
      const publicKey = 'UNq5iAgC0LjsStois';

      // Generar un enlace de verificación de ejemplo (podrías generar un token único)
      const verificationLink = `https://ejemplo.com/verify?email=${encodeURIComponent(email)}&token=${Date.now()}`;
      
      const templateParams = {
        to_email: email,
        to_name: email.split('@')[0],
        verification_link: verificationLink,
        year: new Date().getFullYear(),
        company_name: 'Email Marketing AI',
        subject: 'Verificación de tu correo electrónico'
      };
      
      // Para depuración - mostrar los parámetros enviados
      setDebugInfo(JSON.stringify({
        serviceId,
        templateId,
        publicKey: publicKey.substring(0, 4) + '...',
        templateParams
      }, null, 2));

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setShowModal(true);
      setEmail('');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      setError('Ha ocurrido un error al enviar el correo. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-1" style={{ borderColor: '#e9e9e9' }}>
            <div className="card-header bg-white">
              <h2 className="text-center" style={{ color: '#F21A2B' }}>Verificación por Correo Electrónico</h2>
              <p className="text-center text-muted">Envío de correos de prueba con EmailJS</p>
            </div>
            <div className="card-body p-4">
              <Form ref={formRef} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Ingresa un correo válido para recibir el mensaje de verificación.
                  </Form.Text>
                </Form.Group>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: '#F21A2B', borderColor: '#F21A2B' }}
                  >
                    {loading ? 'Enviando...' : 'Enviar Verificación'}
                  </Button>
                </div>
              </Form>

              <div className="mt-4">
                <h5>Instrucciones:</h5>
                <ol>
                  <li>Ingresa tu correo electrónico en el campo de arriba</li>
                  <li>Haz clic en "Enviar Verificación"</li>
                  <li>Revisa tu bandeja de entrada para el correo de verificación</li>
                  <li>El sistema mostrará una confirmación cuando el correo sea enviado</li>
                </ol>
              </div>
              
              <div className="mt-4">
                <h5>Configuración de EmailJS:</h5>
                <ol>
                  <li>Inicia sesión en <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer">EmailJS.com</a></li>
                  <li>Crea un nuevo template llamado <code>template_verification</code></li>
                  <li>Copia el contenido HTML del archivo <code>email_template.html</code> en la raíz del proyecto</li>
                  <li>Asegúrate de que el Service ID coincida con <code>service_0k81gmp</code></li>
                </ol>
              </div>
              
              {debugInfo && (
                <Alert variant="info" className="mt-3">
                  <h6>Información de depuración:</h6>
                  <pre style={{fontSize: '0.8rem'}}>{debugInfo}</pre>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#F21A2B', color: 'white' }}>
          <Modal.Title>Correo Verificado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se ha enviado un correo de verificación a <strong>{email}</strong>.</p>
          <p>Por favor, revisa tu bandeja de entrada para completar el proceso.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmailVerificationView;
