import React from 'react';
import { FaChartBar, FaCheck, FaTrophy } from 'react-icons/fa';
import { TestResults } from '../interfaces/testResults';
import { Campaign } from '../../../../services/campaignService';

interface TestResultsDisplayProps {
  results: TestResults | null;
  campaignA: Campaign | null;
  campaignB: Campaign | null;
}

const TestResultsDisplay: React.FC<TestResultsDisplayProps> = ({ 
  results, 
  campaignA, 
  campaignB 
}) => {
  if (!results || !campaignA || !campaignB) return null;

  // Determinar cuál campaña es la ganadora
  const getWinner = () => {
    const metricsA = [
      results.campaignA.openRate,
      results.campaignA.clickRate,
      results.campaignA.conversionRate
    ];
    
    const metricsB = [
      results.campaignB.openRate,
      results.campaignB.clickRate,
      results.campaignB.conversionRate
    ];
    
    // Promedio de métricas
    const avgA = metricsA.reduce((a, b) => a + b, 0) / metricsA.length;
    const avgB = metricsB.reduce((a, b) => a + b, 0) / metricsB.length;
    
    return avgA > avgB ? 'A' : 'B';
  };
  
  const winner = getWinner();

  // Estilos
  const containerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  };

  const headerIconStyle: React.CSSProperties = {
    fontSize: '22px',
    marginRight: '10px',
    color: '#F21A2B'
  };

  const resultsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '25px'
  };

  const metricCardStyle: React.CSSProperties = {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    textAlign: 'center' as const
  };

  const winnerBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#F21A2B',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    marginLeft: '10px',
    fontWeight: 'bold'
  };

  const campaignComparisonStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginTop: '20px'
  };

  const campaignColumnStyle: React.CSSProperties = {
    flex: 1,
    padding: '15px',
    borderRadius: '6px',
    border: '1px solid #eee'
  };

  const winnerColumnStyle: React.CSSProperties = {
    ...campaignColumnStyle,
    borderColor: '#F21A2B',
    boxShadow: '0 0 8px rgba(242, 26, 43, 0.2)'
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <FaChartBar style={headerIconStyle} />
        <h3 style={{ margin: 0, fontSize: '18px' }}>Resultados de la Prueba A/B</h3>
      </div>

      <div style={resultsGridStyle}>
        <div style={metricCardStyle}>
          <h4>Tasa de apertura</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
            {results.campaignA.openRate > results.campaignB.openRate ? (
              <span style={{ color: '#F21A2B' }}>{formatPercent(results.campaignA.openRate)}</span>
            ) : (
              <span style={{ color: '#F21A2B' }}>{formatPercent(results.campaignB.openRate)}</span>
            )}
          </div>
          <div style={{ fontSize: '14px', color: '#888' }}>
            media: {formatPercent((results.campaignA.openRate + results.campaignB.openRate) / 2)}
          </div>
        </div>

        <div style={metricCardStyle}>
          <h4>Tasa de clics</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
            {results.campaignA.clickRate > results.campaignB.clickRate ? (
              <span style={{ color: '#F21A2B' }}>{formatPercent(results.campaignA.clickRate)}</span>
            ) : (
              <span style={{ color: '#F21A2B' }}>{formatPercent(results.campaignB.clickRate)}</span>
            )}
          </div>
          <div style={{ fontSize: '14px', color: '#888' }}>
            media: {formatPercent((results.campaignA.clickRate + results.campaignB.clickRate) / 2)}
          </div>
        </div>

        <div style={metricCardStyle}>
          <h4>Tasa de conversión</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
            {results.campaignA.conversionRate > results.campaignB.conversionRate ? (
              <span style={{ color: '#F21A2B' }}>{formatPercent(results.campaignA.conversionRate)}</span>
            ) : (
              <span style={{ color: '#F21A2B' }}>{formatPercent(results.campaignB.conversionRate)}</span>
            )}
          </div>
          <div style={{ fontSize: '14px', color: '#888' }}>
            media: {formatPercent((results.campaignA.conversionRate + results.campaignB.conversionRate) / 2)}
          </div>
        </div>
      </div>

      <h4 style={{ marginBottom: '15px' }}>Comparación detallada</h4>
      
      <div style={campaignComparisonStyle}>
        <div style={winner === 'A' ? winnerColumnStyle : campaignColumnStyle}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            Campaña A: {campaignA.nombre}
            {winner === 'A' && (
              <span style={winnerBadgeStyle}>
                <FaTrophy style={{ marginRight: '4px', fontSize: '10px' }} /> Ganador
              </span>
            )}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tasa de apertura:</span>
              <span style={{ fontWeight: 'bold', color: results.campaignA.openRate > results.campaignB.openRate ? '#F21A2B' : '#333' }}>
                {formatPercent(results.campaignA.openRate)}
                {results.campaignA.openRate > results.campaignB.openRate && <FaCheck style={{ marginLeft: '5px', fontSize: '12px' }} />}
              </span>
            </div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tasa de clics:</span>
              <span style={{ fontWeight: 'bold', color: results.campaignA.clickRate > results.campaignB.clickRate ? '#F21A2B' : '#333' }}>
                {formatPercent(results.campaignA.clickRate)}
                {results.campaignA.clickRate > results.campaignB.clickRate && <FaCheck style={{ marginLeft: '5px', fontSize: '12px' }} />}
              </span>
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tasa de conversión:</span>
              <span style={{ fontWeight: 'bold', color: results.campaignA.conversionRate > results.campaignB.conversionRate ? '#F21A2B' : '#333' }}>
                {formatPercent(results.campaignA.conversionRate)}
                {results.campaignA.conversionRate > results.campaignB.conversionRate && <FaCheck style={{ marginLeft: '5px', fontSize: '12px' }} />}
              </span>
            </div>
          </div>
        </div>
        
        <div style={winner === 'B' ? winnerColumnStyle : campaignColumnStyle}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            Campaña B: {campaignB.nombre}
            {winner === 'B' && (
              <span style={winnerBadgeStyle}>
                <FaTrophy style={{ marginRight: '4px', fontSize: '10px' }} /> Ganador
              </span>
            )}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tasa de apertura:</span>
              <span style={{ fontWeight: 'bold', color: results.campaignB.openRate > results.campaignA.openRate ? '#F21A2B' : '#333' }}>
                {formatPercent(results.campaignB.openRate)}
                {results.campaignB.openRate > results.campaignA.openRate && <FaCheck style={{ marginLeft: '5px', fontSize: '12px' }} />}
              </span>
            </div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tasa de clics:</span>
              <span style={{ fontWeight: 'bold', color: results.campaignB.clickRate > results.campaignA.clickRate ? '#F21A2B' : '#333' }}>
                {formatPercent(results.campaignB.clickRate)}
                {results.campaignB.clickRate > results.campaignA.clickRate && <FaCheck style={{ marginLeft: '5px', fontSize: '12px' }} />}
              </span>
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tasa de conversión:</span>
              <span style={{ fontWeight: 'bold', color: results.campaignB.conversionRate > results.campaignA.conversionRate ? '#F21A2B' : '#333' }}>
                {formatPercent(results.campaignB.conversionRate)}
                {results.campaignB.conversionRate > results.campaignA.conversionRate && <FaCheck style={{ marginLeft: '5px', fontSize: '12px' }} />}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Recomendación</h4>
        <p style={{ margin: 0 }}>
          Basado en los resultados, la <strong>Campaña {winner}</strong> muestra un mejor rendimiento general. 
          {winner === 'A' 
            ? ` La campaña "${campaignA.nombre}" ha generado mejores métricas y debería considerarse como la opción preferida para futuras comunicaciones similares.`
            : ` La campaña "${campaignB.nombre}" ha generado mejores métricas y debería considerarse como la opción preferida para futuras comunicaciones similares.`
          }
        </p>
      </div>
    </div>
  );
};

export default TestResultsDisplay;
