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
