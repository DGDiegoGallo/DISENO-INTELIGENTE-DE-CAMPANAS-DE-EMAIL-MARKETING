import React from 'react';
import { FaEye, FaEnvelope } from 'react-icons/fa';
import { Campaign } from '../../../../services/campaignService';

interface CampaignPreviewProps {
  campaign: Campaign | null;
  label: string;
  loading?: boolean;
}

const CampaignPreview: React.FC<CampaignPreviewProps> = ({ campaign, label, loading = false }) => {
  // Estilos
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: 'white',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #eee'
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#333'
  };

  const contentStyle: React.CSSProperties = {
    padding: '8px 0',
    fontSize: '14px',
    color: '#555'
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '14px'
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    marginRight: '8px',
    color: '#666',
    width: '80px'
  };

  const frameStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '12px',
    marginTop: '10px',
    maxHeight: '120px',
    overflow: 'auto',
    backgroundColor: '#f9f9f9'
  };

  const loadingStyle: React.CSSProperties = {
    padding: '30px',
    textAlign: 'center',
    color: '#999'
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>
          <FaEnvelope /> {label}
        </div>
        {campaign && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#F21A2B' }}>
            <FaEye /> Ver
          </div>
        )}
      </div>

      {loading ? (
        <div style={loadingStyle}>Cargando información...</div>
      ) : !campaign ? (
        <div style={contentStyle}>Seleccione una campaña para ver los detalles</div>
      ) : (
        <div style={contentStyle}>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Nombre:</span>
            <span>{campaign.nombre}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Asunto:</span>
            <span>{campaign.asunto}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Fecha:</span>
            <span>{campaign.Fechas ? new Date(campaign.Fechas).toLocaleDateString() : 'Sin fecha'}</span>
          </div>
          {campaign.contactos && (
            <div style={infoRowStyle}>
              <span style={labelStyle}>Contactos:</span>
              <span>{campaign.contactos.split(',').length} destinatarios</span>
            </div>
          )}
          
          {campaign.contenidoHTML && (
            <>
              <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#666' }}>Vista previa:</div>
              <div style={frameStyle}>
                {typeof campaign.contenidoHTML === 'string' 
                  ? <div dangerouslySetInnerHTML={{ __html: campaign.contenidoHTML.substring(0, 300) + '...' }} />
                  : <div>Contenido HTML disponible</div>
                }
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignPreview;
