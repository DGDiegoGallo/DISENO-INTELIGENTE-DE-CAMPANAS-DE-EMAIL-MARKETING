import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Icono de usuario de ejemplo
import logoImage from '../../assets/images/Horiz.Preferente.png'; // Importar la imagen del logo
import useUserStore from '../../store/useUserStore'; // Importar el store de Zustand

const Navbar: React.FC = () => {
  // Obtener datos del usuario desde el store de Zustand
  const { user } = useUserStore();
  
  // Ya no necesitamos inicializar manualmente, Zustand persist lo hace automáticamente

  // Estilos para el componente de usuario
  const userContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
    gap: '15px'
  };

  const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  };

  const usernameStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#333',
    margin: 0
  };

  const emailStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    margin: 0
  };

  const profilePictureStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid #eee'
  };

  return (
    <nav className="navbar navbar-light bg-white border-bottom" style={{ position: 'fixed', width: '100%', height: '50px', zIndex: 1001, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', padding: '0 15px' }}>
      <div className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a className="navbar-brand" href="#" style={{ marginLeft: '10px' }}>
          <img 
            src={logoImage} 
            alt="TISYIKI" 
            height="30"
            className="d-inline-block align-middle"
          />
        </a>

        {/* Componente de usuario */}
        <div style={userContainerStyle}>
          <div style={userInfoStyle}>
            <p style={usernameStyle}>{user ? (user.nombre ? `${user.nombre} ${user.apellido}` : user.username) : 'Usuario'}</p>
            <p style={emailStyle}>{user?.email || 'ejemplo@gmail.com'}</p>
          </div>
          
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt="Perfil" 
              style={profilePictureStyle}
            />
          ) : (
            <FaUserCircle size={40} color="#ccc" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;