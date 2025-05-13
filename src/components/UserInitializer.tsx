import { useEffect } from 'react';
import useUserStore from '../store/useUserStore';

/**
 * Este componente es simplemente un monitor para verificar el estado de autenticación
 * La inicialización real ocurre en el store useUserStore a través de persist middleware
 */
const UserInitializer: React.FC = () => {
  // Obtener estados y acciones del store
  const { isAuthenticated, initialized } = useUserStore();

  // Solo para depuración y registro
  useEffect(() => {
    // Verificar el estado de autenticación actual, sólo para depuración
    const sessionClosed = localStorage.getItem('session_closed') === 'true';
    
    // Solo emitir logs la primera vez
    if (initialized) {
      console.log(`Estado de la sesión: autenticado=${isAuthenticated}, sesionCerrada=${sessionClosed}`);
    }
  }, [isAuthenticated, initialized]);

  // Este componente no renderiza nada
  return null;
};

export default UserInitializer;
