/**
 * Interfaces para el análisis CRM
 */

/**
 * Interfaz para los datos de interacción de destinatarios
 * Se usa para procesar la información sobre registros y gastos
 */
export interface DestinationInteraction {
  dinero_gastado?: number | string;
  se_registro_en_pagina?: boolean;
}

/**
 * Interfaz extendida para campañas que incluye datos de interacción
 */
export interface ExtendedCampaign {
  id: number;
  nombre: string;
  interaccion_destinatario?: Record<string, DestinationInteraction>;
}

export interface CrmAnalysisContact {
  id: string;
  name: string;
  email: string;
  lastPurchaseDate?: string;
  totalSpent?: number;
  interactionScore?: number;
  leadStatus?: 'Prospecto' | 'Contactado' | 'Calificado' | 'Perdido' | 'Ganado';
  campaign?: {
    id: number;
    name: string;
    date: string;
  };
  // Datos adicionales para procesar el estado del contacto
  interactionData?: DestinationInteraction;
}

export interface CrmStats {
  totalContacts: number;
  totalRevenue: number;
  avgInteractionScore: number;
  dealsWon: number;
  dealsPipeline: number;
}

export interface ContactGroup {
  id: string;
  nombre: string;
  contactos: {
    nombre: string;
    email: string;
    telefono: string;
  }[];
}

export interface GroupsData {
  grupos: ContactGroup[];
}

// Interfaces para los datos de campañas desde Strapi

// Interfaz para la estructura de respuesta de Strapi
export interface StrapiResponse<T> {
  data: StrapiAttributes<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Interfaz para los atributos de Strapi
export interface StrapiAttributes<T> {
  id: number;
  attributes: T;
}

// Interfaz para los datos de campaña
export interface StrapiCampaign {
  documentId: string;
  nombre: string;
  Fechas: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  asunto: string;
  contenidoHTML: string | null; // Contenido HTML de la campaña
  contactos: string;
  gruposdecontactosJSON: GroupsData;
  interaccion_destinatario: Record<string, string | number | boolean> | null;
  se_registro_en_pagina: boolean | null;
  dinero_gastado: string | null;
  campanaJSON: Record<string, unknown> | null; // Datos de la campaña en formato JSON
  email_destinatario: string | string[];
  usuario: {
    data: {
      id: number;
      attributes: {
        documentId: string;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
      }
    }
  };
}

// Interfaz para el usuario procesado y aplanado desde Strapi
export interface ProcessedStrapiUser {
  id: number;
  documentId?: string; // Hacer opcionales si no siempre están
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Interfaz para la campaña procesada (con ID incluido y usuario aplanado)
export interface ProcessedCampaign extends Omit<StrapiCampaign, 'usuario'> {
  id: number; // ID de la campaña
  usuario?: ProcessedStrapiUser | number | string; // Usuario puede ser objeto aplanado, ID, o no estar.
}

// Interfaces para las visualizaciones de gráficos
export interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export interface DoughnutChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
}

export interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }[];
}
