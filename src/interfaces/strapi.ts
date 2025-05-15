// Interfaces para los tipos de datos de Strapi
// Definimos interface para datos que pueden venir aplanados o con attributes

// Strapi Rich Text Block interface para manejar contenido en formato Rich Text
export interface StrapiRichTextBlock {
  type: string;
  children: {
    type?: string;
    text?: string;
    [key: string]: unknown; // Para otras propiedades que pueda tener
  }[];
  [key: string]: unknown; // Para otras propiedades que pueda tener
}
type StrapiAttributes<T> = {
  id: number;
} & ({
  attributes: T;
} | T);

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

// Mantenemos StrapiData para retrocompatibilidad
export interface StrapiData<T> {
  id: number;
  attributes: T;
}

export interface StrapiSingleResponse<T> {
  data: StrapiAttributes<T>;
  meta: Record<string, unknown>;
}

// Función auxiliar para extraer los datos de un objeto Strapi
// independientemente de si están aplanados o dentro de attributes
export function extractStrapiData<T>(data: StrapiAttributes<T>): T & { id: number } {
  const { id } = data;
  // Si hay attributes, devolvemos su contenido con el id
  if ('attributes' in data) {
    return { ...data.attributes, id };
  }
  // Si no hay attributes, ya está aplanado
  return data as T & { id: number };
}
