import React from 'react';

export const viewStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
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

export const searchSectionStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  marginBottom: '30px',
  alignItems: 'center'
};

export const searchContainerStyle: React.CSSProperties = {
  position: 'relative',
  flex: '1 1 250px'
};

export const searchIconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#999'
};

export const searchInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 12px 12px 40px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '14px'
};

export const dropdownStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '14px',
  flex: '1 1 150px'
};

export const searchButtonStyle: React.CSSProperties = {
  padding: '12px 20px',
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '14px',
  cursor: 'pointer',
  fontWeight: 'bold',
  flex: '0 0 auto'
};

export const cardsContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px'
};

export const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
};

export const iconContainerStyle: React.CSSProperties = {
  marginBottom: '15px'
};

export const cardIconStyle: React.CSSProperties = {
  fontSize: '70px',
  color: '#F21A2B'
};

export const cardTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#333',
  textAlign: 'center'
};

export const cardDescriptionStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '15px',
  textAlign: 'center',
  lineHeight: '1.5'
};

export const cardButtonStyle: React.CSSProperties = {
  padding: '8px 25px',
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '14px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: 'auto'
};
