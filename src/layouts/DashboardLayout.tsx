import React from 'react';
import Navbar from '../components/Navbar/Navbar';

interface DashboardLayoutProps {
  sidebar: React.ReactNode; // Para pasar el componente Sidebar configurado
  children: React.ReactNode; // Para el contenido principal (con transiciones)
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebar, children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="d-flex" style={{ marginTop: '56px' }}>
        {sidebar} {/* Renderizar el Sidebar pasado como prop */}
        {/* Contenedor principal donde irá el contenido con transiciones */}
        <div 
          className="container-fluid px-3"
          style={{
            marginLeft: '180px', // Asume ancho fijo del sidebar
            position: 'relative',
            paddingTop: '20px',
            backgroundColor: '#f8f9fa',
            flexGrow: 1, // Asegura que ocupe el espacio restante
          }}
        >
          {children} {/* Renderizar el contenido principal */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
