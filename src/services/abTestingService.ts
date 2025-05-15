/**
 * Servicio para administrar las pruebas A/B
 */
import { extractStrapiData, StrapiRichTextBlock } from '../interfaces/strapi';
import campaignService from './campaignService';
import * as contactsService from './contactsService';

export interface ABTest {
  id: string;
  name: string;
  date: string;
  campaignId: number;
  campaignName: string;
  groupA: string;
  groupB: string;
  subject: string;
  emailHtmlA?: string | StrapiRichTextBlock[] | null;
  emailHtmlB?: string | StrapiRichTextBlock[] | null;
  results?: ABTestResults;
}

export interface ABTestResults {
  groupA: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
  };
  groupB: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
  };
}

const AB_TESTS_STORAGE_KEY = 'email_marketing_ab_tests';

/**
 * Obtiene todas las pruebas A/B guardadas
 */
export const getAllABTests = (): ABTest[] => {
  const testsStr = localStorage.getItem(AB_TESTS_STORAGE_KEY);
  if (!testsStr) return [];
  
  try {
    return JSON.parse(testsStr);
  } catch (error) {
    console.error('Error al obtener pruebas A/B:', error);
    return [];
  }
};

/**
 * Guarda una prueba A/B nueva
 */
export const saveABTest = (test: ABTest): ABTest => {
  const tests = getAllABTests();
  
  // Verificar si ya existe (para actualizar)
  const existingIndex = tests.findIndex(t => t.id === test.id);
  
  if (existingIndex >= 0) {
    tests[existingIndex] = test;
  } else {
    // Asignar ID si es nuevo
    if (!test.id) {
      test.id = `abtest-${Date.now()}`;
    }
    test.date = new Date().toISOString();
    tests.push(test);
  }
  
  localStorage.setItem(AB_TESTS_STORAGE_KEY, JSON.stringify(tests));
  return test;
};

/**
 * Elimina una prueba A/B
 */
export const deleteABTest = (id: string): boolean => {
  const tests = getAllABTests();
  const updatedTests = tests.filter(test => test.id !== id);
  
  if (updatedTests.length === tests.length) {
    return false; // No se encontró el test
  }
  
  localStorage.setItem(AB_TESTS_STORAGE_KEY, JSON.stringify(updatedTests));
  return true;
};

/**
 * Obtiene una prueba A/B por ID
 */
export const getABTestById = (id: string): ABTest | null => {
  const tests = getAllABTests();
  return tests.find(test => test.id === id) || null;
};

// Interfaz para los bloques HTML específicos de Strapi
interface StrapiHtmlBlock {
  html?: string;
  emailHtml?: string;
  text?: string;
  type?: string;
  children?: StrapiTextChild[];
}

interface StrapiTextChild {
  text?: string;
  children?: StrapiTextChild[];
}

// Tipo para campañas locales o de cache
interface LocalCampaign {
  id: number;
  nombre?: string;
  title?: string;
  asunto?: string;
  subject?: string;
  contenidoHTML?: string | StrapiRichTextBlock[] | null;
  emailHtml?: string | StrapiRichTextBlock[] | null;
  contactos?: string;
  contactGroup?: string;
  fecha?: string;
}

/**
 * Obtiene campaña por ID para AB Test
 * Intenta primero obtener la campaña del almacenamiento local
 * Solo si no la encuentra, hace una petición a la API
 */
