// Importamos solo los tipos necesarios

const API_URL = 'http://34.238.122.213:1337';

// Interfaz para las campañas en el formato que viene de Strapi
export interface CampaignData {
  id: number;
  attributes: {
    documentId?: string;
    nombre: string;
    Fechas: string;
    estado: 'borrador' | 'programado' | 'enviado' | 'cancelado';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    asunto: string;
    contenidoHTML: string | null; // Puede ser null o un string con HTML
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
    interaccion_destinatario?: Record<string, unknown> | null; // Puede ser null o un objeto con datos de interacción
    se_registro_en_pagina?: boolean | null;
    dinero_gastado?: string | null;
    campanaJSON?: Record<string, unknown> | null; // Puede ser null o un objeto con el diseño de la campaña
    email_destinatario?: Record<string, unknown> | null; // Puede ser null o un objeto con datos del destinatario
    usuario: {
      data: {
        id: number;
        attributes: {
          username: string;
          email: string;
          provider: string;
          confirmed: boolean;
          blocked: boolean;
          createdAt: string;
          updatedAt: string;
          nombre: string;
          apellido: string;
          sexo?: string;
          edad?: number;
          fechaDeNacimiento?: string;
          pais?: string;
          ciudad?: string;
          domicilio?: string;
          telefono?: string;
          avatar?: string;
          rol?: string;
        };
      };
    };
  };
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Obtener campañas del usuario
      const response = await fetch(
        `${API_URL}/api/proyecto-56s?populate=usuario&filters[usuario][id]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener datos de campañas');
      }

      const data = await response.json();
      const campaigns = data.data || [];
      
      // Procesar datos para el informe
      const contactGroups: { name: string; contactCount: number }[] = [];
      let totalContacts = 0;
      
      // Estadísticas de campañas por estado
      const campaignStats = {
        draft: 0,
        scheduled: 0,
        sent: 0,
        cancelled: 0
      };
      
      // Procesar cada campaña para extraer información
      campaigns.forEach((campaign: CampaignData) => {
        // Contar campañas por estado
        switch (campaign.attributes.estado) {
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
        if (campaign.attributes.gruposdecontactosJSON && campaign.attributes.gruposdecontactosJSON.grupos) {
          campaign.attributes.gruposdecontactosJSON.grupos.forEach((grupo: {
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
      console.error('Error al obtener campañas del usuario:', error);
      throw error;
    }
  }
};

export default reportService;
