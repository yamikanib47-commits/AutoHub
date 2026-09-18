import { 
  FunnelStage, 
  KpiDefinition, 
  AutoAce90DayTargets, 
  OperatingMetricsSnapshot, 
  JarvisBottleneckDiagnosis 
} from '../types/kpi';

/**
 * AUTOACE CORE IDENTITY
 * AutoAce is a Zambian automotive demand-and-connection business.
 * Core Value Flow:
 * Acquire consumer demand → capture buyer intent → connect that demand with people who can fulfill it → facilitate the transaction → generate revenue.
 */
export const AUTOACE_CORE_IDENTITY = {
  name: 'AutoAce',
  market: 'Zambia',
  currency: 'ZMW (K)',
  corePremise: 'AutoAce is not simply a car listing website. The most important asset is consumer demand and intent.',
  operatingRule: 'Do not optimize for activity simply because activity is increasing. Always ask: Is this helping AutoAce generate demand, create connections, close deals, or generate revenue?'
};

/**
 * 4 PRIMARY BUSINESS OUTCOMES
 * These four outcomes are more important than vanity metrics such as views or follower count.
 */
export const AUTOACE_PRIMARY_GOALS = [
  {
    id: 'buyer-demand',
    number: 1,
    title: 'BUYER DEMAND',
    summary: 'Get people actively looking for vehicles to submit requests or express genuine buying intent.',
    assetFocus: 'Consumer intent & high-conviction vehicle requirements'
  },
  {
    id: 'qualified-connections',
    number: 2,
    title: 'QUALIFIED CONNECTIONS',
    summary: 'Successfully connect buyers with relevant sellers, agents, importers, or other automotive providers.',
    assetFocus: 'Verified supply network & trusted fulfillment match'
  },
  {
    id: 'closed-deals',
    number: 3,
    title: 'CLOSED DEALS',
    summary: 'Turn qualified demand into completed vehicle transactions.',
    assetFocus: 'Actual physical vehicle handoffs & contracts'
  },
  {
    id: 'revenue',
    number: 4,
    title: 'REVENUE',
    summary: 'Generate sustainable revenue from successful automotive transactions and related services.',
    assetFocus: 'Sourcing fees, broker margins, value-add facilitation (Zambian Kwacha)'
  }
];

/**
 * 90-DAY WORKING TARGETS
 * Initial operating targets to calibrate against real data.
 */
export const AUTOACE_90_DAY_TARGETS: AutoAce90DayTargets = {
  buyerRequestsMonthly: 20,              // 20 per month
  qualifiedConnectionsMonthly: 15,        // 15 per month
  closedDealsMonthly: 3,                  // 3+ per month
  revenueZmwMonthly: 5000,               // K5,000+ per month
  newSellerRelationshipsMonthly: 10,     // 10 per month
  contentPublishedMonthly: 20,           // 20 pieces per month
  hotLeadFollowUpRatePercent: 100,       // 100% within 24 hours
  googleReviewsMonthly: 5                // 5 per month
};

/**
 * 6-STAGE FUNNEL ARCHITECTURE
 * The purpose of the KPI system is to identify where this funnel is leaking.
 */
