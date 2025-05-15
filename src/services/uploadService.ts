import { API_URL } from './strapiService';

interface StrapiUploadResponse {
  id: number;
  name: string;
  url: string;
  size: number;
  mime: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Servicio para gestionar la carga de archivos a Strapi
 */
export const uploadFile = async (file: File, folder: string = ''): Promise<StrapiUploadResponse[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const formData = new FormData();
    formData.append('files', file);
    
    // Si se especifica una carpeta, añadirla como parámetro
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al cargar el archivo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en uploadFile:', error);
    throw error;
  }
};

interface StrapiUserResponse {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string | {
    id: number;
    url: string;
  };
  [key: string]: string | number | boolean | object | undefined; // Para otros campos que pueda tener el usuario
}

/**
 * Actualiza el avatar del usuario en Strapi
 */
export const updateUserAvatar = async (userId: number, fileId: number): Promise<StrapiUserResponse> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Primero, obtener el usuario actual para ver cómo está estructurado el campo avatar
    const userResponse = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!userResponse.ok) {
      throw new Error('Error al obtener información del usuario');
    }
    
    const userData = await userResponse.json();
    console.log('Datos actuales del usuario:', userData);
    
    // Ahora actualizar el avatar
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Dependiendo de cómo Strapi espera la relación, podría ser uno de estos formatos:
        // Opción 1: Solo el ID como número
        avatar: fileId,
        // Opción 2: Objeto con connect
        // avatar: { connect: [{ id: fileId }] }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al actualizar el avatar');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateUserAvatar:', error);
    throw error;
  }
};
