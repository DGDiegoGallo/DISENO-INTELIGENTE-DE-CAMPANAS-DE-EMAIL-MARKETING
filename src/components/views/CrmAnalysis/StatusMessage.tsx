import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { statusMessageStyle, messageIconStyle } from './styles';

interface StatusMessageProps {
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
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
      

    </div>
  );
};

export default StatusMessage;
