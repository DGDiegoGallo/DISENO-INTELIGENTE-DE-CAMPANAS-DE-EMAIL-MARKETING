/**
 * CRM Service
 * 
 * Servicio para análisis CRM basado en datos de campañas existentes.
 * Reemplaza la integración con HubSpot para usar datos internos.
 */
import strapiService from './strapiService';
import { CrmAnalysisContact, CrmStats, ProcessedCampaign, DestinationInteraction } from '../interfaces/crm';
import { extractStrapiData } from '../interfaces/strapi';

/**
 * Obtiene las campañas desde Strapi
 */
export const getCampaigns = async (): Promise<ProcessedCampaign[]> => {
  try {
    // Configuración para obtener campañas con la relación usuario
    const queryParams: Record<string, string | number> = {
      'pagination[page]': 1,
      'pagination[pageSize]': 100,
      'populate': 'usuario',
    };

    // Obtener datos desde Strapi
    console.log('Obteniendo campañas desde Strapi...');
    const response = await strapiService.getCollection<Record<string, unknown>>('proyecto-56s', queryParams);
    console.log('Respuesta de Strapi:', response);
    
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.error('Formato de respuesta inesperado:', response);
      return [];
    }
    
    // Transformar los datos al formato esperado usando la función auxiliar
    const campaigns: ProcessedCampaign[] = [];
    
    for (const item of response.data) {
      try {
        // Extraer datos usando la función auxiliar de Strapi
        const processedItem = extractStrapiData(item);
        campaigns.push(processedItem as unknown as ProcessedCampaign);
      } catch (err) {
        console.error('Error al procesar item de campaña:', item, err);
      }
    }
    
    console.log('Campañas procesadas:', campaigns.length);
    return campaigns;
  } catch (error) {
    console.error('Error al obtener campañas:', error);
    return [];
  }
};

/**
 * Genera contactos CRM a partir de datos de campañas
 */
