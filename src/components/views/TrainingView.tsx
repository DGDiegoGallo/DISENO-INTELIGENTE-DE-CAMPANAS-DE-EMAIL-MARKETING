import React, { useState } from 'react';
import { FaList, FaPlayCircle, FaSearch } from 'react-icons/fa';

const TrainingView: React.FC = () => {
  // Estado para el campo de búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // Datos de ejemplo para los tutoriales recientes
  const recentTutorials = [
    { id: 1, title: 'Título del tutorial', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 2, title: 'Título del tutorial', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 3, title: 'Título del tutorial', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 4, title: 'Título del tutorial', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
  ];

  // Datos de ejemplo para las guías populares
  const popularGuides = [
    { id: 1, name: 'Nombre de la guía' },
    { id: 2, name: 'Nombre de la guía' },
    { id: 3, name: 'Nombre de la guía' },
    { id: 4, name: 'Nombre de la guía' }
  ];

  // Estilos inline
  const viewStyle: React.CSSProperties = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '100%',
    margin: '0 auto',
    maxHeight: 'calc(100vh - 120px)', // Limit height relative to viewport
    overflowY: 'auto' // Add vertical scroll if content overflows
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '20px'
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

  const searchContainerStyle: React.CSSProperties = {
    position: 'relative',
    marginTop: '20px',
    marginBottom: '30px'
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 15px 12px 40px',
    borderRadius: '24px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#aaa'
  };

  const categoriesContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  };

  const categoryCardStyle: React.CSSProperties = {
    flex: '1 1 200px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s',
    minHeight: '150px',
    marginBottom: '30px'
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#F21A2B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    marginTop: '10px'
  };

  const tutorialCardsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '30px'
  };

  const tutorialCardStyle: React.CSSProperties = {
    flex: '1 1 230px',
    minWidth: '230px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  };

  const tutorialIconContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 10px 10px 10px',
  };

  const tutorialContentStyle: React.CSSProperties = {
    padding: '0px 15px 15px 15px'
  };

  const tutorialTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px'
  };

  const tutorialDescStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px'
  };

  const readMoreButtonStyle: React.CSSProperties = {
    backgroundColor: '#F21A2B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 15px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold'
  };

  const guideCardStyle: React.CSSProperties = {
    flex: '1 1 250px',
    minWidth: '250px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const guideIconContainerStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    marginBottom: '15px'
  };

  const guideNameStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
    textAlign: 'center'
  };

  const downloadButtonStyle: React.CSSProperties = {
    backgroundColor: '#F21A2B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 15px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold'
  };

  return (
    <div style={viewStyle}>
      {/* Header section */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Capacitación</h1>
        <p style={subtitleStyle}>Aquí te proporcionamos material de aprendizaje.</p>
      </div>

      {/* Search bar */}
      <div style={searchContainerStyle}>
        <FaSearch style={searchIconStyle} />
        <input
          type="text"
          placeholder="Busca un puesto de trabajo"
          style={searchInputStyle}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories section */}
      <div style={categoriesContainerStyle}>
        {/* Interactive Guides Category */}
        <div style={categoryCardStyle}>
          <div style={iconContainerStyle}>
            <FaList size={30} color="white" />
          </div>
          <h3>Guías interactivas</h3>
        </div>

        {/* Tutorials Category */}
        <div style={categoryCardStyle}>
          <div style={iconContainerStyle}>
            <FaPlayCircle size={30} color="white" />
          </div>
          <h3>Tutoriales</h3>
        </div>
      </div>

      {/* Recent Tutorials Section */}
      <h2 style={sectionTitleStyle}>Últimos tutoriales añadidos</h2>
      <div style={tutorialCardsContainerStyle}>
        {recentTutorials.map(tutorial => (
          <div key={tutorial.id} style={tutorialCardStyle}>
            <div style={tutorialIconContainerStyle}>
              <FaPlayCircle size={70} color="#F21A2B" />
            </div>
            <div style={tutorialContentStyle}>
              <h3 style={tutorialTitleStyle}>{tutorial.title}</h3>
              <p style={tutorialDescStyle}>{tutorial.description}</p>
              <button style={readMoreButtonStyle}>Leer más</button>
            </div>
          </div>
        ))}
      </div>

      {/* Popular Guides Section */}
      <h2 style={sectionTitleStyle}>Guías populares</h2>
      <div style={tutorialCardsContainerStyle}>
        {popularGuides.map(guide => (
          <div key={guide.id} style={guideCardStyle}>
            <div style={guideIconContainerStyle}>
              <FaList size={50} color="#F21A2B" />
            </div>
            <h3 style={guideNameStyle}>{guide.name}</h3>
            <button style={downloadButtonStyle}>Descargar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingView;
