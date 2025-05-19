import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../config/api';
import { StrapiUser, UpdateProfileData } from '../interfaces/user';
import useUserStore from '../store/useUserStore';

const userService = {
  /**
   * Actualiza el perfil de un usuario en Strapi
   * @param userId - ID del usuario a actualizar
   * @param profileData - Datos del perfil a actualizar
   */
  updateUserProfile: async (userId: number, profileData: UpdateProfileData): Promise<StrapiUser> => {
    try {
      // Llamada directa a la API de Strapi para actualizar el usuario
      console.log(`Actualizando usuario ${userId} con datos:`, profileData);
      
      // En Strapi v5, no se necesita envolver los datos en un objeto 'data' para la actualización de usuarios
      const response = await axios.put(
        `${API_URL}${API_ENDPOINTS.USERS}/${userId}`,
        profileData
      );
      
      console.log('Respuesta de la API de Strapi:', response.data);
      
      // Actualizar el usuario en el store
      const { user, token } = useUserStore.getState();
      if (user && user.id === userId) {
        // Actualizar el localStorage y el estado
        useUserStore.getState().login({
          user: { ...user, ...profileData },
          token: token || ''
        });
      }
      
      return response.data as StrapiUser;
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Detalles del error:', error.response.data);
      }
      throw error;
    }
  },

  /**
   * Obtiene los datos de un usuario por su ID
   * @param userId - ID del usuario a obtener
   */
  getUserById: async (userId: number): Promise<StrapiUser> => {
    try {
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.USERS}/${userId}`);
      return response.data as StrapiUser;
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      throw error;
    }
  }
};

export default userService;
