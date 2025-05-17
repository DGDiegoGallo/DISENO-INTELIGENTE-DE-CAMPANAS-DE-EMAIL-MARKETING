import axios from 'axios';
// import authService from './auth/authService'; // Removed unused import

// URL base de la API de Strapi
export const API_URL = 'http://34.238.122.213:1337';

// Configuración para las solicitudes autenticadas
const getAuthConfig = () => {
  return {};
};

// Importar interfaces desde la carpeta de interfaces
import { StrapiResponse, StrapiSingleResponse } from '../interfaces/strapi';

// Servicio para interactuar con Strapi
const strapiService = {
  /**
   * Obtiene una colección de elementos de Strapi
   * @param endpoint - El endpoint de la colección (ej: 'campaigns')
   * @param params - Parámetros de consulta opcionales (filtros, paginación, etc.)
   */
  getCollection: async <T>(endpoint: string, params?: Record<string, unknown>): Promise<StrapiResponse<T>> => {
    try {
      // Convertir los parámetros a un formato que URLSearchParams pueda manejar
      const queryString = params ? `?${new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString()}` : '';
      const url = `${API_URL}/api/${endpoint}${queryString}`;
      const config = getAuthConfig();

      console.log(`[StrapiService] Requesting URL for ${endpoint}:`, url);
      console.log(`[StrapiService] Request config for ${endpoint}:`, JSON.stringify(config, null, 2));

      const response = await axios.get<StrapiResponse<T>>(
        url,
        config
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener colección ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene un elemento específico de Strapi por ID
   * @param endpoint - El endpoint de la colección (ej: 'campaigns')
   * @param id - ID del elemento a obtener
   * @param params - Parámetros de consulta opcionales (populate, fields, etc.)
   */
  getById: async <T>(endpoint: string, id: number, params?: Record<string, unknown>): Promise<StrapiSingleResponse<T>> => {
    try {
      // Convertir los parámetros a un formato que URLSearchParams pueda manejar
      const queryString = params ? `?${new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString()}` : '';
      const response = await axios.get<StrapiSingleResponse<T>>(
        `${API_URL}/api/${endpoint}/${id}${queryString}`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener ${endpoint} con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo elemento en una colección de Strapi
   * @param endpoint - El endpoint de la colección (ej: 'campaigns')
   * @param data - Datos del elemento a crear
   */
  create: async <T>(endpoint: string, data: Record<string, unknown>): Promise<StrapiSingleResponse<T>> => {
    try {
      // Formato específico para Strapi v5
      const strapiV5Data = { data };
      
      console.log(`Enviando datos a Strapi v5 (${endpoint}):`, JSON.stringify(strapiV5Data, null, 2));
      
      const response = await axios.post<StrapiSingleResponse<T>>(
        `${API_URL}/api/${endpoint}`,
        strapiV5Data,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error(`Error al crear ${endpoint}:`, error);
      // Mostrar más detalles sobre el error para depuración
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown, status?: number } };
        console.error(`Error ${axiosError.response?.status} al crear ${endpoint}:`, 
                     axiosError.response?.data);
      }
      throw error;
    }
  },

  /**
   * Actualiza un elemento existente en Strapi
   * @param endpoint - El endpoint de la colección (ej: 'campaigns')
   * @param id - ID del elemento a actualizar
   * @param data - Datos a actualizar
   */
  update: async <T>(endpoint: string, id: number, data: Record<string, unknown>): Promise<StrapiSingleResponse<T>> => {
    try {
      const response = await axios.put<StrapiSingleResponse<T>>(
        `${API_URL}/api/${endpoint}/${id}`,
        { data },
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar ${endpoint} con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un elemento de Strapi
   * @param endpoint - El endpoint de la colección (ej: 'campaigns')
   * @param id - ID del elemento a eliminar
   */
  delete: async <T>(endpoint: string, id: number): Promise<StrapiSingleResponse<T>> => {
    try {
      const response = await axios.delete<StrapiSingleResponse<T>>(
        `${API_URL}/api/${endpoint}/${id}`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar ${endpoint} con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Sube un archivo a Strapi
   * @param file - Archivo a subir
   * @param refId - ID del elemento relacionado (opcional)
   * @param ref - Nombre de la colección relacionada (opcional)
   * @param field - Campo donde se guardará el archivo (opcional)
   */
  uploadFile: async (file: File, refId?: number, ref?: string, field?: string): Promise<Record<string, unknown>> => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      
      if (refId) formData.append('refId', refId.toString());
      if (ref) formData.append('ref', ref);
      if (field) formData.append('field', field);

      const response = await axios.post(
        `${API_URL}/api/upload`,
        formData,
        {
          ...getAuthConfig(),
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al subir archivo:', error);
      throw error;
    }
  },

  /**
   * Realiza una consulta personalizada a Strapi usando el sistema de filtros
   * @param endpoint - El endpoint de la colección (ej: 'campaigns')
   * @param filters - Objeto de filtros según la documentación de Strapi
   * @param pagination - Configuración de paginación
   * @param sort - Configuración de ordenamiento
   * @param populate - Configuración para incluir relaciones
   */
  query: async <T>(
    endpoint: string,
    filters?: Record<string, unknown>,
    pagination?: { page?: number; pageSize?: number },
    sort?: string[],
    populate?: string | Record<string, unknown>
  ): Promise<StrapiResponse<T>> => {
    try {
      const queryParams: Record<string, unknown> = {};
      
      if (filters) {
        queryParams.filters = filters;
      }
      
      if (pagination) {
        queryParams.pagination = pagination;
      }
      
      if (sort) {
        queryParams.sort = sort;
      }
      
      if (populate) {
        queryParams.populate = populate;
      }
      
      // Convertir el objeto de parámetros a formato de consulta de Strapi
      const queryString = `?${new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString()}`;
      
      const response = await axios.get<StrapiResponse<T>>(
        `${API_URL}/api/${endpoint}${queryString}`,
        getAuthConfig()
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error en consulta personalizada a ${endpoint}:`, error);
      throw error;
    }
  }
};

export default strapiService;
