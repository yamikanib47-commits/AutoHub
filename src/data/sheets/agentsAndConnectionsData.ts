import { AgentRecord, ConnectionRecord } from '../../types/database';

export const initialAgents: AgentRecord[] = [
  {
    agent_id: 'AG001',
    agent_name: 'Yamikani Banda (Head Admin)',
    phone: '+260 97 500 1100',
    city: 'Lusaka',
    active_leads: 3,
    completed_deals: 4, // Top closer
    commission_earned: 14400,
    status: 'Active'
  },
  {
    agent_id: 'AG002',
    agent_name: 'Chilufya Mwape',
    phone: '+260 96 611 2233',
    city: 'Kitwe',
    active_leads: 2,
    completed_deals: 3, // Strong Copperbelt closer
    commission_earned: 7575,
    status: 'Active'
  },
  {
    agent_id: 'AG003',
    agent_name: 'Kondwani Phiri',
    phone: '+260 95 422 3344',
    city: 'Lusaka',
    active_leads: 3,
    completed_deals: 2,
    commission_earned: 5025,
    status: 'Active'
  },
  {
    agent_id: 'AG004',
    agent_name: 'Lupupa Tembo',
    phone: '+260 97 833 4455',
    city: 'Ndola',
    active_leads: 3,
    completed_deals: 0, // High activity, struggling to close inspections
    commission_earned: 0,
    status: 'Active'
  },
  {
    agent_id: 'AG005',
    agent_name: 'Musonda Bwalya',
    phone: '+260 96 244 5566',
    city: 'Lusaka',
    active_leads: 2,
    completed_deals: 1,
    commission_earned: 2400,
    status: 'Active'
  },
  {
    agent_id: 'AG006',
    agent_name: 'Brian Chola',
    phone: '+260 97 155 6677',
    city: 'Lusaka',
    active_leads: 4, // Pattern: 4 leads assigned but slow response, leads go stale
    completed_deals: 0,
    commission_earned: 0,
    status: 'Busy'
  },
  {
    agent_id: 'AG007',
    agent_name: 'Grace Mulenga',
    phone: '+260 95 366 7788',
    city: 'Kabwe',
    active_leads: 2,
    completed_deals: 0,
    commission_earned: 0,
    status: 'Active'
  },
  {
    agent_id: 'AG008',
    agent_name: 'Taonga Zulu',
    phone: '+260 96 977 8899',
    city: 'Livingstone',
    active_leads: 1,
    completed_deals: 0,
    commission_earned: 0,
    status: 'Active'
  }
];

