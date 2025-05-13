import strapiService from './strapiService';
import { StrapiResponse, StrapiSingleResponse } from '../interfaces/strapi';
import { Contact, Segment, ContactFilters } from '../interfaces/contacts';

// Servicio para manejar contactos y segmentos
const contactService = {
  /**
   * Obtiene todos los contactos con paginación opcional
   * @param page - Número de página
   * @param pageSize - Tamaño de página
   * @param filters - Filtros opcionales
   */
  getAllContacts: async (
    page = 1,
    pageSize = 25,
    filters?: ContactFilters
  ): Promise<StrapiResponse<Contact>> => {
    try {
      // Construir filtros para Strapi
      const strapiFilters: Record<string, unknown> = {};
      
      if (filters?.email) {
        strapiFilters.email = {
          $containsi: filters.email
        };
      }
      
      if (filters?.status) {
        strapiFilters.status = {
          $eq: filters.status
        };
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        strapiFilters.tags = {
          $containsi: filters.tags
        };
      }
      
      if (filters?.startDate || filters?.endDate) {
        const createdAtFilter: Record<string, string> = {};
        
        if (filters.startDate) {
          createdAtFilter.$gte = filters.startDate;
        }
        
        if (filters.endDate) {
          createdAtFilter.$lte = filters.endDate;
        }
        
        strapiFilters.createdAt = createdAtFilter;
      }
      
      return await strapiService.query<Contact>(
        'contacts',
        strapiFilters,
        { page, pageSize },
        ['createdAt:desc'],
        '*'
      );
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un contacto por su ID
   * @param id - ID del contacto
   */
  getContactById: async (id: number): Promise<StrapiSingleResponse<Contact>> => {
    try {
      return await strapiService.getById<Contact>('contacts', id, {
        populate: '*'
      });
    } catch (error) {
      console.error(`Error al obtener contacto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo contacto
   * @param contactData - Datos del contacto
   */
  createContact: async (contactData: Partial<Contact>): Promise<StrapiSingleResponse<Contact>> => {
    try {
      return await strapiService.create<Contact>('contacts', contactData);
    } catch (error) {
      console.error('Error al crear contacto:', error);
      throw error;
    }
  },

  /**
   * Actualiza un contacto existente
   * @param id - ID del contacto
   * @param contactData - Datos a actualizar
   */
  updateContact: async (
    id: number,
    contactData: Partial<Contact>
  ): Promise<StrapiSingleResponse<Contact>> => {
    try {
      return await strapiService.update<Contact>('contacts', id, contactData);
    } catch (error) {
      console.error(`Error al actualizar contacto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un contacto
   * @param id - ID del contacto
   */
  deleteContact: async (id: number): Promise<StrapiSingleResponse<Contact>> => {
    try {
      return await strapiService.delete<Contact>('contacts', id);
    } catch (error) {
      console.error(`Error al eliminar contacto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Importa contactos desde un archivo CSV
   * @param file - Archivo CSV con contactos
   */
  importContacts: async (file: File): Promise<Record<string, unknown>> => {
    try {
      // Primero subimos el archivo
      const uploadResult = await strapiService.uploadFile(file);
      
      // Luego llamamos a un endpoint personalizado para procesar el archivo
      // Esto dependerá de cómo hayas configurado Strapi
      const response = await fetch(`http://34.238.122.213:1337/api/contacts/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          // Usamos acceso seguro a propiedades con operador opcional
          fileId: uploadResult && typeof uploadResult === 'object' && Array.isArray(uploadResult) && 
                 uploadResult.length > 0 && 'id' in uploadResult[0] ? 
                 uploadResult[0].id : null
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error al importar contactos:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los segmentos
   * @param page - Número de página
   * @param pageSize - Tamaño de página
   */
  getAllSegments: async (
    page = 1,
    pageSize = 10
  ): Promise<StrapiResponse<Segment>> => {
    try {
      return await strapiService.query<Segment>(
        'segments',
        {},
        { page, pageSize },
        ['createdAt:desc'],
        '*'
      );
    } catch (error) {
      console.error('Error al obtener segmentos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un segmento por su ID
   * @param id - ID del segmento
   */
  getSegmentById: async (id: number): Promise<StrapiSingleResponse<Segment>> => {
    try {
      return await strapiService.getById<Segment>('segments', id, {
        populate: '*'
      });
    } catch (error) {
      console.error(`Error al obtener segmento con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo segmento
   * @param segmentData - Datos del segmento
   */
  createSegment: async (segmentData: Partial<Segment>): Promise<StrapiSingleResponse<Segment>> => {
    try {
      return await strapiService.create<Segment>('segments', segmentData);
    } catch (error) {
      console.error('Error al crear segmento:', error);
      throw error;
    }
  },

  /**
   * Actualiza un segmento existente
   * @param id - ID del segmento
   * @param segmentData - Datos a actualizar
   */
  updateSegment: async (
    id: number,
    segmentData: Partial<Segment>
  ): Promise<StrapiSingleResponse<Segment>> => {
    try {
      return await strapiService.update<Segment>('segments', id, segmentData);
    } catch (error) {
      console.error(`Error al actualizar segmento con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un segmento
   * @param id - ID del segmento
   */
  deleteSegment: async (id: number): Promise<StrapiSingleResponse<Segment>> => {
    try {
      return await strapiService.delete<Segment>('segments', id);
    } catch (error) {
      console.error(`Error al eliminar segmento con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene los contactos de un segmento específico
   * @param segmentId - ID del segmento
   * @param page - Número de página
   * @param pageSize - Tamaño de página
   */
  getContactsBySegment: async (
    segmentId: number,
    page = 1,
    pageSize = 25
  ): Promise<StrapiResponse<Contact>> => {
    try {
      // Esto dependerá de cómo hayas configurado las relaciones en Strapi
      return await strapiService.query<Contact>(
        'contacts',
        { segment: { id: { $eq: segmentId } } },
        { page, pageSize },
        ['createdAt:desc'],
        '*'
      );
    } catch (error) {
      console.error(`Error al obtener contactos del segmento ${segmentId}:`, error);
      throw error;
    }
  }
};

export default contactService;
