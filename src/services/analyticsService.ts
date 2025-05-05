import strapiService, { StrapiResponse } from './strapiService';

// Interfaces para análisis y métricas
export interface CampaignMetrics {
  campaignId: number;
  campaignTitle: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  date: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label: string;
}

export interface PerformanceMetrics {
  openRates: TimeSeriesData[];
  clickRates: TimeSeriesData[];
  bounceRates: TimeSeriesData[];
  unsubscribeRates: TimeSeriesData[];
}

export interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}

export interface GeographicData {
  country: string;
  count: number;
  percentage: number;
}

export interface TimeOfDayData {
  hour: number;
  openCount: number;
  clickCount: number;
}

// Servicio para análisis y métricas
const analyticsService = {
  /**
   * Obtiene métricas generales de todas las campañas
   * @param startDate - Fecha de inicio para filtrar
   * @param endDate - Fecha de fin para filtrar
   */
  getOverallMetrics: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      const params: any = {};
      
      if (startDate) {
        params.startDate = startDate;
      }
      
      if (endDate) {
        params.endDate = endDate;
      }
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `${strapiService.API_URL}/api/analytics/overall?${new URLSearchParams(params)}`,
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
        `${strapiService.API_URL}/api/analytics/campaign/${campaignId}`,
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
        `${strapiService.API_URL}/api/analytics/performance-over-time?${new URLSearchParams(params)}`,
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
        `${strapiService.API_URL}/api/analytics/all-performance-metrics?${new URLSearchParams(params)}`,
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
      const params: any = {};
      
      if (campaignId) {
        params.campaignId = campaignId;
      }
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `${strapiService.API_URL}/api/analytics/device-breakdown?${new URLSearchParams(params)}`,
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
      const params: any = {
        limit
      };
      
      if (campaignId) {
        params.campaignId = campaignId;
      }
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `${strapiService.API_URL}/api/analytics/geographic-data?${new URLSearchParams(params)}`,
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
      const params: any = {};
      
      if (campaignId) {
        params.campaignId = campaignId;
      }
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `${strapiService.API_URL}/api/analytics/time-of-day?${new URLSearchParams(params)}`,
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
  getSentimentAnalysis: async (campaignId?: number): Promise<any> => {
    try {
      const params: any = {};
      
      if (campaignId) {
        params.campaignId = campaignId;
      }
      
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `${strapiService.API_URL}/api/analytics/sentiment?${new URLSearchParams(params)}`,
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
  getRecommendations: async (): Promise<any> => {
    try {
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `${strapiService.API_URL}/api/analytics/recommendations`,
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
  getABTestResults: async (testId: number): Promise<any> => {
    try {
      // Suponiendo que tienes un endpoint personalizado en Strapi para esto
      const response = await fetch(
        `${strapiService.API_URL}/api/analytics/ab-test/${testId}`,
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
