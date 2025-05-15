import React from 'react';
import useLoadingStore from '../../store/useLoadingStore';

/**
 * Componente de ejemplo que muestra cómo usar el sistema global de carga
 */
const GlobalLoadingExample: React.FC = () => {
  const startLoading = useLoadingStore(state => state.startLoading);
  const stopLoading = useLoadingStore(state => state.stopLoading);
  
  // Función de ejemplo para mostrar cómo activar el indicador de carga
  const handleSimulateLoading = () => {
    // Iniciar carga con un mensaje personalizado
    startLoading('Procesando datos...');
    
    // Simular una operación que toma 3 segundos
    setTimeout(() => {
      // Detener la carga cuando la operación finaliza
      stopLoading();
      alert('¡Operación completada!');
    }, 3000);
  };
  
  return (
    <div className="mt-4 p-3 bg-light rounded">
      <h4>Ejemplo de uso del sistema global de carga</h4>
      <p>
        Este componente muestra cómo puedes activar y desactivar el indicador de carga global
        desde cualquier parte de la aplicación.
      </p>
      
      <button 
        className="btn btn-primary"
        onClick={handleSimulateLoading}
      >
        Simular carga (3 segundos)
      </button>
      
      <div className="mt-3">
        <h5>Instrucciones:</h5>
        <ol>
          <li>Importa el store: <code>import useLoadingStore from '../store/useLoadingStore';</code></li>
          <li>Usa el hook: <code>const {'{startLoading, stopLoading}'} = useLoadingStore();</code></li>
          <li>Activa la carga: <code>startLoading('Mensaje opcional');</code></li>
          <li>Desactiva cuando termines: <code>stopLoading();</code></li>
        </ol>
      </div>
    </div>
  );
};

export default GlobalLoadingExample;
