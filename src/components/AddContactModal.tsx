import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string, group: string) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontSize: '13px',
  color: '#555',
  fontWeight: 'bold',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 5px',
};

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState(''); // Puedes inicializar con un valor por defecto si es necesario

  const handleSubmit = () => {
    // Aquí puedes añadir validación si es necesario
    onSubmit(name, email, group);
    // Limpiar campos y cerrar (opcional, depende de si onSubmit cierra)
    // setName('');
    // setEmail('');
    // setGroup(''); 
    // onClose(); 
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <h3 style={{ marginTop: 0, marginBottom: '25px', textAlign: 'center', color: '#333' }}>Nuevo contacto</h3>
      <div>
        <label style={labelStyle}>Nombre</label>
        <input 
          type="text" 
          placeholder="Nombre" 
          style={inputStyle} 
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
      </div>
      <div>
        <label style={labelStyle}>Correo</label>
        <input 
          type="email" 
          placeholder="ejemplo@gmail.com" 
          style={inputStyle} 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div>
        <label style={labelStyle}>Grupo</label>
        <select 
          style={inputStyle} 
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option value="">Seleccionar</option>
          {/* Cargar opciones de grupo dinámicamente si es necesario */}
          <option value="Grupo 1">Grupo 1</option>
          <option value="Grupo 2">Grupo 2</option>
          <option value="Grupo 3">Grupo 3</option>
        </select>
      </div>
      <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>
        <button 
          style={{...buttonStyle, backgroundColor: 'transparent', border: '1px solid #F21A2B', color: '#F21A2B'}} 
          onClick={onClose}
        >
          Cancelar
        </button>
        <button 
          style={{...buttonStyle, backgroundColor: '#F21A2B', color: 'white'}} 
          onClick={handleSubmit}
        >
          Aceptar
        </button>
      </div>
    </ModalWrapper>
  );
};

export default AddContactModal;
