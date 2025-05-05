import React from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

// Props para manejar la navegación
interface CreateABTestViewProps {
  onNavigate: (view: string) => void;
}

const CreateABTestView: React.FC<CreateABTestViewProps> = ({ onNavigate }) => {

  // --- Estilos --- (Simplificados para brevedad, se pueden refinar)
  const viewStyle: React.CSSProperties = {
    padding: '25px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  };

  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
  };

  const backIconStyle: React.CSSProperties = {
    cursor: 'pointer',
    fontSize: '20px',
  };

  const sendButtonStyle: React.CSSProperties = {
    backgroundColor: '#F21A2B',
    color: 'white',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  };

  const formRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  };

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1, // Ocupa espacio disponible
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: '5px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#555',
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  };

  const columnsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '30px',
    marginTop: '30px',
  };

  const columnStyle: React.CSSProperties = {
    flex: 1,
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  const columnTitleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '20px',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    width: '100%',
    marginBottom: '20px',
  };

  const designSectionTitleStyle: React.CSSProperties = {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '10px',
  };

  const designButtonStyle: React.CSSProperties = {
    backgroundColor: '#F21A2B',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    width: '100%',
    marginBottom: '15px',
  };

  const editSectionStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '5px',
    fontSize: '13px',
    color: '#555',
    cursor: 'pointer',
    marginBottom: '15px',
  };

  const previewPlaceholderStyle: React.CSSProperties = {
    border: '1px dashed #ccc',
    height: '200px', // Altura de ejemplo
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: '14px',
    textAlign: 'center',
    padding: '10px',
    borderRadius: '4px',
  };

  // --- JSX --- 
  return (
    <div style={viewStyle}>
      {/* Cabecera */}
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <FaArrowLeft style={backIconStyle} onClick={() => onNavigate('Pruebas A/B')} />
          <h2 style={titleStyle}>Crear pruebas A/B</h2>
        </div>
        <button style={sendButtonStyle}>Enviar</button>
      </div>

      {/* Formulario Superior */}
      <div style={formRowStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="ab-title">Título</label>
          <input style={inputStyle} type="text" id="ab-title" placeholder="Título" />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="ab-subject">Asunto</label>
          <input style={inputStyle} type="text" id="ab-subject" placeholder="Asunto" />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="ab-send-time">Hora de envío</label>
          <input style={inputStyle} type="text" id="ab-send-time" placeholder="DD/MM/AAAA 00:00PM" />
        </div>
      </div>

      {/* Columnas Grupo A y Grupo B */}
      <div style={columnsContainerStyle}>
        {/* Columna Grupo A */}
        <div style={columnStyle}>
          <h3 style={columnTitleStyle}>Grupo A</h3>
          <label style={labelStyle} htmlFor="group-a-contacts">Contactos</label>
          <select style={selectStyle} id="group-a-contacts">
            <option value="">Seleccionar</option>
            {/* Opciones de grupos de contacto aquí */}
          </select>
          <h4 style={designSectionTitleStyle}>Diseña el contenido de tu correo electrónico</h4>
          <button style={designButtonStyle}>Diseñar contenido</button>
          <div style={editSectionStyle}>Editar <FaEdit /></div>
          <div style={previewPlaceholderStyle}>Área de previsualización del correo A</div>
        </div>

        {/* Columna Grupo B */}
        <div style={columnStyle}>
          <h3 style={columnTitleStyle}>Grupo B</h3>
          <label style={labelStyle} htmlFor="group-b-contacts">Contactos</label>
          <select style={selectStyle} id="group-b-contacts">
            <option value="">Seleccionar</option>
            {/* Opciones de grupos de contacto aquí */}
          </select>
          <h4 style={designSectionTitleStyle}>Diseña el contenido de tu correo electrónico</h4>
          <button style={designButtonStyle}>Diseñar contenido</button>
          <div style={editSectionStyle}>Editar <FaEdit /></div>
          <div style={previewPlaceholderStyle}>Área de previsualización del correo B</div>
        </div>
      </div>

    </div>
  );
};

export default CreateABTestView;
