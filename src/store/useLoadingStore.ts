import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingText: string;
  startLoading: (text?: string) => void;
  stopLoading: () => void;
}

/**
 * Store global para manejar el estado de carga de la aplicación
 */
const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingText: 'Cargando...',
  
  // Inicia el estado de carga con un texto opcional
  startLoading: (text = 'Cargando...') => set({ isLoading: true, loadingText: text }),
  
  // Detiene el estado de carga
  stopLoading: () => set({ isLoading: false }),
}));

export default useLoadingStore;
