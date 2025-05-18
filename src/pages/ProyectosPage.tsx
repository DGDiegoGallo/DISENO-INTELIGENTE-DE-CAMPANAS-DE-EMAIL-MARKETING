import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Proyecto } from '../interfaces/ProyectoTypes';
import { proyectosService } from '../services/proyectosService';

const ProyectosPage: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const responseData = await proyectosService.getAllProyectos();
        console.log('Datos recibidos:', responseData);
        if (responseData && responseData.data && Array.isArray(responseData.data)) {
          setProyectos(responseData.data);
        } else {
          console.error('Formato de datos inesperado:', responseData);
          setError('Los datos recibidos no tienen el formato esperado.');
        }
      } catch (err) {
        console.error('Error al obtener proyectos:', err);
        setError('Error al cargar los proyectos. Por favor, intente más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      
      <div className="container flex-grow-1 py-4">
        <h1 className="mb-4">Proyectos desde Strapi</h1>
        
        {isLoading && (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {!isLoading && !error && proyectos.length === 0 && (
          <div className="alert alert-info" role="alert">
            No se encontraron proyectos.
          </div>
        )}
        
        {!isLoading && !error && proyectos.length > 0 && (
          <div className="row">
            {proyectos.map(proyecto => (
              <div className="col-md-6 col-lg-4 mb-4" key={proyecto.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{proyecto.attributes?.nombre || 'Sin título'}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Estado: {proyecto.attributes?.estado || 'No definido'}
                    </h6>
                    <p className="card-text">
                      <strong>Asunto:</strong> {proyecto.attributes?.asunto || 'Sin asunto'}
                    </p>
                    <p className="card-text">
                      <strong>Fecha:</strong> {
                        proyecto.attributes?.Fechas ? 
                        new Date(proyecto.attributes.Fechas).toLocaleDateString() : 
                        'No definida'
                      }
                    </p>
                  </div>
                  <div className="card-footer bg-transparent">
                    <small className="text-muted">
                      ID: {proyecto.id} | Actualizado: {
                        proyecto.attributes?.updatedAt ? 
                        new Date(proyecto.attributes.updatedAt).toLocaleDateString() : 
                        'No disponible'
                      }
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && !error && proyectos.length > 0 && (
          <div className="mt-5">
            <h3>Datos en formato JSON:</h3>
            <div className="bg-dark text-light p-3 rounded">
              <pre style={{ maxHeight: '400px', overflow: 'auto' }}>
                {JSON.stringify(proyectos, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProyectosPage;
