import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaBullhorn, FaEnvelopeOpenText, FaArrowRight } from 'react-icons/fa';

const TutorialView: React.FC = () => {
  const cardStyle: React.CSSProperties = {
    minHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease-in-out',
  };

  const iconContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '15px',
  };

  const arrowContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: '#282A5B',
    paddingTop: '20px', // Adjust as needed to align arrows between cards
  };

  return (
    <Container fluid className="p-4" style={{ color: '#333', minHeight: '80vh' }}>
      <h2 style={{ color: '#282A5B', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
        ¡Comienza a Crear Campañas Exitosas!
      </h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Sigue estos simples pasos para lanzar tu primera campaña de email marketing.
      </p>
      <Row className="justify-content-md-center align-items-stretch">
        {/* Step 1 */}
        <Col md={3} className="mb-4">
          <Card style={cardStyle} className="h-100">
            <Card.Body>
              <div style={iconContainerStyle}>
                <FaUsers size={50} style={{ color: '#6C9AFF' }} />
              </div>
              <Card.Title as="h5" className="text-center mb-3" style={{ color: '#282A5B' }}>Paso 1: Crea Grupos de Contactos</Card.Title>
              <Card.Text style={{ textAlign: 'justify' }}>
                Dirígete a la pestaña <strong>Contactos</strong> en la barra lateral. Aquí podrás organizar tus destinatarios en grupos para segmentar tus campañas de manera efectiva.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={1} style={arrowContainerStyle} className="d-none d-md-flex">
          <FaArrowRight />
        </Col>

        {/* Step 2 */}
        <Col md={3} className="mb-4">
          <Card style={cardStyle} className="h-100">
            <Card.Body>
              <div style={iconContainerStyle}>
                <FaBullhorn size={50} style={{ color: '#32CD32' }} />
              </div>
              <Card.Title as="h5" className="text-center mb-3" style={{ color: '#282A5B' }}>Paso 2: Crea tu Campaña</Card.Title>
              <Card.Text style={{ textAlign: 'justify' }}>
                Utiliza los grupos de contactos que creaste para iniciar una nueva campaña de marketing. Ve a la pestaña <strong>Campañas</strong> y selecciona "Crear Nueva".
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={1} style={arrowContainerStyle} className="d-none d-md-flex">
          <FaArrowRight />
        </Col>

        {/* Step 3 */}
        <Col md={3} className="mb-4">
          <Card style={cardStyle} className="h-100">
            <Card.Body>
              <div style={iconContainerStyle}>
                <FaEnvelopeOpenText size={50} style={{ color: '#FF6347' }} />
              </div>
              <Card.Title as="h5" className="text-center mb-3" style={{ color: '#282A5B' }}>Paso 3: Diseña y Envía</Card.Title>
              <Card.Text style={{ textAlign: 'justify' }}>
                Diseña tu correo electrónico con nuestro editor intuitivo. Una vez listo, establece una hora de envío, ¡y tu campaña estará en camino!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TutorialView;