export const AUTOACE_FUNNEL_STAGES: FunnelStage[] = [
  {
    id: 'ATTENTION',
    name: 'Attention',
    subtitle: 'Content / discovery',
    description: 'Targeted vehicle media and market intelligence reaching Zambian drivers.',
    metricLabel: 'Content Reach & Views',
    order: 1,
    iconName: 'Eye',
    leakQuestion: 'Are people discovering AutoAce content across Zambia?'
  },
  {
    id: 'INTEREST',
    name: 'Interest',
    subtitle: 'People engage with AutoAce',
    description: 'Comments, direct inquiries, shares, and initial touchpoints.',
    metricLabel: 'Engagement & Inquiries',
    order: 2,
    iconName: 'MessageSquare',
    leakQuestion: 'Are viewers actively engaging or just scrolling past?'
  },
  {
    id: 'INTENT',
    name: 'Intent',
    subtitle: 'Buyer submits request / genuine buying interest',
    description: 'Specific vehicle make, budget, and readiness to purchase.',
    metricLabel: 'Buyer Requests Submitted',
    order: 3,
    iconName: 'FileCheck',
    leakQuestion: 'Is general interest converting into concrete vehicle search requests?'
  },
  {
    id: 'CONNECTION',
    name: 'Connection',
    subtitle: 'AutoAce connects buyer with relevant supply',
    description: 'Matching buyer requirements to trusted Zambian sellers, importers, or agents.',
    metricLabel: 'Qualified Connections Made',
    order: 4,
    iconName: 'Shuffle',
    leakQuestion: 'Do we have the seller inventory to fulfill buyer demand?'
  },
  {
    id: 'TRANSACTION',
    name: 'Transaction',
    subtitle: 'Vehicle deal closes',
    description: 'Inspections cleared, payment handled, car delivered.',
    metricLabel: 'Closed Vehicle Deals',
    order: 5,
    iconName: 'CheckCircle2',
    leakQuestion: 'Where are active negotiations stalling before vehicle payment?'
  },
  {
    id: 'REVENUE',
    name: 'Revenue',
    subtitle: 'AutoAce earns from transaction / service',
    description: 'Direct commission, facilitation fee, or service fee collected in Kwacha.',
    metricLabel: 'AutoAce Revenue (K)',
    order: 6,
    iconName: 'Banknote',
    leakQuestion: 'Are deals yielding sufficient unit economics and fee collection?'
  }
];

/**
 * KPI HIERARCHY
 * Organizes metrics into two disciplined tiers:
 * Primary: Outcomes that prove business progress.
 * Leading: Operational levers that explain why primary metrics move.
 */
export const AUTOACE_KPI_DEFINITIONS: KpiDefinition[] = [
  // Primary KPIs
  {
    id: 'kpi_buyer_requests',
    name: 'Buyer Requests',
    category: 'PRIMARY',
    targetMonthly: AUTOACE_90_DAY_TARGETS.buyerRequestsMonthly,
    unit: 'requests/mo',
    description: 'Specific vehicle demand submitted by ready buyers.',
    funnelStage: 'INTENT',
    isOutcomeMetric: true
  },
  {
    id: 'kpi_qualified_connections',
    name: 'Qualified Connections',
    category: 'PRIMARY',
    targetMonthly: AUTOACE_90_DAY_TARGETS.qualifiedConnectionsMonthly,
    unit: 'connections/mo',
    description: 'Valid matches made between verified buyers and vetted vehicle sources.',
    funnelStage: 'CONNECTION',
    isOutcomeMetric: true
  },
  {
    id: 'kpi_closed_deals',
    name: 'Closed Deals',
    category: 'PRIMARY',
    targetMonthly: AUTOACE_90_DAY_TARGETS.closedDealsMonthly,
    unit: 'deals/mo',
    description: 'Fully completed automotive purchases facilitated by AutoAce.',
    funnelStage: 'TRANSACTION',
    isOutcomeMetric: true
  },
  {
    id: 'kpi_revenue',
    name: 'AutoAce Revenue',
    category: 'PRIMARY',
    targetMonthly: AUTOACE_90_DAY_TARGETS.revenueZmwMonthly,
    unit: 'ZMW/mo',
    prefix: 'K',
    description: 'Total revenue earned from closed transactions and automotive services.',
    funnelStage: 'REVENUE',
    isOutcomeMetric: true
  },

  // Leading KPIs
  {
    id: 'kpi_content_published',
    name: 'Content Published',
    category: 'LEADING',
    targetMonthly: AUTOACE_90_DAY_TARGETS.contentPublishedMonthly,
    unit: 'pieces/mo',
    description: 'Published vehicle reviews, buyer guides, and market pricing updates.',
    funnelStage: 'ATTENTION',
    isOutcomeMetric: false
  },
  {
    id: 'kpi_content_interactions',
    name: 'Content Interactions',
    category: 'LEADING',
    targetMonthly: 150,
    unit: 'interactions/mo',
    description: 'Direct inquiries, substantive comments, and DMs indicating interest.',
    funnelStage: 'INTEREST',
    isOutcomeMetric: false
  },
  {
    id: 'kpi_seller_relationships',
    name: 'New Seller/Agent Relationships',
    category: 'LEADING',
    targetMonthly: AUTOACE_90_DAY_TARGETS.newSellerRelationshipsMonthly,
    unit: 'sellers/mo',
    description: 'Vetted car yards, individual sellers, and import agents onboarded.',
    funnelStage: 'CONNECTION',
    isOutcomeMetric: false
  },
  {
    id: 'kpi_hot_lead_followup',
    name: 'Hot-Lead Follow-Up Speed',
    category: 'LEADING',
    targetMonthly: AUTOACE_90_DAY_TARGETS.hotLeadFollowUpRatePercent,
    unit: '% within 24h',
    description: 'Percentage of qualified buyer leads contacted within 24 hours.',
    funnelStage: 'INTENT',
    isOutcomeMetric: false
  },
  {
    id: 'kpi_google_reviews',
    name: 'Google Reviews',
    category: 'LEADING',
    targetMonthly: AUTOACE_90_DAY_TARGETS.googleReviewsMonthly,
    unit: 'reviews/mo',
    description: 'Positive public testimonials establishing Zambian market trust.',
    funnelStage: 'TRANSACTION',
    isOutcomeMetric: false
  },

  // Supporting Attention Metrics (Explicitly NOT Primary KPIs)
  {
    id: 'kpi_raw_views',
    name: 'Content Views / Impressions',
    category: 'SUPPORTING_ATTENTION',
    targetMonthly: 10000,
    unit: 'views',
    description: 'Broad digital reach. Supporting attention metric only, never a primary business goal.',
    funnelStage: 'ATTENTION',
    isOutcomeMetric: false,
    isVanityMetric: true
  },
  {
    id: 'kpi_followers',
    name: 'Social Followers',
    category: 'SUPPORTING_ATTENTION',
    targetMonthly: 1000,
    unit: 'followers',
    description: 'Audience size. Supporting attention metric only; does not prove commercial demand.',
    funnelStage: 'ATTENTION',
    isOutcomeMetric: false,
    isVanityMetric: true
  }
];

