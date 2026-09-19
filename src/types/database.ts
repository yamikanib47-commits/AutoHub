/**
 * AutoAce Relational Google Sheets Database Types
 * Designed for Google Sheets prototype and ready for PostgreSQL / Supabase migration.
 */

export interface BusinessRecord {
  business_id: string;
  business_name: string;
  market: string;
  business_model: string;
  mission: string;
  current_stage: string;
  commission_rate: number; // e.g. 0.03 for 3%
  listing_fee: number; // e.g. 45 for K45
  created_at: string;
}

export type KpiCategory = 
  | 'Awareness' 
  | 'Demand' 
  | 'Leads' 
  | 'Connections' 
  | 'Sales' 
  | 'Revenue' 
  | 'Content' 
  | 'Operations';

export type KpiStatus = 'On Track' | 'Needs Attention' | 'Critical' | 'Exceeded';

export interface KpiRecord {
  kpi_id: string;
  kpi_name: string;
  category: KpiCategory;
  target: number | string;
  current_value: number | string;
  period: string; // 'Monthly' | '90-Day' | 'Weekly'
  unit: string;
  status: KpiStatus;
  updated_at: string;
}

export type BuyerRequestStatus = 
  | 'New' 
  | 'Contacted' 
  | 'Qualified' 
  | 'Matched' 
  | 'Connected' 
  | 'Purchased' 
  | 'Lost';

export type LeadTemperature = 'Hot' | 'Medium' | 'Cold';

export interface BuyerRecord {
  buyer_id: string;
  name: string;
  phone: string;
  city: string;
  budget: number; // in ZMW (K)
  preferred_make: string;
  preferred_model: string;
  preferred_year: number;
  transmission: 'Automatic' | 'Manual';
  fuel: 'Petrol' | 'Diesel' | 'Hybrid';
  request_status: BuyerRequestStatus;
  lead_temperature: LeadTemperature;
  assigned_agent_id: string; // references agents.agent_id (can be empty string if unassigned)
  created_at: string;
}

export type SellerType = 'Private Seller' | 'Dealer' | 'Agent' | 'Importer';
export type VerificationStatus = 'Verified' | 'Pending Verification' | 'Unverified';

export interface SellerRecord {
  seller_id: string;
  seller_name: string;
  phone: string;
  location: string;
  seller_type: SellerType;
  verification_status: VerificationStatus;
  active_listings: number;
  total_sales: number;
  created_at: string;
}

export type ListingStatus = 'Active' | 'Under Inspection' | 'Reserved' | 'Sold' | 'Inactive';

export interface SellerListingRecord {
  listing_id: string;
  seller_id: string; // references sellers.seller_id
  vehicle: string;
  make: string;
  model: string;
  year: number;
  price: number; // in ZMW (K)
  location: string;
  transmission: 'Automatic' | 'Manual';
  fuel: 'Petrol' | 'Diesel' | 'Hybrid';
  condition: string;
  listing_status: ListingStatus;
  created_at: string;
}

export type AgentStatus = 'Active' | 'Busy' | 'On Leave' | 'Inactive';

export interface AgentRecord {
  agent_id: string;
  agent_name: string;
  phone: string;
  city: string;
  active_leads: number;
  completed_deals: number;
  commission_earned: number; // in ZMW (K)
  status: AgentStatus;
}

export type ConnectionStatus = 'Pending' | 'Approved' | 'Contact Revealed' | 'Closed' | 'Expired';

export interface ConnectionRecord {
  connection_id: string;
  buyer_id: string; // references buyers.buyer_id
  listing_id: string; // references seller_listings.listing_id
  seller_id: string; // references sellers.seller_id
  agent_id: string; // references agents.agent_id
  connection_status: ConnectionStatus;
  created_at: string;
  converted_to_sale: boolean;
}

export type TransactionStatus = 'Completed' | 'Funds Cleared' | 'In Escrow';

export interface TransactionRecord {
  transaction_id: string;
  buyer_id: string; // references buyers.buyer_id
  seller_id: string; // references sellers.seller_id
  agent_id: string; // references agents.agent_id
  connection_id: string; // references connections.connection_id
  vehicle: string;
  sale_value: number; // in ZMW (K)
  autoace_commission: number; // 3% of sale_value
  agent_commission: number; // 50% of AutoAce commission
  autoace_net_revenue: number; // autoace_commission - agent_commission
  transaction_status: TransactionStatus;
  sale_date: string;
}

export type ContentPlatform = 'TikTok' | 'Instagram' | 'Facebook' | 'YouTube';

export interface ContentRecord {
  content_id: string;
  platform: ContentPlatform;
  content_type: string;
  topic: string;
  hook: string;
  published_at: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  profile_visits: number;
  inquiries: number;
  buyer_requests: number;
  resulting_sales: number;
}

export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskCategory = 
  | 'Buyer Follow-up' 
  | 'Yard Inspection' 
  | 'Deal Closing' 
  | 'Listing Sourcing' 
  | 'Content Creation' 
  | 'Payment Collection'
  | 'Operations';

export interface TaskRecord {
  task_id: string;
  task: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
  assigned_to: string; // references agents.agent_name or agent_id
  due_date: string;
  related_buyer_id: string; // references buyers.buyer_id or empty
  related_seller_id: string; // references sellers.seller_id or empty
  created_at: string;
}

export type BusinessEventType = 
  | 'buyer_request_received' 
  | 'seller_added' 
  | 'listing_created' 
  | 'connection_created' 
  | 'inspection_scheduled' 
  | 'deal_closed' 
  | 'content_published' 
  | 'payment_received' 
  | 'follow_up_completed'
  | 'lead_escalated';

export interface BusinessEventRecord {
  event_id: string;
  event_type: BusinessEventType;
  description: string;
  related_entity_type: 'buyer' | 'seller' | 'listing' | 'connection' | 'transaction' | 'content' | 'task';
  related_entity_id: string;
  value: number | null;
  timestamp: string;
}

export interface DashboardMetricFormula {
  cell: string;
  metric_name: string;
  formula: string;
  calculated_value: string | number;
  notes: string;
}

export interface GoogleSheetsDatabase {
  business: BusinessRecord[];
  kpis: KpiRecord[];
  buyers: BuyerRecord[];
  seller_listings: SellerListingRecord[];
  sellers: SellerRecord[];
  agents: AgentRecord[];
  connections: ConnectionRecord[];
  transactions: TransactionRecord[];
  content: ContentRecord[];
  tasks: TaskRecord[];
  business_events: BusinessEventRecord[];
  dashboard_formulas: DashboardMetricFormula[];
}
