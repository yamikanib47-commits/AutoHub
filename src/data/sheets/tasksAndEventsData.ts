import { TaskRecord, BusinessEventRecord } from '../../types/database';

export const initialTasks: TaskRecord[] = [
  {
    task_id: 'TK001',
    task: 'URGENT: Assign agent to Hot Buyer Given Lubinda (K450k LC 200 ZX)',
    category: 'Buyer Follow-up',
    priority: 'Critical',
    status: 'Pending',
    assigned_to: 'Yamikani Banda',
    due_date: '2026-09-18',
    related_buyer_id: 'B007',
    related_seller_id: 'S001',
    created_at: '2026-09-14T09:00:00Z'
  },
  {
    task_id: 'TK002',
    task: 'Assign Copperbelt agent to Mukuka Silwamba (K310k Hilux Extra Cab)',
    category: 'Buyer Follow-up',
    priority: 'Critical',
    status: 'Pending',
    assigned_to: 'Chilufya Mwape',
    due_date: '2026-09-18',
    related_buyer_id: 'B019',
    related_seller_id: 'S005',
    created_at: '2026-09-15T11:30:00Z'
  },
  {
    task_id: 'TK003',
    task: 'Inspect 2017 Prado TX-L 2.8 D-4D at Great East Motors Yard',
    category: 'Yard Inspection',
    priority: 'High',
    status: 'In Progress',
    assigned_to: 'Yamikani Banda',
    due_date: '2026-09-19',
    related_buyer_id: 'B025',
    related_seller_id: 'S001',
    created_at: '2026-09-17T10:00:00Z'
  },
  {
    task_id: 'TK004',
    task: 'Urgent follow-up on Bupe Mwila (RAV4 request untouched for 12 days)',
    category: 'Buyer Follow-up',
    priority: 'High',
    status: 'Pending',
    assigned_to: 'Brian Chola',
    due_date: '2026-09-18',
    related_buyer_id: 'B014',
    related_seller_id: '',
    created_at: '2026-09-15T14:00:00Z'
  },
  {
    task_id: 'TK005',
    task: 'Negotiate price reduction on L004 (Harrier) with City Car Den S003',
    category: 'Listing Sourcing',
    priority: 'High',
    status: 'In Progress',
    assigned_to: 'Lupupa Tembo',
    due_date: '2026-09-20',
    related_buyer_id: 'B013',
    related_seller_id: 'S003',
    created_at: '2026-09-12T16:00:00Z'
  },
  {
    task_id: 'TK006',
    task: 'Verify seller documentation for Lusaka Car Consignment Yard',
    category: 'Operations',
    priority: 'Medium',
    status: 'In Progress',
    assigned_to: 'Musonda Bwalya',
    due_date: '2026-09-21',
    related_buyer_id: '',
    related_seller_id: 'S010',
    created_at: '2026-09-10T11:00:00Z'
  },
  {
    task_id: 'TK007',
    task: 'Complete title transfer & Interpol clearance for Bwalya Kangwa (X-Trail)',
    category: 'Deal Closing',
    priority: 'High',
    status: 'Completed',
    assigned_to: 'Chilufya Mwape',
    due_date: '2026-08-20',
    related_buyer_id: 'B002',
    related_seller_id: 'S005',
    created_at: '2026-08-14T10:00:00Z'
  },
  {
    task_id: 'TK008',
    task: 'Schedule test drive for Thandiwe Ngoma (Vezel Hybrid at Woodlands)',
    category: 'Buyer Follow-up',
    priority: 'Medium',
    status: 'In Progress',
    assigned_to: 'Musonda Bwalya',
    due_date: '2026-09-19',
    related_buyer_id: 'B018',
    related_seller_id: 'S004',
    created_at: '2026-09-16T11:00:00Z'
  },
  {
    task_id: 'TK009',
    task: 'Disburse agent commission split for T010 (K5,100 to Yamikani)',
    category: 'Payment Collection',
    priority: 'High',
    status: 'Completed',
    assigned_to: 'Yamikani Banda',
    due_date: '2026-09-10',
    related_buyer_id: 'B015',
    related_seller_id: 'S009',
    created_at: '2026-09-09T16:00:00Z'
  },
  {
    task_id: 'TK010',
    task: 'Publish Weekly Lusaka Yard Price Guide video on YouTube & TikTok',
    category: 'Content Creation',
    priority: 'Medium',
    status: 'Completed',
    assigned_to: 'Yamikani Banda',
    due_date: '2026-09-18',
    related_buyer_id: '',
    related_seller_id: '',
    created_at: '2026-09-16T09:00:00Z'
  },
  {
    task_id: 'TK011',
    task: 'Call Kabwe buyer Godfrey Lungu regarding Mark X 250G availability',
    category: 'Buyer Follow-up',
    priority: 'Medium',
    status: 'Pending',
    assigned_to: 'Grace Mulenga',
    due_date: '2026-09-19',
    related_buyer_id: 'B021',
    related_seller_id: 'S002',
    created_at: '2026-09-16T14:00:00Z'
  },
  {
    task_id: 'TK012',
    task: 'Re-engage Mulenga Tembo on Hilux Extra Cab in Kitwe',
    category: 'Buyer Follow-up',
    priority: 'High',
    status: 'Pending',
    assigned_to: 'Lupupa Tembo',
    due_date: '2026-09-19',
    related_buyer_id: 'B003',
    related_seller_id: 'S005',
    created_at: '2026-09-15T15:30:00Z'
  },
  {
    task_id: 'TK013',
    task: 'Physical chassis inspection on 2015 Outlander at Kansenshi yard',
    category: 'Yard Inspection',
    priority: 'Medium',
    status: 'Pending',
    assigned_to: 'Lupupa Tembo',
    due_date: '2026-09-20',
    related_buyer_id: 'B023',
    related_seller_id: 'S007',
    created_at: '2026-09-16T12:00:00Z'
  },
  {
    task_id: 'TK014',
    task: 'Check registration documents for Kabwe Wheels & Spares (S012)',
    category: 'Operations',
    priority: 'Low',
    status: 'Pending',
    assigned_to: 'Grace Mulenga',
    due_date: '2026-09-23',
    related_buyer_id: '',
    related_seller_id: 'S012',
    created_at: '2026-09-11T10:00:00Z'
  },
  {
    task_id: 'TK015',
    task: 'Resolve unassigned leads queue: Assign 2 cold leads from website',
    category: 'Operations',
    priority: 'Medium',
    status: 'Pending',
    assigned_to: 'Yamikani Banda',
    due_date: '2026-09-19',
    related_buyer_id: '',
    related_seller_id: '',
    created_at: '2026-09-17T16:00:00Z'
  },
  {
    task_id: 'TK016',
    task: 'Inspect 2013 Dualis panoramic roof & CVTs with Durban transit broker',
    category: 'Yard Inspection',
    priority: 'Medium',
    status: 'In Progress',
    assigned_to: 'Kondwani Phiri',
    due_date: '2026-09-20',
    related_buyer_id: 'B022',
    related_seller_id: 'S011',
    created_at: '2026-09-15T09:30:00Z'
  },
  {
    task_id: 'TK017',
    task: 'Finalize escrow disbursement for T008 (Isuzu D-Max in Ndola)',
    category: 'Payment Collection',
    priority: 'High',
    status: 'Completed',
    assigned_to: 'Chilufya Mwape',
    due_date: '2026-09-03',
    related_buyer_id: 'B010',
    related_seller_id: 'S007',
    created_at: '2026-09-02T13:00:00Z'
  },
  {
    task_id: 'TK018',
    task: 'Record client testimonial video with Chanda Mutale (Prado TX)',
    category: 'Content Creation',
    priority: 'Medium',
    status: 'Completed',
    assigned_to: 'Yamikani Banda',
    due_date: '2026-09-16',
    related_buyer_id: 'B001',
    related_seller_id: 'S001',
    created_at: '2026-09-14T11:00:00Z'
  },
  {
    task_id: 'TK019',
    task: 'Source 3 additional verified Hilux Revo listings under K300k',
    category: 'Listing Sourcing',
    priority: 'High',
    status: 'In Progress',
    assigned_to: 'Kondwani Phiri',
    due_date: '2026-09-22',
    related_buyer_id: '',
    related_seller_id: '',
    created_at: '2026-09-16T14:30:00Z'
  },
  {
    task_id: 'TK020',
    task: 'Audit dormant listings at City Car Den and recommend price drops',
    category: 'Operations',
    priority: 'Critical',
    status: 'Pending',
    assigned_to: 'Yamikani Banda',
    due_date: '2026-09-19',
    related_buyer_id: '',
    related_seller_id: 'S003',
    created_at: '2026-09-17T15:00:00Z'
  }
];

