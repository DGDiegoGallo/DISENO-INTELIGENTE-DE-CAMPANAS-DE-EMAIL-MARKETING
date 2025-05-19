import { create } from 'zustand';
import adminService from '../services/adminService';
import { StrapiUser } from '../interfaces/user';
import { CampaignWithUser, CampaignMetrics } from '../interfaces/admin';

// Interfaz para la estructura de datos de Strapi
interface StrapiCampaignResponse {
  id: number;
  attributes: Record<string, unknown>;
  // Propiedades directas que pueden venir en la respuesta de Strapi v5
  usuario?: Record<string, unknown>;
  nombre?: string;
  Fechas?: string;
  estado?: string;
  asunto?: string;
  contactos?: string;
  documentId?: string;
  interaccion_destinatario?: Record<string, unknown>;
  // Permitir otras propiedades desconocidas
  [key: string]: unknown;
}

// Interfaz para el estado del store
interface AdminCampaignsState {
  campaigns: CampaignWithUser[];
  loading: boolean;
  error: string | null;
  selectedUser: number | null;
  selectedCampaign: CampaignWithUser | null;
  showCampaignDetailsModal: boolean;
  showDeleteConfirm: boolean;
  userToDelete: StrapiUser | null;
  users: StrapiUser[];
  stats: {
    totalCampaigns: number;
    totalUsers: number;
    totalOpens: number;
    totalClicks: number;
    totalRegistrations: number;
    totalRevenue: number;
  };
  // Acciones
  loadData: () => Promise<void>;
  filterCampaignsByUser: (userId: number | null) => void;
  showCampaignDetails: (campaign: CampaignWithUser) => void;
  closeCampaignDetails: () => void;
  deleteUser: (userId: number) => Promise<boolean>;
  confirmDelete: (user: StrapiUser) => void;
  cancelDelete: () => void;
}

