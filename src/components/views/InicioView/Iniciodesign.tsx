import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { DetailedCampaign } from '../../../interfaces/campaign';

interface IniciodesignProps {
  campaigns: DetailedCampaign[];
  onEditCampaign: (id: number | string) => void;
  onDeleteCampaign: (id: number | string) => void;
}

const Iniciodesign: React.FC<IniciodesignProps> = ({ campaigns, onEditCampaign, onDeleteCampaign }) => {
  const headerStyle: React.CSSProperties = {
    backgroundColor: '#282A5B', 
    color: 'white',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.25rem 0.25rem 0 0',
  };

  const rowStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '0.75rem 1.25rem',
    marginBottom: '0.5rem',
    borderRadius: '0.25rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  const noCampaignsStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginTop: '10px',
  }

  const titleText = campaigns.some(c => c.interaccion_destinatario && Object.values(c.interaccion_destinatario).some(i => i.dinero_gastado === 0))
    ? "Campañas con destinatarios sin gasto"
    : "Resumen de Campañas";

  return (
    <div>
      <h3 className="mb-3" style={{ marginTop: '30px' }}>{titleText}</h3>
      
      {campaigns.length === 0 ? (
        <div style={noCampaignsStyle}>
          <p>No hay campañas para mostrar.</p>
        </div>
      ) : (
        <>
          <div className="row g-0 fw-bold" style={headerStyle}>
            <div className="col-3">Fecha</div>
            <div className="col-3">Nombre Campaña</div>
            <div className="col-2">Asunto</div>
            <div className="col-2">Estado</div>
            <div className="col-2 text-end">Acciones</div>
          </div>

          {campaigns.map((campaign) => (
            <div key={campaign.id} className="row g-0 align-items-center" style={rowStyle}>
              <div className="col-3">{campaign.Fechas ? new Date(campaign.Fechas).toLocaleDateString() : 'N/A'}</div>
              <div className="col-3">{campaign.nombre}</div>
              <div className="col-2">{campaign.asunto || 'N/A'}</div>
              <div className="col-2">
                <span className={`badge bg-${campaign.estado === 'enviado' ? 'success' : campaign.estado === 'borrador' ? 'secondary' : campaign.estado === 'programado' ? 'info' : 'warning'}`}>
                  {campaign.estado || 'N/A'}
                </span>
              </div>
              <div className="col-2 text-end">
                <button 
                  className="btn btn-sm btn-link p-0 me-2" 
                  title="Editar"
                  onClick={() => onEditCampaign(campaign.id)}
                  style={{ color: '#282A5B' }} 
                >
                  <FaEdit />
                </button>
                <button 
                  className="btn btn-sm btn-link p-0 text-danger" 
                  title="Eliminar"
                  onClick={() => onDeleteCampaign(campaign.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Iniciodesign;