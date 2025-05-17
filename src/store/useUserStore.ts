import { create } from 'zustand';
import { StrapiUser } from '@/interfaces/user';

interface AuthState {
  user: StrapiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: { user: StrapiUser; token: string }) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
  setTemporaryUserAvatar: (userId: number, avatarDataUrl: string) => void;
  getEffectiveAvatar: (user: StrapiUser | null) => string | undefined;
}

// Función extremadamente simple para recuperar datos del localStorage
const getTemporaryAvatar = (userId: number | string): string | null => {
  if (!userId) return null;
  return localStorage.getItem(`temp_profile_avatar_user_${userId}`);
};

const getStoredAuth = () => {
  try {
    const userStr = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    if (userStr && token) {
      let user = JSON.parse(userStr) as StrapiUser;
      if (user && user.id) {
        const tempAvatar = getTemporaryAvatar(user.id);
        if (tempAvatar) {
          user = { ...user, avatar: tempAvatar };
        }
      }
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
    const initialUser = userData.user;
    const tempAvatar = getTemporaryAvatar(initialUser.id);
    const userToStore: StrapiUser = tempAvatar 
      ? { ...initialUser, avatar: tempAvatar } 
      : { ...initialUser };

    try {
      console.log('Guardando datos de autenticación para:', userToStore.email);
      
      // Guardar en localStorage usando nuestras nuevas claves
      localStorage.setItem('auth_user', JSON.stringify(userToStore));
      localStorage.setItem('auth_token', userData.token);
      
      // También mantener compatibilidad con el formato auth-storage que usan otras páginas
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: userToStore,
          token: userData.token,
          isAuthenticated: true
        },
        version: 0
      }));
      
      // Para compatibilidad con código existente
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userToStore)); // Use userToStore here as well
      
      // Actualizar el estado
      set({
        user: userToStore,
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
    // Limpiar todo el localStorage
    localStorage.clear();
    
    console.log('LocalStorage completamente limpiado al cerrar sesión.');
    
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
      // The stored object already includes the temp avatar if present due to modification in getStoredAuth
      set(stored);
      return true;
    }
    
    return false;
  },

  setTemporaryUserAvatar: (userId, avatarDataUrl) => {
    if (!userId) return;
    localStorage.setItem(`temp_profile_avatar_user_${userId}`, avatarDataUrl);
    set((state) => {
      if (state.user && state.user.id === userId) {
        return { user: { ...state.user, avatar: avatarDataUrl } };
      }
      return {}; // No change if user doesn't match or doesn't exist
    });
  },

  getEffectiveAvatar: (currentUser) => {
    if (!currentUser || !currentUser.id) return undefined;
    const tempAvatar = getTemporaryAvatar(currentUser.id);
    return tempAvatar || currentUser.avatar;
  }
}));

export default useUserStore;
