import React from 'react';

export const viewStyle: React.CSSProperties = {
  padding: '20px', 
  backgroundColor: '#f8f9fa', 
  maxHeight: 'calc(100vh - 120px)', 
  overflowY: 'auto'
};

export const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
};

export const chartContainerStyle: React.CSSProperties = {
  flexGrow: 1, 
  position: 'relative',
  height: '180px',
};

export const cardTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#555',
  marginBottom: '10px',
  fontWeight: 'bold',
  textAlign: 'center',
};

export const headerStyle: React.CSSProperties = {
  display: 'flex', 
  alignItems: 'center', 
  marginBottom: '25px', 
  justifyContent: 'space-between'
};

export const statsContainerStyle: React.CSSProperties = {
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
  gap: '15px',
  marginBottom: '25px'
};

export const statBoxStyle: React.CSSProperties = {
  backgroundColor: 'white', 
  padding: '15px', 
  borderRadius: '8px', 
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

export const statLabelStyle: React.CSSProperties = {
  fontSize: '12px', 
  color: '#666', 
  marginBottom: '5px'
};

export const statValueStyle: React.CSSProperties = {
  fontSize: '24px', 
  fontWeight: 'bold', 
  color: '#333'
};

export const chartsContainerStyle: React.CSSProperties = {
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
  gap: '20px', 
  marginBottom: '30px'
};

export const tableContainerStyle: React.CSSProperties = {
  marginTop: '30px', 
  marginBottom: '30px'
};

export const tableStyle: React.CSSProperties = {
  width: '100%', 
  borderCollapse: 'collapse', 
  backgroundColor: 'white', 
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
  borderRadius: '8px'
};

export const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: '#F21A2B', 
  color: 'white'
};

export const tableCellStyle: React.CSSProperties = {
  padding: '12px 15px', 
  textAlign: 'left'
};

export const buttonBaseStyle: React.CSSProperties = {
  padding: '12px 24px',
  fontSize: '16px',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
};

export const primaryButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: '#F21A2B',
};

export const secondaryButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: '#3366cc',
  display: 'inline-flex',
  alignItems: 'center'
};

export const statusMessageStyle: React.CSSProperties = {
  padding: '10px 15px',
  marginBottom: '20px',
  borderRadius: '4px',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center'
};
