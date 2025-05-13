/**
 * HubSpot Service
 * 
 * Integración con HubSpot CRM API.
 * IMPORTANTE: En una implementación de producción, estas llamadas NUNCA deberían hacerse desde el frontend
 * para proteger tu API Key. Lo correcto sería hacerlas desde un backend seguro.
 * Esta implementación es solo para fines de demostración.
 */

// Interfaces para trabajar con datos de HubSpot
export interface HubSpotContact {
  id?: string;
  properties: {
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    total_revenue?: string; // en centavos o con decimales según configuración
    hs_lead_status?: string;
    last_purchase_date?: string;
    interaction_score?: string;
    // Otros campos personalizados según necesidad
  };
}

export interface HubSpotDeal {
  id?: string;
  properties: {
    dealname: string;
    amount?: string;
    closedate?: string;
    dealstage?: string;
    pipeline?: string;
  };
}

// Interface for the items we expect from localStorage for mapping
interface LocalCrmDataItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalSpent?: number;
  leadStatus?: string; 
  lastPurchaseDate?: string;
  interactionScore?: number;
}

// API Key de HubSpot
const HUBSPOT_API_KEY = 'pat-na1-07aa3d54-a6e8-4069-bc34-16567ffdf674';

// Base URL para la API de HubSpot
const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com';

