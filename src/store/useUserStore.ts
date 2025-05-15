import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  email: string;
  nombre?: string;
  apellido?: string;
  avatar?: string | null;
  rol?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: { user: User; token: string }) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

// Función extremadamente simple para recuperar datos del localStorage
const getStoredAuth = () => {
  try {
    const userStr = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    if (userStr && token) {
      const user = JSON.parse(userStr);
      return { user, token, isAuthenticated: true };
    }
  } catch (e) {
    console.error('Error leyendo auth del localStorage:', e);
  }
  return { user: null, token: null, isAuthenticated: false };
};

// Crear el store de autenticación simplificado
const useUserStore = create<AuthState>()((set, get) => ({
  // Estado inicial basado en localStorage
  ...getStoredAuth(),
  
  // Iniciar sesión
  login: (userData) => {
    try {
      console.log('Guardando datos de autenticación para:', userData.user.email);
      
      // Guardar en localStorage usando nuestras nuevas claves
      localStorage.setItem('auth_user', JSON.stringify(userData.user));
      localStorage.setItem('auth_token', userData.token);
      
      // También mantener compatibilidad con el formato auth-storage que usan otras páginas
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: userData.user,
          token: userData.token,
          isAuthenticated: true
        },
        version: 0
      }));
      
      // Para compatibilidad con código existente
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData.user));
      
      // Actualizar el estado
      set({
        user: userData.user,
        token: userData.token,
        isAuthenticated: true
      });
      
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  },
  
  // Cerrar sesión
  logout: () => {
    // Limpiar todas las claves relacionadas con la autenticación
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('Todas las claves de autenticación eliminadas');
    
    // Restablecer estado
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },
  
  // Verificar autenticación (útil para proteger rutas)
  checkAuth: () => {
    const { isAuthenticated } = get();
    
    // Si ya está autenticado en el estado, confiar en eso
    if (isAuthenticated && get().user && get().token) {
      return true;
    }
    
    // De lo contrario, verificar localStorage
    const stored = getStoredAuth();
    if (stored.isAuthenticated) {
      // Actualizar el estado si encontramos datos en localStorage
      set(stored);
      return true;
    }
    
    return false;
  }
}));

export default useUserStore;
