/**
 * Utilidades para transformar respuestas de Strapi
 */
import { StrapiResponse, StrapiSingleResponse } from '../interfaces/strapi';

/**
 * Transforma una respuesta de colección de Strapi a un array plano de items
 * @param response Respuesta de Strapi para una colección
 */
export function transformStrapiCollection<T>(response: StrapiResponse<T>): T[] {
  if (!response?.data) return [];
  
  return response.data.map(item => {
    // Si el item tiene una estructura con attributes, extraer y combinar con el id
    if (item && typeof item === 'object' && 'attributes' in item && 'id' in item) {
      // Extraer attributes y asegurar que es un objeto
      const attributes = item.attributes as Record<string, unknown>;
      return {
        ...attributes,
        id: item.id
      } as T;
    }
    // Si ya es plano, devolverlo tal cual
    return item as T;
  });
}

/**
 * Transforma una respuesta singular de Strapi a un objeto plano
 * @param response Respuesta de Strapi para un item individual
 */
export function transformStrapiSingle<T>(response: StrapiSingleResponse<T>): T | null {
  if (!response?.data) return null;
  
  const item = response.data;
  
  // Si el item tiene una estructura con attributes, extraer y combinar con el id
  if (item && typeof item === 'object' && 'attributes' in item && 'id' in item) {
    // Extraer attributes y asegurar que es un objeto
    const attributes = item.attributes as Record<string, unknown>;
    return {
      ...attributes,
      id: item.id
    } as T;
  }
  
  // Si ya es plano, devolverlo tal cual
  return item as T;
}