// Store de Zustand para administrar las campañas
const useAdminCampaignsStore = create<AdminCampaignsState>((set) => ({
  campaigns: [],
  loading: false,
  error: null,
  selectedUser: null,
  selectedCampaign: null,
  showCampaignDetailsModal: false,
  showDeleteConfirm: false,
  userToDelete: null,
  users: [],
  stats: {
    totalCampaigns: 0,
    totalUsers: 0,
    totalOpens: 0,
    totalClicks: 0,
    totalRegistrations: 0,
    totalRevenue: 0
  },

  // Cargar datos de usuarios y campañas
  loadData: async () => {
    set({ loading: true, error: null });
    try {
      // Cargar usuarios
      const usersResponse = await adminService.getUsersDirectly(1, 100);
      let users: StrapiUser[] = [];
      
      // usersResponse is now directly StrapiUser[] from adminService.getUsersDirectly()
      if (usersResponse && Array.isArray(usersResponse)) {
        users = usersResponse.map((userObj: StrapiUser) => {
          // StrapiUser already has the structure we need, so we can return it directly
          // StrapiUser already has all the properties we need
          return {
            id: userObj.id,
            username: userObj.username || '',
            email: userObj.email || '',
            provider: userObj.provider || 'local',
            confirmed: typeof userObj.confirmed === 'boolean' ? userObj.confirmed : false,
            blocked: typeof userObj.blocked === 'boolean' ? userObj.blocked : false,
            createdAt: userObj.createdAt || '',
            updatedAt: userObj.updatedAt || '',
            nombre: userObj.nombre || '',
            apellido: userObj.apellido || '',
            rol: userObj.rol || '',
            ...(userObj.role && typeof userObj.role === 'object' && 'type' in userObj.role ? { rol: userObj.role.type } : {})
          };
        });
      }

      // Cargar todas las campañas con información de usuario
      const campaignsResponse = await adminService.getAllCampaigns(1, 100);
      let campaigns: CampaignWithUser[] = [];
      
      if (campaignsResponse && campaignsResponse.data && Array.isArray(campaignsResponse.data)) {
        // Convertir los datos a un formato tipado
        const typedData = campaignsResponse.data as unknown as StrapiCampaignResponse[];
        
        // Primero, mostrar un resumen de los datos recibidos para diagnóstico
        const firstCampaign = typedData.length > 0 ? typedData[0] : null;
        if (firstCampaign) {
          console.log('[Store] Primera campaña completa:', firstCampaign);
          console.log('[Store] Primera campaña completa:', JSON.stringify(firstCampaign, null, 2));
        }
        
        campaigns = typedData.map((campaign) => {
          // Asegurarnos de que campaign.id es un número
          const id = typeof campaign.id === 'number' ? campaign.id : Number(campaign.id);
          const attributes = campaign.attributes || {};
          
          // Extraer datos de usuario - inicializar valores predeterminados
          let usuarioAttributes: Record<string, unknown> = {}; 
          let userId = 0;

          console.log(`[Store] Processing campaign ID: ${id}`);
          
          // ENFOQUE 1: Comprobar si el usuario está directamente en la raíz del objeto campaña
          if (campaign.usuario && typeof campaign.usuario === 'object') {
            const directUser = campaign.usuario as Record<string, unknown>;
            if (directUser.id) {
              userId = typeof directUser.id === 'number' ? directUser.id : Number(directUser.id);
              usuarioAttributes = directUser;
              console.log(`[Store] ✅ Usuario directo encontrado en la raíz de la campaña ID: ${id}, Usuario ID: ${userId}`);
            }
          }
          
          // ENFOQUE 2: Si no se encontró en la raíz, buscar en 'attributes.usuario'
          else if (!userId && attributes.usuario) {
            const usuarioContainer = attributes.usuario;
            
            // CASO 2.1: Usuario completo directo en attributes.usuario
            if (typeof usuarioContainer === 'object' && 'id' in usuarioContainer && usuarioContainer.id) {
              const directUser = usuarioContainer as Record<string, unknown>;
              userId = typeof directUser.id === 'number' ? directUser.id : Number(directUser.id);
              usuarioAttributes = directUser;
              console.log(`[Store] ✅ Usuario directo encontrado en attributes.usuario para campaña ID: ${id}, Usuario ID: ${userId}`);
            }
            
            // CASO 2.2: Formato Strapi v5 con data anidada en attributes.usuario.data
            else if (typeof usuarioContainer === 'object' && 'data' in usuarioContainer && usuarioContainer.data) {
              const usuarioData = usuarioContainer.data as Record<string, unknown>;
              
              if (usuarioData.id) {
                userId = typeof usuarioData.id === 'number' ? usuarioData.id : Number(usuarioData.id);
                
                // Si hay attributes anidados, usar esos, sino usar el objeto data completo
                if (usuarioData.attributes && typeof usuarioData.attributes === 'object') {
                  usuarioAttributes = usuarioData.attributes as Record<string, unknown>;
                } else {
                  usuarioAttributes = usuarioData;
                }
                
                console.log(`[Store] ✅ Usuario encontrado en formato Strapi v5 para campaña ID: ${id}, Usuario ID: ${userId}`);
              }
            }
          }
          
          // Si no se encontró usuario, registrar y continuar con valores predeterminados
          if (userId === 0) {
            console.warn(`[Store] ❌ No se encontró usuario válido para la campaña ID: ${id}`);
          }
          
          // Extraer interacciones si existen
          const interacciones = attributes.interaccion_destinatario || {};
          let totalOpens = 0;
          let totalClicks = 0;
          let totalRegistrations = 0;
          let totalRevenue = 0;
          
          // Calcular totales de interacciones
          Object.values(interacciones).forEach((interaccion) => {
            const interaccionObj = interaccion as Record<string, unknown>;
            totalOpens += Number(interaccionObj.opens || 0);
            totalClicks += Number(interaccionObj.clicks || 0);
            totalRegistrations += interaccionObj.se_registro_en_pagina ? 1 : 0;
            totalRevenue += parseFloat(String(interaccionObj.dinero_gastado || '0'));
          });
          
          // Convertir los valores a tipos seguros
          const documentId = String(attributes.documentId || `campaign-${campaign.id}`);
          const nombre = String(attributes.nombre || 'Sin título');
          const fechas = String(attributes.Fechas || attributes.createdAt || new Date().toISOString());
          const estado = String(attributes.estado || 'borrador');
          const asunto = String(attributes.asunto || 'Sin asunto');
          const contactos = String(attributes.contactos || '');
          const createdAt = String(attributes.createdAt || new Date().toISOString());
          const updatedAt = String(attributes.updatedAt || new Date().toISOString());
          const publishedAt = String(attributes.publishedAt || '');
          
          // Construir userName y userEmail de forma segura
          const nombreUsuario = String(usuarioAttributes.nombre || '');
          const apellidoUsuario = String(usuarioAttributes.apellido || '');
          const username = String(usuarioAttributes.username || '');
          const emailUsuario = String(usuarioAttributes.email || 'Email desconocido');

          let constructedUserName = `${nombreUsuario} ${apellidoUsuario}`.trim();
          if (!constructedUserName && username) {
            constructedUserName = username;
          }
          if (!constructedUserName) {
            constructedUserName = 'Usuario desconocido';
          }

          return {
            id: id,
            documentId: documentId,
            nombre: nombre,
            Fechas: fechas,
            estado: estado,
            asunto: asunto,
            contactos: contactos,
            createdAt: createdAt,
            updatedAt: updatedAt,
            publishedAt: publishedAt,
            usuario: {
              id: userId, // This should always be present if user is found
              username: String(usuarioAttributes.username || constructedUserName.toLowerCase().replace(/\s+/g, '_').substring(0, 20) || `user_${userId}`),
              email: emailUsuario, // Defaulted if not present from attributes
              nombre: String(usuarioAttributes.nombre || '').trim(),
              apellido: String(usuarioAttributes.apellido || '').trim(),
              provider: String(usuarioAttributes.provider || 'local'), // Default to 'local'
              confirmed: typeof usuarioAttributes.confirmed === 'boolean' ? usuarioAttributes.confirmed : true, // Default to true
              blocked: typeof usuarioAttributes.blocked === 'boolean' ? usuarioAttributes.blocked : false,   // Default to false
              createdAt: String(usuarioAttributes.createdAt || new Date().toISOString()), // Default to now
              updatedAt: String(usuarioAttributes.updatedAt || new Date().toISOString()), // Default to now
              // Optional fields from StrapiUser, provide if available or undefined
              sexo: String(usuarioAttributes.sexo || ''),
              edad: typeof usuarioAttributes.edad === 'number' ? usuarioAttributes.edad : undefined,
              fechaDeNacimiento: String(usuarioAttributes.fechaDeNacimiento || ''),
              pais: String(usuarioAttributes.pais || ''),
              ciudad: String(usuarioAttributes.ciudad || ''),
              domicilio: String(usuarioAttributes.domicilio || ''),
              telefono: String(usuarioAttributes.telefono || ''),
              avatar: String(usuarioAttributes.avatar || ''),
              rol: String(usuarioAttributes.rol || (userId === 0 ? 'public' : 'authenticated')), // Default role, or public if no user
              role: usuarioAttributes.role && typeof usuarioAttributes.role === 'object' ? usuarioAttributes.role as { id: number; name: string; type: string; } : undefined,
            } as StrapiUser,
            metrics: {
              opens: totalOpens,
              clicks: totalClicks,
              registrations: totalRegistrations,
              revenue: totalRevenue,
            } as CampaignMetrics,
            userId: userId,
            userName: constructedUserName, // Para la columna 'Usuario'
            userEmail: emailUsuario,
          } as CampaignWithUser;
        });
      }

      // Imprimir el objeto completo de la primera campaña para depuración
      if (campaigns.length > 0) {
        console.log(`[Store] Primera campaña completa:`, campaigns[0]);
      }

      // Imprimir la primera campaña completa para depuración
      if (campaigns.length > 0) {
        console.log(`[Store] Primera campaña completa:`, JSON.stringify(campaigns[0], null, 2));
      }

      // Filtrar campañas que tienen un usuario asociado en el JSON - VERSIÓN SIMPLIFICADA
      const validCampaigns = campaigns.filter(campaign => {
        // Excluir campañas con nombre "Gestión de Grupos de Contactos"
        if (campaign.nombre && campaign.nombre.trim() === 'Gestión de Grupos de Contactos') {
          console.log(`[Store] Filtrando campaña ID: ${campaign.id} - Es de Gestión de Grupos de Contactos`);
          return false;
        }

        // Verificar si la campaña tiene un objeto usuario directamente
        if (campaign.usuario) {
          // Extraer datos del usuario
          const usuario = campaign.usuario;
          
          // Verificar que el usuario tenga un ID
          if (usuario.id) {
            console.log(`[Store] Campaña ID: ${campaign.id} - Tiene usuario: ${usuario.email}`);
            
            // Asignar datos del usuario a la campaña
            campaign.userId = usuario.id;
            campaign.userName = usuario.nombre && usuario.apellido ? 
              `${usuario.nombre} ${usuario.apellido}` : 
              usuario.username || '';
            campaign.userEmail = usuario.email || '';
            
            // Agregar usuario a la lista si no existe
            const userExists = users.some(user => user.id === usuario.id);
            if (!userExists) {
              console.log(`[Store] Agregando usuario a la lista: ${usuario.email}`);
              users.push(usuario as StrapiUser);
            }
            
            return true;
          }
        }
        
        console.log(`[Store] Filtrando campaña ID: ${campaign.id} - No tiene usuario asociado`);
        return false;
      });
      
      console.log(`[Store] Total campañas originales: ${campaigns.length}, Campañas válidas después de filtrado: ${validCampaigns.length}`);
      
      // Si no hay campañas válidas, mostrar mensaje de depuración
      if (validCampaigns.length === 0 && campaigns.length > 0) {
        console.log(`[Store] ADVERTENCIA: No se encontraron campañas con usuarios válidos.`);
        console.log(`[Store] Estructura de usuario en la primera campaña:`, campaigns[0].usuario ? 
          JSON.stringify(campaigns[0].usuario, null, 2) : 'No existe propiedad usuario');
      }
      
      console.log(`[Store] Total campañas originales: ${campaigns.length}, Campañas válidas después de filtrado: ${validCampaigns.length}`);
      
      // Calcular estadísticas globales solo con campañas válidas
      const stats = {
        totalCampaigns: validCampaigns.length,
        totalUsers: users.length,
        totalOpens: validCampaigns.reduce((sum, campaign) => sum + (campaign.metrics?.opens || 0), 0),
        totalClicks: validCampaigns.reduce((sum, campaign) => sum + (campaign.metrics?.clicks || 0), 0),
        totalRegistrations: validCampaigns.reduce((sum, campaign) => sum + (campaign.metrics?.registrations || 0), 0),
        totalRevenue: validCampaigns.reduce((sum, campaign) => sum + (campaign.metrics?.revenue || 0), 0)
      };

      set({
        campaigns: validCampaigns,
        users,
        stats,
        loading: false
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      set({
        error: 'Error al cargar datos de campañas y usuarios.',
        loading: false
      });
    }
  },

  // Filtrar campañas por usuario
  filterCampaignsByUser: (userId: number | null) => {
    set({ selectedUser: userId });
  },

  // Mostrar detalles de una campaña
  showCampaignDetails: (campaign: CampaignWithUser) => {
    set({
      selectedCampaign: campaign,
      showCampaignDetailsModal: true
    });
  },

  // Eliminar un usuario
  deleteUser: async (userId: number) => {
    try {
      set({ loading: true });
      await adminService.deleteUser(userId);
      
      // Actualizar la lista de usuarios eliminando el usuario del estado actual
      // Esto proporciona una actualización inmediata en la UI sin recargar datos del servidor
      set(state => ({
        users: state.users.filter(user => user.id !== userId),
        stats: {
          ...state.stats,
          totalUsers: state.stats.totalUsers - 1
        },
        loading: false,
        showDeleteConfirm: false,
        userToDelete: null
      }));
      
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      set({ 
        error: 'Error al eliminar el usuario. Por favor, intente nuevamente.',
        loading: false 
      });
      return false;
    }
  },
  
  // Mostrar confirmación de eliminación
  confirmDelete: (user: StrapiUser) => {
    set({
      showDeleteConfirm: true,
      userToDelete: user
    });
  },
  
  // Cancelar eliminación
  cancelDelete: () => {
    set({
      showDeleteConfirm: false,
      userToDelete: null
    });
  },

  // Cerrar detalles de campaña
  closeCampaignDetails: () => {
    set({
      showCampaignDetailsModal: false,
      selectedCampaign: null
    });
  }
}));

export default useAdminCampaignsStore;