export const initialBusinessEvents: BusinessEventRecord[] = [
  {
    event_id: 'EV001',
    event_type: 'buyer_request_received',
    description: 'Chanda Mutale submitted buyer request for 2016 Prado TX (K320k budget)',
    related_entity_type: 'buyer',
    related_entity_id: 'B001',
    value: 320000,
    timestamp: '2026-08-10T09:15:00Z'
  },
  {
    event_id: 'EV002',
    event_type: 'seller_added',
    description: 'Great East Motors Yard verified as AutoAce Tier 1 Dealer',
    related_entity_type: 'seller',
    related_entity_id: 'S001',
    value: null,
    timestamp: '2026-08-10T10:00:00Z'
  },
  {
    event_id: 'EV003',
    event_type: 'listing_created',
    description: '2016 Toyota Land Cruiser Prado TX listed at Great East Motors',
    related_entity_type: 'listing',
    related_entity_id: 'L001',
    value: 320000,
    timestamp: '2026-08-10T11:00:00Z'
  },
  {
    event_id: 'EV004',
    event_type: 'connection_created',
    description: 'Connection C001 created between Buyer B001 and Listing L001',
    related_entity_type: 'connection',
    related_entity_id: 'C001',
    value: null,
    timestamp: '2026-08-11T10:00:00Z'
  },
  {
    event_id: 'EV005',
    event_type: 'inspection_scheduled',
    description: 'Yamikani Banda conducted 42-point inspection on Prado TX for B001',
    related_entity_type: 'listing',
    related_entity_id: 'L001',
    value: null,
    timestamp: '2026-08-12T14:00:00Z'
  },
  {
    event_id: 'EV006',
    event_type: 'deal_closed',
    description: 'Transaction T001 completed for K320,000 (Prado TX)',
    related_entity_type: 'transaction',
    related_entity_id: 'T001',
    value: 320000,
    timestamp: '2026-08-14T16:30:00Z'
  },
  {
    event_id: 'EV007',
    event_type: 'payment_received',
    description: 'AutoAce collected K9,600 brokerage commission for T001',
    related_entity_type: 'transaction',
    related_entity_id: 'T001',
    value: 9600,
    timestamp: '2026-08-14T17:00:00Z'
  },
  {
    event_id: 'EV008',
    event_type: 'buyer_request_received',
    description: 'Bwalya Kangwa requested clean Nissan X-Trail T31 in Kitwe',
    related_entity_type: 'buyer',
    related_entity_id: 'B002',
    value: 125000,
    timestamp: '2026-08-12T11:30:00Z'
  },
  {
    event_id: 'EV009',
    event_type: 'connection_created',
    description: 'Connection C002 established between B002 and Copperbelt Auto Hub (L002)',
    related_entity_type: 'connection',
    related_entity_id: 'C002',
    value: null,
    timestamp: '2026-08-13T12:00:00Z'
  },
  {
    event_id: 'EV010',
    event_type: 'deal_closed',
    description: 'Transaction T002 completed in Kitwe for K125,000',
    related_entity_type: 'transaction',
    related_entity_id: 'T002',
    value: 125000,
    timestamp: '2026-08-17T15:00:00Z'
  },
  {
    event_id: 'EV011',
    event_type: 'payment_received',
    description: 'AutoAce collected K3,750 commission for T002',
    related_entity_type: 'transaction',
    related_entity_id: 'T002',
    value: 3750,
    timestamp: '2026-08-17T15:30:00Z'
  },
  {
    event_id: 'EV012',
    event_type: 'content_published',
    description: 'YouTube Video CT005 published (Japan Import Guide to Zambia)',
    related_entity_type: 'content',
    related_entity_id: 'CT005',
    value: 12400,
    timestamp: '2026-08-15T10:00:00Z'
  },
  {
    event_id: 'EV013',
    event_type: 'deal_closed',
    description: 'Transaction T003 completed: Mercedes C200 to Kondwani Phiri (K195,000)',
    related_entity_type: 'transaction',
    related_entity_id: 'T003',
    value: 195000,
    timestamp: '2026-08-19T16:00:00Z'
  },
  {
    event_id: 'EV014',
    event_type: 'payment_received',
    description: 'AutoAce commission collected K5,850 for T003',
    related_entity_type: 'transaction',
    related_entity_id: 'T003',
    value: 5850,
    timestamp: '2026-08-19T16:30:00Z'
  },
  {
    event_id: 'EV015',
    event_type: 'deal_closed',
    description: 'Transaction T004 completed: Toyota RunX to Natasha Simbeye (K85,000)',
    related_entity_type: 'transaction',
    related_entity_id: 'T004',
    value: 85000,
    timestamp: '2026-08-22T11:00:00Z'
  },
  {
    event_id: 'EV016',
    event_type: 'payment_received',
    description: 'AutoAce commission collected K2,550 for T004',
    related_entity_type: 'transaction',
    related_entity_id: 'T004',
    value: 2550,
    timestamp: '2026-08-22T11:30:00Z'
  },
  {
    event_id: 'EV017',
    event_type: 'deal_closed',
    description: 'Transaction T005 completed: Honda Fit Shuttle Hybrid (K160,000)',
    related_entity_type: 'transaction',
    related_entity_id: 'T005',
    value: 160000,
    timestamp: '2026-08-25T14:30:00Z'
  },
  {
    event_id: 'EV018',
    event_type: 'deal_closed',
    description: 'Transaction T006 completed: Subaru Forester XT in Livingstone (K140,000)',
    related_entity_type: 'transaction',
    related_entity_id: 'T006',
    value: 140000,
    timestamp: '2026-08-27T10:00:00Z'
  },
  {
    event_id: 'EV019',
    event_type: 'deal_closed',
    description: 'Transaction T007 completed: Mitsubishi Pajero Sport (K210,000)',
    related_entity_type: 'transaction',
    related_entity_id: 'T007',
    value: 210000,
    timestamp: '2026-08-29T16:00:00Z'
  },
  {
    event_id: 'EV020',
    event_type: 'connection_created',
    description: 'Connection C022 created between B017 and L004 (Harrier at City Car Den)',
    related_entity_type: 'connection',
    related_entity_id: 'C022',
    value: null,
    timestamp: '2026-08-28T16:00:00Z'
  },
  {
    event_id: 'EV021',
    event_type: 'deal_closed',
    description: 'Transaction T008 completed: Isuzu D-Max in Ndola (K270,000)',
    related_entity_type: 'transaction',
    related_entity_id: 'T008',
    value: 270000,
    timestamp: '2026-09-02T12:00:00Z'
  },
  {
    event_id: 'EV022',
    event_type: 'deal_closed',
    description: 'Transaction T009 completed: Mazda Demio Skyactiv in Kitwe (K110,000)',
    related_entity_type: 'transaction',
    related_entity_id: 'T009',
    value: 110000,
    timestamp: '2026-09-04T11:30:00Z'
  },
  {
    event_id: 'EV023',
    event_type: 'deal_closed',
    description: 'Transaction T010 completed: Ford Ranger Wildtrak (K340,000)',
    related_entity_type: 'transaction',
    related_entity_id: 'T010',
    value: 340000,
    timestamp: '2026-09-09T10:00:00Z'
  },
  {
    event_id: 'EV024',
    event_type: 'payment_received',
    description: 'AutoAce gross commission collected K10,200 for T010',
    related_entity_type: 'transaction',
    related_entity_id: 'T010',
    value: 10200,
    timestamp: '2026-09-09T10:30:00Z'
  },
  {
    event_id: 'EV025',
    event_type: 'buyer_request_received',
    description: 'Mulenga Tembo submitted request for Toyota Hilux Revo D-4D',
    related_entity_type: 'buyer',
    related_entity_id: 'B003',
    value: 285000,
    timestamp: '2026-09-02T14:20:00Z'
  },
  {
    event_id: 'EV026',
    event_type: 'buyer_request_received',
    description: 'Bupe Mwila submitted request for Toyota RAV4 (Mazabuka)',
    related_entity_type: 'buyer',
    related_entity_id: 'B014',
    value: 180000,
    timestamp: '2026-09-03T16:30:00Z'
  },
  {
    event_id: 'EV027',
    event_type: 'follow_up_completed',
    description: 'Agent Brian Chola left initial message for Bupe Mwila (then went quiet)',
    related_entity_type: 'buyer',
    related_entity_id: 'B014',
    value: null,
    timestamp: '2026-09-04T10:00:00Z'
  },
  {
    event_id: 'EV028',
    event_type: 'connection_created',
    description: 'Connection C011 created for Joseph Banda to L004 (Harrier)',
    related_entity_type: 'connection',
    related_entity_id: 'C011',
    value: null,
    timestamp: '2026-09-02T13:00:00Z'
  },
  {
    event_id: 'EV029',
    event_type: 'lead_escalated',
    description: 'Joseph Banda rejected L004: Seller City Car Den refused reasonable offer of K230k',
    related_entity_type: 'connection',
    related_entity_id: 'C011',
    value: null,
    timestamp: '2026-09-06T15:00:00Z'
  },
  {
    event_id: 'EV030',
    event_type: 'buyer_request_received',
    description: 'High-Value Buyer Given Lubinda requested LC 200 ZX (K450k budget)',
    related_entity_type: 'buyer',
    related_entity_id: 'B007',
    value: 450000,
    timestamp: '2026-09-14T08:30:00Z'
  },
  {
    event_id: 'EV031',
    event_type: 'lead_escalated',
    description: 'WARNING: Buyer B007 remains UNASSIGNED for >4 days',
    related_entity_type: 'buyer',
    related_entity_id: 'B007',
    value: null,
    timestamp: '2026-09-17T09:00:00Z'
  },
  {
    event_id: 'EV032',
    event_type: 'buyer_request_received',
    description: 'Mukuka Silwamba submitted request for Toyota Hilux Extra Cab in Kitwe',
    related_entity_type: 'buyer',
    related_entity_id: 'B019',
    value: 310000,
    timestamp: '2026-09-15T11:00:00Z'
  },
  {
    event_id: 'EV033',
    event_type: 'lead_escalated',
    description: 'WARNING: Buyer B019 remains UNASSIGNED for >3 days',
    related_entity_type: 'buyer',
    related_entity_id: 'B019',
    value: null,
    timestamp: '2026-09-17T10:00:00Z'
  },
  {
    event_id: 'EV034',
    event_type: 'content_published',
    description: 'TikTok CT025 published (AutoAce Prado TX delivery celebration)',
    related_entity_type: 'content',
    related_entity_id: 'CT025',
    value: 48000,
    timestamp: '2026-09-15T15:00:00Z'
  },
  {
    event_id: 'EV035',
    event_type: 'content_published',
    description: 'Facebook Post CT026 published (How to Submit a Buyer Request on AutoAce)',
    related_entity_type: 'content',
    related_entity_id: 'CT026',
    value: 22100,
    timestamp: '2026-09-16T08:00:00Z'
  },
  {
    event_id: 'EV036',
    event_type: 'buyer_request_received',
    description: 'Clement Katongo submitted qualified request for 2017 Prado TX-L (K380k)',
    related_entity_type: 'buyer',
    related_entity_id: 'B025',
    value: 380000,
    timestamp: '2026-09-17T08:20:00Z'
  },
  {
    event_id: 'EV037',
    event_type: 'connection_created',
    description: 'Connection C021 created for B025 to L025 at Great East Motors',
    related_entity_type: 'connection',
    related_entity_id: 'C021',
    value: null,
    timestamp: '2026-09-17T09:00:00Z'
  },
  {
    event_id: 'EV038',
    event_type: 'inspection_scheduled',
    description: 'Inspection scheduled for Clement Katongo on Prado TX-L',
    related_entity_type: 'listing',
    related_entity_id: 'L025',
    value: null,
    timestamp: '2026-09-17T11:00:00Z'
  },
  {
    event_id: 'EV039',
    event_type: 'content_published',
    description: 'YouTube Market Report CT030 published by Yamikani Banda',
    related_entity_type: 'content',
    related_entity_id: 'CT030',
    value: 6500,
    timestamp: '2026-09-18T07:30:00Z'
  },
  {
    event_id: 'EV040',
    event_type: 'lead_escalated',
    description: 'System audit: 2 unassigned hot buyers, 1 stale buyer request, 1 overpriced listing',
    related_entity_type: 'task',
    related_entity_id: 'TK020',
    value: null,
    timestamp: '2026-09-18T08:00:00Z'
  }
];
