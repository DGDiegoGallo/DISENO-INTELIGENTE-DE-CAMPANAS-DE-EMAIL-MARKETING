import strapiService, { StrapiResponse, StrapiSingleResponse } from './strapiService';

// Interfaces para las campañas de email adaptadas a la estructura de Proyecto_56
export interface Campaign {
  id?: number;
  nombre: string;           // Título de la campaña
  fechas?: string;         // Fecha de creación/programación
  estado: 'borrador' | 'programado' | 'enviado' | 'cancelado';
  usuario?: number;        // ID del usuario que creó la campaña (relación con User)
  asunto: string;          // Asunto del correo
  contenidoHTML: string;   // HTML del correo
  disenoJSON: string | Record<string, unknown>;  // Diseño del correo en formato JSON o string
  contactos?: string;      // Grupo de contactos (ahora como texto simple)
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface CampaignStats {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalUnsubscribed: number;
}

export interface CampaignFilters {
  title?: string;
  status?: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  startDate?: string;
  endDate?: string;
}

// Servicio para manejar las campañas de email integrado con Strapi (Proyecto_56)
const campaignService = {
  /**
   * Obtiene todas las campañas con paginación opcional
   * @param page - Número de página
   * @param pageSize - Tamaño de página
   * @param filters - Filtros opcionales
   */
  getAllCampaigns: async (
    page = 1,
    pageSize = 10,
    filters?: CampaignFilters
  ): Promise<StrapiResponse<Campaign>> => {
    try {
      // Construir los parámetros de consulta para la paginación
      const queryParams: Record<string, string | number> = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        // Incluir la relación con el usuario
        'populate': 'usuario',
      };

      // Añadir filtros si existen
      if (filters) {
        if (filters.title) {
          queryParams['filters[nombre][$containsi]'] = filters.title;
        }
        if (filters.status) {
          queryParams['filters[estado][$eq]'] = filters.status;
        }
        if (filters.startDate) {
          queryParams['filters[fechas][$gte]'] = filters.startDate;
        }
        if (filters.endDate) {
          queryParams['filters[fechas][$lte]'] = filters.endDate;
        }
      }

      // Obtener las campañas con los filtros aplicados y la relación con el usuario
      return await strapiService.getCollection<Campaign>('proyecto-56s', queryParams);
    } catch (error) {
      console.error('Error al obtener campañas:', error);
      throw error;
    }
  },

  /**
   * Obtiene una campaña por su ID
   * @param id - ID de la campaña
   */
  getCampaignById: async (id: number): Promise<StrapiSingleResponse<Campaign>> => {
    try {
      // Usar 'usuario' (singular) para coincidir con el campo de relación actualizado
      return await strapiService.getById<Campaign>('proyecto-56s', id, {
        populate: 'usuario'
      });
    } catch (error) {
      console.error(`Error al obtener campaña con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva campaña
   * @param campaignData - Datos de la campaña
   */
  createCampaign: async (campaignData: Partial<Campaign>): Promise<StrapiSingleResponse<Campaign>> => {
    try {
      // Obtener el ID del usuario actual desde localStorage (si está disponible)
      let userId: number | undefined;
      try {
        const userDataStr = localStorage.getItem('user');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          userId = userData.id;
        }
      } catch (e) {
        console.warn('No se pudo obtener el ID del usuario desde localStorage:', e);
      }
      
      // Adaptar los datos para Strapi v5
      const strapiData = {
        nombre: campaignData.nombre,
        Fechas: new Date().toISOString(), // Usar formato ISO para fechas
        estado: campaignData.estado,
        asunto: campaignData.asunto,
        contenidoHTML: campaignData.contenidoHTML,
        disenoJSON: campaignData.disenoJSON,
        contactos: typeof campaignData.contactos === 'string' 
          ? campaignData.contactos 
          : JSON.stringify(campaignData.contactos),
        // Incluir el ID del usuario si está disponible
        usuario: userId || campaignData.usuario
      };
      
      console.log('Datos adaptados para Strapi v5:', strapiData);
      
      // Usar el endpoint correcto con 's' al final
      return await strapiService.create<Campaign>('proyecto-56s', strapiData);
    } catch (error) {
      console.error('Error al crear campaña:', error);
      // Si hay una respuesta, mostrar los detalles del error para depuración
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown } };
        console.error('Detalles del error:', axiosError.response?.data);
      }
      throw error;
    }
  },

  /**
   * Actualiza una campaña existente
   * @param id - ID de la campaña
   * @param campaignData - Datos a actualizar
   */
  updateCampaign: async (
    id: number,
    campaignData: Partial<Campaign>
  ): Promise<StrapiSingleResponse<Campaign>> => {
    try {
      return await strapiService.update<Campaign>('proyecto-56s', id, campaignData);
    } catch (error) {
      console.error(`Error al actualizar campaña con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una campaña
   * @param id - ID de la campaña
   */
  deleteCampaign: async (id: number): Promise<StrapiSingleResponse<Campaign>> => {
    try {
      return await strapiService.delete<Campaign>('proyecto-56s', id);
    } catch (error) {
      console.error(`Error al eliminar campaña con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Programa una campaña para envío
   * @param id - ID de la campaña
   * @param scheduledDate - Fecha programada para el envío
   */
  scheduleCampaign: async (
    id: number,
    scheduledDate: string
  ): Promise<StrapiSingleResponse<Campaign>> => {
    try {
      return await strapiService.update<Campaign>('campaigns', id, {
        status: 'scheduled',
        scheduledDate
      });
    } catch (error) {
      console.error(`Error al programar campaña con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancela una campaña programada
   * @param id - ID de la campaña
   */
  cancelCampaign: async (id: number): Promise<StrapiSingleResponse<Campaign>> => {
    try {
      return await strapiService.update<Campaign>('campaigns', id, {
        status: 'cancelled'
      });
    } catch (error) {
      console.error(`Error al cancelar campaña con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene estadísticas de una campaña
   * @param id - ID de la campaña
   */
  getCampaignStats: async (id: number): Promise<CampaignStats> => {
    try {
      // Aquí podrías tener un endpoint específico en Strapi para estadísticas
      // o calcularlas a partir de los datos de la campaña
      // Obtener la campaña pero no usarla directamente en este ejemplo
      // ya que estamos devolviendo datos estáticos
      await strapiService.getById<Campaign>('campaigns', id, {
        populate: 'stats'
      });
      
      // Ejemplo de cómo podrías extraer estadísticas
      // Esto dependerá de cómo esté estructurada tu API en Strapi
      return {
        totalSent: 0, // Estos valores deberían venir de tu API
        totalOpened: 0,
        totalClicked: 0,
        totalBounced: 0,
        totalUnsubscribed: 0
      };
    } catch (error) {
      console.error(`Error al obtener estadísticas de campaña con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene las campañas más exitosas según métricas
   * @param limit - Número de campañas a obtener
   */
  getTopPerformingCampaigns: async (limit = 5): Promise<StrapiResponse<Campaign>> => {
    try {
      // Ejemplo de cómo podrías ordenar por tasa de apertura
      return await strapiService.query<Campaign>(
        'campaigns',
        { status: { $eq: 'sent' } },
        { page: 1, pageSize: limit },
        ['openRate:desc'],
        '*'
      );
    } catch (error) {
      console.error('Error al obtener campañas más exitosas:', error);
      throw error;
    }
  }
};

export default campaignService;
