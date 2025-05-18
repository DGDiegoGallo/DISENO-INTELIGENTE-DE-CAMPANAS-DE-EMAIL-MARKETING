import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { StrapiUser, RegisterUserData } from '../interfaces/user';
import { API_URL } from '../config/api';

// Credenciales para inicio de sesión
export interface LoginCredentials {
  identifier: string; // Email o username
  password: string;
}

interface AuthState {
  user: StrapiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registrationStep: number; // Para manejar el proceso de registro en múltiples pasos
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setRegistrationStep: (step: number) => void;
  updateProfile: (profileData: Partial<StrapiUser>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registrationStep: 1, // Iniciar en el paso 1 del registro
      
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
            // axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
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
      
      register: async (userData: RegisterUserData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Extraer solo los campos básicos requeridos por Strapi para registro
          const registrationData = {
            username: userData.username,
            email: userData.email,
            password: userData.password,
          };
          
          const response = await axios.post(
            `${API_URL}/api/auth/local/register`, 
            registrationData
          );
          
          if (response.data.jwt) {
            // No guardar token ni establecer autenticación para que el usuario tenga que iniciar sesión
            set({ 
              isLoading: false 
            });
            
            // Si hay campos adicionales del perfil, actualizarlos
            const profileData: Partial<StrapiUser> = {};
            const user = response.data.user;
            
            // Añadir solo los campos que están presentes en los datos enviados
            if (userData.nombre) profileData.nombre = userData.nombre;
            if (userData.apellido) profileData.apellido = userData.apellido;
            if (userData.sexo) profileData.sexo = userData.sexo;
            if (userData.edad) profileData.edad = userData.edad;
            if (userData.fechaDeNacimiento) profileData.fechaDeNacimiento = userData.fechaDeNacimiento;
            if (userData.pais) profileData.pais = userData.pais;
            if (userData.ciudad) profileData.ciudad = userData.ciudad;
            if (userData.domicilio) profileData.domicilio = userData.domicilio;
            if (userData.telefono) profileData.telefono = userData.telefono;
            if (userData.avatar) profileData.avatar = userData.avatar;
            
            // Si hay campos adicionales para actualizar, enviar solicitud
            if (Object.keys(profileData).length > 0) {
              await axios.put(
                `${API_URL}/api/users/${user.id}`,
                profileData,
                {
                  headers: {
                    Authorization: `Bearer ${response.data.jwt}`
                  }
                }
              );
            }
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
        // Borrar token y usuario
        localStorage.removeItem('token');
        // Limpiar el token de los headers de Axios
        // delete axios.defaults.headers.common['Authorization'];
        
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          registrationStep: 1, // Reiniciar el paso de registro
        });
      },
      
      clearError: () => set({ error: null }),
      
      // Nuevo método para manejar los pasos del registro
      setRegistrationStep: (step: number) => set({ registrationStep: step }),
      
      // Método para actualizar el perfil del usuario
      updateProfile: async (profileData: Partial<StrapiUser>) => {
        const { user, token } = useAuthStore.getState();
        
        if (!user || !token) {
          set({ error: 'Usuario no autenticado' });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.put(
            `${API_URL}/api/users/${user.id}`,
            profileData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          // Actualizar los datos del usuario en el estado
          set({
            user: { ...user, ...response.data },
            isLoading: false
          });
        } catch (error) {
          let errorMessage = 'Error al actualizar el perfil';
          
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if ((error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message) {
            const errorResponse = error as { response?: { data?: { error?: { message?: string } } } };
            errorMessage = errorResponse.response?.data?.error?.message || errorMessage;
          }
          
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      }
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
/*
const { token } = useAuthStore.getState();
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
*/

export default useAuthStore;
