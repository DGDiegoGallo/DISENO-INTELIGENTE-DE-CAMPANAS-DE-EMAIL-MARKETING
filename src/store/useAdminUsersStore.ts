import { create } from 'zustand';
import adminService from '../services/adminService';
import { StrapiUser } from '../interfaces/user';

// Define the API response type for projects with users
interface ProjectWithUser {
  id?: number;
  attributes?: {
    usuario?: {
      data?: {
        id?: number;
        attributes?: StrapiUser;
      };
    };
  };
  usuario?: StrapiUser | { id: number };
  [key: string]: unknown;
}

interface StrapiResponse<T> {
  data?: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface AdminUsersState {
  users: StrapiUser[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedRole: string;
  currentPage: number;
  pageSize: number;
  totalUsers: number;
  // Actions
  loadUsers: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSelectedRole: (role: string) => void;
  setCurrentPage: (page: number) => void;
  deleteUser: (userId: number) => Promise<boolean>;
  getFilteredUsers: () => StrapiUser[];
}

const useAdminUsersStore = create<AdminUsersState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedRole: 'all',
  currentPage: 1,
  pageSize: 10,
  totalUsers: 0,

  loadUsers: async () => {
    set({ loading: true, error: null });
    try {
      // First try to get users directly from /api/users
      let usersData: StrapiUser[] = [];
      
      try {
        const directResponse = await adminService.getUsersDirectly(1, 100);
        if (directResponse && Array.isArray(directResponse)) {
          usersData = directResponse;
        }
      } catch (directError) {
        console.warn('Could not get users directly, trying proyecto-56s endpoint:', directError);
      }
      
      // If no users from direct endpoint, try from proyecto-56s
      if (usersData.length === 0) {
        try {
          const response = await adminService.getAllUsers(1, 100) as unknown as StrapiResponse<ProjectWithUser> | StrapiUser[];
          
          if (Array.isArray(response)) {
            // If response is already an array of users
            usersData = response;
          } else if (response?.data) {
            // If response has a data array (Strapi v4 format)
            const projects = response.data;
            const uniqueUsers = new Map<number, StrapiUser>();
            
            projects.forEach((project) => {
              if (!project) return;
              
              // Helper function to safely access user data
              const getUserData = (): Partial<StrapiUser> | null => {
                // Check for Strapi v5 format
                if (project.attributes?.usuario?.data?.attributes) {
                  return project.attributes.usuario.data.attributes as Partial<StrapiUser>;
                }
                // Check for direct user object
                if (project.usuario && typeof project.usuario === 'object' && 'id' in project.usuario) {
                  return project.usuario as Partial<StrapiUser>;
                }
                return null;
              };
              
              const userData = getUserData();
              if (!userData) return;
              
              // Extract user ID safely
              let userId: number | undefined;
              if ('id' in userData && userData.id) {
                userId = Number(userData.id);
              } else if (project.attributes?.usuario?.data?.id) {
                userId = Number(project.attributes.usuario.data.id);
              }
              
              if (!userId || uniqueUsers.has(userId)) return;
              
              // Safely extract user properties with fallbacks
              const username = 'username' in userData ? String(userData.username || '') : '';
              const email = 'email' in userData ? String(userData.email || '') : '';
              const provider = 'provider' in userData ? String(userData.provider || 'local') : 'local';
              
              const confirmed = 'confirmed' in userData 
                ? typeof userData.confirmed === 'boolean' 
                  ? userData.confirmed 
                  : String(userData.confirmed) === 'true'
                : false;
                
              const blocked = 'blocked' in userData
                ? typeof userData.blocked === 'boolean'
                  ? userData.blocked
                  : String(userData.blocked) === 'true'
                : false;
                
              const createdAt = 'createdAt' in userData ? String(userData.createdAt || '') : '';
              const updatedAt = 'updatedAt' in userData ? String(userData.updatedAt || '') : '';
              const nombre = 'nombre' in userData ? String(userData.nombre || '') : '';
              const apellido = 'apellido' in userData ? String(userData.apellido || '') : '';
              
              // Handle role extraction
              let rol = 'user';
              if ('rol' in userData && userData.rol) {
                rol = String(userData.rol);
              } else if ('role' in userData && userData.role) {
                const role = userData.role;
                if (typeof role === 'object' && role !== null) {
                  if ('type' in role && role.type) {
                    rol = String(role.type);
                  } else if ('name' in role && role.name) {
                    rol = String(role.name);
                  }
                }
              }
              
              uniqueUsers.set(userId, {
                id: userId,
                username,
                email,
                provider,
                confirmed,
                blocked,
                createdAt,
                updatedAt,
                nombre,
                apellido,
                rol
              });
            });
            
            usersData = Array.from(uniqueUsers.values());
          }
        } catch (error) {
          console.error('Error loading users from proyecto-56s:', error);
          throw new Error('No se pudieron cargar los usuarios. Por favor, intente nuevamente.');
        }
      }

      set({
        users: usersData,
        totalUsers: usersData.length,
        loading: false
      });
    } catch (error) {
      console.error('Error loading users:', error);
      set({
        error: 'Error loading user data.',
        users: [],
        loading: false
      });
    }
  },

  setSearchTerm: (term: string) => set({ searchTerm: term, currentPage: 1 }),
  
  setSelectedRole: (role: string) => set({ selectedRole: role, currentPage: 1 }),
  
  setCurrentPage: (page: number) => set({ currentPage: page }),
  
  deleteUser: async (userId: number) => {
    try {
      await adminService.deleteUser(userId);
      set(state => ({
        users: state.users.filter(user => user.id !== userId),
        totalUsers: state.totalUsers - 1
      }));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },
  
  getFilteredUsers: () => {
    const { users, searchTerm, selectedRole } = get();
    
    return users.filter(user => {
      // Filter by search term (username, email, or full name)
      const matchesSearch = 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.nombre || ''} ${user.apellido || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by role
      const matchesRole = 
        selectedRole === 'all' || 
        (selectedRole === 'admin' && user.rol === 'admin') ||
        (selectedRole === 'user' && user.rol !== 'admin');
      
      return matchesSearch && matchesRole;
    });
  }
}));

export default useAdminUsersStore;
