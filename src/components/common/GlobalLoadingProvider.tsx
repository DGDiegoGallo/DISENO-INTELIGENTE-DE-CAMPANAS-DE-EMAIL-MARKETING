import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import useLoadingStore from '../../store/useLoadingStore';

/**
 * Componente proveedor global de carga
 * Este componente debe ser incluido una sola vez en el nivel más alto de la aplicación (App.tsx)
 */
const GlobalLoadingProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isLoading, loadingText } = useLoadingStore();
  
  return (
    <>
      {children} {/* Render the actual application content */}
      <LoadingSpinner isVisible={isLoading} text={loadingText} scope="global" />
    </>
  );
};

export default GlobalLoadingProvider;
