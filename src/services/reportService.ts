// Importamos solo los tipos necesarios

const API_URL = 'http://34.238.122.213:1337';

// Interfaz para las campañas en el formato que viene de Strapi
export interface CampaignData {
  id: number;
  documentId?: string;
  nombre: string;
  Fechas: string;
  estado: 'borrador' | 'programado' | 'enviado' | 'cancelado';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  asunto: string;
  contenidoHTML: string | null;
  contactos: string;
  gruposdecontactosJSON?: {
    grupos: Array<{
      id: string;
      nombre: string;
      contactos: Array<{
        nombre: string;
        email: string;
        telefono: string;
      }>;
    }>;
  };
  interaccion_destinatario?: {
    [key: string]: { // email address with '.' replaced by '_'
      clicks: number;
      opens: number;
      dinero_gastado: number;
      se_registro_en_pagina: boolean;
    };
  } | null;
  se_registro_en_pagina?: boolean | null;
  dinero_gastado?: string | null;
  campanaJSON?: Record<string, unknown> | null;
  email_destinatario?: Record<string, unknown> | null;
  usuario: {
    id: number;
    documentId?: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    nombre: string;
    apellido: string;
    sexo?: string;
    edad?: number;
    fechaDeNacimiento?: string;
    pais?: string;
    ciudad?: string;
    domicilio?: string;
    telefono?: string;
    avatar?: string | null;
    rol?: string;
  };
}

export interface ContactGroup {
  name: string;
  contactCount: number;
}

export interface UserCampaignsData {
  campaigns: CampaignData[];
  totalCampaigns: number;
  contactGroups: {
    name: string;
    contactCount: number;
  }[];
  totalContacts: number;
  campaignStats: {
    draft: number;
    scheduled: number;
    sent: number;
    cancelled: number;
  };
}

/**
 * Servicio para generar informes de usuario
 */
const reportService = {
  /**
   * Obtiene todas las campañas del usuario actual
   */
  getUserCampaigns: async (userId: number): Promise<UserCampaignsData> => {
    try {
      // Token handling removed as per new authentication strategy

      // Obtener campañas del usuario
      const response = await fetch(
        `${API_URL}/api/proyecto-56s?populate=usuario&filters[usuario][id]=${userId}`,
        { // Headers object might still be needed for Content-Type or other headers in the future,
          // but Authorization is removed.
          headers: {}
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Error API - Status:', response.status, response.statusText);
        console.error('Error API - Body:', errorBody);
        throw new Error(`Error al obtener datos de campañas: ${response.status} ${response.statusText}. Cuerpo: ${errorBody}`);
      }

      const data = await response.json();
      const campaigns = data && data.data ? data.data : [];
      
      // Procesar datos para el informe
      const contactGroups: ContactGroup[] = [];
      let totalContacts = 0;
      
      // Estadísticas de campañas por estado
      const campaignStats = {
        draft: 0,
        scheduled: 0,
        sent: 0,
        cancelled: 0
      };
      
      // Procesar cada campaña para extraer información
      campaigns.forEach((campaign: CampaignData, index: number) => {
        if (!campaign || !campaign.id) { // Check for a core property like id
          console.warn(`Campaña en el índice ${index} es inválida o nula:`, campaign);
          return; // Saltar esta campaña si es inválida
        }

        // Contar campañas por estado
        switch (campaign.estado) {
          case 'borrador':
            campaignStats.draft++;
            break;
          case 'programado':
            campaignStats.scheduled++;
            break;
          case 'enviado':
            campaignStats.sent++;
            break;
          case 'cancelado':
            campaignStats.cancelled++;
            break;
        }
        
        // Procesar grupos de contactos
        if (campaign.gruposdecontactosJSON && campaign.gruposdecontactosJSON.grupos) {
          campaign.gruposdecontactosJSON.grupos.forEach((grupo: {
            id: string;
            nombre: string;
            contactos: Array<{
              nombre: string;
              email: string;
              telefono: string;
            }>;
          }) => {
            // Verificar si ya existe este grupo en nuestro array
            const existingGroup = contactGroups.find(g => g.name === grupo.nombre);
            
            if (existingGroup) {
              // Si existe, actualizar el conteo
              existingGroup.contactCount += grupo.contactos.length;
            } else {
              // Si no existe, añadirlo
              contactGroups.push({
                name: grupo.nombre,
                contactCount: grupo.contactos.length
              });
            }
            
            // Sumar al total de contactos
            totalContacts += grupo.contactos.length;
          });
        }
      });
      
      return {
        campaigns,
        totalCampaigns: campaigns.length,
        contactGroups,
        totalContacts,
        campaignStats
      };
    } catch (error) {
      console.error('Error detallado en getUserCampaigns para userId:', userId, error);
      if (error instanceof Error) {
        console.error('Mensaje de Error:', error.message);
        console.error('Stack de Error:', error.stack);
      }
            // console.error('Token que se intentó usar:', localStorage.getItem('token')); // Line removed as token is no longer used here
      throw error;
    }
  }
};

export default reportService;
