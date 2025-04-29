import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const API_URL = 'http://34.238.122.213:1337';

// Interfaces para tipado
export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  identifier: string; // Email o username
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.post(
            `${API_URL}/api/auth/local`, 
            credentials
          );
          
          if (response.data.jwt) {
            set({ 
              user: response.data.user,
              token: response.data.jwt,
              isAuthenticated: true,
              isLoading: false
            });
            
            // Configurar el token para futuras solicitudes
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
          }
        } catch (error) {
          let errorMessage = 'Error al iniciar sesión';
          
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if ((error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message) {
            const errorResponse = error as { response?: { data?: { error?: { message?: string } } } };
            errorMessage = errorResponse.response?.data?.error?.message || errorMessage;
          }
          
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.post(
            `${API_URL}/api/auth/local/register`, 
            userData
          );
          
          if (response.data.jwt) {
            set({ 
              user: response.data.user,
              token: response.data.jwt,
              isAuthenticated: true,
              isLoading: false
            });
            
            // Configurar el token para futuras solicitudes
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
          }
        } catch (error) {
          let errorMessage = 'Error al registrar usuario';
          
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if ((error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message) {
            const errorResponse = error as { response?: { data?: { error?: { message?: string } } } };
            errorMessage = errorResponse.response?.data?.error?.message || errorMessage;
          }
          
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        // Eliminar el token de las cabeceras
        delete axios.defaults.headers.common['Authorization'];
        
        set({ 
          user: null,
          token: null,
          isAuthenticated: false
        });
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // nombre único para el almacenamiento
      storage: createJSONStorage(() => localStorage), // usar localStorage
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }), // solo persistir estos campos
    }
  )
);

// Configurar axios con el token al iniciar la aplicación
const { token } = useAuthStore.getState();
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default useAuthStore;
