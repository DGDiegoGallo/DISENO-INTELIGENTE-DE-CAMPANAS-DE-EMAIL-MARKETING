import React from 'react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro semitransparente
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050, // Asegura que esté por encima de otros elementos
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '15px', // Bordes redondeados como en la imagen
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  maxWidth: '400px', // Ajustado para modales más pequeños
  width: '90%',
};

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  // Detener la propagación para evitar cerrar el modal al hacer clic dentro
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div style={overlayStyle} onClick={onClose}> {/* Cierra al hacer clic fuera */} 
      <div style={modalContentStyle} onClick={handleContentClick}>
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
