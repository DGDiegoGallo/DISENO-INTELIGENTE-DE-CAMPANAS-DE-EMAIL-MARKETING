import { StrapiUser } from './user';

export interface AdminState {
  users: StrapiUser[];
  loading: boolean;
  error: string | null;
  showDeleteConfirm: boolean;
  userToDelete: StrapiUser | null;
}

export interface CampaignMetrics {
  opens: number;
  clicks: number;
  registrations: number;
  revenue: number;
}

export interface CampaignWithUser {
  id: number;
  documentId: string;
  nombre: string;
  Fechas: string;
  estado: string;
  asunto: string;
  contactos: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  usuario: StrapiUser;
  metrics?: CampaignMetrics;
  userId: number;       // ID del usuario asociado a la campaña
  userName: string;     // Nombre completo o username del usuario
  userEmail: string;    // Email del usuario
}
