import React from 'react';

interface ABTestNameInputProps {
  testName: string;
  onTestNameChange: (name: string) => void;
  formSectionStyle: React.CSSProperties;
}

const ABTestNameInput: React.FC<ABTestNameInputProps> = ({
  testName,
  onTestNameChange,
  formSectionStyle,
}) => {
  return (
    <div style={formSectionStyle}>
      <div className="row g-3">
        <div className="col-md-12">
          <label className="form-label" htmlFor="test-name">Nombre de la prueba A/B</label>
          <input
            className="form-control"
            id="test-name"
            type="text"
            placeholder="Ej: Comparación de asuntos - Newsletter Mayo"
            value={testName}
            onChange={(e) => onTestNameChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ABTestNameInput;
