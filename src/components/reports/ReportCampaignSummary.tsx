import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { UserCampaignsData } from '../../services/reportService';

interface ReportCampaignSummaryProps {
  reportData: UserCampaignsData | null;
}

const ReportCampaignSummary: React.FC<ReportCampaignSummaryProps> = ({ reportData }) => {
  if (!reportData || !reportData.campaigns) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Fecha inválida';
    }
  };

  return (
    <div className="mb-4">
      <h5 className="d-flex align-items-center mb-3">
        <FaEnvelope className="me-2" /> Resumen Detallado de Campañas
      </h5>
      <div className="card p-3 mb-3">
        <h6 className="card-title">Resumen General</h6>
        <div className="row">
          <div className="col-md-6">
            <p><strong>Total de campañas:</strong> {reportData.totalCampaigns}</p>
            <p><strong>Campañas en borrador:</strong> {reportData.campaignStats.draft}</p>
            <p><strong>Campañas programadas:</strong> {reportData.campaignStats.scheduled}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Campañas enviadas:</strong> {reportData.campaignStats.sent}</p>
            <p><strong>Campañas canceladas:</strong> {reportData.campaignStats.cancelled}</p>
            <p><strong>Total de contactos (general):</strong> {reportData.totalContacts}</p>
          </div>
        </div>
      </div>

      {reportData.campaigns.map((campaign, index) => {
        let totalInteractionClicks = 0;
        let totalInteractionOpens = 0;
        let totalInteractionDineroGastado = 0;
        let totalInteractionRegistrations = 0;

        if (campaign.interaccion_destinatario) {
          Object.values(campaign.interaccion_destinatario).forEach(interaction => {
            if (interaction) {
              totalInteractionClicks += interaction.clicks || 0;
              totalInteractionOpens += interaction.opens || 0;
              totalInteractionDineroGastado += interaction.dinero_gastado || 0;
              if (interaction.se_registro_en_pagina) {
                totalInteractionRegistrations++;
              }
            }
          });
        }

        return (
          <div key={campaign.id || index} className="card mb-3">
            <div className="card-header">
              Campaña: <strong>{campaign.nombre || 'Sin nombre'}</strong> (ID: {campaign.id})
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Estado:</strong> {campaign.estado || 'N/A'}</p>
                  <p><strong>Fecha:</strong> {formatDate(campaign.Fechas)}</p>
                  <p><strong>Dinero Gastado (Total):</strong> ${parseFloat(campaign.dinero_gastado || '0').toFixed(2)}</p>
                  <p><strong>Se Registró (Total):</strong> {campaign.se_registro_en_pagina ? 'Sí' : 'No'}</p>
                </div>
                <div className="col-md-6">
                  <h6>Interacciones de Destinatarios:</h6>
                  <p><strong>Total Clicks:</strong> {totalInteractionClicks}</p>
                  <p><strong>Total Aperturas:</strong> {totalInteractionOpens}</p>
                  <p><strong>Dinero Gastado (Interacciones):</strong> ${Number(totalInteractionDineroGastado || 0).toFixed(2)}</p>
                  <p><strong>Registros (Interacciones):</strong> {totalInteractionRegistrations}</p>
                </div>
              </div>
              {campaign.gruposdecontactosJSON && campaign.gruposdecontactosJSON.grupos && campaign.gruposdecontactosJSON.grupos.length > 0 && (
                <div className="mt-3">
                  <h6>Grupos de Contactos en esta Campaña:</h6>
                  <ul className="list-group">
                    {campaign.gruposdecontactosJSON.grupos.map(grupo => (
                      <li key={grupo.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {grupo.nombre || 'Grupo sin nombre'}
                        <span className="badge bg-primary rounded-pill">{grupo.contactos ? grupo.contactos.length : 0} contactos</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportCampaignSummary;
