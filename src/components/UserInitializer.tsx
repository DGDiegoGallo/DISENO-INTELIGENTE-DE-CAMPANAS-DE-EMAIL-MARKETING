import { useEffect } from 'react';
import useUserStore from '../store/useUserStore';
// Import the utility to initialize user data
import '../utils/initializeUserData';

// Componente para inicializar los datos del usuario desde localStorage
const UserInitializer: React.FC = () => {
  const { login, isAuthenticated } = useUserStore();

  useEffect(() => {
    // Solo inicializar si no está autenticado
    if (!isAuthenticated) {
      try {
        // Intentar obtener los datos del usuario desde localStorage
        const storedData = localStorage.getItem('state');
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          if (parsedData.state && parsedData.state.user && parsedData.state.token) {
            // Iniciar sesión con los datos del localStorage
            login({
              user: parsedData.state.user,
              token: parsedData.state.token
            });
            
            console.log('Usuario inicializado desde localStorage:', parsedData.state.user.username);
          }
        }
      } catch (error) {
        console.error('Error al inicializar usuario desde localStorage:', error);
      }
    }
  }, [isAuthenticated, login]);

  // Este componente no renderiza nada
  return null;
};

export default UserInitializer;
