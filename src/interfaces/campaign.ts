/**
 * Interfaces relacionadas con Campañas
 */
import { StrapiRichTextBlock } from './strapi';
import { StrapiUser } from './user';

/**
 * Interfaz para el manejo de campañas
 */
export interface Campaign {
  id: number;
  fecha: string;
  title: string;
  subject: string;
  contactGroup: string;
  scheduledTime: string;
  emailDesign?: Record<string, unknown> | string; // Diseño del email
  emailHtml?: string | null; // HTML generado, puede ser null si no hay contenido
}

/**
 * Interfaz para campañas procesadas desde Strapi
 */
export interface ProcessedCampaign {
  id: number;
  nombre: string;
  asunto: string;
  Fechas?: string;
  createdAt?: string;
  contenidoHTML?: string | StrapiRichTextBlock[] | null;
  campanaJSON?: Record<string, unknown> | string;
  contactos?: string;
}

// --- New interfaces based on the provided JSON ---

export interface RecipientInteractionDetail {
  clicks: number;
  opens: number;
  dinero_gastado: number; // This is a number in the nested object
  se_registro_en_pagina: boolean;
}

export interface InteraccionDestinatario {
  [key: string]: RecipientInteractionDetail; // Keys are sanitized email addresses like "ejemplo_gmail_com"
}

export interface GrupoContactoDetail {
  nombre: string;
  email: string;
  telefono: string;
}

export interface Grupo {
  id: string;
  nombre: string;
  contactos: GrupoContactoDetail[];
}

export interface GruposDeContactosJSON {
  grupos: Grupo[];
}

export interface DetailedCampaign {
  id: number;
  documentId?: string; // Optional as it's not always used directly in frontend logic
  nombre: string;
  Fechas: string; // Matches JSON, uppercase 'F'
  estado: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  asunto: string;
  contenidoHTML: string | StrapiRichTextBlock[] | null; 
  contactos: string; // Comma-separated list of emails
  gruposdecontactosJSON: GruposDeContactosJSON | null;
  interaccion_destinatario: InteraccionDestinatario | null;
  se_registro_en_pagina?: boolean | null; // Top-level aggregate, optional
  dinero_gastado?: string | null;      // Top-level aggregate, stored as string, optional
  campanaJSON: Record<string, unknown> | null; 
  email_destinatario?: string | null;
  usuario?: StrapiUser | undefined; 
}

// To be used with StrapiResponse<T>
// Example: StrapiResponse<DetailedCampaign> for a single campaign attribute set
// Example: StrapiResponse<DetailedCampaign[]> for a list of campaigns with their attributes
