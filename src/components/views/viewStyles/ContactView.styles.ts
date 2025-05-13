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

export const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#333',
  fontSize: '22px',
};

export const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
};

export const buttonStyle: React.CSSProperties = {
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '10px 15px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#333',
};

export const tableContainerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '25px',
};

export const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

export const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: '#F21A2B',
  color: 'white',
  textAlign: 'left',
};

export const tableHeaderCellStyle: React.CSSProperties = {
  padding: '12px 15px',
  fontWeight: 'bold',
};

export const tableRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #eee',
};

export const tableCellStyle: React.CSSProperties = {
  padding: '12px 15px',
  color: '#444',
};

export const actionsCellStyle: React.CSSProperties = {
  padding: '12px 15px',
  display: 'flex',
  gap: '15px',
};

export const iconStyle: React.CSSProperties = {
  cursor: 'pointer',
  color: '#777',
  fontSize: '16px',
};

export const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    maxWidth: '90%',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
};

export const formControlStyle: React.CSSProperties = {
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

export const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px',
  backgroundColor: 'white',
  boxSizing: 'border-box',
};

export const modalButtonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '20px',
};

export const modalButtonStyle: React.CSSProperties = {
  padding: '10px 15px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
  border: 'none',
};

export const modalPrimaryButtonStyle: React.CSSProperties = {
  ...modalButtonStyle,
  backgroundColor: '#F21A2B',
  color: 'white',
};

export const modalSecondaryButtonStyle: React.CSSProperties = {
  ...modalButtonStyle,
  backgroundColor: 'white',
  color: '#333',
  border: '1px solid #ddd',
};

export const tabContainerStyle: React.CSSProperties = {
  display: 'flex',
  borderBottom: '1px solid #ddd',
  marginBottom: '20px',
};

export const tabStyle: React.CSSProperties = {
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#555',
};

export const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  borderBottom: '2px solid #F21A2B',
  color: '#F21A2B',
};