/**
 * INITIAL BENCHMARK SNAPSHOT
 * Current operating state to run against the 90-day targets.
 */
export const DEFAULT_OPERATING_SNAPSHOT: OperatingMetricsSnapshot = {
  contentPublished: 16,
  contentViews: 14200,
  contentInteractions: 118,
  buyerRequests: 14,
  sellerAgentRelationships: 8,
  qualifiedConnections: 9,
  hotLeadFollowUpRate: 92,
  closedDeals: 2,
  revenueZmw: 4200,
  googleReviews: 4
};

/**
 * JARVIS DIAGNOSTIC LOGIC ENGINE
 * Evaluates the funnel and outputs actionable operator guidance based directly on the business rules.
 */
export function evaluateFunnelAndDiagnose(
  snapshot: OperatingMetricsSnapshot = DEFAULT_OPERATING_SNAPSHOT
): JarvisBottleneckDiagnosis[] {
  const diagnoses: JarvisBottleneckDiagnosis[] = [];

  // Diagnostic Rule 1: Attention increasing but demand capture isn't
  // E.g. views/interactions healthy (or high) but buyer requests below target (< 75% of target)
  const isAttentionHigh = snapshot.contentViews >= 8000 || snapshot.contentPublished >= 15;
  const isDemandLagging = snapshot.buyerRequests < (AUTOACE_90_DAY_TARGETS.buyerRequestsMonthly * 0.75); // < 15
  if (isAttentionHigh && isDemandLagging) {
    diagnoses.push({
      id: 'leak_attention_vs_intent',
      stageTriggered: 'INTENT',
      headline: 'Demand Capture Leak (Attention High → Requests Low)',
      diagnosticPrompt:
        'Attention is increasing, but demand capture isn’t. Focus on content that creates stronger buyer intent and improve the path from content to request.',
      recommendedAction:
        'Revise content hooks from generic vehicle showcases to explicit Call-To-Actions (e.g. "Looking for an X-Trail or RunX in Lusaka under K120k? WhatsApp AutoAce to source it today"). Add direct request forms to all video captions.',
      priorityLevel: 'CRITICAL',
      metricsInvolved: ['Content Views', 'Buyer Requests', 'Call-to-Action conversion']
    });
  }

  // Diagnostic Rule 2: Buyer requests increasing but connections are low
  // E.g. requests incoming (>= 12), but qualified connections lagging (< 60% of requests)
  const connectionRatio = snapshot.buyerRequests > 0 ? (snapshot.qualifiedConnections / snapshot.buyerRequests) : 0;
  if (snapshot.buyerRequests >= 10 && connectionRatio < 0.65) {
    diagnoses.push({
      id: 'leak_intent_vs_connection',
      stageTriggered: 'CONNECTION',
      headline: 'Fulfillment Capacity Bottleneck (Requests High → Connections Low)',
      diagnosticPrompt:
        'Demand is being captured, but fulfillment capacity is becoming the bottleneck. Focus on finding relevant sellers/agents.',
      recommendedAction:
        'Target onboarding of 3-5 new car yards along Great East Road / Kafue Road and direct Japanese import brokers to broaden supply for top-requested vehicle specs.',
      priorityLevel: 'CRITICAL',
      metricsInvolved: ['Buyer Requests', 'Qualified Connections', 'Seller Relationships']
    });
  }

  // Diagnostic Rule 3: Connections are high but deals are low
  // E.g. qualified connections active (>= 8), but closed deals < 2
  const dealRatio = snapshot.qualifiedConnections > 0 ? (snapshot.closedDeals / snapshot.qualifiedConnections) : 0;
  if (snapshot.qualifiedConnections >= 8 && (dealRatio < 0.25 || snapshot.closedDeals < 2)) {
    diagnoses.push({
      id: 'leak_connection_vs_deal',
      stageTriggered: 'TRANSACTION',
      headline: 'Closing Stage Friction (Connections High → Deals Low)',
      diagnosticPrompt:
        'The connection stage needs investigation. Review lead quality, follow-up and conversion.',
      recommendedAction:
        'Audit buyer budgets vs seller price expectations. Check mechanical inspection drop-offs, buyer financing availability, and follow-up response times.',
      priorityLevel: 'WARNING',
      metricsInvolved: ['Qualified Connections', 'Closed Deals', 'Lead Follow-up Speed']
    });
  }

  // Diagnostic Rule 4: Deals are increasing but revenue is low
  // E.g. closed deals are happening (>= 3), but revenue is under target (< K5,000)
  if (snapshot.closedDeals >= 3 && snapshot.revenueZmw < AUTOACE_90_DAY_TARGETS.revenueZmwMonthly) {
    diagnoses.push({
      id: 'leak_deal_vs_revenue',
      stageTriggered: 'REVENUE',
      headline: 'Monetization Leak (Deals Moving → Revenue Under K5,000)',
      diagnosticPrompt:
        'Transaction volume is moving, but monetization needs review.',
      recommendedAction:
        'Re-evaluate facilitation fee structure. Move from flat nominal tips to a structured 2-3% buyer-sourcing fee or premium verification add-on.',
      priorityLevel: 'WARNING',
      metricsInvolved: ['Closed Deals', 'AutoAce Revenue (K)', 'Fee per closed deal']
    });
  }

  // Diagnostic Rule 5: Follow-up Speed Guardrail
  if (snapshot.hotLeadFollowUpRate < 95) {
    diagnoses.push({
      id: 'leak_lead_decay',
      stageTriggered: 'INTENT',
      headline: 'Lead Decay Risk (Follow-up under 100% within 24h)',
      diagnosticPrompt:
        'Hot automotive leads decay rapidly. Every hour of delay diminishes buyer conviction and allows competitors or private yard walk-ins to close.',
      recommendedAction:
        'Ensure all new buyer requests trigger instant acknowledgment and qualify vehicle specs within 24 hours without fail.',
      priorityLevel: 'WARNING',
      metricsInvolved: ['Hot-Lead Follow-up Speed %']
    });
  }

  // If no critical leaks detected, return healthy state
  if (diagnoses.length === 0) {
    diagnoses.push({
      id: 'status_balanced',
      stageTriggered: 'REVENUE',
      headline: 'Funnel Operations Balanced',
      diagnosticPrompt:
        'All stages of the AutoAce demand-to-revenue funnel are moving in alignment with 90-day operating targets.',
      recommendedAction:
        'Maintain discipline. Continue acquiring verified demand, onboarding vetted Zambian suppliers, and sustaining 24-hour lead follow-up.',
      priorityLevel: 'HEALTHY',
      metricsInvolved: ['All Primary & Leading KPIs']
    });
  }

  return diagnoses;
}
