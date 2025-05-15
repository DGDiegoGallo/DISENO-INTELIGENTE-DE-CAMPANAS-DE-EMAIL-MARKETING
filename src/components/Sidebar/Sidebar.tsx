import React from 'react';
import { 
  FaHome, 
  FaBullhorn, 
  FaUsers, 
  FaDatabase, 
  FaFlask, 
  FaChartBar, 
  FaGraduationCap, 
  FaLightbulb, 
  FaUserFriends, 
  FaHeadset,
  FaSignOutAlt,
  FaEnvelope,
  FaUser
} from 'react-icons/fa';
import authService from '../../services/auth/authService';
import useUserStore from '../../store/useUserStore';

// Definir la interfaz para las props
interface SidebarProps {
  onNavigate: (viewName: string) => void;
  activeView: string;
}

// Definición del estilo para el sidebar
const sidebarStyle = {
  width: '180px',
  height: '100%',
  backgroundColor: 'white',
  borderRight: '1px solid #e9e9e9',
  position: 'fixed' as const,
  left: 0,
  top: 0,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column' as const
};

// Estilo para los elementos de navegación
const navItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 16px',
  color: '#666',
  textDecoration: 'none',
  fontSize: '13px',
  borderBottom: '1px solid #f5f5f5',
  cursor: 'pointer'
};

// Estilo para el ícono
const iconStyle = {
  marginRight: '12px',
  fontSize: '15px',
  minWidth: '16px',
  color: '#888'
};

// Restaurar y definir el estilo activo como constante
const activeNavItemStyle = {
  backgroundColor: '#F21A2B',
  color: 'white'
};

const activeIconStyle = {
  color: 'white'
};

// Estilo para texto de dos líneas
const twoLineTextStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  lineHeight: '1.2'
};

// Estilo para el contenedor de navegación
const navContainerStyle = {
  marginTop: '50px', // Espacio para la navbar
  flex: 1, // Tomar el espacio disponible
  overflowY: 'auto' as const // Permitir scroll si hay muchos items
};

