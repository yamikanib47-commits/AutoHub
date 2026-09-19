export type NavTab = 
  | 'Dashboard'
  | 'Google Sheets DB'
  | 'Goals & KPIs'
  | 'Tasks'
  | 'Calendar'
  | 'Analytics'
  | 'Team'
  | 'Settings'
  | 'Help';

export * from './types/kpi';

export interface StatMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPrimary?: boolean; // Dark blue primary card
  trend?: 'up' | 'down' | 'neutral';
}

export interface DayAnalytic {
  day: string;
  value: number; // percentage height (0 - 100)
  type: 'hatched' | 'solid-light' | 'solid-dark';
  tooltip?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  dueDate: string;
  category: string;
  iconBg: string;
  iconColor: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  priority?: string;
  buyerName?: string;
  budget?: string;
  location?: string;
  contact?: string;
  intentScore?: number;
  matchedYard?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  taskTitle: string;
  avatar: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export interface ReminderItem {
  id: string;
  title: string;
  timeRange: string;
  platform?: string;
  link?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Done';
}

// AutoAce HQ & Operation types
export type HQTab =
  | 'hq'
  | 'ideas'
  | 'content'
  | 'leads'
  | 'requests'
  | 'tasks'
  | 'automation'
  | 'notifications'
  | 'review'
  | 'memory';

export type IdeaPriority = 'NOW' | 'NEXT' | 'PARKED' | 'CUT';
export type IdeaCategory = 'Content' | 'Feature' | 'Business' | 'Marketing' | 'Personal';

export interface IdeaItem {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  priority: IdeaPriority;
  impact: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export type LeadStatus = 'HOT' | 'MEDIUM' | 'COLD';
export type LeadType = 'BUYER' | 'SELLER' | 'AGENT' | 'IMPORT';

export interface LeadItem {
  id: string;
  name: string;
  contact: string;
  type: LeadType;
  status: LeadStatus;
  vehicleInterest: string;
  budgetOrTarget: string;
  notes: string;
  lastContacted: string;
  intentScore: number;
}

export type RequestType = 'BUYER' | 'SELLER';

export interface VehicleRequest {
  id: string;
  type: RequestType;
  clientName: string;
  vehicleSpec: string;
  budgetOrAsking: string;
  timeline: string;
  status: 'Open' | 'Matched' | 'Negotiating' | 'Closed';
  matchFound?: {
    matchId: string;
    title: string;
    equitySpread: string;
  };
  notes: string;
  createdAt: string;
}

export type TaskCategory = 'AUTOACE' | 'CONTENT' | 'CAREER' | 'PERSONAL' | 'ADMIN';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface HQTask {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  notes?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  platform: 'TikTok' | 'Reels' | 'YouTube Shorts' | 'LinkedIn' | 'Newsletter';
  status: 'Idea' | 'Drafting' | 'Recorded' | 'Scheduled' | 'Published';
  hook: string;
  script?: string;
  visualAngle?: string;
  callToAction?: string;
  scheduledFor?: string;
  views?: string;
}

export type NotificationType = 'lead' | 'content' | 'followup' | 'jarvis' | 'system';

export interface HQNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionTab?: HQTab;
}

export interface AutomationIntegration {
  id: string;
  name: string;
  provider: 'Make.com' | 'OneSignal' | 'Supabase' | 'Google Drive';
  type: 'Webhook' | 'Push Engine' | 'Cloud DB' | 'Cloud Storage';
  status: 'Active' | 'Standby' | 'Connecting';
  latencyMs: number;
  lastEvent: string;
  description: string;
  endpoint?: string;
}

export interface MemoryItem {
  id: string;
  category: 'Operator Preference' | 'Core Principle' | 'Monthly Goal' | 'Tone Guideline';
  title: string;
  content: string;
  updatedAt: string;
}

export interface TodaySlot {
  id: string;
  pillar: 'Income / Career' | 'AutoAce Demand' | 'Personal Health';
  priorityTitle: string;
  recommendation: string;
  status: 'Pending' | 'In Progress' | 'Done';
  tag: string;
}
