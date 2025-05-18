// Interfaz básica para los datos de proyecto
export interface Proyecto {
  id: number;
  attributes: {
    nombre?: string;
    Fechas?: string;
    estado?: string;
    asunto?: string;
    contenidoHTML?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    [key: string]: string | number | boolean | null | undefined | object; // Para otros campos que puedan existir
  };
}

export interface ProyectosResponse {
  data: Proyecto[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