export const getCampaignForABTest = async (id: number) => {
  try {
    console.log(`Buscando campaña con ID ${id} para AB Test`);
    
    // 1. Primero intentamos obtener las campañas almacenadas localmente
    let campaigns: LocalCampaign[] = [];
    try {
      // Intentar obtener del cache local primero
      const campaignsCache = localStorage.getItem(CAMPAIGNS_CACHE_KEY);
      if (campaignsCache) {
        campaigns = JSON.parse(campaignsCache);
        console.log('Campañas obtenidas del cache local:', campaigns.length);
      }
    } catch (e) {
      console.error('Error al obtener campañas del cache:', e);
    }
    
    // 2. Buscar la campaña por ID en el cache local
    const localCampaign = campaigns.find((c: LocalCampaign) => c.id === id);
    if (localCampaign) {
      console.log('Campaña encontrada en cache local:', localCampaign);
      // Usar el contenido HTML en cualquiera de los formatos que pueda venir
      const htmlContent = processHtmlContent(localCampaign.contenidoHTML || localCampaign.emailHtml || '');
      
      return {
        id: localCampaign.id,
        nombre: localCampaign.nombre || localCampaign.title || 'Sin nombre',
        asunto: localCampaign.asunto || localCampaign.subject || 'Sin asunto',
        contenidoHTML: htmlContent,
        contactos: localCampaign.contactos || localCampaign.contactGroup || ''
      };
    }
    
    // 3. Si no encontramos la campaña localmente, intentamos con una llamada simulada
    console.log('Campaña no encontrada en cache, creando datos de muestra');
    
    // Crear datos de muestra para este AB Test (evitamos hacer la llamada a la API)
    // Si no se encuentra en caché, devolver datos simulados con HTML real
    return {
      id: id,
      nombre: `Campaña ${id}`,
      asunto: `Asunto de la campaña ${id}`,
      contenidoHTML: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Campaña de Prueba ${id}</h2>
          <p style="line-height: 1.6;">Este es un email de prueba para la campaña ${id}.</p>
          <p style="line-height: 1.6;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Mensaje importante:</strong> Este es un bloque destacado para información relevante.</p>
          </div>
          <p style="line-height: 1.6;">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <a href="#" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Llamada a la acción</a>
        </div>
      `,
      contactos: ''
    };
    
    // Nota: Si en el futuro queremos reactivar la llamada a la API, podemos descomentar este código:
    /*
    const response = await campaignService.getCampaignById(id);
    
    if (!response || !response.data) {
      console.error('Respuesta de getCampaignById vacía o sin datos');
      throw new Error('No se pudo obtener la campaña - Respuesta vacía');
    }
    
    console.log('Datos recibidos de campaignService:', response);
    
    const campaignData = extractStrapiData(response.data);
    console.log('Datos extraídos:', campaignData);
    
    return {
      id: campaignData.id,
      nombre: campaignData.nombre || 'Sin nombre',
      asunto: campaignData.asunto || 'Sin asunto',
      contenidoHTML: campaignData.contenidoHTML,
      contactos: campaignData.contactos || ''
    };
    */
  } catch (error) {
    console.error('Error al obtener campaña para AB Test:', error);
    // Propagar el error con un mensaje más descriptivo
    throw new Error(`Error al obtener la campaña con ID ${id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

const CAMPAIGNS_CACHE_KEY = 'campaigns_cache';

/**
 * Guarda las campañas en el cache local
 */
export const saveCampaignsToCache = (campaigns: LocalCampaign[]) => {
  try {
    localStorage.setItem(CAMPAIGNS_CACHE_KEY, JSON.stringify(campaigns));
    console.log(`Guardadas ${campaigns.length} campañas en cache local`);
    return true;
  } catch (error) {
    console.error('Error al guardar campañas en cache:', error);
    return false;
  }
};

/**
 * Obtiene todas las campañas disponibles para pruebas A/B
 */
export const getAvailableCampaigns = async () => {
  try {
    const response = await campaignService.getUserCampaigns(1, 50);
    
    if (!response || !response.data) {
      return [];
    }
    
    const campaigns: LocalCampaign[] = response.data.map((item) => {
      const campaignData = extractStrapiData(item);
      return {
        id: campaignData.id,
        nombre: campaignData.nombre,
        asunto: campaignData.asunto,
        contenidoHTML: campaignData.contenidoHTML,
        emailHtml: typeof campaignData.contenidoHTML === 'string' ? campaignData.contenidoHTML : null, 
        fecha: new Date(campaignData.Fechas || campaignData.createdAt || '').toLocaleDateString()
      };
    });
    
    // Guardar las campañas completas en el cache local para usarlas después
    saveCampaignsToCache(campaigns);
    
    return campaigns;
  } catch (error) {
    console.error('Error al obtener campañas disponibles:', error);
    return [];
  }
};

/**
 * Genera resultados simulados para pruebas A/B
 */
export const generateTestResults = (groupASent: number, groupBSent: number): ABTestResults => {
  // Generar resultados aleatorios pero realistas
  const aOpenRate = 0.15 + Math.random() * 0.4; // Entre 15% y 55%
  const bOpenRate = 0.15 + Math.random() * 0.4;
  
  const aClickRate = 0.05 + Math.random() * 0.2; // Entre 5% y 25%
  const bClickRate = 0.05 + Math.random() * 0.2;
  
  const aConversionRate = 0.01 + Math.random() * 0.05; // Entre 1% y 6%
  const bConversionRate = 0.01 + Math.random() * 0.05;
  
  const aRevenuePerConversion = 20 + Math.random() * 80; // Entre $20 y $100
  const bRevenuePerConversion = 20 + Math.random() * 80;
  
  // Calcular valores absolutos para ambos grupos
  const aOpened = Math.floor(groupASent * aOpenRate);
  const bOpened = Math.floor(groupBSent * bOpenRate);
  
  const aClicked = Math.floor(aOpened * aClickRate);
  const bClicked = Math.floor(bOpened * bClickRate);
  
  const aConverted = Math.floor(aClicked * aConversionRate);
  const bConverted = Math.floor(bClicked * bConversionRate);
  
  const aRevenue = Math.floor(aConverted * aRevenuePerConversion);
  const bRevenue = Math.floor(bConverted * bRevenuePerConversion);
  
  return {
    groupA: {
      sent: groupASent,
      opened: aOpened,
      clicked: aClicked,
      converted: aConverted,
      revenue: aRevenue
    },
    groupB: {
      sent: groupBSent,
      opened: bOpened,
      clicked: bClicked,
      converted: bConverted,
      revenue: bRevenue
    }
  };
};

/**
 * Obtiene el recuento de contactos en grupos para las pruebas A/B
 */
export const getContactsCountInGroup = (groupName: string): number => {
  if (!groupName) return 0;
  
  if (groupName === 'todos') {
    // Contar todos los contactos
    return contactsService.getAllContacts().length;
  } else {
    // Contar contactos del grupo específico
    return contactsService.getContactsByGroup(groupName).length;
  }
};

/**
 * Procesa el contenido HTML que puede venir en diferentes formatos
 * @param content Contenido HTML en formato string o StrapiRichTextBlock[]
 * @returns Contenido HTML procesado como string
 */
export const processHtmlContent = (content: string | StrapiRichTextBlock[] | null): string => {
  // Si el contenido es null o undefined
  if (!content) return '<p>No hay contenido disponible</p>';
  
  // Si el contenido es un string, devolverlo directamente
  if (typeof content === 'string') return content;
  
  // Si el contenido es un array (formato Rich Text de Strapi)
  if (Array.isArray(content)) {
    try {
      // Primero, ver si hay contenido HTML directo en algún bloque
      for (const block of content) {
        const strapiBlock = block as unknown as StrapiHtmlBlock;
        
        // Algunos bloques de Strapi tienen HTML directo en la propiedad 'html'
        if (typeof strapiBlock.html === 'string' && strapiBlock.html) {
          return strapiBlock.html;
        }
        
        // O puede estar como propiedad 'emailHtml'
        if (typeof strapiBlock.emailHtml === 'string' && strapiBlock.emailHtml) {
          return strapiBlock.emailHtml;
        }
      }
      
      // Si no hay HTML directo, intentar reconstruir el HTML a partir de bloques de texto
      let htmlContent = '';
      
      for (const block of content) {
        const strapiBlock = block as unknown as StrapiHtmlBlock;
        
        // Si el bloque tiene tipo y es un párrafo o cabecera
        if (strapiBlock.type) {
          if (strapiBlock.type === 'paragraph' && strapiBlock.children) {
            const paragraphText = strapiBlock.children
              .map(child => typeof child.text === 'string' ? child.text : '')
              .join('');
            if (paragraphText) htmlContent += `<p>${paragraphText}</p>`;
          } else if (strapiBlock.type.startsWith('heading') && strapiBlock.children) {
            const level = strapiBlock.type.charAt(strapiBlock.type.length - 1) || '3';
            const headingText = strapiBlock.children
              .map(child => typeof child.text === 'string' ? child.text : '')
              .join('');
            if (headingText) htmlContent += `<h${level}>${headingText}</h${level}>`;
          }
        } else if (strapiBlock.children && Array.isArray(strapiBlock.children)) {
          // Si el bloque solo tiene children sin tipo específico
          const text = strapiBlock.children
            .map(child => typeof child.text === 'string' ? child.text : '')
            .join('');
          if (text) htmlContent += `<p>${text}</p>`;
        }
      }
      
      if (htmlContent) {
        return htmlContent;
      }
      
      // Si aún no tenemos contenido, intentar cualquier texto disponible
      return content
        .map(block => {
          const strapiBlock = block as unknown as StrapiHtmlBlock;
          // Revisar cualquier propiedad que pueda tener texto
          const text = typeof strapiBlock.text === 'string' ? strapiBlock.text : '';
          if (text) return `<p>${text}</p>`;
          
          // Intentar con children si existe
          if (strapiBlock.children && Array.isArray(strapiBlock.children)) {
            const childText = strapiBlock.children
              .map(child => typeof child.text === 'string' ? child.text : '')
              .filter(Boolean)
              .join(' ');
            if (childText) return `<p>${childText}</p>`;
          }
          return '';
        })
        .filter(Boolean)
        .join('') || '<p>No se pudo extraer contenido HTML</p>';
    } catch (e) {
      console.error('Error al procesar el Rich Text:', e);
      return '<p>Error al procesar el contenido HTML</p>';
    }
  }
  
  return '<p>Formato de contenido no reconocido</p>';
};

/**
 * Obtiene los grupos disponibles para pruebas A/B
 */
export const getAvailableGroups = (): string[] => {
  return contactsService.getAllGroups();
};
