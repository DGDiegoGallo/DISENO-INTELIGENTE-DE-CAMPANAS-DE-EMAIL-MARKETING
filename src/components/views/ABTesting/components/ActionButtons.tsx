import React, { useState } from 'react';
import { FaChartBar, FaUndo } from 'react-icons/fa';
import { CSSProperties } from 'react';

interface ActionButtonsProps {
  isGeneratingResults: boolean;
  campaignASelected: boolean;
  campaignBSelected: boolean;
  testNameProvided: boolean;
  resultsAvailable: boolean;
  onGenerate: () => void;
  onReset: () => void;
  buttonStyle: CSSProperties;
  buttonHoverStyle: CSSProperties;
  disabledButtonStyle: CSSProperties;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isGeneratingResults,
  campaignASelected,
  campaignBSelected,
  testNameProvided,
  resultsAvailable,
  onGenerate,
  onReset,
  buttonStyle,
  buttonHoverStyle,
  disabledButtonStyle,
}) => {
  const handleGenerateClick = () => {
    onGenerate();
  };
  const [isGenerateHovered, setIsGenerateHovered] = useState(false);
  const [isResetHovered, setIsResetHovered] = useState(false);

  const canGenerate = campaignASelected && campaignBSelected;
  const showResetButton = testNameProvided || campaignASelected || campaignBSelected || resultsAvailable;

  return (
    <div className="text-center my-4 py-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
      <button
        style={(!canGenerate || isGeneratingResults || resultsAvailable) ? disabledButtonStyle : (isGenerateHovered ? {...buttonStyle, ...buttonHoverStyle} : buttonStyle)}
        onClick={handleGenerateClick}
        disabled={!canGenerate || isGeneratingResults || resultsAvailable}
        onMouseEnter={() => setIsGenerateHovered(true)}
        onMouseLeave={() => setIsGenerateHovered(false)}
        data-component-name="ActionButtons_GenerateButton" 
      >
        <FaChartBar style={{ marginRight: '8px' }} />
        {isGeneratingResults ? 'Generando...' : 'Generar resultado de la comparación'}
      </button>
      
      {showResetButton && (
        <button
          style={
            isGeneratingResults 
              ? disabledButtonStyle 
              : (isResetHovered 
                ? {...buttonStyle, ...buttonHoverStyle, backgroundColor: '#5a6268', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'} 
                : {...buttonStyle, backgroundColor: '#6c757d'}) 
          }
          onClick={onReset}
          disabled={isGeneratingResults}
          onMouseEnter={() => setIsResetHovered(true)}
          onMouseLeave={() => setIsResetHovered(false)}
          data-component-name="ActionButtons_ResetButton"
        >
          <FaUndo style={{ marginRight: '8px' }} />
          Rehacer Prueba
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
