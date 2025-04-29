import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Campaign {
  id: number;
  fecha: string;
  detalles: string;
  analisis: string;
}

// Añadir la prop onShowCreate a la interfaz
interface CampaignsViewProps {
  onShowCreate: () => void;
}

const CampaignsView: React.FC<CampaignsViewProps> = ({ onShowCreate }) => {
  // Datos de muestra para las campañas
  const campaignData: Campaign[] = [
    { id: 1, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
    { id: 2, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
    { id: 3, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
    { id: 4, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
    { id: 5, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
    { id: 6, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
    { id: 7, fecha: 'DD/MM/AAAA', detalles: 'Campaña lorem ipsum...', analisis: '5/30' },
  ];

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Interacciones</h2>
        {/* Usar onShowCreate en el onClick */}
        <button 
          onClick={onShowCreate} 
          className="btn text-white fw-bold px-4" 
          style={{ backgroundColor: '#FF3A44' }}
        >
          Crear
        </button>
      </div>

      {/* Tabla de campañas */}
      <div className="card border-0 shadow-sm">
        {/* Cabecera */}
        <div className="row g-0 text-white rounded-top" style={{ backgroundColor: '#282A5B', padding: '0.75rem 1.25rem' }}>
          <div className="col-3 fw-bold">Fecha</div>
          <div className="col-5 fw-bold">Detalles</div>
          <div className="col-2 fw-bold">Análisis</div>
          <div className="col-2 fw-bold text-end">Acciones</div>
        </div>

        {/* Filas de la tabla */}
        {campaignData.map((campaign) => (
          <div key={campaign.id} className="row g-0 border-bottom align-items-center" style={{ padding: '0.75rem 1.25rem' }}>
            <div className="col-3">{campaign.fecha}</div>
            <div className="col-5">{campaign.detalles}</div>
            <div className="col-2">{campaign.analisis}</div>
            <div className="col-2 text-end">
              <button className="btn btn-sm btn-link p-0 me-3" title="Editar">
                <FaEdit className="text-secondary" />
              </button>
              <button className="btn btn-sm btn-link p-0" title="Eliminar">
                <FaTrash className="text-secondary" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted small">
          Mostrando 7 de 10 datos
        </div>
        <nav aria-label="Page navigation">
          <ul className="pagination pagination-sm">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li className="page-item active"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item"><a className="page-link" href="#">4</a></li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&hellip;</span>
              </a>
            </li>
            <li className="page-item"><a className="page-link" href="#">40</a></li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CampaignsView; 