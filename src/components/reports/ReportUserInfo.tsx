import React from 'react';
import { FaUser } from 'react-icons/fa';
import { StrapiUser } from '@/interfaces/user';

interface ReportUserInfoProps {
  user: StrapiUser | null;
}

const ReportUserInfo: React.FC<ReportUserInfoProps> = ({ user }) => {
  if (!user) return null;
  
  return (
    <div className="mb-4">
      <h5 className="d-flex align-items-center">
        <FaUser className="me-2" /> Información del Usuario
      </h5>
      <div className="card p-3">
        <p><strong>Nombre:</strong> {user?.nombre || ''} {user?.apellido || ''}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>País:</strong> {user?.pais || 'No especificado'}</p>
        <p><strong>Ciudad:</strong> {user?.ciudad || 'No especificada'}</p>
      </div>
    </div>
  );
};

export default ReportUserInfo;
