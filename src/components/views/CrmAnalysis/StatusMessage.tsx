import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface StatusMessageProps {
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  const isError = message.includes('Error');
  
  return (
    <div style={{ 
      padding: '10px 15px',
      borderRadius: '4px',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: isError ? '#ffe6e6' : '#e6ffe6'
    }}>
      <FaInfoCircle 
        style={{ 
          fontSize: '18px',
          marginRight: '10px',
          color: isError ? '#c00' : '#0c0' 
        }} 
      />
      {message}
      

    </div>
  );
};

export default StatusMessage;
