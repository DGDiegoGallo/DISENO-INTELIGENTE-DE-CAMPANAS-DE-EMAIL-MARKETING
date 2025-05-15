import { CSSProperties } from 'react';

// Estilos principales
export const viewStyle: CSSProperties = {
  padding: '25px',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f8f9fa'
};

export const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
};

export const titleContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

export const titleStyle: CSSProperties = {
  margin: 0,
  color: '#333',
  fontSize: '22px'
};

export const backIconStyle: CSSProperties = {
  color: '#555',
  cursor: 'pointer',
  fontSize: '18px'
};

// Estilos de botones
export const buttonStyle: CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px'
};

export const disabledButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#ccc',
  cursor: 'not-allowed'
};

// Estilos de contenedores
export const contentContainerStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '20px'
};

// Estilos de mensajes
export const messageStyle: CSSProperties = {
  padding: '10px 15px',
  borderRadius: '4px',
  marginBottom: '15px'
};

export const errorMessageStyle: CSSProperties = {
  ...messageStyle,
  backgroundColor: '#f8d7da',
  color: '#721c24',
  border: '1px solid #f5c6cb'
};

export const successMessageStyle: CSSProperties = {
  ...messageStyle,
  backgroundColor: '#d4edda',
  color: '#155724',
  border: '1px solid #c3e6cb'
};

// Estilos de previsualización
export const previewContainerStyle: CSSProperties = {
  marginTop: '15px'
};

export const previewHeaderStyle: CSSProperties = {
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  marginBottom: '10px'
};

export const previewTitleContainerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

export const previewTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '16px'
};

export const previewContentStyle: CSSProperties = {
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  backgroundColor: 'white',
  padding: '10px',
  maxHeight: '300px',
  overflowY: 'auto'
};
