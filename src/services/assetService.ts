import { API_URL } from '../config/api';

interface StrapiAsset {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, unknown>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Obtiene la información de un archivo por su ID
 */
export const getAssetById = async (assetId: string | number): Promise<StrapiAsset> => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/api/upload/files/${assetId}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el archivo: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAssetById:', error);
    throw error;
  }
};

/**
 * Construye la URL completa de un asset
 */
export const getAssetUrl = (assetId: string | number | null | undefined): string => {
  if (!assetId) return '';
  
  // URL directa al archivo
  return `${API_URL}/uploads/assets/${assetId}`;
};
