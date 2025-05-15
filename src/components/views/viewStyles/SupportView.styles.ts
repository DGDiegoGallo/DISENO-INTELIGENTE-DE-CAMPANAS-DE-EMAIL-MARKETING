import React from 'react';

export const viewStyle: React.CSSProperties = {
  padding: '25px',
  backgroundColor: '#f9f9f9',
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto',
  fontFamily: 'Arial, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
};

export const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#333'
};

export const chatContainerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 200px)',
  maxWidth: '1000px',
  margin: '0 auto'
};

export const chatHistoryStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  marginBottom: '20px',
  padding: '10px'
};

export const inputContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-end'
};

export const messageInputStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 15px',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  minHeight: '60px',
  maxHeight: '120px',
  resize: 'vertical',
  fontFamily: 'inherit'
};

export const sendButtonStyle: React.CSSProperties = {
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '15px 25px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  height: '60px',
  transition: 'background-color 0.2s'
};

export const messageBubbleStyle: React.CSSProperties = {
  padding: '12px 18px',
  borderRadius: '18px',
  marginBottom: '10px',
  maxWidth: '85%',
  wordBreak: 'break-word',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
};

export const userMessageStyle: React.CSSProperties = {
  backgroundColor: '#F21A2B',
  color: '#fff',
  alignSelf: 'flex-end',
  marginLeft: 'auto'
};

export const aiMessageStyle: React.CSSProperties = {
  backgroundColor: '#282A5B',
  color: '#fff',
  alignSelf: 'flex-start'
};

export const loadingDotsStyle: React.CSSProperties = {
  display: 'inline-block',
};

// Animación para los puntos de carga (se aplicará con CSS en un entorno real)
// Aquí simulamos con estilo estático
