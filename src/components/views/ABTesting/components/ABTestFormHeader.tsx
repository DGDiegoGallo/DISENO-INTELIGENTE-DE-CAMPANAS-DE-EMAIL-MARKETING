import React from 'react';
import { FaChartBar } from 'react-icons/fa';
import { CSSProperties } from 'react';

interface ABTestFormHeaderProps {
  titleStyle: CSSProperties;
  titleContainerStyle: CSSProperties;
  headerStyle: CSSProperties;
}

const ABTestFormHeader: React.FC<ABTestFormHeaderProps> = ({
  titleStyle,
  titleContainerStyle,
  headerStyle
}) => {
  return (
    <div style={headerStyle}>
      <div style={titleContainerStyle}>
        <FaChartBar size={28} color="#F21A2B" />
        <h2 style={titleStyle}>Crear prueba A/B</h2>
      </div>
    </div>
  );
};

export default ABTestFormHeader;
