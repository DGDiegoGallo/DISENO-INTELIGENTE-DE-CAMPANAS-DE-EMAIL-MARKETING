import strapiService from './strapiService';
import { StrapiUser } from '../interfaces/user';

// Define more specific types for Strapi filter values
type StrapiFilterValue = string | number | boolean | null | Array<string | number | boolean | null> | Record<string, unknown>;

// Define a type for Strapi filters
type StrapiFilters = Record<string, StrapiFilterValue>;

// Define a general type for Strapi query parameters
interface StrapiQueryParams {
  'pagination[page]'?: number;
  'pagination[pageSize]'?: number;
  populate?: string | string[];
  filters?: StrapiFilters; 
  sort?: string | string[];
  fields?: string[];
  publicationState?: 'live' | 'preview';
  locale?: string | string[];
  [key: string]: unknown; // Allow other specific query params with unknown type
}

// Interface for projects that might contain a user
interface ProjectWithOptionalUser {
  usuario?: StrapiUser;
  id?: number;
  nombre?: string;
  estado?: string;
  asunto?: string;
  contactos?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  documentId?: string;
  Fechas?: string;
  interaccion_destinatario?: Record<string, unknown>;
  [key: string]: unknown; // Allow other project properties with unknown type
}

// Type for user relation in Strapi v5
interface StrapiUserRelation {
  data?: {
    id?: number | string;
    attributes?: {
      username?: string;
      email?: string;
      nombre?: string;
      apellido?: string;
      provider?: string;
      confirmed?: boolean;
      blocked?: boolean;
      createdAt?: string;
      updatedAt?: string;
      rol?: string;
      [key: string]: unknown;
    };
  };
}

// Type for interaction data
interface InteractionData {
  opens?: number;
  clicks?: number;
  se_registro_en_pagina?: boolean;
  dinero_gastado?: string | number;
  [key: string]: unknown;
}

// Represents the raw attributes of a campaign from Strapi
interface StrapiRawCampaignAttributes {
  nombre?: string;
  Fechas?: string; // Note: Consider if this should be Date or string and align with actual data
  estado?: string;
  asunto?: string;
  contactos?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  usuario?: StrapiUserRelation; // Typed user relation
  interaccion_destinatario?: Record<string, InteractionData>; // Typed interaction data
  documentId?: string;
  [key: string]: unknown; // For any other attributes Strapi might send
}

// Represents a single raw campaign object from Strapi, with id and attributes
interface StrapiRawCampaign {
  id: number;
  attributes: StrapiRawCampaignAttributes;
  // Direct properties that might be in the API response 
  nombre?: string;
  Fechas?: string;
  estado?: string;
  asunto?: string;
  contactos?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  documentId?: string;
  usuario?: StrapiUser | Record<string, unknown>; // User can be directly on the campaign 
  interaccion_destinatario?: Record<string, InteractionData>;
  [key: string]: unknown; // Allow any other properties
}

// Tipo intermedio para la respuesta de la API que puede variar en su estructura
// Permite datos que tienen id pero pueden o no tener attributes
type StrapiApiResponse = { id: number } & Partial<StrapiRawCampaign>;

// Generic Strapi response structure for collections
interface StrapiCollectionResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
    [key: string]: unknown; // For other meta properties with unknown type
  };
  error?: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
  [key: string]: unknown; // For other top-level response properties with unknown type
}

/**
 * Servicio para funciones administrativas
 */
