import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// --- Definir Props --- 
interface ABTestingListViewProps {
  onNavigate: (view: string) => void;
}

// --- Datos Placeholder --- 
const tests = [
  { id: 1, name: 'Prueba Verano', contactA: 'Grupo Jóvenes', contactB: 'Grupo Adultos' },
  { id: 2, name: 'Descuento Invierno', contactA: 'Clientes Frecuentes', contactB: 'Nuevos Clientes' },
  { id: 3, name: 'Lanzamiento Producto X', contactA: 'Suscriptores VIP', contactB: 'Suscriptores Generales' },
  { id: 4, name: 'Promoción Flash', contactA: 'Segmento A', contactB: 'Segmento B' },
  { id: 5, name: 'Newsletter Semanal', contactA: 'Interesados Tech', contactB: 'Interesados Marketing' },
];

// --- Componente --- 
// Actualizar la definición para aceptar props
const ABTestingListView: React.FC<ABTestingListViewProps> = ({ onNavigate }) => {

  // --- Estilos --- 
  const viewStyle: React.CSSProperties = {
    padding: '25px',
    backgroundColor: '#f8f9fa', // Fondo gris claro general
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    color: '#333',
    fontSize: '22px',
    fontWeight: 'bold',
  };

  const createButtonStyle: React.CSSProperties = {
    backgroundColor: '#F21A2B', // Rojo
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  };

  const tableContainerStyle: React.CSSProperties = {
    borderRadius: '8px', // Mantener si se quiere redondear la cabecera
    marginBottom: '20px',
  };

  const tableHeaderStyle: React.CSSProperties = {
    display: 'flex',
    backgroundColor: '#282A5B', // Azul oscuro
    color: 'white',
    padding: '12px 15px',
    fontWeight: 'bold',
    fontSize: '14px',
    borderTopLeftRadius: '8px', 
    borderTopRightRadius: '8px',
    marginBottom: '10px', // Espacio entre cabecera y la primera tarjeta de fila
  };

  const tableRowStyle: React.CSSProperties = {
    display: 'flex',
    padding: '12px 15px',
    fontSize: '14px',
    alignItems: 'center',
    backgroundColor: 'white', 
    borderRadius: '6px',
    // Sombra aún más pronunciada
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
    marginBottom: '10px', 
  };

  const tableCellStyle: React.CSSProperties = {
    flex: 1, // Distribución equitativa inicial
    padding: '0 5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const actionsCellStyle: React.CSSProperties = {
    ...tableCellStyle,
    flex: '0 0 150px', // Ancho fijo para acciones
    textAlign: 'right',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  };

  const analysisButtonStyle: React.CSSProperties = {
    backgroundColor: '#F21A2B', // Rojo
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
    marginRight: '10px',
  };

  const iconStyle: React.CSSProperties = {
    cursor: 'pointer',
    color: '#888',
    margin: '0 5px',
    fontSize: '16px',
  };

  const paginationContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: '#777',
  };

  const paginationControlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  };

  const pageButtonStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    padding: '5px 10px',
    margin: '0 2px',
    cursor: 'pointer',
    borderRadius: '3px',
    backgroundColor: 'white',
    fontSize: '12px',
  };

  const activePageButtonStyle: React.CSSProperties = {
    ...pageButtonStyle,
    backgroundColor: '#F21A2B',
    color: 'white',
    borderColor: '#F21A2B',
  };

  const disabledPageButtonStyle: React.CSSProperties = {
    ...pageButtonStyle,
    color: '#ccc',
    cursor: 'default',
  };

  return (
    <div style={viewStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Pruebas A/B</h2>
        {/* Usar onNavigate en el botón Crear */}
        <button 
          style={createButtonStyle} 
          onClick={() => onNavigate('Crear pruebas A/B')}
        >
          Crear
        </button>
      </div>

      <div style={tableContainerStyle}>
        {/* Cabecera */}
        <div style={tableHeaderStyle}>
          <div style={{ ...tableCellStyle, flex: '1.5' }}>Nombre</div>
          <div style={tableCellStyle}>Contacto A</div>
          <div style={tableCellStyle}>Contacto B</div>
          <div style={actionsCellStyle}>Acciones</div>
        </div>
        {/* Filas de datos (cada una es una tarjeta) */}
        {tests.map((test) => (
          <div key={test.id} style={tableRowStyle}> {/* Aplicar estilo de tarjeta aquí */}
            <div style={{ ...tableCellStyle, flex: '1.5' }}>{test.name}</div>
            <div style={tableCellStyle}>{test.contactA}</div>
            <div style={tableCellStyle}>{test.contactB}</div>
            <div style={actionsCellStyle}>
              <button style={analysisButtonStyle}>Análisis</button>
              <FaEdit style={iconStyle} />
              <FaTrashAlt style={iconStyle} />
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div style={paginationContainerStyle}>
        <span>Mostrando 5 de 10 datos</span>
        <div style={paginationControlsStyle}>
          <button style={disabledPageButtonStyle}>&lt;</button>
          <button style={activePageButtonStyle}>1</button>
          <button style={pageButtonStyle}>2</button>
          <button style={pageButtonStyle}>3</button>
          <button style={pageButtonStyle}>4</button>
          <span style={{ margin: '0 5px' }}>...</span>
          <button style={pageButtonStyle}>40</button>
          <button style={pageButtonStyle}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default ABTestingListView;
