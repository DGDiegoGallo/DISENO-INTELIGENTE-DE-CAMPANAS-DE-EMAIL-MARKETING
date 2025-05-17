import { CSSProperties } from 'react';

// Estilos principales
export const viewStyle: CSSProperties = {
  position: 'relative', // Added for local spinner context
  padding: '25px',
  fontFamily: "'Inter', sans-serif", // Using a more modern font, ensure it's imported globally or fallback
  backgroundColor: '#f4f6f8', // Slightly softer background
  maxHeight: 'calc(100vh - 90px)', // Adjust 90px based on actual navbar height
  overflowY: 'auto',
};

export const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
};

export const titleContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

export const titleStyle: CSSProperties = {
  margin: 0,
  color: '#282A5B', // Navy Blue
  fontSize: '24px',
  fontWeight: 'bold',
};

// Estilos de botones
export const buttonStyle: CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#F21A2B', // Red
  color: 'white',
  border: 'none',
  borderRadius: '6px', // Slightly more rounded
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '15px',
  transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

export const buttonHoverStyle: CSSProperties = {
  backgroundColor: '#D01020', // Darker Red
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
};

export const disabledButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#cccccc',
  color: '#666666',
  cursor: 'not-allowed',
  boxShadow: 'none',
};

// Estilos de contenedores
export const contentContainerStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px', // Increased gap
  marginBottom: '24px'
};

// Estilos de mensajes
export const messageStyle: CSSProperties = {
  padding: '10px 15px',
  borderRadius: '4px',
  marginBottom: '15px'
};

export const errorMessageStyle: CSSProperties = {
  ...messageStyle,
  backgroundColor: '#f8d7da',
  color: '#721c24',
  border: '1px solid #f5c6cb'
};

export const successMessageStyle: CSSProperties = {
  ...messageStyle,
  backgroundColor: '#d4edda',
  color: '#155724',
  border: '1px solid #c3e6cb'
};

// Estilos de previsualización
export const previewContainerStyle: CSSProperties = {
  marginTop: '15px'
};

export const previewHeaderStyle: CSSProperties = {
  padding: '12px 15px',
  backgroundColor: '#ffffff', // White background for contrast
  borderRadius: '8px',
  marginBottom: '10px',
  border: '1px solid #e0e0e0',
};

export const previewTitleContainerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

export const previewTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '17px',
  fontWeight: '600',
  color: '#282A5B', // Navy Blue
};

export const previewContentStyle: CSSProperties = {
  border: '1px solid #e9edf0',
  borderRadius: '6px',
  backgroundColor: '#f8f9fa', // Light background for content area
  padding: '15px',
  maxHeight: '300px',
  overflowY: 'auto',
  lineHeight: '1.6',
};

// New style for general form sections/cards
export const formSectionStyle: CSSProperties = {
  backgroundColor: 'white',
  padding: '20px 25px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginBottom: '24px',
};

// New style for h4 section titles
export const sectionTitleStyle: CSSProperties = {
  color: '#282A5B', // Navy Blue
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: `2px solid #F21A2B`, // Red accent
  display: 'inline-block',
};

// Modal Styles
export const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent grey backdrop
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050, // Ensure it's above other content
};

export const modalContentStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  minWidth: '350px',
  maxWidth: '500px',
  textAlign: 'center',
};

export const modalTextStyle: CSSProperties = {
  marginBottom: '25px',
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333',
};

export const modalActionsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginTop: '20px',
};

const modalButtonBaseStyle: CSSProperties = {
  padding: '10px 20px',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '15px',
  transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

export const modalButtonPrimaryStyle: CSSProperties = {
  ...modalButtonBaseStyle,
  backgroundColor: '#F21A2B', // Main brand red color
};

export const modalButtonSecondaryStyle: CSSProperties = {
  ...modalButtonBaseStyle,
  backgroundColor: '#6c757d', // Grey for secondary actions
};
