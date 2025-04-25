import React from 'react';

interface Partner {
  logo: string;
  name: string;
}

interface IntegrationPartnersProps {
  title: string;
  partners: Partner[];
}

const IntegrationPartners: React.FC<IntegrationPartnersProps> = ({
  title = "Conecta tus herramientas favoritas",
  partners = []
}) => {
  return (
    <div className="py-4" style={{ background: 'white' }}>
      <div className="container">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#282A5B' }}>
          {title}
        </h2>
        
        <div className="row justify-content-center align-items-center">
          {partners.map((partner, index) => (
            <div className="col-4 col-md-2 mb-4 d-flex justify-content-center" key={index}>
              <img src={partner.logo} alt={partner.name} height="50" className="mx-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationPartners; 