const adminService = {
  /**
   * Obtiene todos los usuarios relacionados con el proyecto-56s
   * @param page Número de página
   * @param pageSize Tamaño de página
   */
  getAllUsers: async (page = 1, pageSize = 25): Promise<StrapiUser[]> => {
    try {
      const queryParams: StrapiQueryParams = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'populate': 'usuario'
      };
      
      // Utilizamos la colección proyecto-56s con populate=usuario
      const response = await strapiService.getCollection('proyecto-56s', queryParams);
      console.log('Respuesta de proyecto-56s:', response);
      return response.data as StrapiUser[];
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
  getUsersDirectly: async (page = 1, pageSize = 25): Promise<StrapiUser[]> => {
    try {
      const queryParams: StrapiQueryParams = { 
        'pagination[page]': page, 
        'pagination[pageSize]': pageSize,
        'populate': 'usuario'
      };
      
      const response = await strapiService.getCollection('proyecto-56s', queryParams);
      
      // Extraer usuarios de los proyectos
      if (response.data && Array.isArray(response.data)) {
        const usersFromProjects: StrapiUser[] = [];
        
        const typedData = response.data as unknown as StrapiRawCampaign[];
        typedData.forEach(project => {
          if (project.attributes?.usuario?.data) {
            const userData = project.attributes.usuario.data;
            const userId = typeof userData.id === 'number' ? userData.id : Number(userData.id || 0);
            
            if (userData.attributes && userId > 0) {
              const userAttributes = userData.attributes;
              usersFromProjects.push({
                id: userId,
                username: String(userAttributes.username || ''),
                email: String(userAttributes.email || ''),
                provider: String(userAttributes.provider || 'local'),
                confirmed: typeof userAttributes.confirmed === 'boolean' ? userAttributes.confirmed : true,
                blocked: typeof userAttributes.blocked === 'boolean' ? userAttributes.blocked : false,
                createdAt: String(userAttributes.createdAt || ''),
                updatedAt: String(userAttributes.updatedAt || ''),
                nombre: String(userAttributes.nombre || ''),
                apellido: String(userAttributes.apellido || ''),
                rol: String(userAttributes.rol || 'authenticated')
              });
            }
          }
        });
        
        return usersFromProjects;
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener usuarios directamente:', error);
      throw error;
    }
  },

  /**
   * Extrae usuarios únicos de los proyectos
   * @param proyectosData Datos de proyectos con usuarios
   */
  extractUsersFromProjects: (proyectosData: ProjectWithOptionalUser[]): StrapiUser[] => {
    const uniqueUsers = new Map<number, StrapiUser>();
    
    proyectosData.forEach(proyecto => {
      if (proyecto && proyecto.usuario) {
        const userData = proyecto.usuario; // userData is StrapiUser
        if (userData && typeof userData.id === 'number') { // Ensure userData.id is number
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
  getAllCampaigns: async (page = 1, pageSize = 25): Promise<StrapiCollectionResponse<StrapiRawCampaign>> => {
    try {
      // Usar populate=usuario para asegurar que se incluyen los datos de usuario
      const queryParams: StrapiQueryParams = { 
        'pagination[page]': page, 
        'pagination[pageSize]': pageSize, 
        'populate': 'usuario' // Asegurar que se incluye la relación usuario
      };
      // Obtener datos de la API
      const response = await strapiService.getCollection('proyecto-56s', queryParams);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        
        // Adaptar los datos para que sean compatibles con lo que espera el store
        // Esto es importante para manejar la estructura que devuelve la API
        // Procesar y normalizar los datos de campaña para asegurar estructura consistente
        const processedData = response.data.map((campaign: StrapiApiResponse) => {
          // Inicializar con estructura básica y attributes vacíos si no existen
          const processedCampaign = { ...campaign, attributes: campaign.attributes || {} } as StrapiRawCampaign;
          
          // Si existe usuario directo en la raíz, agregarlo a attributes.usuario
          if (processedCampaign.usuario) {
            processedCampaign.attributes.usuario = { 
              data: typeof processedCampaign.usuario === 'object' ? processedCampaign.usuario : { id: 0 } 
            };
          }
          
          // Transferir propiedades directas a attributes (normalización)
          const propsToTransfer = ['nombre', 'Fechas', 'estado', 'asunto', 'contactos', 'documentId', 'interaccion_destinatario'];
          
          for (const prop of propsToTransfer) {
            if (prop in processedCampaign && !(prop in processedCampaign.attributes)) {
              const value = processedCampaign[prop as keyof StrapiRawCampaign];
              if (value !== undefined) {
                processedCampaign.attributes[prop] = value;
              }
            }
          }
          
          return processedCampaign;
        });
        
        // Asignar los datos procesados de vuelta a la respuesta
        response.data = processedData;
      }
      
      return response as StrapiCollectionResponse<StrapiRawCampaign>; // Assert the response type
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
