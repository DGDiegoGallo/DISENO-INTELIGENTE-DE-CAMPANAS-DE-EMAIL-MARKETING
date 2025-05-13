import React from 'react';

export const viewStyle: React.CSSProperties = {
  padding: '25px',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f8f9fa',
};

export const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
};

export const titleContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

export const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#333',
  fontSize: '22px',
};

export const backIconStyle: React.CSSProperties = {
  cursor: 'pointer',
  color: '#555',
  fontSize: '18px',
};

export const mainContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

export const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#333',
  marginBottom: '20px',
};

export const columnsContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '25px',
  marginBottom: '30px',
};

export const columnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

export const columnTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '15px',
  paddingBottom: '10px',
  borderBottom: '1px solid #eee',
};

export const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  color: '#555',
  fontSize: '14px',
  fontWeight: 'bold',
};

export const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px',
  marginBottom: '20px',
  backgroundColor: 'white',
};

export const designSectionTitleStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#333',
  marginBottom: '10px',
  marginTop: '10px',
};

export const designButtonStyle: React.CSSProperties = {
  padding: '10px 15px',
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

export const metricsContainerStyle: React.CSSProperties = {
  marginTop: '30px',
};

export const metricsSectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#333',
  marginBottom: '15px',
};

export const metricsOptionsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginBottom: '25px',
};

export const metricCheckboxContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

export const metricLabelStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#555',
};

export const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '15px',
  marginTop: '30px',
};

export const primaryButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

export const secondaryButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: 'white',
  color: '#555',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};
