/**
 * Interfaces for A/B Testing Results
 */

export interface CampaignMetrics {
  openRate: number;
  clickRate: number;
  conversionRate: number;
  bounceRate?: number;
  unsubscribeRate?: number;
}

export interface TestResults {
  testId: string;
  testName: string;
  dateCreated: string;
  campaignA: CampaignMetrics;
  campaignB: CampaignMetrics;
  winner: 'A' | 'B' | 'tie';
  recommendation: string;
}

export interface SavedTest {
  id: string;
  name: string;
  dateCreated: string;
  campaignAId: number | undefined;
  campaignBId: number | undefined;
  campaignAName: string;
  campaignBName: string;
  results: TestResults;
}
