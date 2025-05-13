import React from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { actionsContainerStyle, actionButtonStyle, secondaryButtonStyle } from './styles';

interface ActionButtonsProps {
  onLoadTestData: () => void;
  onUploadToHubSpot: () => void;
  isLoading: boolean;
  isUploading: boolean;
  hasLocalData: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onLoadTestData,
  onUploadToHubSpot,
  isLoading,
  isUploading,
  hasLocalData
}) => {
  return (
    <div style={actionsContainerStyle}>
      <button
        onClick={onLoadTestData}
        style={actionButtonStyle}
        onMouseOver={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.backgroundColor = '#D91727';
          target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.backgroundColor = '#F21A2B';
          target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }}
        disabled={isLoading}
      >
        {isLoading ? 'Cargando...' : 'Cargar Datos CRM de Prueba en localStorage'}
      </button>
      
      <button
        onClick={onUploadToHubSpot}
        style={{
          ...secondaryButtonStyle,
          marginLeft: '10px'
        }}
        onMouseOver={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.backgroundColor = '#2a56ad';
          target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.backgroundColor = '#3366cc';
          target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }}
        disabled={isUploading || !hasLocalData}
      >
        <FaCloudUploadAlt style={{ marginRight: '8px', fontSize: '18px' }} />
        {isUploading ? 'Enviando...' : 'Enviar Datos a HubSpot'}
      </button>
    </div>
  );
};

export default ActionButtons;
