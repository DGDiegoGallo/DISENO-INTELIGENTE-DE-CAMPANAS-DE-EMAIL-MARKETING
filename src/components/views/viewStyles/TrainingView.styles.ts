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

export const searchSectionStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  marginBottom: '20px',
};

export const searchContainerStyle: React.CSSProperties = {
  position: 'relative',
  flex: '1 1 300px',
};

export const searchIconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#999',
};

export const searchInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 12px 12px 40px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px',
  boxSizing: 'border-box',
};

export const recentTutorialsStyle: React.CSSProperties = {
  marginBottom: '30px',
};

export const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#333',
  marginBottom: '15px',
};

export const tutorialsContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
};

export const tutorialCardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

export const tutorialTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '10px',
};

export const tutorialDescriptionStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '15px',
  lineHeight: '1.5',
};

export const viewButtonStyle: React.CSSProperties = {
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 15px',
  fontSize: '14px',
  cursor: 'pointer',
  width: '100%',
  fontWeight: 'bold',
};

export const guidesContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  marginTop: '20px',
};

export const guideCardStyle: React.CSSProperties = {
  flex: '1 1 250px',
  minWidth: '250px',
  background: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export const guideIconContainerStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  marginBottom: '15px',
};

export const guideTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '10px',
  textAlign: 'center',
};

export const guideDescriptionStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '15px',
  textAlign: 'center',
  lineHeight: '1.5',
};
