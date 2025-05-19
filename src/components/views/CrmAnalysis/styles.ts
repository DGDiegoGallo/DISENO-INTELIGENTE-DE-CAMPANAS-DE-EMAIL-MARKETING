import React from 'react';

export const viewStyle: React.CSSProperties = {
  padding: '20px', 
  backgroundColor: '#f8f9fa', 
  maxHeight: 'calc(100vh - 120px)', 
  overflowY: 'auto'
};

export const headerStyle: React.CSSProperties = {
  display: 'flex', 
  alignItems: 'center', 
  marginBottom: '25px', 
  justifyContent: 'space-between'
};

export const titleContainerStyle: React.CSSProperties = {
  display: 'flex', 
  alignItems: 'center'
};

export const backIconStyle: React.CSSProperties = {
  marginRight: '15px', 
  cursor: 'pointer', 
  color: '#555', 
  fontSize: '18px'
};

export const titleStyle: React.CSSProperties = {
  margin: 0, 
  color: '#333', 
  fontSize: '20px'
};

export const refreshButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

export const refreshIconStyle: React.CSSProperties = {
  marginRight: '8px'
};

// Estilos para mensajes eliminados - Ahora se usa Toastify

export const actionButtonStyle: React.CSSProperties = {
  padding: '12px 24px',
  fontSize: '16px',
  color: 'white',
  backgroundColor: '#F21A2B',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
};

export const secondaryButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  backgroundColor: '#3366cc',
  display: 'inline-flex',
  alignItems: 'center'
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

export const statsContainerStyle: React.CSSProperties = {
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
  gap: '15px',
  marginBottom: '25px'
};

export const statCardStyle: React.CSSProperties = {
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

export const tableTitleStyle: React.CSSProperties = {
  fontSize: '18px', 
  margin: '0 0 15px 0', 
  color: '#333'
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

export const tableHeaderCellStyle: React.CSSProperties = {
  padding: '12px 15px', 
  textAlign: 'left'
};

export const tableCellStyle: React.CSSProperties = {
  padding: '10px 15px'
};

export const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px'
};

export const scoreContainerStyle: React.CSSProperties = {
  width: '30px', 
  height: '30px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '14px',
};

export const actionsContainerStyle: React.CSSProperties = {
  marginTop: '30px', 
  marginBottom: '20px', 
  textAlign: 'center'
};

// Opciones para los gráficos
export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: false },
      ticks: { font: { size: 10 } }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 } }
    },
  },
};

export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
};

export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: false },
      ticks: { font: { size: 10 } }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 } }
    },
  },
};
