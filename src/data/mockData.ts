import { 
  StatMetric, 
  DayAnalytic, 
  ProjectItem, 
  TeamMember, 
  ReminderItem, 
  TaskItem,
  TodaySlot,
  LeadItem,
  VehicleRequest,
  HQTask,
  IdeaItem,
  ContentItem,
  AutomationIntegration,
  HQNotification,
  MemoryItem
} from '../types';

export const statMetrics: StatMetric[] = [
  {
    id: '1',
    title: 'Buyer Requests',
    value: 18,
    change: 'Target: 20/mo • Lusaka Demand',
    isPrimary: true,
    trend: 'up'
  },
  {
    id: '2',
    title: 'Qualified Connections',
    value: 14,
    change: 'Target: 15/mo • Supply Matched',
    trend: 'up'
  },
  {
    id: '3',
    title: 'Closed Deals',
    value: 3,
    change: 'Target: 3+/mo • Completed Deals',
    trend: 'up'
  },
  {
    id: '4',
    title: 'AutoAce Revenue',
    value: 'K5,400',
    change: 'Target: K5,000+ • ZMW Earned',
    trend: 'up'
  }
];

export const projectAnalyticsData: DayAnalytic[] = [
  { day: 'S', value: 48, type: 'hatched' },
  { day: 'M', value: 72, type: 'solid-light' },
  { day: 'T', value: 64, type: 'solid-light', tooltip: '74% Intent Rate' },
  { day: 'W', value: 96, type: 'solid-dark' },
  { day: 'T', value: 68, type: 'hatched' },
  { day: 'F', value: 52, type: 'hatched' },
  { day: 'S', value: 58, type: 'hatched' }
];

export const initialProjects: ProjectItem[] = [
  {
    id: 'lead-1',
    title: 'Toyota Prado TX 150',
    dueDate: 'K320k • Lusaka (Woodlands)',
    category: 'Matching Supply',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    status: 'In Progress',
    buyerName: 'Chanda M.',
    budget: 'K320,000',
    location: 'Lusaka (Woodlands)',
    contact: '+260 97 712 3456',
    intentScore: 96,
    matchedYard: 'Great East Motors Yard'
  },
  {
    id: 'lead-2',
    title: 'Nissan X-Trail T31 Clean',
    dueDate: 'K120k • Kitwe (Parklands)',
    category: 'Qualified Lead',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    status: 'In Progress',
    buyerName: 'Bwalya K.',
    budget: 'K120,000',
    location: 'Kitwe (Parklands)',
    contact: '+260 96 689 0123',
    intentScore: 92,
    matchedYard: 'Copperbelt Auto Hub'
  },
  {
    id: 'lead-3',
    title: 'Toyota Hilux D-4D D/Cab',
    dueDate: 'K285k • Ndola (Kansenshi)',
    category: 'Inspection Stage',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    status: 'In Progress',
    buyerName: 'Mulenga T.',
    budget: 'K285,000',
    location: 'Ndola (Kansenshi)',
    contact: '+260 97 945 6789',
    intentScore: 94,
    matchedYard: 'Apex Auto Imports'
  },
  {
    id: 'lead-4',
    title: 'Mercedes-Benz C200 W204',
    dueDate: 'K195k • Lusaka (Kabulonga)',
    category: 'Deal Closing',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    status: 'Completed',
    buyerName: 'Kondwani P.',
    budget: 'K195,000',
    location: 'Lusaka (Kabulonga)',
    contact: '+260 95 533 2211',
    intentScore: 98,
    matchedYard: 'Prime Motors Woodlands'
  },
  {
    id: 'lead-5',
    title: 'Toyota RunX / Allex (Auto)',
    dueDate: 'K85k • Kabwe Central',
    category: 'New Request',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    status: 'Pending',
    buyerName: 'Natasha S.',
    budget: 'K85,000',
    location: 'Kabwe Central',
    contact: '+260 97 100 4433',
    intentScore: 89,
    matchedYard: 'Lusaka Yard Consignment'
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 's1',
    name: 'Great East Motors',
    taskTitle: 'Kafue Rd Yard • 4 Verified Prado/Hilux Units',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face',
    status: 'Completed'
  },
  {
    id: 's2',
    name: 'Apex Auto Imports',
    taskTitle: 'Japan Broker • 3 Units Sourced for Ndola/Kitwe',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
    status: 'In Progress'
  },
  {
    id: 's3',
    name: 'Prime Motors Woodlands',
    taskTitle: 'Lusaka Showroom • 2 Inquiries (Mercedes/BMW)',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face',
    status: 'In Progress'
  },
  {
    id: 's4',
    name: 'Copperbelt Auto Hub',
    taskTitle: 'Kitwe Yard • 1 Inspection Sourced (X-Trail)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    status: 'Pending'
  }
];

