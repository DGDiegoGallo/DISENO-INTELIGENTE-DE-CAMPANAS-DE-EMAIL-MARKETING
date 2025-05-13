import React from 'react';
import { FaInfoCircle, FaCloudUploadAlt } from 'react-icons/fa';
import { statusMessageStyle, messageIconStyle, secondaryButtonStyle } from './styles';

interface StatusMessageProps {
  message: string;
  showUploadButton: boolean;
  isUploading: boolean;
  onUpload: () => void;
  hasLocalData: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ 
  message, 
  showUploadButton, 
  isUploading, 
  onUpload,
  hasLocalData
}) => {
  const isError = message.includes('Error');
  
  return (
    <div style={{ 
      ...statusMessageStyle,
      backgroundColor: isError ? '#ffe6e6' : '#e6ffe6'
    }}>
      <FaInfoCircle 
        style={{ 
          ...messageIconStyle, 
          color: isError ? '#c00' : '#0c0' 
        }} 
      />
      {message}
      
      {showUploadButton && (
        <button
          onClick={onUpload}
          style={secondaryButtonStyle}
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
      )}
    </div>
  );
};

export default StatusMessage;
