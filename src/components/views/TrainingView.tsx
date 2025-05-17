import React, { useState } from 'react';
import { FaEnvelopeOpenText, FaEye } from 'react-icons/fa'; // FaEnvelopeOpenText for email examples, FaEye for preview button
import EmailHtmlPreviewModal from '../common/EmailHtmlPreviewModal'; // Import the modal

const TrainingView: React.FC = () => {
  // State for managing the HTML preview modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentHtmlContent, setCurrentHtmlContent] = useState('');
  const [currentPreviewTitle, setCurrentPreviewTitle] = useState('');

  // Datos para los videos de YouTube (3 videos)
  const youtubeVideos = [
    { id: 'bun0XPB_DgU', title: 'Video Tutorial 1: Creación de Campañas Efectivas' },
    { id: 'V7gL7-wPjU8', title: 'Video Tutorial 2: Segmentación Avanzada' },
    { id: 'hbloo-5v79I', title: 'Video Tutorial 3: Análisis y Optimización' },
  ];

  // Datos para los ejemplos de email marketing (3 ejemplos)
  const emailExamples = [
    {
      id: 1,
      title: 'Email de Bienvenida Automatizado',
      previewContent: 'Un correo cálido y acogedor para nuevos suscriptores, presentando tu marca y estableciendo expectativas.',
      bestPractices: [
        'Personaliza con el nombre del suscriptor.',
        'Presenta claramente tu marca y propuesta de valor.',
        'Incluye un Call-to-Action (CTA) principal y visible.',
        'Establece expectativas sobre la frecuencia y tipo de correos.',
        'Asegúrate de que sea responsive y se vea bien en móviles.'
      ],
      htmlContent: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email de Bienvenida</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
    .header img { max-width: 150px; }
    .content { padding: 20px 0; color: #333333; line-height: 1.6; }
    .content h1 { color: #F21A2B; font-size: 24px; }
    .button { display: inline-block; background-color: #F21A2B; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="width: 150px; height: 50px; background-color: #cccccc; color: #555555; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 1px dashed #aaaaaa; text-align: center;">(Aquí va tu logo)</div>
    </div>
    <div class="content">
      <h1>¡Bienvenido/a a [Nombre de tu Marca]!</h1>
      <p>Hola [Nombre del Suscriptor],</p>
      <p>Gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte con nosotros. Aquí encontrarás [breve descripción de lo que ofreces o qué esperar].</p>
      <p>Para empezar, te recomendamos visitar nuestro sitio web o ver nuestros productos más populares:</p>
      <a href="#" class="button">Visitar Nuestro Sitio</a>
      <p>Recibirás nuestros correos aproximadamente [Frecuencia, ej: una vez por semana] con [Tipo de contenido, ej: novedades, ofertas especiales y consejos útiles].</p>
      <p>¡Gracias de nuevo!</p>
      <p>El equipo de [Nombre de tu Marca]</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} [Nombre de tu Marca]. Todos los derechos reservados.</p>
      <p>Si no deseas recibir estos correos, puedes <a href="#" style="color: #F21A2B;">cancelar tu suscripción</a>.</p>
    </div>
  </div>
</body>
</html>
      `
    },
    {
      id: 2,
      title: 'Email Promocional de Oferta Especial',
      previewContent: 'Anuncio de un descuento o promoción por tiempo limitado para impulsar conversiones.',
      bestPractices: [
        'Asunto claro y con sentido de urgencia (ej: "¡Última oportunidad! 20% OFF").',
        'Visual atractivo que destaque el producto/servicio en oferta.',
        'CTA prominente y fácil de encontrar ("Comprar ahora", "Ver oferta").',
        'Segmenta tu lista para enviar la oferta a la audiencia correcta.',
        'Realiza pruebas A/B con diferentes asuntos y CTAs.'
      ],
      htmlContent: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Oferta Especial</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 0; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden; }
    .banner { background-color: #F21A2B; padding: 30px 20px; text-align: center; }
    .banner h1 { color: #ffffff; font-size: 28px; margin: 0; }
    .banner p { color: #ffffff; font-size: 16px; margin-top: 5px; }
    .content { padding: 20px; color: #333333; line-height: 1.6; text-align: center; }
    .content .offer { font-size: 22px; font-weight: bold; color: #F21A2B; margin-bottom: 15px; }
    .product-image { max-width: 80%; height: auto; margin: 15px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);}
    .button { display: inline-block; background-color: #F21A2B; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; font-size: 18px; }
    .terms { font-size: 12px; color: #777777; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; background-color: #f7f7f7; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="banner">
      <h1>¡Oferta Exclusiva Para Ti!</h1>
      <p>Solo por tiempo limitado - ¡No te lo pierdas!</p>
    </div>
    <div class="content">
      <p>Hola [Nombre del Suscriptor],</p>
      <p class="offer">¡Consigue un 20% DE DESCUENTO en [Nombre del Producto/Servicio]!</p>
      <div style="width: 100%; max-width: 560px; min-height: 150px; background-color: #cccccc; color: #555555; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 1px dashed #aaaaaa; margin-bottom: 20px; border-radius: 5px; text-align: center;">(Aquí va la imagen del producto)</div>
      <p>Utiliza el código <strong style="color: #F21A2B;">PROMO20</strong> al finalizar tu compra.</p>
      <a href="#" class="button">Comprar Ahora</a>
      <p class="terms">Oferta válida hasta [Fecha Límite]. Aplican términos y condiciones.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} [Nombre de tu Marca]. Todos los derechos reservados.</p>
      <p><a href="#" style="color: #F21A2B;">Cancelar suscripción</a></p>
    </div>
  </div>
</body>
</html>
      `
    },
    {
      id: 3,
      title: 'Email de Reactivación de Clientes Inactivos',
      previewContent: 'Intento de volver a enganchar a suscriptores que no han interactuado recientemente con tus comunicaciones.',
      bestPractices: [
        'Asunto intrigante o que ofrezca valor (ej: "¿Nos extrañas? Tenemos algo para ti").',
        'Recuérdales por qué se suscribieron o el valor que obtienen.',
        'Ofrece un incentivo especial para volver (descuento, contenido exclusivo).',
        'Pide feedback o permite actualizar preferencias de comunicación.',
        'Considera una opción para darse de baja fácilmente si ya no están interesados.'
      ],
      htmlContent: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Te Extrañamos</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; }
    .header h1 { color: #333333; font-size: 26px; margin-bottom: 5px; }
    .header p { color: #F21A2B; font-size: 18px; font-weight: bold; }
    .content { padding: 20px 0; color: #333333; line-height: 1.6; }
    .content .highlight { background-color: #fff3cd; border-left: 4px solid #ffeeba; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; background-color: #F21A2B; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    .preferences { margin-top: 30px; padding-top:15px; border-top: 1px solid #eee; text-align:center; font-size:14px; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Hola [Nombre del Suscriptor]!</h1>
      <p>¡Hace tiempo que no sabemos de ti y te extrañamos!</p>
    </div>
    <div class="content">
      <p>Sabemos que la vida puede ser ocupada, pero queríamos recordarte todo lo bueno que [Nombre de tu Marca] tiene para ofrecer. Desde que te fuiste, hemos añadido [Novedad 1] y [Novedad 2].</p>
      <div class="highlight">
        <p><strong>Oferta especial de bienvenida de nuevo:</strong> Disfruta de un <strong>15% de descuento</strong> en tu próxima compra con el código <strong style="color: #F21A2B;">TEEXTRAÑO15</strong>.</p>
      </div>
      <p>Nos encantaría que volvieras a explorar lo que tenemos para ti.</p>
      <a href="#" class="button">Volver a Comprar</a>
      <div class="preferences">
         <p>¿Quieres ajustar la frecuencia de nuestros correos? <a href="#" style="color: #F21A2B;">Actualiza tus preferencias</a>.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} [Nombre de tu Marca]. Todos los derechos reservados.</p>
      <p>Si ya no deseas recibir nuestros mensajes, <a href="#" style="color: #F21A2B;">puedes darte de baja aquí</a>.</p>
    </div>
  </div>
</body>
</html>
      `
    }
  ];

  // Estilos inline
  const viewStyle: React.CSSProperties = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '100%',
    margin: '0 auto',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto'
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '30px' // Increased margin
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#666',
    margin: '8px 0 0 0'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '20px', // Slightly larger section titles
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    marginTop: '30px', // Increased top margin for sections
    borderBottom: '1px solid #eee', // Added a light separator
    paddingBottom: '10px'
  };

  const videoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  };

  const videoCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Slightly more pronounced shadow
    overflow: 'hidden',
    transition: 'transform 0.2s ease-in-out',
  };

  const videoIframeWrapperStyle: React.CSSProperties = {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: '0',
    overflow: 'hidden',
  };

  const videoIframeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    border: 'none',
  };

  const videoTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    padding: '15px',
    textAlign: 'center' as const,
    backgroundColor: '#f9f9f9' // Light background for video titles
  };

  // Styles for Email Examples Section
  const emailExamplesGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', // Adjusted minmax for potentially more content
    gap: '20px',
    marginBottom: '30px'
  };

  const emailCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
  };

  const emailTitleStyle: React.CSSProperties = {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#F21A2B', // Brand color for titles
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  };

  const emailIconStyle: React.CSSProperties = {
    marginRight: '10px',
    color: '#F21A2B' // Brand color for icon
  };

  const emailPreviewStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#555',
    marginBottom: '15px',
    lineHeight: '1.6'
  };

  const bestPracticesTitleStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#333',
    marginTop: '10px',
    marginBottom: '8px'
  };

  const bestPracticesListStyle: React.CSSProperties = {
    listStyleType: 'disc',
    paddingLeft: '20px',
    margin: '0',
    fontSize: '14px',
    color: '#444',
  };

  const bestPracticesItemStyle: React.CSSProperties = {
    marginBottom: '6px',
    lineHeight: '1.5'
  };

  const previewButtonStyle: React.CSSProperties = {
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 15px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.2s ease-in-out',
  };

  const handleOpenPreview = (html: string, title: string) => {
    setCurrentHtmlContent(html);
    setCurrentPreviewTitle(title);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    // Optionally clear content when modal closes
    // setCurrentHtmlContent(''); 
    // setCurrentPreviewTitle('');
  };

  return (
    <div style={viewStyle}>
      {/* Header section */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Capacitación y Buenas Prácticas</h1>
        <p style={subtitleStyle}>Material de aprendizaje y ejemplos para mejorar tus campañas de email marketing.</p>
      </div>

      {/* Videos de Capacitación Section */}
      <div> 
        <h2 style={sectionTitleStyle}>Videos de Capacitación</h2>
        <div style={videoGridStyle}>
          {youtubeVideos.map(video => (
            <div 
              key={video.id} 
              style={videoCardStyle}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0px)'}
            >
              <div style={videoIframeWrapperStyle}>
                <iframe
                  style={videoIframeStyle}
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 style={videoTitleStyle}>{video.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Email Marketing Examples Section */}
      <div>
        <h2 style={sectionTitleStyle}>Ejemplos de Email Marketing y Buenas Prácticas</h2>
        <div style={emailExamplesGridStyle}>
          {emailExamples.map(example => (
            <div 
              key={example.id} 
              style={emailCardStyle}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0px)'}
            >
              <h3 style={emailTitleStyle}>
                <FaEnvelopeOpenText style={emailIconStyle} size={20}/> 
                {example.title}
              </h3>
              <p style={emailPreviewStyle}>{example.previewContent}</p>
              <h4 style={bestPracticesTitleStyle}>Buenas Prácticas:</h4>
              <ul style={bestPracticesListStyle}>
                {example.bestPractices.map((practice, index) => (
                  <li key={index} style={bestPracticesItemStyle}>{practice}</li>
                ))}
              </ul>
              <button 
                style={previewButtonStyle}
                onClick={() => handleOpenPreview(example.htmlContent, `Preview: ${example.title}`)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F21A2B'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#555'}
              >
                <FaEye /> Ver Preview HTML
              </button>
            </div>
          ))}
        </div>
      </div>

      <EmailHtmlPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
        htmlContent={currentHtmlContent}
        title={currentPreviewTitle}
      />
    </div>
  );
};

export default TrainingView;
