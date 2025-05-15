import strapiService from './strapiService';

/**
 * Servicio para funciones administrativas
 */
const adminService = {
  /**
   * Obtiene todos los usuarios relacionados con el proyecto-56s
   * @param page Número de página
   * @param pageSize Tamaño de página
   */
  getAllUsers: async (page = 1, pageSize = 25): Promise<unknown> => {
    try {
      const queryParams: Record<string, string | number> = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'populate': 'usuario'
      };
      
      // Utilizamos la colección proyecto-56s con populate=usuario
      const response = await strapiService.getCollection('proyecto-56s', queryParams);
      console.log('Respuesta de proyecto-56s:', response);
      return response;
    } catch (error) {
      console.error('Error al obtener usuarios del proyecto:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los usuarios directamente de la API de Strapi
   * @param page Número de página
   * @param pageSize Tamaño de página
   */
  getUsersDirectly: async (page = 1, pageSize = 100) => {
    try {
      const queryParams: Record<string, string | number> = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize
      };
      
      // Llamada directa al endpoint de usuarios
      const response = await strapiService.getCollection('users', queryParams);
      console.log('Respuesta directa de usuarios:', response);
      return response;
    } catch (error) {
      console.error('Error al obtener usuarios directamente:', error);
      throw error;
    }
  },

  /**
   * Extrae usuarios únicos de los proyectos
   * @param proyectosData Datos de proyectos con usuarios
   */
  extractUsersFromProjects: (proyectosData: Record<string, any>[]) => {
    const uniqueUsers = new Map<number, Record<string, any>>();
    
    proyectosData.forEach(proyecto => {
      if (proyecto && proyecto.usuario) {
        const userData = proyecto.usuario as Record<string, any>;
        if (userData && userData.id) {
          // Solo agregar si no existe ya (prevenir duplicados)
          if (!uniqueUsers.has(userData.id)) {
            uniqueUsers.set(userData.id, userData);
          }
        }
      }
    });
    
    return Array.from(uniqueUsers.values());
  },

  /**
   * Obtiene todas las campañas del sistema
   * @param page Número de página
   * @param pageSize Tamaño de página
   */
  getAllCampaigns: async (page = 1, pageSize = 25) => {
    try {
      const queryParams: Record<string, string | number> = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'populate': 'usuario',
      };
      
      return await strapiService.getCollection('proyecto-56s', queryParams);
    } catch (error) {
      console.error('Error al obtener campañas:', error);
      throw error;
    }
  },

  /**
   * Elimina un usuario del sistema
   * @param id ID del usuario a eliminar
   */
  deleteUser: async (id: number) => {
    try {
      console.log(`Intentando eliminar usuario con ID ${id}`);
      // Verificamos primero que el usuario existe
      const user = await strapiService.getById('users', id);
      if (!user) {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }
      return await strapiService.delete('users', id);
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario a obtener
   */
  getUserById: async (id: number) => {
    try {
      return await strapiService.getById('users', id);
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Bloquea/desbloquea un usuario
   * @param id ID del usuario
   * @param blocked Estado de bloqueo (true/false)
   */
  updateUserBlockStatus: async (id: number, blocked: boolean) => {
    try {
      return await strapiService.update('users', id, { blocked });
    } catch (error) {
      console.error(`Error al actualizar estado de bloqueo del usuario ${id}:`, error);
      throw error;
    }
  }
};

export default adminService;
