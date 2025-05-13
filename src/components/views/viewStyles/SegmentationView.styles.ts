import React from 'react';

export const viewStyle: React.CSSProperties = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  maxWidth: '100%',
  margin: '0 auto',
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto'
};

export const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  marginBottom: '20px',
  color: '#333'
};

export const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  marginBottom: '15px',
  marginTop: '30px',
  color: '#333'
};

export const tableStyle: React.CSSProperties = {
  width: '100%', 
  borderCollapse: 'collapse',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '30px',
  backgroundColor: 'white'
};

export const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: '#282A5B', 
  color: 'white'
};

export const tableHeaderCellStyle: React.CSSProperties = {
  padding: '12px 15px',
  textAlign: 'left',
  fontWeight: 'bold'
};

export const tableCellStyle: React.CSSProperties = {
  padding: '12px 15px',
  borderBottom: '1px solid #eee'
};

export const tableIconStyle: React.CSSProperties = {
  cursor: 'pointer',
  marginRight: '15px',
  color: '#777',
  fontSize: '16px'
};

export const recommendationSectionStyle: React.CSSProperties = {
  marginTop: '30px'
};

export const recommendationBoxStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  marginBottom: '20px',
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

export const recommendationImageStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  backgroundColor: '#eee',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#999',
  fontSize: '12px'
};

export const recommendationTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#555',
  lineHeight: '1.5'
};
