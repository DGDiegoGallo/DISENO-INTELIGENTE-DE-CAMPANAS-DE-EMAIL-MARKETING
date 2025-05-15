import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  /**
   * Si el spinner está visible o no
   */
  isVisible: boolean;
  /**
   * Texto opcional que se muestra debajo del spinner
   */
  text?: string;
}

/**
 * Componente general de animación de carga para toda la aplicación
 * Muestra un spinner centrado con un fondo semitransparente que cubre toda la pantalla
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isVisible, text }) => {
  if (!isVisible) return null;
  
  return (
    <div className="global-loading-overlay">
      <div className="global-loading-container">
        <div className="global-loading-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {text && <p className="global-loading-text">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
