// Contenido inicial para InicioView.tsx
import React from 'react';
import CircularChart from '../CircularChart/CircularChart';
import { Doughnut } from 'react-chartjs-2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar ChartJS (puede que necesite hacerse a nivel de App si se usa en más vistas)
ChartJS.register(ArcElement, Tooltip, Legend);

// Interfaces (podrían moverse a un archivo de tipos)
/* // Ya no se usa directamente aquí
interface ChartInstance {
  data: {
    labels: string[];
    datasets: Array<{
      backgroundColor: string[];
      [key: string]: unknown;
    }>;
  };
  getDatasetMeta: (index: number) => {
    controller: {
      getStyle: (index: number) => {
        borderColor: string;
        borderWidth: number;
      };
    };
  };
}
*/

interface Campaign {
    id: number;
    fecha: string;
    detalles: string;
}

interface InicioViewProps {
  emailChartData: any; // Considerar tipar mejor
  emailChartOptions: any; // Considerar tipar mejor
  campaignData: Campaign[];
}

const InicioView: React.FC<InicioViewProps> = ({ emailChartData, emailChartOptions, campaignData }) => {
  return (
    <>
      <h2 className="mt-4 mb-4">Interacciones</h2>
      
      <div className="row">
        {/* Primer div con los dos gráficos circulares en tarjetas separadas */}
        <div className="col-md-6 mb-4">
          <div className="card border-1" style={{ borderColor: '#e9e9e9', height: '100%' }}>
            <div className="card-body p-4">
              <div className="row h-100">
                <div className="col-6 d-flex justify-content-center align-items-center">
                  <div className="card border-1 w-100 h-100" style={{ borderColor: '#e9e9e9' }}>
                    <div className="card-body d-flex justify-content-center align-items-center">
                      <CircularChart percentage={74} label="Tasa de clics" />
                    </div>
                  </div>
                </div>
                <div className="col-6 d-flex justify-content-center align-items-center">
                  <div className="card border-1 w-100 h-100" style={{ borderColor: '#e9e9e9' }}>
                    <div className="card-body d-flex justify-content-center align-items-center">
                      <CircularChart percentage={74} label="Tasa de apertura" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Segundo div con el gráfico donut */}
        <div className="col-md-6 mb-4">
          <div className="card border-1" style={{ borderColor: '#e9e9e9', height: '100%' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-center">
                <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Doughnut data={emailChartData} options={emailChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="mb-3">Campañas en curso</h3>
      {/* Tabla de campañas */}
      <div> {/* Contenedor General sin estilos propios */}
        {/* Cabecera (mantiene su estilo) */}
        <div className="row g-0 text-white rounded-top mb-3" style={{ backgroundColor: '#282A5B', padding: '0.75rem 1.25rem' }}>
          <div className="col-4 fw-bold">Fecha</div>
          <div className="col-5 fw-bold">Detalles</div>
          <div className="col-3 fw-bold text-end">Acciones</div>
        </div>
        {/* Cuerpo (cada fila es una tarjeta separada) */}
        {campaignData.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded shadow mb-3">
            <div 
              className="row g-0 align-items-center" 
              style={{
                padding: '0.75rem 1.25rem' // Padding original
              }}
            >
              <div className="col-4">{campaign.fecha}</div>
              <div className="col-5">{campaign.detalles}</div>
              <div className="col-3 text-end">
                <button className="btn btn-sm btn-link p-0 me-2" title="Editar">
                  <FaEdit />
                </button>
                <button className="btn btn-sm btn-link p-0 text-danger" title="Eliminar">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Botón Ver más */}
      <div className="text-center">
        <button className="btn text-white fw-bold" style={{ backgroundColor: '#FF3A44', padding: '0.5rem 1.5rem' }}>
          Ver más
        </button>
      </div>
    </>
  );
};

export default InicioView; 