import React, { useState } from 'react';
import { FaPlayCircle, FaSearch } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';

const RecommendationView: React.FC = () => {
  // Estados para el campo de búsqueda y carga
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Datos de ejemplo para las tarjetas de recomendación
  const recommendationCards = [
    { 
      id: 1, 
      title: 'Venta', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...' 
    },
    { 
      id: 2, 
      title: 'Capacitación', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...' 
    },
    { 
      id: 3, 
      title: 'Servicio', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...' 
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

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 20px 0',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px'
  };

  const searchSectionStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap'
  };

  const searchContainerStyle: React.CSSProperties = {
    position: 'relative',
    flex: '1 1 300px'
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 15px 12px 40px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#aaa'
  };

  const selectContainerStyle: React.CSSProperties = {
    flex: '0 0 200px'
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '12px',
    color: '#666'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#F21A2B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 25px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
    flex: '0 0 auto'
  };

  const cardsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  };

  const cardStyle: React.CSSProperties = {
    flex: '1 1 300px',
    maxWidth: '400px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column'
  };

  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px'
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px'
  };

  const cardDescriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.4'
  };

  const viewButtonStyle: React.CSSProperties = {
    backgroundColor: '#F21A2B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    marginTop: 'auto'
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Búsqueda con:', searchQuery, selectedOption);
    
    // Simulamos una carga de búsqueda
    setIsLoading(true);
    setHasSearched(false);
    
    // Simulamos una demora en la búsqueda
    setTimeout(() => {
      setIsLoading(false);
      setHasSearched(true);
      // Aquí iría la lógica real de búsqueda
    }, 1500);
  };

  return (
    <div style={viewStyle}>
      {/* Título principal */}
      <h1 style={titleStyle}>Recomendación de campañas</h1>

      {/* Sección de búsqueda */}
      <form onSubmit={handleSearch} style={searchSectionStyle}>
        {/* Campo de búsqueda */}
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

        {/* Selector de opciones */}
        <div style={selectContainerStyle}>
          <select 
            style={selectStyle}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="" disabled>Seleccionar</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        </div>

        {/* Botón de búsqueda */}
        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner size="small" color="white" /> Buscando...
            </>
          ) : (
            'Buscar'
          )}
        </button>
      </form>

      {/* Mensaje de resultados de búsqueda */}
      {hasSearched && (
        <div style={{ marginBottom: '20px', padding: '10px 15px', backgroundColor: '#f9f9f9', borderRadius: '4px', fontSize: '14px', color: '#333' }}>
          <p style={{ margin: 0 }}>
            Se encontraron <strong>{recommendationCards.length}</strong> resultados para 
            <strong>"{searchQuery}"</strong> {selectedOption && <span>en <strong>{selectedOption}</strong></span>}
          </p>
        </div>
      )}

      {/* Contenedor de tarjetas de recomendación */}
      <div style={cardsContainerStyle}>
        {isLoading ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <LoadingSpinner size="large" color="primary" text="Buscando recomendaciones..." />
          </div>
        ) : (
          recommendationCards.map(card => (
            <div key={card.id} style={cardStyle}>
              <div style={iconContainerStyle}>
                <FaPlayCircle size={80} color="#F21A2B" />
              </div>
              <h2 style={cardTitleStyle}>{card.title}</h2>
              <p style={cardDescriptionStyle}>{card.description}</p>
              <button style={viewButtonStyle}>Ver</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendationView;