export const initialReminder: ReminderItem = {
  id: 'r1',
  title: 'Vehicle Inspection: Prado TX for Chanda M.',
  timeRange: '02.00 pm - 04.00 pm • Great East Motors',
  link: 'https://wa.me/260977123456'
};

export const initialTasksList: TaskItem[] = [
  { id: 't1', title: 'Review pull request for API auth tokens', project: 'Develop API Endpoints', dueDate: 'Today', priority: 'High', status: 'In Progress' },
  { id: 't2', title: 'Figma review for onboarding screen 3', project: 'Onboarding Flow', dueDate: 'Nov 27', priority: 'Medium', status: 'Todo' },
  { id: 't3', title: 'Fix mobile responsiveness in Safari iOS', project: 'Cross-Browser Testing', dueDate: 'Dec 4', priority: 'High', status: 'Todo' },
  { id: 't4', title: 'Benchmark Lighthouse performance scores', project: 'Optimize Page Load', dueDate: 'Dec 5', priority: 'Low', status: 'In Progress' },
  { id: 't5', title: 'Audit production database indexes', project: 'Build Dashboard', dueDate: 'Done', priority: 'High', status: 'Done' }
];

// AutoAce HQ Data
export const initialTodaySlots: TodaySlot[] = [
  {
    id: 'slot-1',
    pillar: 'AutoAce Demand',
    priorityTitle: 'Close Derrick Hall & Marcus Vance M340i deal',
    recommendation: 'Finalize inspection escrow & execute buyer contract to lock +$3.2k gross spread.',
    status: 'Pending',
    tag: 'Revenue'
  },
  {
    id: 'slot-2',
    pillar: 'Income / Career',
    priorityTitle: 'Publish short-form Reel on BMW B58 depreciation',
    recommendation: 'Batch record 30s hook and schedule for 6:00 PM peak engagement window.',
    status: 'In Progress',
    tag: 'Distribution'
  },
  {
    id: 'slot-3',
    pillar: 'Personal Health',
    priorityTitle: '45m Zone-2 cardio & mobility work',
    recommendation: 'Scheduled for 7:30 AM before customer calls begin.',
    status: 'Done',
    tag: 'Vitality'
  }
];

export const initialLeads: LeadItem[] = [
  {
    id: 'lead-1',
    name: 'Julian Croft',
    contact: '+1 (512) 883-9102 • jcroft@austinvip.io',
    type: 'BUYER',
    status: 'HOT',
    vehicleInterest: '2021 Porsche 718 Cayman GTS 4.0 or GT4',
    budgetOrTarget: '$85,000 - $95,000 cash ready',
    notes: 'Sold his 991.1 Carrera, looking for track-capable weekend car with clean DME scan.',
    lastContacted: '2 hours ago',
    intentScore: 94
  },
  {
    id: 'lead-2',
    name: 'Samantha Wei',
    contact: '+1 (415) 309-8811 • sam.wei@lumencapital.com',
    type: 'SELLER',
    status: 'HOT',
    vehicleInterest: '2020 BMW M2 Competition (Hockenheim Silver, 6MT)',
    budgetOrTarget: 'Asking $54,000 net to seller',
    notes: 'Single owner, 21k miles, ceramic coated, clean title in hand.',
    lastContacted: 'Yesterday',
    intentScore: 88
  },
  {
    id: 'lead-3',
    name: 'Marcus Vance',
    contact: '+1 (310) 902-4419 • mvance@pacificdesign.co',
    type: 'BUYER',
    status: 'HOT',
    vehicleInterest: '2021 BMW M340i xDrive, under 38k miles',
    budgetOrTarget: '$45,000 cash budget',
    notes: 'Matched with Derrick Hall consignment! Waiting on inspection confirmation.',
    lastContacted: '4 hours ago',
    intentScore: 98
  }
];

