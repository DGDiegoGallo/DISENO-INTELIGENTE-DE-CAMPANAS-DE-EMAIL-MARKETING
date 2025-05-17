import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash, FaEye, FaSync } from 'react-icons/fa';
import campaignService from '../../services/campaignService';
import { extractStrapiData } from '../../interfaces/strapi';
import useLoadingStore from '../../store/useLoadingStore';

interface Campaign {
  id: number;
  fecha: string;
  title: string;
  subject: string;
  contactGroup: string;
  scheduledTime: string;
  emailDesign?: Record<string, unknown> | string | null; // Diseño del email
  emailHtml?: string | null; // HTML generado, puede ser null si no hay contenido
}

// Añadir la prop onShowCreate a la interfaz
interface CampaignsViewProps {
  onShowCreate: () => void;
}

const CampaignsView: React.FC<CampaignsViewProps> = ({ onShowCreate }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showPreview, setShowPreview] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useLocalStorage, setUseLocalStorage] = useState(false); // Cargar desde Strapi por defecto

  // Función para cargar datos de ejemplo o desde localStorage
  const loadFromLocalStorage = useCallback(() => {
    // Intentar obtener campañas guardadas
    const savedCampaignsStr = localStorage.getItem('campaigns');
    let savedCampaigns: Campaign[] = [];
    
    if (savedCampaignsStr) {
      try {
        savedCampaigns = JSON.parse(savedCampaignsStr);
      } catch (error) {
        console.error('Error al cargar campañas guardadas:', error);
      }
    }
    
    // Si hay una campaña actual, verificar si ya existe o agregarla
    const currentCampaignStr = localStorage.getItem('currentCampaign');
    if (currentCampaignStr) {
      try {
        const currentCampaign = JSON.parse(currentCampaignStr);
        
        // Verificar si ya existe una campaña con el mismo título
        const existingIndex = savedCampaigns.findIndex(c => 
          c.title === currentCampaign.title && c.subject === currentCampaign.subject
        );
        
        if (existingIndex >= 0) {
          // Actualizar campaña existente
          savedCampaigns[existingIndex] = {
            ...currentCampaign,
            id: savedCampaigns[existingIndex].id,
            fecha: new Date().toLocaleDateString()
          };
        } else {
          // Agregar nueva campaña
          savedCampaigns.push({
            ...currentCampaign,
            id: Date.now(),
            fecha: new Date().toLocaleDateString()
          });
        }
        
        // Guardar campañas actualizadas
        localStorage.setItem('campaigns', JSON.stringify(savedCampaigns));
      } catch (error) {
        console.error('Error al procesar campaña actual:', error);
      }
    }
    
    // Si no hay campañas guardadas, usar datos de ejemplo
    if (savedCampaigns.length === 0) {
      savedCampaigns = [
        { id: 1, fecha: '05/05/2025', title: 'Campaña de bienvenida', subject: 'Bienvenido a nuestra plataforma', contactGroup: 'todos', scheduledTime: '2025-05-10T10:00' },
        { id: 2, fecha: '04/05/2025', title: 'Promoción de mayo', subject: 'Ofertas especiales solo este mes', contactGroup: 'grupo1', scheduledTime: '2025-05-15T09:30' },
        { id: 3, fecha: '03/05/2025', title: 'Actualización de servicios', subject: 'Nuevas funcionalidades disponibles', contactGroup: 'grupo2', scheduledTime: '2025-05-20T14:00' },
        { id: 4, fecha: '02/05/2025', title: 'Webinar de marketing', subject: 'Invitación a nuestro webinar mensual', contactGroup: 'todos', scheduledTime: '2025-05-25T16:00' },
        { id: 5, fecha: '01/05/2025', title: 'Encuesta de satisfacción', subject: 'Tu opinión es importante para nosotros', contactGroup: 'grupo3', scheduledTime: '2025-05-30T11:00' },
      ];
      localStorage.setItem('campaigns', JSON.stringify(savedCampaigns));
    }
    
    setCampaigns(savedCampaigns);
  }, []);
  
  // Función para cargar campañas desde Strapi (filtradas por usuario logueado)
  const loadFromStrapi = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      useLoadingStore.getState().startLoading('Cargando tus campañas...');
      
      // Obtener campañas desde Strapi (solo las del usuario logueado)
      const response = await campaignService.getUserCampaigns(1, 50);
      
      // Verificar la estructura real de los datos para depuración
      console.log('Estructura completa de la respuesta (campañas del usuario):', response);
      
      // Mapear los datos de Strapi al formato de la interfaz Campaign
      // Usar extractStrapiData para obtener los datos independientemente de si están aplanados o en attributes
      const strapiCampaigns = response.data.map((item) => {
        // Extraer los datos usando nuestra función auxiliar
        const campaignData = extractStrapiData(item);
        console.log('Datos extraídos:', campaignData);
        
        return {
          id: campaignData.id,
          fecha: new Date(campaignData.Fechas || campaignData.createdAt || '').toLocaleDateString(),
          title: campaignData.nombre,
          subject: campaignData.asunto,
          contactGroup: campaignData.contactos || '',
          scheduledTime: campaignData.Fechas || '',
          // Procesar el contenido HTML que puede venir en formato Rich Text de Strapi
          emailHtml: (() => {
            const content = campaignData.contenidoHTML;
            // Si el contenido es null o undefined
            if (!content) return null;
            // Si el contenido es un string, devolverlo directamente
            if (typeof content === 'string') return content;
            // Si el contenido es un array (formato Rich Text de Strapi)
            if (Array.isArray(content)) {
              try {
                // Extraer el texto de los bloques
                return content.map(block => {
                  if (block.children && Array.isArray(block.children)) {
                    return block.children.map(child => child.text || '').join(' ');
                  }
                  return '';
                }).join('\n');
              } catch (e) {
                console.error('Error al procesar el Rich Text:', e);
                return null;
              }
            }
            return null;
          })(),
          emailDesign: campaignData.campanaJSON
        };
      });
      
      setCampaigns(strapiCampaigns);
      setIsLoading(false);
      useLoadingStore.getState().stopLoading();
    } catch (error) {
      console.error('Error al cargar campañas desde Strapi:', error);
      setError('No se pudieron cargar las campañas desde Strapi. Usando datos locales.');
      setIsLoading(false);
      useLoadingStore.getState().stopLoading();
      
      // Si falla, cargar desde localStorage como respaldo
      loadFromLocalStorage();
    }
  }, [loadFromLocalStorage]);

  // Cargar campañas desde Strapi o localStorage
  useEffect(() => {
    const loadCampaigns = async () => {
      if (useLocalStorage) {
        // Cargar desde localStorage (para desarrollo/pruebas)
        loadFromLocalStorage();
      } else {
        // Cargar desde Strapi
        await loadFromStrapi();
      }
    };
    
    loadCampaigns();
  }, [useLocalStorage, loadFromStrapi, loadFromLocalStorage]);
  

  

  
  const handleDelete = async (id: number) => {
    try {
      if (useLocalStorage) {
        // Eliminar de localStorage
        const updatedCampaigns = campaigns.filter(campaign => campaign.id !== id);
        setCampaigns(updatedCampaigns);
        localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      } else {
        // Eliminar de Strapi
        setIsLoading(true);
        await campaignService.deleteCampaign(id);
        // Recargar la lista
        await loadFromStrapi();
      }
    } catch (error) {
      console.error('Error al eliminar la campaña:', error);
      setError('Error al eliminar la campaña. Por favor intenta nuevamente.');
      setIsLoading(false);
    }
  };
  
  const handleEdit = (campaign: Campaign) => {
    localStorage.setItem('currentCampaign', JSON.stringify(campaign));
    onShowCreate();
  };
  
  const togglePreview = (id: number) => {
    setShowPreview(showPreview === id ? null : id);
  };

  return (
    <div className="container-fluid p-4">
      {/* Ya no necesitamos este indicador local porque usamos el global */}

      {/* Mensajes de estado */}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => setError(null)}
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <h2 className="mb-0 me-3">Interacciones</h2>
          {isLoading && <span className="text-secondary">Cargando...</span>}
        </div>
        <div>
          {/* Toggle para cambiar entre localStorage y Strapi */}
          <div className="form-check form-switch d-inline-block me-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="dataSourceToggle"
              checked={!useLocalStorage}
              onChange={() => setUseLocalStorage(!useLocalStorage)}
            />
            <label className="form-check-label" htmlFor="dataSourceToggle">
              {useLocalStorage ? 'Usando localStorage' : 'Usando Strapi'}
            </label>
          </div>
          
          <button 
            onClick={() => useLocalStorage ? loadFromLocalStorage() : loadFromStrapi()}
            className="btn btn-outline-secondary me-2"
            title="Recargar datos"
            disabled={isLoading}
          >
            <FaSync className={isLoading ? 'fa-spin' : ''} />
          </button>
          
          <button 
            onClick={onShowCreate} 
            className="btn text-white fw-bold px-4" 
            style={{ backgroundColor: '#F21A2B' }}
            disabled={isLoading}
          >
            Crear
          </button>
        </div>
      </div>

      {/* Tabla de campañas */}
      <div className="card border-0 shadow-sm">
        {/* Cabecera */}
        <div className="row g-0 text-white rounded-top" style={{ backgroundColor: '#282A5B', padding: '0.75rem 1.25rem' }}>
          <div className="col-2 fw-bold">Fecha</div>
          <div className="col-3 fw-bold">Título</div>
          <div className="col-3 fw-bold">Asunto</div>
          <div className="col-2 fw-bold">Contactos</div>
          <div className="col-2 fw-bold text-end">Acciones</div>
        </div>

        {/* Filas de la tabla */}
        {campaigns.map((campaign) => (
          <React.Fragment key={campaign.id}>
            <div className="row g-0 border-bottom align-items-center" style={{ padding: '0.75rem 1.25rem' }}>
              <div className="col-2">{campaign.fecha}</div>
              <div className="col-3">{campaign.title}</div>
              <div className="col-3">{campaign.subject}</div>
              <div className="col-2">
                {campaign.contactGroup === 'todos' ? 'Todos los contactos' : 
                 campaign.contactGroup === 'grupo1' ? 'Grupo 1' : 
                 campaign.contactGroup === 'grupo2' ? 'Grupo 2' : 
                 campaign.contactGroup === 'grupo3' ? 'Grupo 3' : campaign.contactGroup}
              </div>
              <div className="col-2 text-end">
                {campaign.emailHtml && (
                  <button 
                    className="btn btn-sm btn-link p-0 me-2" 
                    title="Ver preview"
                    onClick={() => togglePreview(campaign.id)}
                  >
                    <FaEye className="text-secondary" />
                  </button>
                )}
                <button 
                  className="btn btn-sm btn-link p-0 me-2" 
                  title="Editar"
                  onClick={() => handleEdit(campaign)}
                >
                  <FaEdit className="text-secondary" />
                </button>
                <button 
                  className="btn btn-sm btn-link p-0" 
                  title="Eliminar"
                  onClick={() => handleDelete(campaign.id)}
                >
                  <FaTrash className="text-secondary" />
                </button>
              </div>
            </div>
            
            {/* Vista previa del correo */}
            {showPreview === campaign.id && campaign.emailHtml && (
              <div className="row g-0 border-bottom">
                <div className="col-12 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Vista previa del correo</h6>
                    <button 
                      className="btn btn-sm text-white" 
                      style={{ backgroundColor: '#F21A2B' }}
                      onClick={() => setShowPreview(null)}
                    >
                      Cerrar vista previa
                    </button>
                  </div>
                  <div 
                    className="border bg-white p-3 rounded" 
                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                    dangerouslySetInnerHTML={{ __html: campaign.emailHtml }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Paginación */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted small">
          Mostrando {campaigns.length} de {campaigns.length} campañas
        </div>
        <nav aria-label="Page navigation">
          <ul className="pagination pagination-sm">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li className="page-item active"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item"><a className="page-link" href="#">4</a></li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&hellip;</span>
              </a>
            </li>
            <li className="page-item"><a className="page-link" href="#">40</a></li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CampaignsView; 