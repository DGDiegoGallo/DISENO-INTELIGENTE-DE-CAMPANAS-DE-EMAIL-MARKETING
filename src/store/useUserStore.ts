import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  nombre?: string;
  apellido?: string;
  sexo?: string;
  edad?: number;
  fechaDeNacimiento?: string;
  pais?: string;
  ciudad?: string;
  domicilio?: string;
  telefono?: string;
  avatar?: string | null;
  rol?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  initialized: boolean;
  login: (userData: { user: User; token: string }) => void;
  logout: () => void;
}

// Función para eliminar datos de sesión del localStorage
const clearStoredData = () => {
  try {
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('user-storage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('state');
    localStorage.setItem('session_closed', 'true');
    sessionStorage.clear();
  } catch (error) {
    console.error('Error al limpiar datos de sesión:', error);
  }
};

// Crear el store con persistencia mejorada
const useUserStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      initialized: false,
      
      login: (userData) => {
        // Al iniciar sesión, limpiar la bandera de sesión cerrada
        localStorage.removeItem('session_closed');
        localStorage.removeItem('userInitializationAttempted');
        
        set({ 
          user: userData.user, 
          token: userData.token, 
          isAuthenticated: true,
          initialized: true
        });
        
        // Guardar también en localStorage directo para compatibilidad
        try {
          localStorage.setItem('token', userData.token);
          localStorage.setItem('user', JSON.stringify(userData.user));
          localStorage.setItem('state', JSON.stringify({
            state: {
              user: userData.user,
              token: userData.token,
              isAuthenticated: true
            },
            version: 0
          }));
        } catch (error) {
          console.error('Error al guardar datos en localStorage:', error);
        }
      },
      
      logout: () => {
        // Borrar datos del store
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          initialized: true
        });
        
        // Borrar datos del localStorage
        clearStoredData();
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
      // Forzar inicialización cuando hay bandera de sesión cerrada
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialized = true;
          
          // Si hay una bandera de sesión cerrada, no restaurar
          if (localStorage.getItem('session_closed') === 'true') {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            console.log('Sesión cerrada. No se restauraron datos.');
          } else if (state.user && state.token) {
            console.log('Datos de sesión restaurados para:', state.user.username);
          }
        }
      }
    }
  )
);

export default useUserStore;
