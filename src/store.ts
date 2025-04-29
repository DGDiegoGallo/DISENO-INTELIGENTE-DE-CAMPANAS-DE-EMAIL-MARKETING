import { create } from 'zustand';

// Exportamos la tienda de autenticación desde su propio archivo
export { useAuthStore } from './store/authStore';

// Esta es una tienda de ejemplo para otras funcionalidades de la app
interface AppState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Puedes agregar más tiendas específicas para diferentes funcionalidades
// Por ejemplo: useProfileStore, useCampaignStore, etc.