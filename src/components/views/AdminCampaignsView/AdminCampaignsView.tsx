import React, { useEffect, useCallback, useState } from 'react';
import { FaArrowLeft, FaSync, FaChartLine, FaEye, FaUser, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaFilePdf } from 'react-icons/fa';
import useAdminCampaignsStore from '../../../store/useAdminCampaignsStore';
import { generateAdminCampaignsPDF } from './AdminCampaignsPDFGenerator';
import './AdminCampaignsView.css';

/**
 * Vista para que el administrador visualice las campañas de los usuarios y sus resultados
 */
const AdminCampaignsView: React.FC = () => {
  // Usar el store de Zustand para manejar el estado
  const {
    campaigns,
    loading,
    error,
    selectedUser,
    selectedCampaign,
    showCampaignDetailsModal,
    users,
    stats,
    loadData,
    filterCampaignsByUser,
    showCampaignDetails,
    closeCampaignDetails
  } = useAdminCampaignsStore();

  // Cargar campañas y usuarios al montar el componente
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtrar campañas según el usuario seleccionado
  const filteredCampaigns = selectedUser
    ? campaigns.filter(campaign => campaign.usuario.id === selectedUser)
    : campaigns;

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleGeneratePDF = useCallback(async () => {
    if (isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    setPdfError(null);
    
    try {
      const selectedUserData = selectedUser ? users.find(u => u.id === selectedUser) : null;
      const selectedUserName = selectedUserData 
        ? `${selectedUserData.nombre || ''} ${selectedUserData.apellido || ''}`.trim() || selectedUserData.username
        : null;

      if (filteredCampaigns.length === 0) {
        throw new Error('No hay campañas disponibles para generar el reporte');
      }

      // Small delay to allow the loading state to show
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await generateAdminCampaignsPDF({
        campaigns: filteredCampaigns,
        stats,
        selectedUserName
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al generar el PDF. Por favor, intente nuevamente.';
      setPdfError(errorMessage);
      
      // Show error for 5 seconds then clear it
      const timer = setTimeout(() => {
        setPdfError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [filteredCampaigns, selectedUser, stats, users, isGeneratingPDF]);

  return (
    <div className="admin-campaigns-view-container">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '25px',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaArrowLeft 
            style={{ color: '#555', marginRight: '15px', cursor: 'pointer', fontSize: '18px' }} 
            onClick={() => window.history.back()}
          />
          <h2 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Campañas de Usuarios</h2>
        </div>
        <div className="btn-group" role="group" aria-label="Acciones">
          <button 
            className="btn btn-outline-danger d-flex align-items-center"
            onClick={handleGeneratePDF}
            disabled={loading || campaigns.length === 0 || isGeneratingPDF}
            title={campaigns.length === 0 ? "No hay campañas para generar el reporte" : "Generar Reporte en PDF"}
          >
            {isGeneratingPDF ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generando...
              </>
            ) : (
              <>
                <FaFilePdf className="me-2" /> Generar Reporte
              </>
            )}
          </button>
          <button 
            className="btn btn-danger d-flex align-items-center"
            onClick={loadData}
            disabled={loading || isGeneratingPDF}
            title="Actualizar datos"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando...
              </>
            ) : (
              <>
                <FaSync className="me-2" /> Actualizar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      )}
      {pdfError && (
        <div className="alert alert-warning d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{pdfError}</div>
        </div>
      )}

      {/* Dashboard de estadísticas */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Dashboard de Métricas</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-2 col-sm-4 mb-3">
                  <div className="metric-card">
                    <h3 className="text-primary">{stats.totalCampaigns}</h3>
                    <p className="mb-0 text-muted">Campañas</p>
                  </div>
                </div>
                <div className="col-md-2 col-sm-4 mb-3">
                  <div className="metric-card">
                    <h3 className="text-primary">{stats.totalUsers}</h3>
                    <p className="mb-0 text-muted">Usuarios</p>
                  </div>
                </div>
                <div className="col-md-2 col-sm-4 mb-3">
                  <div className="metric-card">
                    <h3 className="text-success">{stats.totalOpens}</h3>
                    <p className="mb-0 text-muted">Aperturas</p>
                  </div>
                </div>
                <div className="col-md-2 col-sm-4 mb-3">
                  <div className="metric-card">
                    <h3 className="text-info">{stats.totalClicks}</h3>
                    <p className="mb-0 text-muted">Clics</p>
                  </div>
                </div>
                <div className="col-md-2 col-sm-4 mb-3">
                  <div className="metric-card">
                    <h3 className="text-warning">{stats.totalRegistrations}</h3>
                    <p className="mb-0 text-muted">Registros</p>
                  </div>
                </div>
                <div className="col-md-2 col-sm-4 mb-3">
                  <div className="metric-card">
                    <h3 className="text-danger">${stats.totalRevenue.toFixed(2)}</h3>
                    <p className="mb-0 text-muted">Ingresos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtro de usuarios */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Filtrar por Usuario</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap">
                <button 
                  className={`btn ${selectedUser === null ? 'btn-danger' : 'btn-outline-secondary'} me-2 mb-2 btn-filter`}
                  onClick={() => filterCampaignsByUser(null)}
                >
                  Todos los usuarios
                </button>
                {users.map(user => (
                  <button 
                    key={user.id}
                    className={`btn ${selectedUser === user.id ? 'btn-danger' : 'btn-outline-secondary'} me-2 mb-2 btn-filter`}
                    onClick={() => filterCampaignsByUser(user.id)}
                  >
                    {user.nombre && user.apellido 
                      ? `${user.nombre} ${user.apellido}`
                      : user.username}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de campañas */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title">
            {selectedUser 
              ? `Campañas de ${users.find(u => u.id === selectedUser)?.nombre || 'Usuario'}`
              : 'Todas las Campañas'}
          </h5>
          <span className="badge bg-primary">{filteredCampaigns.length} campañas</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando campañas...</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="alert alert-info m-3">
              No hay campañas disponibles para mostrar.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ width: '60px' }}>#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Usuario</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Métricas</th>
                    <th scope="col" className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td>{campaign.id}</td>
                      <td>{campaign.nombre}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaUser className="text-secondary me-2" />
                          {campaign.usuario.nombre && campaign.usuario.apellido 
                            ? `${campaign.usuario.nombre} ${campaign.usuario.apellido}`
                            : campaign.usuario.username}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="text-secondary me-2" />
                          {new Date(campaign.Fechas || campaign.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        {campaign.estado === 'enviado' ? (
                          <span className="badge bg-success">Enviado</span>
                        ) : campaign.estado === 'programado' ? (
                          <span className="badge bg-info">Programado</span>
                        ) : campaign.estado === 'borrador' ? (
                          <span className="badge bg-warning text-dark">Borrador</span>
                        ) : (
                          <span className="badge bg-secondary">Otro</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex">
                          <div className="me-3" title="Aperturas">
                            <FaEye className="text-success me-1" />
                            {campaign.metrics?.opens || 0}
                          </div>
                          <div className="me-3" title="Clics">
                            <FaCheckCircle className="text-info me-1" />
                            {campaign.metrics?.clicks || 0}
                          </div>
                          <div title="Ingresos">
                            <FaExclamationCircle className="text-danger me-1" />
                            ${campaign.metrics?.revenue?.toFixed(2) || '0.00'}
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => showCampaignDetails(campaign)}
                          title="Ver detalles"
                        >
                          <FaChartLine />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles de campaña */}
      {showCampaignDetailsModal && selectedCampaign && (
        <div className="modal fade show" style={{ 
          display: 'block', 
          backgroundColor: 'rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.3s'
        }} tabIndex={-1} aria-modal="true">
          <div className="modal-dialog modal-xl modal-dialog-centered" style={{ 
            maxWidth: '900px', 
            margin: '30px auto',
            animation: 'slideIn 0.3s'
          }}>
            <div className="modal-content" style={{ 
              width: '100%',
              animation: 'fadeIn 0.4s'
            }}>
              <div className="modal-header">
                <h5 className="modal-title">Detalles de Campaña: {selectedCampaign.nombre}</h5>
                <button type="button" className="btn-close" onClick={closeCampaignDetails}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="mb-3">Información General</h6>
                    <table className="table table-sm table-striped">
                      <tbody style={{ fontSize: '14px' }}>
                        <tr>
                          <th>ID:</th>
                          <td>{selectedCampaign.id}</td>
                        </tr>
                        <tr>
                          <th>Nombre:</th>
                          <td>{selectedCampaign.nombre}</td>
                        </tr>
                        <tr>
                          <th>Asunto:</th>
                          <td>{selectedCampaign.asunto}</td>
                        </tr>
                        <tr>
                          <th>Fecha:</th>
                          <td>{new Date(selectedCampaign.Fechas || selectedCampaign.createdAt).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <th>Estado:</th>
                          <td>
                            {selectedCampaign.estado === 'enviado' ? (
                              <span className="badge bg-success">Enviado</span>
                            ) : selectedCampaign.estado === 'programado' ? (
                              <span className="badge bg-info">Programado</span>
                            ) : selectedCampaign.estado === 'borrador' ? (
                              <span className="badge bg-warning text-dark">Borrador</span>
                            ) : (
                              <span className="badge bg-secondary">Otro</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3">Información del Usuario</h6>
                    <table className="table table-sm table-striped">
                      <tbody style={{ fontSize: '14px' }}>
                        <tr>
                          <th>ID:</th>
                          <td>{selectedCampaign.usuario.id}</td>
                        </tr>
                        <tr>
                          <th>Nombre:</th>
                          <td>
                            {selectedCampaign.usuario.nombre && selectedCampaign.usuario.apellido 
                              ? `${selectedCampaign.usuario.nombre} ${selectedCampaign.usuario.apellido}`
                              : selectedCampaign.usuario.username}
                          </td>
                        </tr>
                        <tr>
                          <th>Email:</th>
                          <td>{selectedCampaign.usuario.email}</td>
                        </tr>
                        <tr>
                          <th>Estado:</th>
                          <td>
                            {selectedCampaign.usuario.blocked ? (
                              <span className="badge bg-danger">Bloqueado</span>
                            ) : selectedCampaign.usuario.confirmed ? (
                              <span className="badge bg-success">Activo</span>
                            ) : (
                              <span className="badge bg-warning text-dark">Pendiente</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>Rol:</th>
                          <td>{selectedCampaign.usuario.rol || 'Usuario'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <h6 className="mb-3">Métricas de la Campaña</h6>
                    <div className="row" style={{ marginBottom: '15px' }}>
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="metric-card" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                          <h4 className="text-success" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>{selectedCampaign.metrics?.opens || 0}</h4>
                          <p className="mb-0 text-muted">Aperturas</p>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="metric-card" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                          <h4 className="text-info" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>{selectedCampaign.metrics?.clicks || 0}</h4>
                          <p className="mb-0 text-muted">Clics</p>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="metric-card" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                          <h4 className="text-warning" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>{selectedCampaign.metrics?.registrations || 0}</h4>
                          <p className="mb-0 text-muted">Registros</p>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="metric-card" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                          <h4 className="text-danger" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>${selectedCampaign.metrics?.revenue?.toFixed(2) || '0.00'}</h4>
                          <p className="mb-0 text-muted">Ingresos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-12">
                    <h6 className="mb-3">Destinatarios</h6>
                    <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px' }}>
                      <p className="mb-0">{selectedCampaign.contactos || 'No hay destinatarios especificados'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6', padding: '15px' }}>
                <button type="button" className="btn btn-danger px-4" onClick={closeCampaignDetails}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaignsView;
