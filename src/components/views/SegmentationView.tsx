import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const SegmentationView: React.FC = () => {
  // Datos de ejemplo para la tabla de historial
  const historialData = [
    { id: 1, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
    { id: 2, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
    { id: 3, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' }
  ];

  // Estilos
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

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '30px 0 15px 0'
  };

  const tableContainerStyle: React.CSSProperties = {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '30px'
  };

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: '#282A5B',
    color: 'white',
    padding: '15px 20px'
  };

  const tableHeaderCellStyle: React.CSSProperties = {
    padding: '10px 15px',
    textAlign: 'left',
    fontWeight: 'normal'
  };

  const tableRowStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderBottom: '1px solid #f0f0f0'
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '15px 20px',
    borderBottom: '1px solid #f0f0f0'
  };

  const actionIconStyle: React.CSSProperties = {
    cursor: 'pointer',
    margin: '0 10px',
    color: '#666'
  };

  const recommendationsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px'
  };

  const recommendationBoxStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px'
  };

  const placeholderImageStyle: React.CSSProperties = {
    width: '150px',
    height: '150px',
    backgroundColor: '#f0f0f0',
    backgroundImage: 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0), linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0)',
    backgroundSize: '30px 30px',
    backgroundPosition: '0 0, 15px 15px',
    flexShrink: 0
  };

  const recommendationTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6'
  };

  return (
    <div style={viewStyle}>
      <h1 style={titleStyle}>Segmentación de campañas</h1>

      {/* Sección de Historial */}
      <h2 style={sectionTitleStyle}>Historial</h2>
      <div style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={tableHeaderStyle}>
            <tr>
              <th style={tableHeaderCellStyle}>Fecha</th>
              <th style={tableHeaderCellStyle}>Detalles</th>
              <th style={tableHeaderCellStyle}>Análisis</th>
              <th style={tableHeaderCellStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historialData.map(item => (
              <tr key={item.id} style={tableRowStyle}>
                <td style={tableCellStyle}>{item.fecha}</td>
                <td style={tableCellStyle}>{item.detalles}</td>
                <td style={tableCellStyle}>{item.analisis}</td>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FaEdit style={actionIconStyle} />
                    <FaTrash style={actionIconStyle} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de Recomendaciones */}
      <h2 style={sectionTitleStyle}>Recomendaciones</h2>
      <div style={recommendationsContainerStyle}>
        {/* Primera recomendación */}
        <div style={recommendationBoxStyle}>
          <div style={placeholderImageStyle}></div>
          <div>
            <p style={recommendationTextStyle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar venenatis metus, aliquet sollicitudin elit mattis in. Etiam a nisi nec nisi mollis aliquam eget vel nibh. Phasellus gravida elementum tellus, eu pharetra metus tristique at. Vivamus eleifend erat non magna ultrices faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        {/* Segunda recomendación */}
        <div style={recommendationBoxStyle}>
          <div>
            <p style={recommendationTextStyle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar venenatis metus, aliquet sollicitudin elit mattis in. Etiam a nisi nec nisi mollis aliquam eget vel nibh. Phasellus gravida elementum tellus, eu pharetra metus tristique at. Vivamus eleifend erat non magna ultrices faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div style={placeholderImageStyle}></div>
        </div>
      </div>
    </div>
  );
};

export default SegmentationView;
