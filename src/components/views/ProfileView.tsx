import React, { useState, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import ChangePasswordModal from '../ChangePasswordModal';
import ChangeProfilePhotoModal from '../ChangeProfilePhotoModal';
import useUserStore from '../../store/useUserStore';
import { getAssetUrl } from '../../services/assetService';

const ProfileView: React.FC = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const { user } = useUserStore();
  
  // Cargar la información del avatar cuando cambie el usuario
  useEffect(() => {
    const loadAvatar = async () => {
      if (user?.avatar) {
        setAvatarLoading(true);
        setAvatarError(false);
        
        try {
          // Intentar obtener la información del asset
          const assetUrl = getAssetUrl(user.avatar);
          setAvatarUrl(assetUrl);
        } catch (error) {
          console.error('Error al cargar el avatar:', error);
          setAvatarError(true);
        } finally {
          setAvatarLoading(false);
        }
      }
    };
    
    loadAvatar();
  }, [user?.avatar]);

  // Valores por defecto para el formulario
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || 'ejemplo@gmail.com'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios del perfil
    console.log('Guardando perfil:', formData);
    // Mostrar alguna notificación de éxito
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">Perfil</h2>
          <button 
            className="btn text-white" 
            style={{ backgroundColor: '#FF3A44' }}
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="card-title mb-4">Información general</h5>
          
          <div className="row mb-4">
            <div className="col-md-3 col-lg-2 mb-3 mb-md-0">
              <div className="position-relative">
                <div className="rounded-circle overflow-hidden" style={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0' }}>
                  {avatarLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    </div>
                  ) : avatarUrl && !avatarError ? (
                    <img 
                      src={avatarUrl} 
                      alt="Foto de perfil" 
                      className="w-100 h-100 object-fit-cover" 
                      onError={() => {
                        console.error('Error al cargar la imagen de perfil');
                        setAvatarError(true);
                      }}
                    />
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100 bg-light text-secondary">
                      <span className="fs-1">{user?.nombre?.charAt(0) || user?.username?.charAt(0) || 'U'}</span>
                    </div>
                  )}
                </div>
                <button 
                  className="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0 shadow-sm"
                  style={{ width: '32px', height: '32px', padding: '0' }}
                  onClick={() => setShowPhotoModal(true)}
                >
                  <FaPencilAlt />
                </button>
              </div>
            </div>
            
            <div className="col-md-9 col-lg-10">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="nombre"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="apellido" className="form-label">Apellido</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="apellido"
                    name="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email"
                    name="email"
                    placeholder="ejemplo@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <div className="input-group">
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password"
                      value="************"
                      disabled
                    />
                    <button 
                      className="btn btn-outline-danger" 
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Cambiar contraseña
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ChangePasswordModal 
        show={showPasswordModal} 
        onHide={() => setShowPasswordModal(false)} 
      />
      
      <ChangeProfilePhotoModal 
        show={showPhotoModal} 
        onHide={() => setShowPhotoModal(false)} 
      />
    </div>
  );
};

export default ProfileView;
