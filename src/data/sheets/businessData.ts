import { BusinessRecord, KpiRecord, DashboardMetricFormula } from '../../types/database';

export const initialBusiness: BusinessRecord = {
  business_id: 'AA001',
  business_name: 'AutoAce',
  market: 'Zambia',
  business_model: 'Automotive Demand & Connection Brokerage',
  mission: 'Acquire consumer demand → capture buyer intent → connect that demand with trusted fulfillment → facilitate transactions → generate revenue.',
  current_stage: 'Prototype Validation',
  commission_rate: 0.03, // 3%
  listing_fee: 45, // K45 per listing
  created_at: '2026-01-01T08:00:00Z'
};

export const initialKpis: KpiRecord[] = [
  {
    kpi_id: 'KPI001',
    kpi_name: 'Buyer Requests',
    category: 'Demand',
    target: 30,
    current_value: 25,
    period: 'Monthly',
    unit: 'requests',
    status: 'Needs Attention',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI002',
    kpi_name: 'Qualified Buyer Leads',
    category: 'Leads',
    target: 20,
    current_value: 14,
    period: 'Monthly',
    unit: 'leads',
    status: 'Needs Attention',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI003',
    kpi_name: 'Active Seller Listings',
    category: 'Operations',
    target: 35,
    current_value: 25,
    period: 'Monthly',
    unit: 'listings',
    status: 'Needs Attention',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI004',
    kpi_name: 'Qualified Connections Made',
    category: 'Connections',
    target: 25,
    current_value: 30,
    period: 'Monthly',
    unit: 'connections',
    status: 'Exceeded',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI005',
    kpi_name: 'Closed Vehicle Deals',
    category: 'Sales',
    target: 12,
    current_value: 10,
    period: 'Monthly',
    unit: 'deals',
    status: 'Needs Attention',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI006',
    kpi_name: 'AutoAce Gross Commission',
    category: 'Revenue',
    target: 65000,
    current_value: 63600,
    period: 'Monthly',
    unit: 'ZMW (K)',
    status: 'On Track',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI007',
    kpi_name: 'AutoAce Net Revenue',
    category: 'Revenue',
    target: 35000,
    current_value: 31800,
    period: 'Monthly',
    unit: 'ZMW (K)',
    status: 'Needs Attention',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI008',
    kpi_name: 'TikTok Video Views',
    category: 'Content',
    target: 150000,
    current_value: 215400,
    period: 'Monthly',
    unit: 'views',
    status: 'Exceeded',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI009',
    kpi_name: 'TikTok Followers',
    category: 'Awareness',
    target: 8000,
    current_value: 5840,
    period: 'Monthly',
    unit: 'followers',
    status: 'Needs Attention',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI010',
    kpi_name: 'Website Inquiries',
    category: 'Demand',
    target: 100,
    current_value: 48,
    period: 'Monthly',
    unit: 'inquiries',
    status: 'Critical',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI011',
    kpi_name: 'Google Business Profile Interactions',
    category: 'Awareness',
    target: 250,
    current_value: 312,
    period: 'Monthly',
    unit: 'interactions',
    status: 'Exceeded',
    updated_at: '2026-09-18T08:00:00Z'
  },
  {
    kpi_id: 'KPI012',
    kpi_name: 'Lead-to-Connection Conversion Rate',
    category: 'Operations',
    target: '80%',
    current_value: '68%',
    period: 'Monthly',
    unit: '%',
    status: 'Needs Attention',
    updated_at: '2026-09-18T08:00:00Z'
  }
];

export const initialDashboardFormulas: DashboardMetricFormula[] = [
  {
    cell: 'B2',
    metric_name: 'Total Transaction Value',
    formula: '=SUM(transactions!G2:G11)',
    calculated_value: 'K2,120,000',
    notes: 'Sum of all completed vehicle transaction amounts in ZMW'
  },
  {
    cell: 'B3',
    metric_name: 'Total AutoAce Commission (Gross)',
    formula: '=SUM(transactions!H2:H11)',
    calculated_value: 'K63,600',
    notes: 'Total 3% brokerage fees collected on transactions'
  },
  {
    cell: 'B4',
    metric_name: 'Agent Commission Disbursed',
    formula: '=SUM(transactions!I2:I11)',
    calculated_value: 'K31,800',
    notes: '50% split paid out to deal-closing agents'
  },
  {
    cell: 'B5',
    metric_name: 'AutoAce Net Revenue',
    formula: '=B3 - B4',
    calculated_value: 'K31,800',
    notes: 'Retained brokerage revenue after agent incentives'
  },
  {
    cell: 'B6',
    metric_name: 'Total Active Listings',
    formula: '=COUNTIF(seller_listings!L2:L26, "Active")',
    calculated_value: 16,
    notes: 'Listings ready for buyers in Zambian car yards'
  },
  {
    cell: 'B7',
    metric_name: 'Hot Unassigned Leads',
    formula: '=COUNTIFS(buyers!L2:L26, "Hot", buyers!M2:M26, "")',
    calculated_value: 2,
    notes: 'CRITICAL: High intent buyers waiting without an assigned agent (B007, B019)'
  },
  {
    cell: 'B8',
    metric_name: 'Connection-to-Sale Conversion Rate',
    formula: '=COUNTIF(connections!H2:H31, TRUE)/COUNTA(connections!A2:A31)',
    calculated_value: '33.3%',
    notes: '10 completed sales out of 30 facilitated connections'
  },
  {
    cell: 'B9',
    metric_name: 'Average Vehicle Deal Size',
    formula: '=AVERAGE(transactions!G2:G11)',
    calculated_value: 'K212,000',
    notes: 'Mean vehicle transaction size across Zambia'
  }
];

export const README_SCHEMA_DOC = `
# AutoAce Relational Google Sheets Database Architecture
Market: Zambia | Model: Demand & Connection Brokerage | Primary Currency: ZMW (K)

### Relational Entity Graph:
BUYER (buyers.buyer_id)
  ↓
buyer_request (buyers.request_status, budget, preferred_make/model)
  ↓
CONNECTION (connections.connection_id: buyer_id + listing_id + seller_id + agent_id)
  ↓
SELLER / LISTING (sellers.seller_id, seller_listings.listing_id)
  ↓
TRANSACTION (transactions.transaction_id: sale_value, 3% commission, agent split)
  ↓
REVENUE (AutoAce Net Revenue)

### Foreign Key Cross-References:
- buyers.assigned_agent_id -> agents.agent_id
- seller_listings.seller_id -> sellers.seller_id
- connections.buyer_id -> buyers.buyer_id
- connections.listing_id -> seller_listings.listing_id
- connections.seller_id -> sellers.seller_id
- connections.agent_id -> agents.agent_id
- transactions.buyer_id -> buyers.buyer_id
- transactions.seller_id -> sellers.seller_id
- transactions.agent_id -> agents.agent_id
- transactions.connection_id -> connections.connection_id
- tasks.assigned_to -> agents.agent_name / agent_id
- tasks.related_buyer_id -> buyers.buyer_id
- tasks.related_seller_id -> sellers.seller_id
- business_events.related_entity_id -> [entity_id]
`;
