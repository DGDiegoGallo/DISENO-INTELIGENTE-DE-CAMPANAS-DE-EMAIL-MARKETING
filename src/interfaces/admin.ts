import { StrapiUser } from './user';

export interface AdminState {
  users: StrapiUser[];
  loading: boolean;
  error: string | null;
  showDeleteConfirm: boolean;
  userToDelete: StrapiUser | null;
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
}