export const initialRequests: VehicleRequest[] = [
  {
    id: 'req-1',
    type: 'BUYER',
    clientName: 'Marcus Vance',
    vehicleSpec: '2021 BMW M340i xDrive, under 38k mi, Tanzanite or Mineral Grey',
    budgetOrAsking: '$45,000',
    timeline: 'Immediate (7 days)',
    status: 'Matched',
    matchFound: {
      matchId: 'req-2',
      title: 'Derrick Hall Consignment (2021 M340i, 32k mi)',
      equitySpread: '+$3,200 Potential Gross Spread'
    },
    notes: 'Buyer pre-approved, ready to execute wire transfer.',
    createdAt: 'Yesterday'
  },
  {
    id: 'req-2',
    type: 'SELLER',
    clientName: 'Derrick Hall',
    vehicleSpec: '2021 BMW M340i xDrive, 32,400 mi, clean Carfax, BMW CPO history',
    budgetOrAsking: '$41,800 Net',
    timeline: 'Ready now',
    status: 'Matched',
    notes: 'Consignment agreement signed, car located in Austin, TX.',
    createdAt: '2 days ago'
  }
];

export const initialIdeas: IdeaItem[] = [
  {
    id: 'idea-1',
    title: 'Private Buyer WhatsApp Broadcast Channel',
    description: 'Direct alert channel to pre-qualified high-budget buyers for 15-minute exclusive windows before public listing.',
    category: 'Business',
    priority: 'NOW',
    impact: 'High',
    createdAt: 'Today'
  },
  {
    id: 'idea-2',
    title: 'TikTok series: "Don\'t buy an M340i until you check this"',
    description: '30s breakdown covering cooling system plastic fittings, oil filter housing, and DME unlock dates.',
    category: 'Content',
    priority: 'NOW',
    impact: 'High',
    createdAt: 'Yesterday'
  }
];

export const initialTasks: HQTask[] = [
  {
    id: 't-1',
    title: 'Review DME scan and title check for Derrick Hall M340i',
    category: 'AUTOACE',
    priority: 'High',
    dueDate: 'Today 2:00 PM',
    completed: false
  },
  {
    id: 't-2',
    title: 'Finalize script for B58 maintenance video',
    category: 'CONTENT',
    priority: 'High',
    dueDate: 'Today 5:00 PM',
    completed: false
  },
  {
    id: 't-3',
    title: 'Follow up with Julian Croft regarding 718 Cayman GTS allocation',
    category: 'AUTOACE',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    completed: false
  }
];

export const initialContent: ContentItem[] = [
  {
    id: 'c-1',
    title: 'Why Dealers Lowball You on Porsche Macan Trade-ins',
    platform: 'Reels',
    status: 'Drafting',
    hook: 'If you take a 2019 Porsche Macan to a dealer today, you will lose $8,000 in 3 minutes.',
    script: 'Dealers factor in $3,500 recon fee and wholesale margins. Here is how private consignment preserves your equity.',
    visualAngle: 'Close-up of Porsche badge, panning across interior leather and infotainment screen.',
    callToAction: 'DM CONSIGN to calculate your net equity payout.',
    scheduledFor: 'Tomorrow, 6:30 PM'
  }
];

export const initialIntegrations: AutomationIntegration[] = [
  {
    id: 'int-1',
    name: 'Make.com Inbound Lead Webhook',
    provider: 'Make.com',
    type: 'Webhook',
    status: 'Active',
    latencyMs: 142,
    lastEvent: '32m ago (Lead payload received)',
    description: 'Listens for Instagram DM keyword triggers and website lead inquiries, routing directly into HQ pipeline.'
  },
  {
    id: 'int-2',
    name: 'OneSignal Push Dispatcher',
    provider: 'OneSignal',
    type: 'Push Engine',
    status: 'Active',
    latencyMs: 88,
    lastEvent: '2h ago (Match notification sent)',
    description: 'Pushes immediate high-priority alerts to operator device when a vehicle match is discovered.'
  }
];

export const initialNotifications: HQNotification[] = [
  {
    id: 'n-1',
    type: 'lead',
    title: 'New High-Intent Buyer Lead',
    message: 'Julian Croft is actively searching for a 2021 Porsche 718 Cayman GTS with $85k-$95k budget.',
    timestamp: '28m ago',
    read: false,
    actionLabel: 'View Lead',
    actionTab: 'leads'
  },
  {
    id: 'n-2',
    type: 'jarvis',
    title: 'Algorithmic Match Discovered',
    message: 'Marcus Vance buyer request matches Derrick Hall 2021 BMW M340i consignment (+$3,200 commission spread).',
    timestamp: '1h ago',
    read: false,
    actionLabel: 'Review Match',
    actionTab: 'requests'
  }
];

export const initialMemory: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'Core Principle',
    title: 'Zero Pressure, Radical Transparency',
    content: 'AutoAce never rushes buyers or pushes compromised inventory. Every inspection report must be shared unedited with client.',
    updatedAt: 'Updated this week'
  }
];
