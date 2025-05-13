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
  FaSmile, 
  FaUserFriends, 
  FaHeadset,
  FaSignOutAlt,
  FaEnvelope
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
  
  // Función para manejar el logout
  const handleLogout = () => {
    // Establecer una bandera para indicar que la sesión fue cerrada explícitamente
    localStorage.setItem('session_closed', 'true');
    
    // Limpiar los datos de sesión usando authService
    authService.logout();
    
    // Llamar a la función logout de Zustand
    logout();
    console.log('Sesión cerrada correctamente en Zustand');
    
    // Limpiar localStorage completamente
    console.log('Limpiando localStorage completamente...');
    localStorage.clear();
    
    // Volver a establecer la bandera de sesión cerrada para que no intente reiniciar la sesión
    localStorage.setItem('session_closed', 'true');
    
    // Eliminar datos de sessionStorage
    sessionStorage.clear();
    
    // Eliminar todas las cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      if (name) {
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
    
    console.log('Todos los datos de sesión han sido eliminados');
    
    // Forzar la navegación de manera incondicional
    // Usar un formulario para evitar cualquier intercepción por parte de react-router u otras bibliotecas
    const form = document.createElement('form');
    form.method = 'GET';
    form.action = '/login';
    
    // Añadir parámetro para indicar que es un cierre de sesión forzado
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'forceLogout';
    input.value = 'true';
    form.appendChild(input);
    
    // Añadir al DOM y hacer submit
    document.body.appendChild(form);
    
    // Mensaje de cierre de sesión
    document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;"><div style="text-align: center; background: #f8f9fa; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"><h1 style="color: #343a40; margin-bottom: 20px;">Cerrando sesión...</h1><p style="color: #6c757d; margin-bottom: 30px;">Por favor espere mientras lo redirigimos.</p><div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #F21A2B; border-radius: 50%; margin: 0 auto; animation: spin 1s linear infinite;"></div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style></div></div>';
    
    // Submtir el formulario después de un breve retraso
    setTimeout(() => {
      form.submit();
    }, 300);
    
    // Como medida de emergencia, si nada funciona después de 1 segundo, forzar redirección
    setTimeout(() => {
      window.location.href = '/login?forceLogout=true&emergency=true';
    }, 1000);
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
          style={{...navItemStyle, ...(activeView === 'Analisis' ? activeNavItemStyle : {})}} 
          onClick={(e) => handleNavClick('Analisis', e)}
        >
          <FaSmile style={{...iconStyle, ...(activeView === 'Analisis' ? activeIconStyle : {})}} />
          <span style={twoLineTextStyle}>
            <span>Análisis</span>
            <span>de sentimiento</span>
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