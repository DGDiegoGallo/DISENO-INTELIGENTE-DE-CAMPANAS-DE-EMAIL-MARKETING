import React, { useEffect, useRef, useCallback } from 'react';
import { FaChartBar, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import Chart from 'chart.js/auto';
import { UserCampaignsData, ContactGroup } from '@/services/reportService';

interface ReportChartsProps {
  reportData: UserCampaignsData | null;
  campaignChartRef: React.RefObject<HTMLDivElement | null>;
  contactsChartRef: React.RefObject<HTMLDivElement | null>;
}

const ReportCharts: React.FC<ReportChartsProps> = ({ reportData, campaignChartRef, contactsChartRef }) => {
  const charts = useRef<Chart[]>([]);

  const renderCharts = useCallback(() => {
    if (!reportData || !campaignChartRef.current || !contactsChartRef.current) {
      return;
    }

    // Destroy existing charts to prevent duplicates
    charts.current.forEach(chart => chart.destroy());
    charts.current = [];

    // Prepare data for campaign status chart
    const campaignStatusData = {
      labels: ['Borrador', 'Programado', 'Enviado', 'Cancelado'],
      datasets: [
        {
          data: [
            reportData.campaignStats.draft,
            reportData.campaignStats.scheduled,
            reportData.campaignStats.sent,
            reportData.campaignStats.cancelled
          ],
          backgroundColor: ['#282A5B', '#4ECDC4', '#F21A2B', '#FFC857'],
          hoverBackgroundColor: ['#3A3D7D', '#6EDFD7', '#FF4A59', '#FFD57F']
        }
      ]
    };

    // Create campaign status chart
    let campaignStatusCanvas = campaignChartRef.current.querySelector('canvas');
    if (!campaignStatusCanvas) {
      campaignStatusCanvas = document.createElement('canvas');
      campaignChartRef.current.appendChild(campaignStatusCanvas);
    }

    const campaignCtx = campaignStatusCanvas.getContext('2d');
    if (campaignCtx) {
      const campaignChart = new Chart(campaignCtx, {
        type: 'doughnut',
        data: campaignStatusData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw as number;
                  const total = (context.dataset.data as number[]).reduce((acc, val) => acc + (val as number), 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          cutout: '60%'
        }
      });
      charts.current.push(campaignChart);
    }

    // Prepare data for contact groups chart
    const contactGroupsData = {
      labels: reportData.contactGroups.map((group: ContactGroup) => group.name),
      datasets: [
        {
          data: reportData.contactGroups.map((group: ContactGroup) => group.contactCount),
          backgroundColor: [
            '#F21A2B', '#282A5B', '#4ECDC4', '#FFC857', '#A5A5A5',
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
          ],
          hoverBackgroundColor: [
            '#FF4A59', '#3A3D7D', '#6EDFD7', '#FFD57F', '#C7C7C7',
            '#FF8CB0', '#64B5FF', '#FFE08C', '#7CD7D7', '#B28CFF'
          ]
        }
      ]
    };

    // Create contact groups chart
    let contactsCanvas = contactsChartRef.current.querySelector('canvas');
    if (!contactsCanvas) {
      contactsCanvas = document.createElement('canvas');
      contactsChartRef.current.appendChild(contactsCanvas);
    }

    const contactsCtx = contactsCanvas.getContext('2d');
    if (contactsCtx) {
      const contactsChart = new Chart(contactsCtx, {
        type: 'pie',
        data: contactGroupsData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw as number;
                  const total = (context.dataset.data as number[]).reduce((acc, val) => acc + (val as number), 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} contactos (${percentage}%)`;
                }
              }
            }
          }
        }
      });
      charts.current.push(contactsChart);
    }
  }, [reportData, campaignChartRef, contactsChartRef]);

  // Render charts when report data changes
  useEffect(() => {
    if (reportData) {
      setTimeout(() => {
        renderCharts();
      }, 300); // Small delay to ensure DOM is ready
    }

    return () => {
      // Clean up charts on unmount
      charts.current.forEach(chart => chart.destroy());
    };
  }, [reportData, renderCharts]);

  if (!reportData) return null;

  return (
    <div className="mb-4">
      <h5 className="d-flex align-items-center">
        <FaChartBar className="me-2" /> Vista Previa de Gráficos
      </h5>
      <div className="row">
        <div className="col-12 mb-3">
          <div className="card p-3">
            <h6 className="d-flex align-items-center">
              <FaCalendarAlt className="me-2" /> Estado de Campañas
            </h6>
            <div ref={campaignChartRef} className="chart-container" style={{ height: '250px' }}></div>
          </div>
        </div>
        <div className="col-12">
          <div className="card p-3">
            <h6 className="d-flex align-items-center">
              <FaUsers className="me-2" /> Distribución de Contactos por Grupo
            </h6>
            <div ref={contactsChartRef} className="chart-container" style={{ height: '250px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCharts;
