import axios from 'axios';
import { Proyecto, ProyectosResponse } from '../interfaces/ProyectoTypes';

const API_BASE_URL = "http://34.238.122.213:1337/api/proyecto-56s";

export const proyectosService = {
    /**
     * Obtiene todos los proyectos desde la API
     */
    getAllProyectos: async (): Promise<ProyectosResponse> => {
        const response = await axios.get<ProyectosResponse>(API_BASE_URL);
        return response.data;
    },

    /**
     * Obtiene un proyecto específico por su ID
     */
    getProyectoById: async (id: number): Promise<Proyecto> => {
        const response = await axios.get<{ data: Proyecto }>(`${API_BASE_URL}/${id}`);
        return response.data.data;
    },

    /**
     * Crea un nuevo proyecto
     */
    createProyecto: async (proyectoData: Omit<Proyecto['attributes'], 'createdAt' | 'updatedAt' | 'publishedAt'>): Promise<Proyecto> => {
        const response = await axios.post<{ data: Proyecto }>(`${API_BASE_URL}`, {
            data: proyectoData
        });
        return response.data.data;
    },

    /**
     * Actualiza un proyecto existente
     */
    updateProyecto: async (id: number, proyectoData: Partial<Omit<Proyecto['attributes'], 'createdAt' | 'updatedAt' | 'publishedAt'>>): Promise<Proyecto> => {
        const response = await axios.put<{ data: Proyecto }>(`${API_BASE_URL}/${id}`, {
            data: proyectoData
        });
        return response.data.data;
    },

    /**
     * Elimina un proyecto
     */
    deleteProyecto: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/${id}`);
    }
};
