import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { Campaign } from '../../../../services/campaignService';

interface CampaignSelectorProps {
  label: string;
  campaigns: Campaign[];
  selectedCampaignId: number | null;
  onChange: (campaignId: number) => void;
  disabled?: boolean;
  isLoading?: boolean;
  excludeCampaignId?: number | null; // ID de campaña que debe excluirse
}

const CampaignSelector: React.FC<CampaignSelectorProps> = ({
  label,
  campaigns,
  selectedCampaignId,
  onChange,
  disabled = false,
  isLoading = false,
  excludeCampaignId = null
}) => {
  // Estilos
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: 'white',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#333'
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: disabled ? '#f5f5f5' : 'white'
  };

  return (
    <div style={cardStyle}>
      <div style={labelStyle}>
        <FaEnvelope /> {label}
      </div>
      <select 
        style={selectStyle}
        value={selectedCampaignId || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled || isLoading}
      >
        <option value="">Seleccione una campaña</option>
        {campaigns
          // Filtrar para no mostrar la campaña que ya está seleccionada en el otro selector
          .filter(campaign => !excludeCampaignId || campaign.id !== excludeCampaignId)
          .map(campaign => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.nombre} - {campaign.Fechas ? new Date(campaign.Fechas).toLocaleDateString() : 'Sin fecha'}
            </option>
          ))}
        
      </select>
    </div>
  );
};

export default CampaignSelector;
