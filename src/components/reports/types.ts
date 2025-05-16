// Common types used by the report components

export interface ContactGroup {
  name: string;
  contactCount: number;
}

export interface CampaignStats {
  draft: number;
  scheduled: number;
  sent: number;
  cancelled: number;
}

export interface Campaign {
  id: number;
  documentId?: string;
  nombre: string;
  Fechas: string;
  estado: 'borrador' | 'programado' | 'enviado' | 'cancelado';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  asunto: string;
  contenidoHTML: string | null; // Assuming it might be Slate JSON or string HTML
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
  campanaJSON?: Record<string, unknown> | null; // Or a more specific type if known
  email_destinatario?: Record<string, unknown> | null;
  usuario?: { // Keep user optional here if not always needed by components using this type directly
    id: number;
    username: string;
    email: string;
    // Add other user fields as needed by components
    nombre?: string;
    apellido?: string;
  };
  // Retain [key: string]: unknown; if there's a possibility of other dynamic fields from Strapi
  // For better type safety, it's preferred to list all known properties.
  // If dynamic properties are not expected, this can be removed.
  [key: string]: unknown;
}

export interface UserCampaignsData {
  totalCampaigns: number;
  campaigns: Campaign[];
  campaignStats: CampaignStats;
  totalContacts: number;
  contactGroups: ContactGroup[];
}
