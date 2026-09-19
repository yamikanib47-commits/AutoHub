import { GoogleSheetsDatabase } from '../../types/database';
import { initialBusiness, initialKpis, initialDashboardFormulas, README_SCHEMA_DOC } from './businessData';
import { initialBuyers } from './buyersData';
import { initialSellers, initialSellerListings } from './sellersAndListingsData';
import { initialAgents, initialConnections } from './agentsAndConnectionsData';
import { initialTransactions, initialContent } from './transactionsAndContentData';
import { initialTasks, initialBusinessEvents } from './tasksAndEventsData';

export const autoAceDatabase: GoogleSheetsDatabase = {
  business: [initialBusiness],
  kpis: initialKpis,
  buyers: initialBuyers,
  seller_listings: initialSellerListings,
  sellers: initialSellers,
  agents: initialAgents,
  connections: initialConnections,
  transactions: initialTransactions,
  content: initialContent,
  tasks: initialTasks,
  business_events: initialBusinessEvents,
  dashboard_formulas: initialDashboardFormulas
};

export {
  initialBusiness,
  initialKpis,
  initialDashboardFormulas,
  README_SCHEMA_DOC,
  initialBuyers,
  initialSellers,
  initialSellerListings,
  initialAgents,
  initialConnections,
  initialTransactions,
  initialContent,
  initialTasks,
  initialBusinessEvents
};