// Función para realizar peticiones a la API de HubSpot
const fetchFromHubSpot = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${HUBSPOT_API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  const headers = {
    'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  console.log(`[HubSpot API Request] ====>
URL: ${method} ${url}
Headers: ${JSON.stringify(headers, null, 2)}
Body: ${options.body ? options.body : 'No Body'}`);

  try {
    const response = await fetch(url, { ...options, headers });
    const responseBody = await response.json().catch(() => response.text()); // Try to parse as JSON, fallback to text

    console.log(`[HubSpot API Response] <====
Status: ${response.status} ${response.statusText}
URL: ${response.url}
Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}
Body: ${typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody, null, 2)}`);

    if (!response.ok) {
      console.error(`HubSpot API Error: ${response.status} ${response.statusText}`, responseBody);
      throw new Error(`HubSpot API request failed with status ${response.status}: ${response.statusText}. Body: ${JSON.stringify(responseBody)}`);
    }
    return responseBody;
  } catch (error) {
    console.error('Error in fetchFromHubSpot:', error);
    // Log the error object itself for more details if it's not an HTTP error from above
    if (!(error instanceof Error && error.message.startsWith('HubSpot API request failed'))) {
        console.error('Raw error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
    throw error;
  }
};

// Esta función mapea tus datos de localStorage al formato esperado por HubSpot para pruebas
// o si no hay conexión a la API
const mapLocalDataToHubSpotFormat = (): { contacts: HubSpotContact[], deals: HubSpotDeal[] } => {
  try {
    const rawData = localStorage.getItem('email_marketing_crm_analysis_data');
    if (!rawData) {
      console.warn('No se encontraron datos CRM en localStorage. Carga datos de prueba primero.');
      return { contacts: [], deals: [] };
    }

    const localData: LocalCrmDataItem[] = JSON.parse(rawData);
    
    // Convertir los datos locales al formato de HubSpot
    const contacts: HubSpotContact[] = localData.map((item: LocalCrmDataItem) => {
      // Separar nombre completo en nombre y apellido (simulado)
      const nameParts = item.name ? item.name.split(' ') : ['', ''];
      const firstname = nameParts[0] || '';
      const lastname = nameParts.slice(1).join(' ') || '';
      
      return {
        id: item.id,
        properties: {
          email: item.email,
          firstname,
          lastname,
          phone: item.phone || '',
          total_revenue: item.totalSpent ? item.totalSpent.toString() : '0',
          hs_lead_status: item.leadStatus || 'Prospecto',
          last_purchase_date: item.lastPurchaseDate || '',
          interaction_score: item.interactionScore ? item.interactionScore.toString() : '0',
        }
      };
    });

    // Generar deals (oportunidades) basados en los contactos con estado "Ganado" o "Calificado"
    const deals: HubSpotDeal[] = localData
      .filter((item: LocalCrmDataItem) => ['Ganado', 'Calificado'].includes(item.leadStatus || ''))
      .map((item: LocalCrmDataItem) => {
        return {
          id: `deal_${item.id}`,
          properties: {
            dealname: `Oportunidad con ${item.name}`,
            amount: item.totalSpent ? item.totalSpent.toString() : '0',
            closedate: item.lastPurchaseDate || new Date().toISOString().split('T')[0],
            dealstage: item.leadStatus === 'Ganado' ? 'closedwon' : 'appointmentscheduled',
            pipeline: 'default',
          }
        };
      });

    return { contacts, deals };
  } catch (error) {
    console.error('Error al procesar datos locales para HubSpot:', error);
    return { contacts: [], deals: [] };
  }
};

// Función para crear contactos en HubSpot a partir de datos locales
const createContactsInHubSpot = async (): Promise<boolean> => {
  try {
    const { contacts } = mapLocalDataToHubSpotFormat();
    if (contacts.length === 0) return false;
    
    // En una implementación real, habría que verificar si los contactos ya existen
    // y actualizar en lugar de crear duplicados
    for (const contact of contacts) {
      await fetchFromHubSpot('/crm/v3/objects/contacts', {
        method: 'POST',
        body: JSON.stringify({ properties: contact.properties })
      });
      
      // Añadir una pequeña pausa para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    return true;
  } catch (error) {
    console.error('Error al crear contactos en HubSpot:', error);
    return false;
  }
};

// Función para crear deals en HubSpot
const createDealsInHubSpot = async (): Promise<boolean> => {
  try {
    const { deals } = mapLocalDataToHubSpotFormat();
    if (deals.length === 0) return false;
    
    for (const deal of deals) {
      await fetchFromHubSpot('/crm/v3/objects/deals', {
        method: 'POST',
        body: JSON.stringify({ properties: deal.properties })
      });
      
      // Añadir una pequeña pausa para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    return true;
  } catch (error) {
    console.error('Error al crear deals en HubSpot:', error);
    return false;
  }
};

/**
 * Obtiene contactos de HubSpot
 * Intenta obtener los contactos desde la API de HubSpot
 * Si falla, utiliza los datos locales como fallback
 */
export const getHubSpotContacts = async (): Promise<HubSpotContact[]> => {
  try {
    // Intentar obtener contactos desde la API de HubSpot
    const response = await fetchFromHubSpot('/crm/v3/objects/contacts?limit=100&properties=email,firstname,lastname,phone,total_revenue,hs_lead_status,last_purchase_date,interaction_score');
    
    return response.results || [];
  } catch (error) {
    console.warn('Error al obtener contactos de HubSpot API, usando datos locales:', error);
    // Fallback a datos locales
    const { contacts } = mapLocalDataToHubSpotFormat();
    return contacts;
  }
};

/**
 * Obtiene deals (oportunidades) de HubSpot
 * Intenta obtener los deals desde la API de HubSpot
 * Si falla, utiliza los datos locales como fallback
 */
export const getHubSpotDeals = async (): Promise<HubSpotDeal[]> => {
  try {
    // Intentar obtener deals desde la API de HubSpot
    const response = await fetchFromHubSpot('/crm/v3/objects/deals?limit=100&properties=dealname,amount,closedate,dealstage,pipeline');
    
    return response.results || [];
  } catch (error) {
    console.warn('Error al obtener deals de HubSpot API, usando datos locales:', error);
    // Fallback a datos locales
    const { deals } = mapLocalDataToHubSpotFormat();
    return deals;
  }
};

/**
 * Obtiene estadísticas básicas de CRM para análisis
 */
export const getHubSpotCrmStats = async (): Promise<{
  totalContacts: number;
  totalRevenue: number;
  leadsByStatus: Record<string, number>;
  avgInteractionScore: number;
  dealsWon: number;
  dealsPipeline: number;
}> => {
  const [contacts, deals] = await Promise.all([
    getHubSpotContacts(),
    getHubSpotDeals()
  ]);
  
  // Calcular estadísticas
  const totalContacts = contacts.length;
  
  let totalRevenue = 0;
  contacts.forEach(contact => {
    const revenue = parseFloat(contact.properties.total_revenue || '0');
    if (!isNaN(revenue)) {
      totalRevenue += revenue;
    }
  });
  
  // Agrupar por estados
  const leadsByStatus: Record<string, number> = {};
  contacts.forEach(contact => {
    const status = contact.properties.hs_lead_status || 'Unknown';
    leadsByStatus[status] = (leadsByStatus[status] || 0) + 1;
  });
  
  // Calcular score promedio
  let totalScore = 0;
  let contactsWithScore = 0;
  contacts.forEach(contact => {
    const score = parseInt(contact.properties.interaction_score || '0');
    if (!isNaN(score)) {
      totalScore += score;
      contactsWithScore++;
    }
  });
  const avgInteractionScore = contactsWithScore ? totalScore / contactsWithScore : 0;
  
  // Deals ganados vs en proceso
  const dealsWon = deals.filter(deal => deal.properties.dealstage === 'closedwon').length;
  const dealsPipeline = deals.length - dealsWon;
  
  return {
    totalContacts,
    totalRevenue,
    leadsByStatus,
    avgInteractionScore,
    dealsWon,
    dealsPipeline
  };
};

/**
 * Carga datos de prueba en HubSpot desde localStorage
 * Esto creará contactos y deals en tu cuenta de HubSpot basados en 
 * los datos almacenados en localStorage
 */
export const loadTestDataToHubSpot = async (): Promise<{ success: boolean, message: string }> => {
  try {
    // Primero crea los contactos
    const contactsSuccess = await createContactsInHubSpot();
    if (!contactsSuccess) {
      return { 
        success: false, 
        message: 'No se pudieron crear contactos en HubSpot. Verifica que hayas cargado datos locales primero.' 
      };
    }
    
    // Luego crea los deals
    const dealsSuccess = await createDealsInHubSpot();
    
    return { 
      success: true, 
      message: `Datos cargados en HubSpot: ${contactsSuccess ? 'Contactos OK' : 'Contactos fallidos'}, ${dealsSuccess ? 'Deals OK' : 'Deals fallidos'}` 
    };
  } catch (error) {
    console.error('Error al cargar datos de prueba en HubSpot:', error);
    return { 
      success: false, 
      message: `Error al cargar datos en HubSpot: ${error instanceof Error ? error.message : 'Error desconocido'}` 
    };
  }
};

export default {
  getHubSpotContacts,
  getHubSpotDeals,
  getHubSpotCrmStats,
  loadTestDataToHubSpot
};
