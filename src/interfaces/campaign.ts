/**
 * Interfaces relacionadas con Campañas
 */
import { StrapiRichTextBlock } from './strapi';

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
