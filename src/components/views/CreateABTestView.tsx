import React from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

// Importar estilos
import {
  viewStyle,
  headerStyle,
  titleContainerStyle,
  titleStyle,
  backIconStyle,
  primaryButtonStyle,
  columnsContainerStyle,
  columnStyle,
  columnTitleStyle,
  labelStyle,
  selectStyle,
  designSectionTitleStyle,
  designButtonStyle
} from './viewStyles/CreateABTestView.styles';

// Props para manejar la navegación
interface CreateABTestViewProps {
  onNavigate: (view: string) => void;
}

const CreateABTestView: React.FC<CreateABTestViewProps> = ({ onNavigate }) => {

  // --- JSX --- 
  return (
    <div style={viewStyle}>
      {/* Cabecera */}
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <FaArrowLeft style={backIconStyle} onClick={() => onNavigate('Pruebas A/B')} />
          <h2 style={titleStyle}>Crear pruebas A/B</h2>
        </div>
        <button style={primaryButtonStyle}>Enviar</button>
      </div>

      {/* Formulario Superior */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <label style={labelStyle} htmlFor="ab-title">Título</label>
          <input style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px' }} type="text" id="ab-title" placeholder="Título" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <label style={labelStyle} htmlFor="ab-subject">Asunto</label>
          <input style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px' }} type="text" id="ab-subject" placeholder="Asunto" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <label style={labelStyle} htmlFor="ab-send-time">Hora de envío</label>
          <input style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px' }} type="text" id="ab-send-time" placeholder="DD/MM/AAAA 00:00PM" />
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#555', cursor: 'pointer', marginBottom: '15px' }}>Editar <FaEdit /></div>
          <div style={{ border: '1px dashed #ccc', height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '14px', textAlign: 'center', padding: '10px', borderRadius: '4px' }}>Área de previsualización del correo A</div>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#555', cursor: 'pointer', marginBottom: '15px' }}>Editar <FaEdit /></div>
          <div style={{ border: '1px dashed #ccc', height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '14px', textAlign: 'center', padding: '10px', borderRadius: '4px' }}>Área de previsualización del correo B</div>
        </div>
      </div>

    </div>
  );
};

export default CreateABTestView;
