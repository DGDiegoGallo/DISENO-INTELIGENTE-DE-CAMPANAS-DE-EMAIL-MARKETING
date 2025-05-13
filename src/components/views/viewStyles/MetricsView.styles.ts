import React from 'react';

export const viewStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f9f9f9',
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto',
  fontFamily: 'Arial, sans-serif'
};

export const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#333'
};

export const chartContainerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '20px',
  marginBottom: '25px',
  boxSizing: 'border-box',
};

export const modalButtonStyle: React.CSSProperties = {
  padding: '10px 25px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
  border: 'none',
  margin: '0 5px',
};

export const modalPrimaryButtonStyle: React.CSSProperties = {
  backgroundColor: '#F21A2B',
  color: 'white',
};

export const modalSecondaryButtonStyle: React.CSSProperties = {
  backgroundColor: 'white',
  color: '#F21A2B',
  border: '1px solid #F21A2B',
};

export const formControlStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '20px',
};

export const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#555',
};

export const inputStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px',
};

export const selectStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px',
  backgroundColor: 'white',
};

export const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '20px',
};

export const modalContentStyle: React.CSSProperties = {
  padding: '20px',
};

export const customModalStyle = {
  content: {
    width: '500px',
    maxWidth: '90%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    padding: '0',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
};