export const initialConnections: ConnectionRecord[] = [
  // 10 Converted Deals (C001 - C010)
  {
    connection_id: 'C001',
    buyer_id: 'B001',
    listing_id: 'L001',
    seller_id: 'S001',
    agent_id: 'AG001',
    connection_status: 'Closed',
    created_at: '2026-08-11T10:00:00Z',
    converted_to_sale: true
  },
  {
    connection_id: 'C002',
    buyer_id: 'B002',
    listing_id: 'L002',
    seller_id: 'S005',
    agent_id: 'AG002',
    connection_status: 'Closed',
    created_at: '2026-08-13T12:00:00Z',
    converted_to_sale: true
  },
  {
    connection_id: 'C003',
    buyer_id: 'B004',
    listing_id: 'L005',
    seller_id: 'S006',
    agent_id: 'AG003',
    connection_status: 'Closed',
    created_at: '2026-08-16T17:00:00Z',
    converted_to_sale: true
  },
  {
    connection_id: 'C004',
    buyer_id: 'B005',
    listing_id: 'L006',
    seller_id: 'S008',
    agent_id: 'AG001',
    connection_status: 'Closed',
    created_at: '2026-08-19T11:00:00Z',
    converted_to_sale: true
  },
  {
    connection_id: 'C005',
    buyer_id: 'B006',
    listing_id: 'L007',
    seller_id: 'S004',
    agent_id: 'AG005',
    connection_status: 'Closed',
    created_at: '2026-08-21T14:30:00Z',
    converted_to_sale: true
  },
  {
    connection_id: 'C006',
    buyer_id: 'B008',
    listing_id: 'L008',
    seller_id: 'S013',
    agent_id: 'AG003',
    connection_status: 'Closed',
    created_at: '2026-08-23T10:00:00Z',
    converted_to_sale: true
  },
  {
    connection_id: 'C007',
    buyer_id: 'B009',
    listing_id: 'L009',
    seller_id: 'S002',
    agent_id: 'AG001',
    connection_status: 'Closed',
    created_at: '2026-08-26T16:00:00Z',
    converted_to_sale: true
  },
  {
    connection_id: 'C008',
    buyer_id: 'B010',
    listing_id: 'L010',
    seller_id: 'S007',
    agent_id: 'AG002',
    connection_status: 'Closed',
    created_at: '2026-08-29T12:00:00Z',
    converted_to_sale: true
  },
  {
    connection_id: 'C009',
    buyer_id: 'B012',
    listing_id: 'L012',
    seller_id: 'S005',
    agent_id: 'AG002',
    connection_status: 'Closed',
    created_at: '2026-08-31T11:30:00Z',
    converted_to_sale: true
  },
  {
    connection_id: 'C010',
    buyer_id: 'B015',
    listing_id: 'L013',
    seller_id: 'S009',
    agent_id: 'AG001',
    connection_status: 'Closed',
    created_at: '2026-09-05T10:00:00Z',
    converted_to_sale: true
  },

  // 20 In-flight or Non-converting Connections (C011 - C030)
  // Highlighting L004 (Toyota Harrier at City Car Den S003) failing multiple times due to price markup:
  {
    connection_id: 'C011',
    buyer_id: 'B013',
    listing_id: 'L004',
    seller_id: 'S003',
    agent_id: 'AG004',
    connection_status: 'Contact Revealed',
    created_at: '2026-09-02T13:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C012',
    buyer_id: 'B003',
    listing_id: 'L003',
    seller_id: 'S001',
    agent_id: 'AG004',
    connection_status: 'Approved',
    created_at: '2026-09-03T15:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C013',
    buyer_id: 'B016',
    listing_id: 'L015',
    seller_id: 'S002',
    agent_id: 'AG004',
    connection_status: 'Approved',
    created_at: '2026-09-07T11:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C014',
    buyer_id: 'B017',
    listing_id: 'L016',
    seller_id: 'S001',
    agent_id: 'AG003',
    connection_status: 'Approved',
    created_at: '2026-09-09T09:30:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C015',
    buyer_id: 'B018',
    listing_id: 'L017',
    seller_id: 'S004',
    agent_id: 'AG005',
    connection_status: 'Contact Revealed',
    created_at: '2026-09-10T11:45:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C016',
    buyer_id: 'B021',
    listing_id: 'L021',
    seller_id: 'S002',
    agent_id: 'AG007',
    connection_status: 'Pending',
    created_at: '2026-09-12T10:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C017',
    buyer_id: 'B013', // Second buyer test on L004
    listing_id: 'L004',
    seller_id: 'S003',
    agent_id: 'AG001',
    connection_status: 'Expired',
    created_at: '2026-09-04T14:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C018',
    buyer_id: 'B022',
    listing_id: 'L022',
    seller_id: 'S011',
    agent_id: 'AG003',
    connection_status: 'Approved',
    created_at: '2026-09-13T14:20:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C019',
    buyer_id: 'B023',
    listing_id: 'L023',
    seller_id: 'S007',
    agent_id: 'AG004',
    connection_status: 'Pending',
    created_at: '2026-09-14T11:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C020',
    buyer_id: 'B024',
    listing_id: 'L024',
    seller_id: 'S003',
    agent_id: 'AG005',
    connection_status: 'Pending',
    created_at: '2026-09-16T15:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C021',
    buyer_id: 'B025',
    listing_id: 'L025',
    seller_id: 'S001',
    agent_id: 'AG001',
    connection_status: 'Approved',
    created_at: '2026-09-17T09:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C022',
    buyer_id: 'B017', // Third connection to L004 (Harrier)
    listing_id: 'L004',
    seller_id: 'S003',
    agent_id: 'AG006',
    connection_status: 'Expired',
    created_at: '2026-08-28T16:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C023',
    buyer_id: 'B020',
    listing_id: 'L020',
    seller_id: 'S010',
    agent_id: 'AG007',
    connection_status: 'Pending',
    created_at: '2026-09-11T16:30:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C024',
    buyer_id: 'B003', // Mulenga Tembo alternative match
    listing_id: 'L019',
    seller_id: 'S005',
    agent_id: 'AG004',
    connection_status: 'Pending',
    created_at: '2026-09-08T15:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C025',
    buyer_id: 'B014',
    listing_id: 'L015',
    seller_id: 'S002',
    agent_id: 'AG006',
    connection_status: 'Expired',
    created_at: '2026-09-04T17:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C026',
    buyer_id: 'B016',
    listing_id: 'L021',
    seller_id: 'S002',
    agent_id: 'AG004',
    connection_status: 'Pending',
    created_at: '2026-09-10T10:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C027',
    buyer_id: 'B018',
    listing_id: 'L007',
    seller_id: 'S004',
    agent_id: 'AG005',
    connection_status: 'Expired',
    created_at: '2026-08-30T14:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C028',
    buyer_id: 'B023', // Fourth connection to L004 (Harrier)
    listing_id: 'L004',
    seller_id: 'S003',
    agent_id: 'AG004',
    connection_status: 'Expired',
    created_at: '2026-09-01T11:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C029',
    buyer_id: 'B021',
    listing_id: 'L011',
    seller_id: 'S003',
    agent_id: 'AG007',
    connection_status: 'Expired',
    created_at: '2026-08-29T15:00:00Z',
    converted_to_sale: false
  },
  {
    connection_id: 'C030',
    buyer_id: 'B025',
    listing_id: 'L001',
    seller_id: 'S001',
    agent_id: 'AG001',
    connection_status: 'Pending',
    created_at: '2026-09-17T14:00:00Z',
    converted_to_sale: false
  }
];
