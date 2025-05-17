import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import campaignService from '../../services/campaignService';
import { Campaign } from '../../services/campaignService';
import { useAuthStore } from '../../store';

interface UserCampaignListProps {
  onSelectCampaign?: (campaign: Campaign) => void;
  showActions?: boolean;
  maxItems?: number;
  onRefresh?: () => void;
}

const UserCampaignList: React.FC<UserCampaignListProps> = ({
  onSelectCampaign,
  showActions = true,
  maxItems,
  onRefresh
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = maxItems || 5;
  
  // No se utiliza navigate actualmente, pero está disponible si se necesita redireccionamiento
  // const navigate = useNavigate();
  const { user } = useAuthStore();

  // Cargar campañas del usuario logueado
  const loadUserCampaigns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar el ID del usuario actual del store
      const userId = user?.id;
      
      // Obtener campañas del usuario
      const response = await campaignService.getUserCampaigns(page, pageSize, userId);
      
      // Asegurarnos de que los datos tengan el formato correcto
      const formattedCampaigns = response.data.map(item => {
        // Si la API devuelve datos en formato Strapi v4 (con attributes), adaptarlos
        const source = 'attributes' in item ? item.attributes : item;
        // Ensure id from item itself is prioritized if item.attributes also has id
        const campaignId = item.id !== undefined ? item.id : ((source as unknown) as Record<string, unknown>).id as number;

        return {
          id: campaignId,
          nombre: source.nombre,
          Fechas: source.Fechas,
          estado: source.estado,
          asunto: source.asunto,
          contenidoHTML: source.contenidoHTML,
          campanaJSON: typeof source.campanaJSON === 'object' ? source.campanaJSON : undefined,
          contactos: source.contactos,
          // Handle gruposdecontactosJSON: DetailedCampaign has it as GruposDeContactosJSON | null
          // campaignService.Campaign expects Record<string, unknown> | undefined
          gruposdecontactosJSON: typeof source.gruposdecontactosJSON === 'object' && source.gruposdecontactosJSON !== null 
                                 ? source.gruposdecontactosJSON 
                                 : undefined,
          interaccion_destinatario: typeof source.interaccion_destinatario === 'object' ? source.interaccion_destinatario : undefined,
          se_registro_en_pagina: source.se_registro_en_pagina,
          dinero_gastado: source.dinero_gastado,
          // email_destinatario is not in DetailedCampaign by default, but campaignService.Campaign has it.
          // If your DetailedCampaign might have it, map it here, otherwise undefined.
          email_destinatario: ((source as unknown) as Record<string, unknown>).email_destinatario as string | undefined, 
          createdAt: source.createdAt,
          updatedAt: source.updatedAt,
          publishedAt: source.publishedAt,
          // usuario is complex, ensure it's mapped if needed or handle its absence
          // For now, casting as Campaign implies the service's Campaign type structure is met.
        } as Campaign;
      });
      
      setCampaigns(formattedCampaigns);
      
      // Actualizar información de paginación
      if (response.meta?.pagination) {
        setTotalPages(response.meta.pagination.pageCount);
      }
    } catch (err) {
      console.error('Error al cargar campañas del usuario:', err);
      setError('No se pudieron cargar las campañas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar al montar y cuando cambien las dependencias
  useEffect(() => {
    loadUserCampaigns();
  }, [page, user?.id, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  // Manejar selección de campaña
  const handleSelectCampaign = (campaign: Campaign) => {
    if (onSelectCampaign) {
      onSelectCampaign(campaign);
    }
  };

  // Manejar eliminación de campaña
  const handleDeleteCampaign = async (id: number | undefined) => {
    if (!id) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta campaña?')) {
      try {
        await campaignService.deleteCampaign(id);
        // Refrescar lista
        loadUserCampaigns();
        if (onRefresh) onRefresh();
      } catch (err) {
        console.error('Error al eliminar campaña:', err);
        alert('No se pudo eliminar la campaña. Por favor, inténtalo de nuevo.');
      }
    }
  };

  // Manejar edición de campaña
  const handleEditCampaign = (campaign: Campaign) => {
    // Redirigir a la página de edición o ejecutar callback
    if (onSelectCampaign) {
      onSelectCampaign(campaign);
    } else {
      // Ejemplo de redirección a una ruta de edición
      // navigate(`/campaigns/edit/${campaign.id}`);
    }
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mostrar estado con color
  const getStatusBadge = (estado: string) => {
    let badgeClass = '';
    
    switch (estado) {
      case 'borrador':
        badgeClass = 'bg-secondary';
        break;
      case 'programado':
        badgeClass = 'bg-primary';
        break;
      case 'enviado':
        badgeClass = 'bg-success';
        break;
      case 'cancelado':
        badgeClass = 'bg-danger';
        break;
      default:
        badgeClass = 'bg-light text-dark';
    }
    
    return (
      <span className={`badge ${badgeClass}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  // Cambiar de página
  const changePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="user-campaign-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Tus campañas</h5>
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={loadUserCampaigns} 
          disabled={loading}
        >
          {loading ? <FaSpinner className="fa-spin me-1" /> : 'Actualizar'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <FaSpinner className="fa-spin" size={24} />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center p-4 bg-light rounded">
          <p className="text-muted mb-0">No tienes campañas creadas aún</p>
        </div>
      ) : (
        <>
          <div className="list-group shadow-sm">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className="list-group-item d-flex justify-content-between align-items-center p-3"
                style={{ cursor: onSelectCampaign ? 'pointer' : 'default' }}
                onClick={() => handleSelectCampaign(campaign)}
              >
                <div className="campaign-info">
                  <h6 className="mb-0">{campaign.nombre}</h6>
                  <div className="d-flex align-items-center mt-1">
                    {getStatusBadge(campaign.estado)}
                    <small className="text-muted ms-2">
                      <FaCalendarAlt className="me-1" style={{ fontSize: '0.7rem' }} />
                      {formatDate(campaign.Fechas)}
                    </small>
                  </div>
                  <small className="text-muted d-block mt-1">
                    Asunto: {campaign.asunto}
                  </small>
                </div>
                
                {showActions && (
                  <div className="campaign-actions d-flex" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="btn btn-sm btn-outline-primary me-1" 
                      title="Ver detalles"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCampaign(campaign);
                      }}
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-secondary me-1" 
                      title="Editar"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCampaign(campaign);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      title="Eliminar"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCampaign(campaign.id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Paginación simple */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between mt-3">
              <button 
                className="btn btn-sm btn-outline-secondary" 
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
              >
                Anterior
              </button>
              <span className="align-self-center">
                Página {page} de {totalPages}
              </span>
              <button 
                className="btn btn-sm btn-outline-secondary" 
                disabled={page === totalPages}
                onClick={() => changePage(page + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserCampaignList;
