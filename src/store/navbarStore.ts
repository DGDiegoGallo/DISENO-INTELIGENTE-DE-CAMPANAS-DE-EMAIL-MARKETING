import { create } from 'zustand';

// Define la interfaz para el estado del Navbar
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NavbarState {
  // Interfaz para el estado del Navbar. Se llenará más adelante.
  // Ejemplo: podrías tener un estado para saber si el menú de usuario está abierto
  // isUserMenuOpen: boolean;
  // toggleUserMenu: () => void;
  // Agrega aquí más estados y acciones relacionados con el Navbar
}

// Crea el store
export const useNavbarStore = create<NavbarState>((_set) => ({
  // Estado inicial
  // isUserMenuOpen: false,
  // Acciones
  // toggleUserMenu: () => set((state) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
}));

// Puedes exportar acciones individuales si lo prefieres
// export const { toggleUserMenu } = useNavbarStore.getState(); 