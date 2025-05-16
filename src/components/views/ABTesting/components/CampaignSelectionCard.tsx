import React from 'react';
import { Campaign } from '../../../../services/campaignService';
import CampaignSelector from './CampaignSelector';
import CampaignPreview from './CampaignPreview';
import { CSSProperties } from 'react';

interface CampaignSelectionCardProps {
  label: string;
  campaigns: Campaign[];
  selectedCampaignId: number | null;
  onCampaignChange: (id: number) => void;
  isLoadingSelector: boolean;
  campaignData: Campaign | null;
  isLoadingPreview: boolean;
  excludeCampaignId: number | null;
  previewContainerStyle: CSSProperties;
  previewHeaderStyle: CSSProperties;
  previewTitleContainerStyle: CSSProperties;
  previewTitleStyle: CSSProperties;
  previewContentStyle: CSSProperties;
}

const CampaignSelectionCard: React.FC<CampaignSelectionCardProps> = ({
  label,
  campaigns,
  selectedCampaignId,
  onCampaignChange,
  isLoadingSelector,
  campaignData,
  isLoadingPreview,
  excludeCampaignId,
  previewContainerStyle,
  previewHeaderStyle,
  previewTitleContainerStyle,
  previewTitleStyle,
  previewContentStyle,
}) => {
  return (
    <div>
      <CampaignSelector
        label={label}
        campaigns={campaigns}
        selectedCampaignId={selectedCampaignId}
        onChange={onCampaignChange}
        disabled={isLoadingSelector} // General loading for the selector part
        isLoading={isLoadingSelector} // Specific loading for the selector itself
        excludeCampaignId={excludeCampaignId}
      />

      {campaignData && (
        <>
          <CampaignPreview
            campaign={campaignData}
            label={`Previsualización de ${label}`}
            loading={isLoadingPreview}
          />

          {campaignData.contenidoHTML && (
            <div style={previewContainerStyle}>
              <div style={previewHeaderStyle}>
                <div style={previewTitleContainerStyle}>
                  <h4 style={previewTitleStyle}>Vista previa del correo</h4>
                </div>
                <div
                  style={previewContentStyle}
                  dangerouslySetInnerHTML={{
                    __html: typeof campaignData.contenidoHTML === 'string'
                      ? campaignData.contenidoHTML
                      : Array.isArray(campaignData.contenidoHTML)
                        ? campaignData.contenidoHTML.map(block =>
                            block.children?.map(child => child.text || '').join(' ') || ''
                          ).join('\n')
                        : ''
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CampaignSelectionCard;
