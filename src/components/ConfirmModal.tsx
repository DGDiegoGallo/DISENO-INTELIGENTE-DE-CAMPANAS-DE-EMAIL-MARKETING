import React from 'react';
import ModalWrapper from './ModalWrapper';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancelar'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    width: '48%',
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', textAlign: 'center', color: '#333' }}>
        {title}
      </h3>
      
      <p style={{ marginBottom: '25px', textAlign: 'center', color: '#555', fontSize: '15px' }}>
        {message}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
        <button 
          style={{...buttonStyle, backgroundColor: 'transparent', border: '1px solid #F21A2B', color: '#F21A2B'}} 
          onClick={onClose}
        >
          {cancelText}
        </button>
        <button 
          style={{...buttonStyle, backgroundColor: '#F21A2B', color: 'white'}} 
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmModal;
