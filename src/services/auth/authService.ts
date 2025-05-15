import axios from 'axios';

const API_URL = 'http://34.238.122.213:1337';

// Interfaces para tipado
export interface LoginCredentials {
  identifier: string; // Email o username
  password: string;
}

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

export interface AuthResponse {
  jwt: string;
  user: User;
}

// Servicio de autenticación
const authService = {
  // Login de usuario
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/api/auth/local`, 
        credentials
      );
      
      // Guardar token en localStorage (con ambos conjuntos de claves para compatibilidad)
      if (response.data.jwt) {
        // Claves nuevas (alineadas con useUserStore)
        localStorage.setItem('auth_token', response.data.jwt);
        localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        
        // Claves antiguas (para compatibilidad con código existente)
        localStorage.setItem('token', response.data.jwt);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },
  
  // Logout de usuario
  logout: () => {
    // Limpiar claves de autenticación de forma exhaustiva
    localStorage.removeItem('auth_token'); // Nueva clave
    localStorage.removeItem('auth_user');  // Nueva clave
    localStorage.removeItem('token');      // Clave antigua
    localStorage.removeItem('user');       // Clave antigua
    localStorage.removeItem('auth-storage'); // Zustand storage
    
    console.log('Servicio de autenticación: sesión cerrada correctamente');
  },
  
  // Obtener token actual
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  // Registrar un nuevo usuario
  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/api/auth/local/register`, 
        userData
      );
      
      // Guardar token en localStorage (con ambos conjuntos de claves para compatibilidad)
      if (response.data.jwt) {
        // Claves nuevas (alineadas con useUserStore)
        localStorage.setItem('auth_token', response.data.jwt);
        localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        
        // Claves antiguas (para compatibilidad con código existente)
        localStorage.setItem('token', response.data.jwt);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }
};

export default authService;
