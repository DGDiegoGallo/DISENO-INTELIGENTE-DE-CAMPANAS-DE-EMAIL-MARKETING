import React from 'react';

export const viewStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto',
  fontFamily: 'Arial, sans-serif'
};

export const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '25px',
};

export const titleContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

export const backIconStyle: React.CSSProperties = {
  cursor: 'pointer',
  color: '#555',
  fontSize: '18px',
};

export const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#333',
  fontSize: '22px',
};

export const formSectionStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '20px',
};

export const formSectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#333',
  marginBottom: '15px',
  fontWeight: 'bold',
};

export const formRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  marginBottom: '15px',
};

export const formGroupStyle: React.CSSProperties = {
  flex: '1 1 250px',
  marginBottom: '15px',
};

export const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#555',
  fontSize: '14px',
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px',
  boxSizing: 'border-box',
};

export const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px',
  minHeight: '100px',
  boxSizing: 'border-box',
  fontFamily: 'Arial, sans-serif',
};

export const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px',
  backgroundColor: 'white',
  boxSizing: 'border-box',
};

export const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '15px',
  marginTop: '20px',
};

export const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
};

export const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: 'white',
  color: '#555',
  border: '1px solid #ddd',
};

export const editorContainerStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '4px',
  height: '500px',
  marginBottom: '20px',
};

export const recipientPreviewStyle: React.CSSProperties = {
  backgroundColor: '#f0f0f0',
  padding: '10px',
  borderRadius: '4px',
  marginTop: '10px',
  fontSize: '14px',
  color: '#555',
  maxHeight: '100px',
  overflowY: 'auto',
};

export const loadingOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

export const spinnerStyle: React.CSSProperties = {
  fontSize: '50px',
  color: '#F21A2B',
  marginBottom: '15px',
};