export const getCrmContacts = async (): Promise<CrmAnalysisContact[]> => {
  try {
    // Obtener todas las campañas primero
    const campaigns = await getCampaigns();
    console.log('getCrmContacts: Campañas obtenidas (total):', campaigns.length);
    
    // Obtener el ID del usuario actual desde localStorage
    let currentUserId: number | null = null;
    try {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const parsedData = JSON.parse(authData);
        // Extraer el ID del usuario desde la estructura de datos en localStorage
        if (parsedData?.state?.user) {
          currentUserId = typeof parsedData.state.user === 'object' ? 
            parsedData.state.user.id : 
            Number(parsedData.state.user);
        }
      }
    } catch (e) {
      console.error('Error al obtener el ID del usuario actual:', e);
    }
    
    // Filtrar las campañas para mostrar solo las del usuario actual
    const userCampaigns = currentUserId 
      ? campaigns.filter(campaign => {
          let campaignOwnerId: number | string | undefined;
          if (typeof campaign.usuario === 'object' && campaign.usuario !== null) {
            // Assuming extractStrapiData flattens the user object
            campaignOwnerId = campaign.usuario.id;
          } else if (typeof campaign.usuario === 'number' || typeof campaign.usuario === 'string') {
            // If campaign.usuario is already a direct ID
            campaignOwnerId = campaign.usuario;
          }
          
          console.log(`[DEBUG CRM Filter] Campaign ID: ${campaign.id}, Campaign UserID: ${campaignOwnerId} (Type: ${typeof campaignOwnerId}), Current UserID: ${currentUserId} (Type: ${typeof currentUserId})`);
          return campaignOwnerId === currentUserId;
        })
      : campaigns;
      
    console.log(`Campañas filtradas por usuario (${currentUserId}):`, userCampaigns.length);
    
    // Arreglo para almacenar todos los contactos generados a partir de campañas
    const contacts: CrmAnalysisContact[] = [];
    
    // Si no hay campañas del usuario actual, no generar datos
    if (userCampaigns.length === 0) {
      console.log('No hay campañas disponibles para este usuario.');
      return [];
    }
    
    // Filtrar campañas excluyendo solo "Sistema de Grupos"
    const filteredCampaigns = userCampaigns.filter(campaign => {
      const asunto = campaign.asunto?.toLowerCase() || '';
      return !asunto.includes('sistema de grupos');
    });
    
    console.log(`Campañas filtradas: ${filteredCampaigns.length}`);
    
    // Procesar cada campaña para obtener contactos reales
    filteredCampaigns.forEach(campaign => {
      // Extraer datos base de la campaña
      const campaignData = {
        id: campaign.id,
        name: campaign.nombre || 'Campaña sin nombre',
        date: campaign.Fechas || campaign.createdAt
      };
      
      console.log(`Procesando campaña: ${campaignData.name} (${campaignData.id})`);
      
      // 1. Procesar contactos de gruposdecontactosJSON si existe
      if (campaign.gruposdecontactosJSON && typeof campaign.gruposdecontactosJSON === 'object' && 'grupos' in campaign.gruposdecontactosJSON) {
        try {
          const grupos = campaign.gruposdecontactosJSON.grupos;
          if (Array.isArray(grupos)) {
            grupos.forEach(grupo => {
              if (grupo && grupo.contactos && Array.isArray(grupo.contactos)) {
                grupo.contactos.forEach(contacto => {
                  if (contacto && contacto.email) {
                    // Usar datos reales del contacto
                    const email = contacto.email.trim();
                    const nombre = contacto.nombre || email.split('@')[0];
                    
                    // Buscar datos de interacción si existen
                    let interactionData: DestinationInteraction | undefined = undefined;
                    let leadStatus = 'Prospecto';
                    let totalSpent = 0;
                    
                    // Verificar si hay datos de interacción para este email
                    if (campaign.interaccion_destinatario && typeof campaign.interaccion_destinatario === 'object') {
                      const normalizedEmail = email.replace('@', '_').replace(/\./g, '_');
                      const interaccion = campaign.interaccion_destinatario[normalizedEmail] as DestinationInteraction | undefined;
                      
                      if (interaccion && typeof interaccion === 'object') {
                        // Acceder a las propiedades con verificación de tipo
                        const dineroGastado = 'dinero_gastado' in interaccion ? interaccion.dinero_gastado : undefined;
                        const seRegistro = 'se_registro_en_pagina' in interaccion ? !!interaccion.se_registro_en_pagina : false;
                        
                        // Convertir dinero_gastado a número
                        const gastado = typeof dineroGastado === 'string' ?
                          parseFloat(dineroGastado) :
                          Number(dineroGastado) || 0;
                          
                        // Aplicar lógica de negocio para determinar estado
                        if (seRegistro) {
                          if (gastado > 0) {
                            leadStatus = 'Ganado';
                          } else {
                            leadStatus = 'Contactado';
                          }
                        } else {
                          leadStatus = 'Prospecto';
                        }
                        
                        totalSpent = gastado;
                        interactionData = interaccion;
                      }
                    }
                    
                    // Si no hay datos de interacción específicos, calcular un score aleatorio
                    const interactionScore = interactionData ? 
                      (leadStatus === 'Ganado' ? 9 : leadStatus === 'Contactado' ? 6 : 3) : 
                      Math.floor(Math.random() * 10) + 1;
                    
                    // Crear contacto con datos reales e incluir datos de interacción directamente
                    contacts.push({
                      id: `crm-${campaign.id}-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
                      name: nombre,
                      email,
                      interactionScore,
                      totalSpent,
                      lastPurchaseDate: getCampaignDate(campaign),
                      leadStatus: leadStatus as 'Prospecto' | 'Contactado' | 'Calificado' | 'Perdido' | 'Ganado',
                      campaign: campaignData,
                      interactionData: interactionData
                    });
                  }
                });
              }
            });
          }
        } catch (err) {
          console.error('Error al procesar grupos de contactos:', err);
        }
      }
      // 2. Procesar contactos directos si no se encontraron en grupos
      else if (campaign.contactos && typeof campaign.contactos === 'string') {
        try {
          const emails = campaign.contactos.split(',').map(email => email.trim());
          emails.forEach(email => {
            if (email) {
              // Buscar datos de interacción si existen
              let interactionData: DestinationInteraction | undefined = undefined;
              let leadStatus = 'Prospecto';
              let totalSpent = 0;
              
              // Verificar si hay datos de interacción para este email
              if (campaign.interaccion_destinatario && typeof campaign.interaccion_destinatario === 'object') {
                try {
                  const emailKey = email.replace('@', '_').replace('.', '_');
                  const interaccion = campaign.interaccion_destinatario[emailKey] as DestinationInteraction | undefined;
                  
                  if (interaccion && typeof interaccion === 'object') {
                    // Acceder a las propiedades con verificación de tipo
                    const dineroGastado = 'dinero_gastado' in interaccion ? interaccion.dinero_gastado : undefined;
                    const seRegistro = 'se_registro_en_pagina' in interaccion ? !!interaccion.se_registro_en_pagina : false;
                    
                    // Convertir dinero_gastado a número
                    const gastado = typeof dineroGastado === 'string' ?
                      parseFloat(dineroGastado) :
                      Number(dineroGastado) || 0;
                      
                    // Aplicar lógica de negocio para determinar estado
                    if (seRegistro) {
                      if (gastado > 0) {
                        leadStatus = 'Ganado';
                      } else {
                        leadStatus = 'Contactado';
                      }
                    } else {
                      leadStatus = 'Prospecto';
                    }
                    
                    totalSpent = gastado;
                    interactionData = interaccion;
                  }
                } catch (err) {
                  console.error('Error al procesar datos de interacción:', err);
                }
              }
              
              // Si no hay datos específicos, usar valores aleatorios
              if (interactionData === undefined) {
                const interactionScore = Math.floor(Math.random() * 10) + 1; // 1-10
                leadStatus = getLeadStatusFromScore(interactionScore);
                totalSpent = getTotalSpentFromStatus(leadStatus);
                // Crear un objeto de interacción básico para evitar errores de tipado
                interactionData = {};
              }
              
              // Calcular score basado en el estado
              const interactionScore = leadStatus === 'Ganado' ? 9 : 
                                      leadStatus === 'Contactado' ? 6 : 
                                      leadStatus === 'Calificado' ? 5 : 
                                      leadStatus === 'Perdido' ? 4 : 3;
              
              // Crear contacto con email real e incluir datos de interacción
              contacts.push({
                id: `crm-${campaign.id}-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
                name: email.split('@')[0],
                email,
                interactionScore,
                totalSpent,
                lastPurchaseDate: getCampaignDate(campaign),
                leadStatus: leadStatus as 'Prospecto' | 'Contactado' | 'Calificado' | 'Perdido' | 'Ganado',
                campaign: campaignData,
                interactionData: interactionData
              });
            }
          });
        } catch (err) {
          console.error('Error al procesar contactos directos:', err);
        }
      }
    });
    
    console.log(`Total de contactos reales procesados: ${contacts.length}`);
    
    // Función para agrupar contactos por mes basado en lastPurchaseDate o fecha de campaña
    function getCampaignDate(campaign: ProcessedCampaign): string {
      // Intentar usar la fecha de la campaña o crear una fecha reciente
      const date = campaign.Fechas || campaign.createdAt || campaign.updatedAt;
      return date ? new Date(date).toISOString().split('T')[0] : 
             new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    

    
    // Devolver el array de contactos
    return contacts;
  } catch (error) {
    console.error('Error al obtener contactos CRM:', error);
    // En caso de error, devolver datos de ejemplo
    return generateSampleContacts(10);
  }
};

/**
 * Genera contactos de ejemplo para demostración
 */
const generateSampleContacts = (count: number): CrmAnalysisContact[] => {
  const contacts: CrmAnalysisContact[] = [];
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'empresa.com', 'outlook.com'];
  const names = ['Juan', 'María', 'Pedro', 'Ana', 'Carlos', 'Laura', 'Sergio', 'Lucía', 'Miguel', 'Sofía'];
  const lastNames = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Fernández'];
  const campaignNames = ['Campaña Primavera', 'Promoción Verano', 'Descuentos Otoño', 'Especial Navidad', 'Aniversario'];
  
  // Generar fechas para los últimos 5 meses
  const today = new Date();
  const dates: string[] = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    dates.push(date.toISOString().split('T')[0]); // Formato YYYY-MM-DD
  }
  
  for (let i = 0; i < count; i++) {
    const name = `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const email = `${name.toLowerCase().replace(' ', '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const interactionScore = Math.floor(Math.random() * 100);
    const leadStatus = getLeadStatusFromScore(interactionScore);
    const totalSpent = getTotalSpentFromStatus(leadStatus);
    const lastPurchaseDate = dates[Math.floor(Math.random() * dates.length)];
    
    // Crear campaña aleatoria
    const campaignId = Math.floor(Math.random() * 1000) + 1;
    const campaignName = campaignNames[Math.floor(Math.random() * campaignNames.length)];
    
    contacts.push({
      id: `sample-${i}`,
      name,
      email,
      interactionScore,
      totalSpent,
      lastPurchaseDate,
      leadStatus: leadStatus as 'Prospecto' | 'Contactado' | 'Calificado' | 'Perdido' | 'Ganado',
      campaign: {
        id: campaignId,
        name: campaignName,
        date: lastPurchaseDate
      }
    });
  }
  
  return contacts;
};

// Estas funciones se utilizan en el procesamiento de contactos reales de campañas

/**
 * Determina el estado del lead basado en la puntuación
 */
const getLeadStatusFromScore = (score: number): string => {
  if (score < 20) return 'Prospecto';
  if (score < 40) return 'Contactado';
  if (score < 60) return 'Calificado';
  if (score < 80) return 'Perdido';
  return 'Ganado';
};

/**
 * Calcula el gasto total basado en el estado
 */
const getTotalSpentFromStatus = (status: string): number => {
  switch (status) {
    case 'Prospecto': return Math.floor(Math.random() * 100);
    case 'Contactado': return Math.floor(Math.random() * 500) + 100;
    case 'Calificado': return Math.floor(Math.random() * 1000) + 500;
    case 'Perdido': return Math.floor(Math.random() * 2000) + 1000;
    case 'Ganado': return Math.floor(Math.random() * 5000) + 2000;
    default: return 0;
  }
};

/**
 * Genera estadísticas CRM a partir de los contactos
 */
export const getCrmStats = async (): Promise<CrmStats> => {
  try {
    const contacts = await getCrmContacts();
    
    // Calcular estadísticas básicas
    const totalContacts = contacts.length;
    
    // Calcular ingresos totales
    let totalRevenue = 0;
    contacts.forEach(contact => {
      if (contact.totalSpent) {
        totalRevenue += contact.totalSpent;
      }
    });
    
    // Calcular score promedio de interacción
    let totalScore = 0;
    let contactsWithScore = 0;
    contacts.forEach(contact => {
      if (contact.interactionScore) {
        totalScore += contact.interactionScore;
        contactsWithScore++;
      }
    });
    const avgInteractionScore = contactsWithScore ? totalScore / contactsWithScore : 0;
    
    // Calcular deals ganados y en pipeline
    const dealsWon = contacts.filter(contact => contact.leadStatus === 'Ganado').length;
    const dealsPipeline = contacts.filter(contact => 
      contact.leadStatus === 'Prospecto' || 
      contact.leadStatus === 'Contactado' || 
      contact.leadStatus === 'Calificado'
    ).length;
    
    return {
      totalContacts,
      totalRevenue,
      avgInteractionScore,
      dealsWon,
      dealsPipeline
    };
  } catch (error) {
    console.error('Error al calcular estadísticas CRM:', error);
    return {
      totalContacts: 0,
      totalRevenue: 0,
      avgInteractionScore: 0,
      dealsWon: 0,
      dealsPipeline: 0
    };
  }
};

export default {
  getCrmContacts,
  getCrmStats
};
