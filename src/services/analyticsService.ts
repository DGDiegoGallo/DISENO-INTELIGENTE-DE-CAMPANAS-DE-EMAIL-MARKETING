// Importar interfaces desde la carpeta de interfaces
import { CampaignMetrics, TimeSeriesData, PerformanceMetrics, DeviceBreakdown, GeographicData, TimeOfDayData } from '../interfaces/analytics';

// Servicio para análisis y métricas
const analyticsService = {
  /**
   * Obtiene métricas generales de todas las campañas
   * @param startDate - Fecha de inicio para filtrar
   * @param endDate - Fecha de fin para filtrar
   */
  getOverallMetrics: async (startDate?: string, endDate?: string): Promise<Record<string, unknown>> => {
    try {
      const params: Record<string, string> = {};
      
      if (startDate) {
        params.startDate = startDate;
      }
      
      if (endDate) {
        params.endDate = endDate;
      }
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `http://34.238.122.213:1337/api/analytics/overall?${new URLSearchParams(params)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener métricas generales:', error);
      throw error;
    }
  },

  /**
   * Obtiene métricas de una campaña específica
   * @param campaignId - ID de la campaña
   */
  getCampaignMetrics: async (campaignId: number): Promise<CampaignMetrics> => {
    try {
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `http://34.238.122.213:1337/api/analytics/campaign/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error(`Error al obtener métricas de campaña ${campaignId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene datos de rendimiento a lo largo del tiempo
   * @param metric - Métrica a obtener (open, click, bounce, unsubscribe)
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @param interval - Intervalo de tiempo (day, week, month)
   */
  getPerformanceOverTime: async (
    metric: 'open' | 'click' | 'bounce' | 'unsubscribe',
    startDate: string,
    endDate: string,
    interval: 'day' | 'week' | 'month' = 'day'
  ): Promise<TimeSeriesData[]> => {
    try {
      const params = {
        metric,
        startDate,
        endDate,
        interval
      };
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `http://34.238.122.213:1337/api/analytics/performance-over-time?${new URLSearchParams(params)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error(`Error al obtener datos de rendimiento para ${metric}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene todas las métricas de rendimiento a lo largo del tiempo
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @param interval - Intervalo de tiempo (day, week, month)
   */
  getAllPerformanceMetrics: async (
    startDate: string,
    endDate: string,
    interval: 'day' | 'week' | 'month' = 'day'
  ): Promise<PerformanceMetrics> => {
    try {
      const params = {
        startDate,
        endDate,
        interval
      };
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `http://34.238.122.213:1337/api/analytics/all-performance-metrics?${new URLSearchParams(params)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener todas las métricas de rendimiento:', error);
      throw error;
    }
  },

  /**
   * Obtiene el desglose de dispositivos utilizados para abrir emails
   * @param campaignId - ID de la campaña (opcional, si no se proporciona devuelve datos generales)
   */
  getDeviceBreakdown: async (campaignId?: number): Promise<DeviceBreakdown> => {
    try {
      const params: Record<string, string> = {};
      
      if (campaignId) {
        params.campaignId = campaignId.toString();
      }
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `http://34.238.122.213:1337/api/analytics/device-breakdown?${new URLSearchParams(params)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener desglose de dispositivos:', error);
      throw error;
    }
  },

  /**
   * Obtiene datos geográficos de aperturas de email
   * @param campaignId - ID de la campaña (opcional, si no se proporciona devuelve datos generales)
   * @param limit - Número máximo de países a devolver
   */
  getGeographicData: async (campaignId?: number, limit = 10): Promise<GeographicData[]> => {
    try {
      // Convertir los parámetros a un formato que URLSearchParams pueda manejar
      const queryParams = new URLSearchParams();
      
      // Agregar el límite
      queryParams.append('limit', limit.toString());
      
      // Agregar el ID de campaña si existe
      if (campaignId) {
        queryParams.append('campaignId', campaignId.toString());
      }
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `http://34.238.122.213:1337/api/analytics/geographic-data?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener datos geográficos:', error);
      throw error;
    }
  },

  /**
   * Obtiene datos de hora del día para aperturas y clics
   * @param campaignId - ID de la campaña (opcional, si no se proporciona devuelve datos generales)
   */
  getTimeOfDayData: async (campaignId?: number): Promise<TimeOfDayData[]> => {
    try {
      const params: Record<string, string> = {};
      
      if (campaignId) {
        params.campaignId = campaignId.toString();
      }
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `http://34.238.122.213:1337/api/analytics/time-of-day?${new URLSearchParams(params)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener datos de hora del día:', error);
      throw error;
    }
  },

  /**
   * Obtiene análisis de sentimiento basado en respuestas y feedback
   * @param campaignId - ID de la campaña (opcional, si no se proporciona devuelve datos generales)
   */
  getSentimentAnalysis: async (campaignId?: number): Promise<Record<string, unknown>> => {
    try {
      const params: Record<string, string> = {};
      
      if (campaignId) {
        params.campaignId = campaignId.toString();
      }
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `http://34.238.122.213:1337/api/analytics/sentiment?${new URLSearchParams(params)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener análisis de sentimiento:', error);
      throw error;
    }
  },

  /**
   * Obtiene recomendaciones basadas en datos históricos
   */
  getRecommendations: async (): Promise<Record<string, unknown>> => {
    try {
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `http://34.238.122.213:1337/api/analytics/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      throw error;
    }
  },

  /**
   * Obtiene datos para pruebas A/B
   * @param testId - ID de la prueba A/B
   */
  getABTestResults: async (testId: number): Promise<Record<string, unknown>> => {
    try {
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `http://34.238.122.213:1337/api/analytics/ab-test/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error(`Error al obtener resultados de prueba A/B ${testId}:`, error);
      throw error;
    }
  }
};

export default analyticsService;
