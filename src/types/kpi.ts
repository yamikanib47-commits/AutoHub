// AutoAce Goals & KPI Framework Definition
// Specifically structured for Yamikani Banda (Head Admin) and the future JARVIS AI Agent

export type FunnelStageId = 
  | 'ATTENTION'
  | 'INTEREST'
  | 'INTENT'
  | 'CONNECTION'
  | 'TRANSACTION'
  | 'REVENUE';

export interface FunnelStage {
  id: FunnelStageId;
  name: string;
  subtitle: string;
  description: string;
  metricLabel: string;
  order: number;
  iconName: string;
  leakQuestion: string;
}

export type KpiClassification = 'PRIMARY' | 'LEADING' | 'SUPPORTING_ATTENTION';

export interface KpiDefinition {
  id: string;
  name: string;
  category: KpiClassification;
  targetMonthly: number;
  unit: string;
  prefix?: string;
  description: string;
  funnelStage: FunnelStageId;
  isOutcomeMetric: boolean;
  isVanityMetric?: boolean;
}

export interface AutoAce90DayTargets {
  buyerRequestsMonthly: number;         // 20 / mo
  qualifiedConnectionsMonthly: number;   // 15 / mo
  closedDealsMonthly: number;           // 3+ / mo
  revenueZmwMonthly: number;            // K5,000+ / mo
  newSellerRelationshipsMonthly: number;// 10 / mo
  contentPublishedMonthly: number;      // 20 pieces / mo
  hotLeadFollowUpRatePercent: number;   // 100% within 24h
  googleReviewsMonthly: number;         // 5 / mo
}

export interface OperatingMetricsSnapshot {
  // Attention / Interest
  contentPublished: number;
  contentViews: number;
  contentInteractions: number;
  
  // Intent (Primary 1)
  buyerRequests: number;
  
  // Fulfillment & Connection (Leading & Primary 2)
  sellerAgentRelationships: number;
  qualifiedConnections: number;
  hotLeadFollowUpRate: number; // e.g. 100%
  
  // Transaction (Primary 3)
  closedDeals: number;
  
  // Revenue (Primary 4 - Zambian Kwacha)
  revenueZmw: number;
  
  // Trust (Leading)
  googleReviews: number;
}

export interface JarvisBottleneckDiagnosis {
  id: string;
  stageTriggered: FunnelStageId;
  headline: string;
  diagnosticPrompt: string;
  recommendedAction: string;
  priorityLevel: 'CRITICAL' | 'WARNING' | 'HEALTHY';
  metricsInvolved: string[];
}
