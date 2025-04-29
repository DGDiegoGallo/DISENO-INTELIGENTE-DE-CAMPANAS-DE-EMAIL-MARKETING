import React from 'react';
import { FaArrowLeft, FaPen } from 'react-icons/fa';

interface CreateCampaignViewProps {
  onBack: () => void; // Función para volver a la vista anterior
}

const CreateCampaignView: React.FC<CreateCampaignViewProps> = ({ onBack }) => {
  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 56px)' }}>
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button onClick={onBack} className="btn btn-link text-dark p-0 me-3" style={{ fontSize: '1.2rem' }}>
            <FaArrowLeft />
          </button>
          <h2 className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>Crear campaña</h2>
        </div>
        <button className="btn text-white fw-bold px-4 py-2" style={{ backgroundColor: '#e5322d', borderRadius: '8px' }}>
          Enviar
        </button>
      </div>

      {/* Contenido del formulario y diseño */}
      <div className="row g-4">
        {/* Columna del formulario */}
        <div className="col-lg-5">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label text-muted small mb-1">Título</label>
              <input type="text" className="form-control" id="titulo" placeholder="Título" />
            </div>
            <div className="mb-3">
              <label htmlFor="asunto" className="form-label text-muted small mb-1">Asunto</label>
              <input type="text" className="form-control" id="asunto" placeholder="Asunto" />
            </div>
            <div className="mb-3">
              <label htmlFor="contactos" className="form-label text-muted small mb-1">Contactos</label>
              <select className="form-select" id="contactos">
                <option selected>Seleccionar</option>
                {/* Opciones de contactos irían aquí */}
              </select>
            </div>
            <div>
              <label htmlFor="horaEnvio" className="form-label text-muted small mb-1">Hora de envío</label>
              <input type="text" className="form-control" id="horaEnvio" placeholder="DD/MM/AAAA HH:MM AM/PM" />
            </div>
          </div>
        </div>

        {/* Columna del diseño de correo */}
        <div className="col-lg-7">
          <div className="bg-white p-4 rounded shadow-sm">
            <h5 className="mb-3 fw-bold">Diseña el contenido de tu correo electrónico</h5>
            <button className="btn text-white fw-bold w-100 mb-3 py-2" style={{ backgroundColor: '#e5322d', borderRadius: '8px' }}>
              Diseñar contenido
            </button>
            <div className="d-flex justify-content-end align-items-center mb-3">
                <span className="text-muted me-2 small">Editar</span> 
                <FaPen className="text-muted" />
            </div>
            {/* Placeholder para el preview del diseño */}
            <div className="border rounded p-3 text-center" style={{ backgroundColor: '#e9ecef' }}>
              <div className="row mb-2">
                  <div className="col-6"><div style={{ height: '100px', backgroundColor: '#ced4da', backgroundImage: 'repeating-linear-gradient(45deg, #adb5bd 25%, transparent 25%, transparent 75%, #adb5bd 75%, #adb5bd), repeating-linear-gradient(45deg, #adb5bd 25%, #ced4da 25%, #ced4da 75%, #adb5bd 75%, #adb5bd)', backgroundSize: '20px 20px' }}></div></div>
                  <div className="col-6"><div style={{ height: '100px', backgroundColor: '#ced4da', backgroundImage: 'repeating-linear-gradient(45deg, #adb5bd 25%, transparent 25%, transparent 75%, #adb5bd 75%, #adb5bd), repeating-linear-gradient(45deg, #adb5bd 25%, #ced4da 25%, #ced4da 75%, #adb5bd 75%, #adb5bd)', backgroundSize: '20px 20px' }}></div></div>
              </div>
               <div className="row">
                  <div className="col-6"><div style={{ height: '100px', backgroundColor: '#ced4da', backgroundImage: 'repeating-linear-gradient(45deg, #adb5bd 25%, transparent 25%, transparent 75%, #adb5bd 75%, #adb5bd), repeating-linear-gradient(45deg, #adb5bd 25%, #ced4da 25%, #ced4da 75%, #adb5bd 75%, #adb5bd)', backgroundSize: '20px 20px' }}></div></div>
                  <div className="col-6"><div style={{ height: '100px', backgroundColor: '#ced4da', backgroundImage: 'repeating-linear-gradient(45deg, #adb5bd 25%, transparent 25%, transparent 75%, #adb5bd 75%, #adb5bd), repeating-linear-gradient(45deg, #adb5bd 25%, #ced4da 25%, #ced4da 75%, #adb5bd 75%, #adb5bd)', backgroundSize: '20px 20px' }}></div></div>
              </div>
              <p className="text-muted small mt-3">
                Lorem ipsum dolor sit amet consectetur. In pellentesque pellentesque sit erat massa pharetra. Consectetur lobortis cras vel maecenas at risus urna sit. Adipiscing integer in et ut. Augue amet quis ultricies accumsan risus ipsum uma morbi id etiam nunc tincidunt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignView;
