import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaSync, FaTrash, FaCheck, FaBan, FaUser, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import adminService from '../../../services/adminService';
import { StrapiUser } from '../../../interfaces/user';
import { AdminState } from '../../../interfaces/admin';
import './AdminView.css';

/**
 * Vista de Administración para usuarios con rol de admin
 */
const AdminView: React.FC = () => {
  // Estado para almacenar los datos y estado de la UI
  const [state, setState] = useState<AdminState>({
    users: [],
    loading: true,
    error: null,
    showDeleteConfirm: false,
    userToDelete: null
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Ya no usamos datos de prueba, mostraremos mensaje cuando no haya usuarios

  // Función para cargar usuarios
  const loadUsers = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Primero intentamos obtener directamente desde /api/users
      let usersData: StrapiUser[] = [];
      
      try {
        const directResponse = await adminService.getUsersDirectly(1, 100);
        if (directResponse && directResponse.data && Array.isArray(directResponse.data)) {
          console.log('Respuesta directa de usuarios:', directResponse);
          usersData = directResponse.data.map(userObj => {
            // Definimos el tipo para asegurar type safety
            const attributes = 'attributes' in userObj ? userObj.attributes as Record<string, unknown> : userObj as Record<string, unknown>;
            return {
              id: userObj.id,
              username: (attributes.username as string) || '',
              email: (attributes.email as string) || '',
              provider: (attributes.provider as string) || 'local',
              confirmed: (attributes.confirmed as boolean) || false,
              blocked: (attributes.blocked as boolean) || false,
              createdAt: (attributes.createdAt as string) || '',
              updatedAt: (attributes.updatedAt as string) || '',
              nombre: (attributes.nombre as string) || '',
              apellido: (attributes.apellido as string) || '',
              rol: (attributes.rol as string) || '',
              // Si el rol viene en el campo role, extraerlo
              // Solo añadir si role existe y tiene una propiedad type
              ...(attributes.role && typeof attributes.role === 'object' && 'type' in attributes.role ? { rol: (attributes.role as Record<string, unknown>).type as string } : {})
            };
          });
        }
      } catch (directError) {
        console.warn('No se pudo obtener usuarios directamente:', directError);
      }
      
      // Si no hay usuarios desde el endpoint directo, intentamos desde proyecto-56s
      if (usersData.length === 0) {
        const response = await adminService.getAllUsers(1, 100) as {data?: Array<Record<string, unknown>>};
        console.log('Respuesta de API de proyecto-56s:', response);
        
        // Extraer usuarios de los proyectos
        if (response && response.data && Array.isArray(response.data)) {
          const uniqueUsers = new Map<number, StrapiUser>();
          
          // Recorrer cada proyecto (la estructura exacta como viene del JSON del usuario)
          response.data.forEach((proyecto: Record<string, unknown>) => {
            const proyectoData = proyecto as Record<string, unknown>;
            if (proyectoData && proyectoData.usuario) {
              const userData = proyectoData.usuario as Record<string, unknown>;
              if (userData && userData.id) {
                if (!uniqueUsers.has(userData.id as number)) {
                  uniqueUsers.set(userData.id as number, {
                    id: userData.id as number,
                    username: (userData.username as string) || '',
                    email: (userData.email as string) || '',
                    provider: (userData.provider as string) || 'local',
                    confirmed: (userData.confirmed as boolean) || false,
                    blocked: (userData.blocked as boolean) || false,
                    createdAt: (userData.createdAt as string) || '',
                    updatedAt: (userData.updatedAt as string) || '',
                    nombre: (userData.nombre as string) || '',
                    apellido: (userData.apellido as string) || '',
                    rol: (userData.rol as string) || '',
                    // Si el rol está en role.type, asignarlo también
                    // Solo añadir si role existe y tiene una propiedad type
                    ...(userData.role && typeof userData.role === 'object' && 'type' in userData.role ? { rol: (userData.role as Record<string, unknown>).type as string } : {})
                  });
                }
              }
            }
          });
          
          usersData = Array.from(uniqueUsers.values());
        }
      }

      console.log('Usuarios procesados:', usersData);
      
      // Si no hay usuarios, simplemente guardamos el array vacío
      setState(prev => ({
        ...prev,
        users: usersData,
        loading: false
      }));
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setState(prev => ({
        ...prev,
        error: 'Error al cargar datos de usuarios.',
        users: [],
        loading: false
      }));
    }
  };

  // Función para mostrar el diálogo de confirmación
  const confirmDelete = (user: StrapiUser) => {
    setState(prev => ({
      ...prev,
      showDeleteConfirm: true,
      userToDelete: user
    }));
  };

  // Función para eliminar un usuario
  const deleteUser = async () => {
    if (!state.userToDelete) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      console.log(`Intentando eliminar usuario con ID ${state.userToDelete.id}`);
      
      // Verificar si el usuario tiene rol de admin
      // Comprobar si el rol viene en el campo 'rol' o en 'role.type'
      const userRole = state.userToDelete.rol || state.userToDelete.role?.type;
      const isUserAdmin = userRole === 'admin';
      if (isUserAdmin) {
        throw new Error('No se puede eliminar un usuario con rol de administrador');
      }
      
      // Llamar al servicio para eliminar usuario
      await adminService.deleteUser(state.userToDelete.id);
      
      // Actualizar la lista de usuarios (eliminar el usuario borrado)
      setState(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== state.userToDelete?.id),
        showDeleteConfirm: false,
        userToDelete: null,
        loading: false
      }));
      
      // Mostrar mensaje de éxito
      alert(`Usuario ${state.userToDelete.username} eliminado exitosamente`);
      
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setState(prev => ({
        ...prev, 
        loading: false,
        showDeleteConfirm: false,
        userToDelete: null
      }));
      alert(`Error al eliminar usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setState(prev => ({
      ...prev,
      showDeleteConfirm: false,
      userToDelete: null
    }));
  };

  return (
    <div className="admin-view-container" style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      maxHeight: 'calc(100vh - 120px)', 
      overflowY: 'auto' 
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '25px',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaArrowLeft 
            style={{ color: '#555', marginRight: '15px', cursor: 'pointer', fontSize: '18px' }} 
            onClick={() => window.history.back()}
          />
          <h2 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Panel de Administración</h2>
        </div>
        <button 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 16px', 
            backgroundColor: '#F21A2B', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onClick={loadUsers}
        >
          <FaSync style={{ marginRight: '8px' }} /> Actualizar
        </button>
      </div>

      {/* Mensaje de error */}
      {state.error && (
        <div className="alert alert-danger" role="alert">
          {state.error}
        </div>
      )}

      {/* Tarjeta de usuarios */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Gestión de Usuarios</h5>
          <span className="badge bg-primary">{state.users.length} usuarios</span>
        </div>
        <div className="card-body p-0">
          {state.loading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando usuarios...</p>
            </div>
          ) : state.users.length === 0 ? (
            <div className="alert alert-info d-flex align-items-center">
              <FaInfoCircle className="me-2" />
              No hay usuarios registrados en el sistema.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ width: '60px' }}>#</th>
                    <th scope="col">Usuario</th>
                    <th scope="col">Email</th>
                    <th scope="col">Nombre completo</th>
                    <th scope="col">Estado</th>
                    <th scope="col" className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {state.users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaUser className="text-secondary me-2" />
                          {user.username}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaEnvelope className="text-secondary me-2" />
                          {user.email}
                        </div>
                      </td>
                      <td>
                        {user.nombre && user.apellido 
                          ? `${user.nombre} ${user.apellido}` 
                          : user.nombre 
                            ? user.nombre 
                            : <span className="text-muted">No especificado</span>
                        }
                      </td>
                      <td>
                        {user.blocked ? (
                          <span className="badge bg-danger">Bloqueado</span>
                        ) : user.confirmed ? (
                          <span className="badge bg-success">Activo</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Pendiente</span>
                        )}
                      </td>
                      <td className="text-center">
                        {(user.rol === 'admin' || user.role?.type === 'admin') ? (
                          <button
                            className="btn btn-sm btn-secondary"
                            disabled
                            title="No se puede eliminar administradores"
                          >
                            <FaTrash />
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => confirmDelete(user)}
                            title="Eliminar usuario"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {state.showDeleteConfirm && state.userToDelete && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1} aria-modal="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro que deseas eliminar al usuario <strong>{state.userToDelete.username}</strong>?</p>
                <p className="text-danger"><strong>ATENCIÓN:</strong> Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                  <FaBan className="me-1" /> Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={deleteUser} disabled={state.loading}>
                  {state.loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <FaCheck className="me-1" /> Confirmar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tarjeta de estadísticas */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-light">
              Resumen del Sistema
            </div>
            <div className="card-body">
              <p>En esta sección encontrarás estadísticas sobre el uso del sistema:</p>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total de usuarios
                  <span className="badge bg-primary rounded-pill">{state.users.length}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Usuarios activos
                  <span className="badge bg-success rounded-pill">
                    {state.users.filter(u => u.confirmed && !u.blocked).length}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Usuarios bloqueados
                  <span className="badge bg-danger rounded-pill">
                    {state.users.filter(u => u.blocked).length}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-light">
              Configuración
            </div>
            <div className="card-body">
              <p className="card-text">Esta sección permite configurar parámetros del sistema.</p>
              <p className="text-muted fst-italic">Próximamente se añadirán más opciones de administración...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
