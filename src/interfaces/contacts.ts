// Interfaces para los contactos
export interface Contact {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  position?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  tags?: string[];
  customFields?: Record<string, unknown>;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Segment {
  name: string;
  description?: string;
  criteria: SegmentCriteria[];
  contactCount?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than';
  value: string | number | boolean;
}

export interface ContactFilters {
  email?: string;
  status?: 'active' | 'unsubscribed' | 'bounced';
  tags?: string[];
  startDate?: string;
  endDate?: string;
}