// Estilo para el botón de logout
const logoutButtonStyle = {
  ...navItemStyle,
  marginTop: 'auto',
  borderTop: '1px solid #e9e9e9',
  backgroundColor: '#f8f8f8'
};

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView }) => {
  // Obtener la función logout del store
  const { logout } = useUserStore();

  // Función helper para manejar el clic
  const handleNavClick = (viewName: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir la navegación por defecto si usamos <a>
    onNavigate(viewName);
  };
  
  // Función simplificada para manejar el logout
  const handleLogout = () => {
    console.log('Cerrando sesión...');
    
    try {
      // 1. Usar la función de logout del store Zustand
      logout();
      
      // 2. Como respaldo, también usar el servicio de autenticación
      authService.logout();
      
      console.log('Sesión cerrada correctamente');
      
      // 3. Redirigir usando window.location para forzar recarga completa
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      // Si falla, intentar redirección directa como último recurso
      window.location.href = '/login';
    }
    // No necesitamos medidas de emergencia adicionales
  };
  
  return (
    <div style={sidebarStyle}>
      <div style={navContainerStyle}>
        <div 
          style={{...navItemStyle, ...(activeView === 'Inicio' ? activeNavItemStyle : {})}}
          onClick={(e) => handleNavClick('Inicio', e)}
        >
          <FaHome style={{...iconStyle, ...(activeView === 'Inicio' ? activeIconStyle : {})}} /> Inicio
        </div>
        
        <div 
          style={{...navItemStyle, ...(activeView === 'Campañas' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('Campañas', e)}
        >
          <FaBullhorn style={{...iconStyle, ...(activeView === 'Campañas' ? activeIconStyle : {})}} /> Campañas
        </div>
        
        <div 
          style={{...navItemStyle, ...(activeView === 'Contactos' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('Contactos', e)}
        >
          <FaUsers style={{...iconStyle, ...(activeView === 'Contactos' ? activeIconStyle : {})}} /> Contactos
        </div>
        
        <div 
          style={{...navItemStyle, ...(activeView === 'Datos CRM' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('Datos CRM', e)}
        >
          <FaDatabase style={{...iconStyle, ...(activeView === 'Datos CRM' ? activeIconStyle : {})}} /> Datos CRM
        </div>
        
        <div 
          style={{...navItemStyle, ...(activeView === 'Pruebas A/B' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('Pruebas A/B', e)}
        >
          <FaFlask style={{...iconStyle, ...(activeView === 'Pruebas A/B' ? activeIconStyle : {})}} /> Pruebas A/B
        </div>
        
        <div 
          style={{...navItemStyle, ...(activeView === 'Metricas' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('Metricas', e)}
        >
          <FaChartBar style={{...iconStyle, ...(activeView === 'Metricas' ? activeIconStyle : {})}} />
          <span style={twoLineTextStyle}>
            <span>Métricas</span>
            <span>de rendimiento</span>
          </span>
        </div>
        
        <div 
          style={{...navItemStyle, ...(activeView === 'Capacitacion' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('Capacitacion', e)}
        >
          <FaGraduationCap style={{...iconStyle, ...(activeView === 'Capacitacion' ? activeIconStyle : {})}} /> Capacitación
        </div>
        
        <div 
          style={{...navItemStyle, ...(activeView === 'Recomendacion' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('Recomendacion', e)}
        >
          <FaLightbulb style={{...iconStyle, ...(activeView === 'Recomendacion' ? activeIconStyle : {})}} />
          <span style={twoLineTextStyle}>
            <span>Recomendación</span>
            <span>de campaña</span>
          </span>
        </div>
        
        <div 
          style={{...navItemStyle, ...(activeView === 'Segmentacion' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('Segmentacion', e)}
        >
          <FaUserFriends style={{...iconStyle, ...(activeView === 'Segmentacion' ? activeIconStyle : {})}} />
          <span style={twoLineTextStyle}>
            <span>Segmentación</span>
            <span>de campañas</span>
          </span>
        </div>
        
        <div 
          style={{...navItemStyle, ...(activeView === 'Soporte' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('Soporte', e)}
        >
          <FaHeadset style={{...iconStyle, ...(activeView === 'Soporte' ? activeIconStyle : {})}} /> Soporte
        </div>
        
        <div 
          style={{...navItemStyle, ...(activeView === 'VerificacionEmail' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('VerificacionEmail', e)}
        >
          <FaEnvelope style={{...iconStyle, ...(activeView === 'VerificacionEmail' ? activeIconStyle : {})}} /> Verificación Email
        </div>

        {/* Acceso a Admin solo para rol admin */}
        {useUserStore.getState().user?.rol === 'admin' && (
          <div 
            style={{...navItemStyle, ...(activeView === 'Administracion' ? activeNavItemStyle : {})}} 
            onClick={(e) => handleNavClick('Administracion', e)}
          >
            <FaUser style={{...iconStyle, ...(activeView === 'Administracion' ? activeIconStyle : {})}} /> Administración
          </div>
        )}
      </div>
      
      {/* Enlace al perfil */}
      <div 
        style={{...navItemStyle, ...(activeView === 'Perfil' ? activeNavItemStyle : {}), marginTop: 'auto', borderTop: '1px solid #e9e9e9'}}
        onClick={(e) => handleNavClick('Perfil', e)}
      >
        <FaUser style={{...iconStyle, ...(activeView === 'Perfil' ? activeIconStyle : {})}} /> Mi Perfil
      </div>
      
      {/* Botón de logout */}
      <div 
        style={logoutButtonStyle}
        onClick={handleLogout}
      >
        <FaSignOutAlt style={iconStyle} /> Cerrar sesión
      </div>
    </div>
  );
};

export default Sidebar; 