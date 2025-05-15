import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import useLoadingStore from '../../store/useLoadingStore';

/**
 * Componente proveedor global de carga
 * Este componente debe ser incluido una sola vez en el nivel más alto de la aplicación (App.tsx)
 */
const GlobalLoadingProvider: React.FC = () => {
  const { isLoading, loadingText } = useLoadingStore();
  
  return <LoadingSpinner isVisible={isLoading} text={loadingText} />;
};

export default GlobalLoadingProvider;
