import React from 'react';
import ModalWrapper from './ModalWrapper';

interface DeleteContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const warningIconStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#F21A2B', // Rojo
  color: 'white',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 auto 20px auto', // Centrar el icono
};

const textStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '25px',
  color: '#333',
  fontSize: '16px',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  width: '100%',
  backgroundColor: '#F21A2B', // Rojo
  color: 'white',
};

const DeleteContactModal: React.FC<DeleteContactModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div style={warningIconStyle}>
        !
      </div>
      <p style={textStyle}>
        ¿Está seguro de eliminar este contacto?
      </p>
      <button 
        style={buttonStyle} 
        onClick={onConfirm}
      >
        Aceptar
      </button>
    </ModalWrapper>
  );
};

export default DeleteContactModal;
