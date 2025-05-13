import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Obtenemos solo lo que necesitamos del store
  const { user, isAuthenticated, initialized } = useUserStore();
  
  // Si el store aún no está inicializado, no tomamos decisiones
  // Esto evita redirecciones prematuras
  if (!initialized) {
    // Opcionalmente podríamos mostrar un loader aquí mientras se inicializa
    return null;
  }
  
  // Simplificamos la lógica de acceso: si está autenticado y hay un usuario, permitimos el acceso
  const canAccess = isAuthenticated && user !== null;
  
  // Siempre loguear para diagnóstico (en una app real esto debería estar en desarrollo solamente)
  console.log('Estado de autenticación:', { 
    isAuthenticated,
    hasUser: user !== null,
    canAccess,
    initialized
  });

  // Si no tiene acceso, redirigir al login
  if (!canAccess) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;
