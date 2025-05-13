import React from 'react';

export const viewStyle: React.CSSProperties = {
  padding: '25px',
  backgroundColor: '#f8f9fa', 
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

export const tableStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'white',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '25px',
};

export const tableHeaderStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
  backgroundColor: '#F21A2B',
  color: 'white',
  padding: '15px',
  fontWeight: 'bold',
  fontSize: '14px',
};

export const tableRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
  borderBottom: '1px solid #eee',
  alignItems: 'center',
};

export const tableCellStyle: React.CSSProperties = {
  padding: '15px',
  fontSize: '14px',
  color: '#444',
};

export const actionsCellStyle: React.CSSProperties = {
  padding: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
};

export const iconStyle: React.CSSProperties = {
  cursor: 'pointer',
  color: '#777',
  fontSize: '16px',
};

export const analysisButtonStyle: React.CSSProperties = {
  backgroundColor: '#f0f0f0',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#444',
};

export const paginationContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '14px',
  color: '#666',
  marginTop: '15px',
};

export const paginationControlsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

export const pageButtonStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: 'white',
};

export const activePageButtonStyle: React.CSSProperties = {
  ...pageButtonStyle,
  backgroundColor: '#F21A2B',
  color: 'white',
  border: '1px solid #F21A2B',
};

export const disabledPageButtonStyle: React.CSSProperties = {
  ...pageButtonStyle,
  opacity: 0.5,
  cursor: 'not-allowed',
};
