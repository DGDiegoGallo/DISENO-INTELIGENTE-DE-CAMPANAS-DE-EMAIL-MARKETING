// Interfaces para la información de usuario

// Datos básicos del usuario que vienen de Strapi
export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  // Campos adicionales del perfil
  nombre?: string;
  apellido?: string;
  sexo?: string;
  edad?: number;
  fechaDeNacimiento?: string;
  pais?: string;
  ciudad?: string;
  domicilio?: string;
  telefono?: string;
  avatar?: string;
  // Rol de usuario que viene directamente en el campo rol
  rol?: string;
  // O también puede venir a través del objeto role
  role?: {
    id: number;
    name: string;
    type: string;
  };
}

// Datos para el registro de usuario
export interface RegisterUserData {
  // Datos obligatorios para Strapi
  username: string;
  email: string;
  password: string;
  
  // Datos adicionales del perfil
  nombre?: string;
  apellido?: string;
  sexo?: string;
  edad?: number;
  fechaDeNacimiento?: string;
  pais?: string;
  ciudad?: string;
  domicilio?: string;
  telefono?: string;
  avatar?: string;
  confirmed?: boolean;
  blocked?: boolean;
}

// Datos para la actualización del perfil
export interface UpdateProfileData {
  nombre?: string;
  apellido?: string;
  sexo?: string;
  edad?: number;
  fechaDeNacimiento?: string;
  pais?: string;
  ciudad?: string;
  domicilio?: string;
  telefono?: string;
  avatar?: string;
}
