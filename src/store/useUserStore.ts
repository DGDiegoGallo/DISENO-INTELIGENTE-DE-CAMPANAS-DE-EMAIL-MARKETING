import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  nombre: string;
  apellido: string;
  sexo: string;
  edad: number;
  fechaDeNacimiento: string;
  pais: string;
  ciudad: string;
  domicilio: string;
  telefono: string;
  avatar: string | null;
  rol: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (userData: { user: User; token: string }) => void;
  logout: () => void;
  initializeFromLocalStorage: () => void;
}

// Crear el store con persistencia
const useUserStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      login: (userData) => set({ 
        user: userData.user, 
        token: userData.token, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      
      initializeFromLocalStorage: () => {
        try {
          const storedData = localStorage.getItem('state');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.state) {
              const { user, token, isAuthenticated } = parsedData.state;
              set({ user, token, isAuthenticated });
            }
          }
        } catch (error) {
          console.error('Error initializing from localStorage:', error);
        }
      }
    }),
    {
      name: 'user-storage', // nombre para el almacenamiento
    }
  )
);

export default useUserStore;
