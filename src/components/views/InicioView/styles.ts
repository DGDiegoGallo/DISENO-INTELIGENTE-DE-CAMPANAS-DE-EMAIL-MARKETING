import React from 'react';

export const viewStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f8f9fa', // Light gray background
  maxHeight: 'calc(100vh - 120px)', // Adjust based on your Navbar/header height
  overflowY: 'auto',
};

export const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '25px',
  justifyContent: 'space-between',
};

export const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
};

export const refreshButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  backgroundColor: '#F21A2B', // Brand red color
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

export const refreshIconStyle: React.CSSProperties = {
  marginRight: '8px',
};

export const verMasButtonStyle: React.CSSProperties = {
    backgroundColor: '#FF3A44', // Original red button color from screenshot
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
};
