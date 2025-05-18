import React, { useEffect, useMemo } from 'react';
import { 
  FaArrowLeft, 
  FaSync, 
  FaTrash, 
  FaUser, 
  FaSearch
} from 'react-icons/fa';
import useAdminCampaignsStore from '../../../store/useAdminCampaignsStore';
import './AdminView.css';

const AdminView: React.FC = () => {
  const {
    users,
    loading,
    loadData,
    stats: { totalUsers },
    deleteUser,
    showDeleteConfirm,
    userToDelete,
    confirmDelete,
    cancelDelete
  } = useAdminCampaignsStore();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FaArrowLeft 
            className="me-2" 
            style={{ cursor: 'pointer' }}
            onClick={() => window.history.back()}
          />
          Administración de Usuarios
        </h2>
        <button 
          className="btn btn-outline-primary"
          onClick={loadData}
          disabled={loading}
        >
          <FaSync className={`me-2 ${loading ? 'fa-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Lista de Usuarios</h5>
          <span className="badge bg-primary">{totalUsers} usuarios</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm me-2">
                          <div className="avatar-title bg-light rounded-circle text-primary">
                            <FaUser />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">{user.username || 'Sin nombre'}</h6>
                          <small className="text-muted">ID: {user.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{user.email || 'Sin email'}</td>
                    <td>
                      {user.rol === 'admin' || user.role?.type === 'admin' ? (
                        <span className="badge bg-danger">Administrador</span>
                      ) : (
                        <span className="badge bg-secondary">Usuario</span>
                      )}
                    </td>
                    <td>
                      {user.confirmed ? (
                        <span className="badge bg-success">Activo</span>
                      ) : (
                        <span className="badge bg-warning">Pendiente</span>
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(user);
                        }}
                        disabled={loading}
                        title="Eliminar usuario"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No se encontraron usuarios que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredUsers.length > 0 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <div className="text-muted">
              Mostrando <b>{Math.min((currentPage - 1) * pageSize + 1, filteredUsers.length)}</b> a{' '}
              <b>{Math.min(currentPage * pageSize, filteredUsers.length)}</b> de <b>{filteredUsers.length}</b> usuarios
            </div>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                </li>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && userToDelete && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelDelete}
                  disabled={loading}
                  aria-label="Cerrar"
                />
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.username}</strong>?
                </p>
                <p className="text-danger mb-0">
                  <small>Esta acción no se puede deshacer.</small>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelDelete}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => userToDelete && deleteUser(userToDelete.id)}
                  disabled={loading}
                >
                  {loading ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AdminView);
