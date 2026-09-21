import { autoAceDatabase } from '../data/sheets';
import { 
  GoogleSheetsDatabase,
  BuyerRecord, 
  BuyerRequestStatus,
  SellerListingRecord, 
  ContentRecord, 
  AgentRecord, 
  TransactionRecord,
  DashboardMetricFormula
} from '../types/database';
import { StatMetric, ProjectItem } from '../types';

export interface DALMetadata {
  isLive: boolean;
  source: 'Local Prototype Data' | 'Google Sheets';
  spreadsheetId: string | null;
  lastSyncedAt: Date | null;
}

/**
 * AutoAce Google Sheets Data Access Layer (DAL)
 * Provides a typed query bridge for Jarvis and AutoAce HQ to query the spreadsheet database.
 * Serves as the central analytical layer between Google Sheets, AutoAce Hub, and Jarvis.
 */
export class AutoAceDataAccessLayer {
  private db: GoogleSheetsDatabase = autoAceDatabase;
  private metadata: DALMetadata = {
    isLive: false,
    source: 'Local Prototype Data',
    spreadsheetId: null,
    lastSyncedAt: null
  };

  private listeners: Array<() => void> = [];

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Error in DAL listener:', e);
      }
    });
  }

  /**
   * Update the internal database from live Google Sheets data
   */
  public setDatabase(
    newDb: GoogleSheetsDatabase,
    meta?: Partial<DALMetadata>
  ): void {
    this.db = newDb;
    if (meta) {
      this.metadata = {
        ...this.metadata,
        ...meta
      };
    }
    this.notify();
  }

  public getMetadata(): DALMetadata {
    return { ...this.metadata };
  }

  /**
   * Question: "How many hot buyers are currently waiting?"
   * Identifies high-conviction buyers with Hot lead temperature who are still active.
   */
  public getHotBuyersWaiting(): {
    count: number;
    unassignedHotBuyers: BuyerRecord[];
    inFlightHotBuyers: BuyerRecord[];
  } {
    const hotBuyers = this.db.buyers.filter((b) => String(b.lead_temperature).toLowerCase() === 'hot');
    const unassignedHotBuyers = hotBuyers.filter((b) => !b.assigned_agent_id || b.assigned_agent_id.trim() === '');
    const inFlightHotBuyers = hotBuyers.filter(
      (b) => b.request_status !== 'Purchased' && b.request_status !== 'Lost'
    );

    return {
      count: inFlightHotBuyers.length,
      unassignedHotBuyers,
      inFlightHotBuyers
    };
  }

  /**
   * Question: "Which buyers have no assigned agent?"
   * Identifies all buyer requests lacking an agent to execute follow-up.
   */
  public getUnassignedBuyers(): {
    count: number;
    unassignedBuyers: BuyerRecord[];
    byCity: Record<string, number>;
  } {
    const unassigned = this.db.buyers.filter((b) => !b.assigned_agent_id || b.assigned_agent_id.trim() === '');
    const byCity: Record<string, number> = {};
    unassigned.forEach((b) => {
      byCity[b.city] = (byCity[b.city] || 0) + 1;
    });

    return {
      count: unassigned.length,
      unassignedBuyers: unassigned,
      byCity
    };
  }

  /**
   * Question: "Which listings are getting interest but not converting?"
   * Finds listings with 2 or more connections that have 0 completed sales.
   */
  public getListingsWithInterestNotConverting(): Array<{
    listing: SellerListingRecord;
    connectionCount: number;
    potentialRevenueLost: number;
    sellerName: string;
    probableCause: string;
  }> {
    const listingConnectionMap = new Map<string, number>();
    const listingSaleMap = new Map<string, number>();

    this.db.connections.forEach((conn) => {
      const current = listingConnectionMap.get(conn.listing_id) || 0;
      listingConnectionMap.set(conn.listing_id, current + 1);

      if (conn.converted_to_sale) {
        const sales = listingSaleMap.get(conn.listing_id) || 0;
        listingSaleMap.set(conn.listing_id, sales + 1);
      }
    });

    const results: Array<{
      listing: SellerListingRecord;
      connectionCount: number;
      potentialRevenueLost: number;
      sellerName: string;
      probableCause: string;
    }> = [];

    this.db.seller_listings.forEach((listing) => {
      const connections = listingConnectionMap.get(listing.listing_id) || 0;
      const sales = listingSaleMap.get(listing.listing_id) || 0;

      if (connections >= 2 && sales === 0) {
        const seller = this.db.sellers.find((s) => s.seller_id === listing.seller_id);
        const autoAceCommission = (Number(listing.price) || 0) * 0.03;
        
        let cause = 'High asking price vs market budget';
        if (Number(listing.price) > 250000 && listing.make === 'Toyota') {
          cause = 'Seller refusing price flexibility; buyer budgets lower than asking';
        } else if (listing.make === 'BMW' || listing.make === 'Audi') {
          cause = 'High maintenance perception on European models among Zambian buyers';
        }

        results.push({
          listing,
          connectionCount: connections,
          potentialRevenueLost: autoAceCommission,
          sellerName: seller?.seller_name || listing.seller_id,
          probableCause: cause
        });
      }
    });

    return results.sort((a, b) => b.connectionCount - a.connectionCount);
  }

  /**
   * Question: "Which content actually generated buyer demand?"
   * Ranks content by buyer requests and resulting sales, filtering out vanity-view content.
   */
  public getContentGeneratingDemand(): {
    topDemandDrivers: ContentRecord[];
    vanityContentZeroDemand: ContentRecord[];
    totalDemandGenerated: number;
    totalSalesFromContent: number;
  } {
    const sorted = [...this.db.content].sort((a, b) => {
      const bSales = Number(b.resulting_sales) || 0;
      const aSales = Number(a.resulting_sales) || 0;
      if (bSales !== aSales) {
        return bSales - aSales;
      }
      return (Number(b.buyer_requests) || 0) - (Number(a.buyer_requests) || 0);
    });

    const topDemandDrivers = sorted.filter((c) => (Number(c.buyer_requests) || 0) > 0 || (Number(c.resulting_sales) || 0) > 0);
    const vanityContentZeroDemand = this.db.content.filter(
      (c) => (Number(c.views) || 0) > 20000 && (Number(c.buyer_requests) || 0) === 0 && (Number(c.resulting_sales) || 0) === 0
    );

    const totalDemandGenerated = this.db.content.reduce((sum, c) => sum + (Number(c.buyer_requests) || 0), 0);
    const totalSalesFromContent = this.db.content.reduce((sum, c) => sum + (Number(c.resulting_sales) || 0), 0);

    return {
      topDemandDrivers,
      vanityContentZeroDemand,
      totalDemandGenerated,
      totalSalesFromContent
    };
  }

  /**
   * Question: "How much revenue did AutoAce generate this month?"
   * Derives total transaction value, gross commission, agent disbursement, and net revenue.
   */
  public getMonthlyRevenue(): {
    totalTransactionValue: number;
    grossCommission: number;
    agentCommissionDisbursed: number;
    netRevenue: number;
    dealCount: number;
    averageDealSize: number;
    currency: string;
    transactions: TransactionRecord[];
  } {
    const txs = this.db.transactions;
    const totalTransactionValue = txs.reduce((sum, t) => sum + (Number(t.sale_value) || 0), 0);
    const grossCommission = txs.reduce((sum, t) => sum + (Number(t.autoace_commission) || 0), 0);
    const agentCommissionDisbursed = txs.reduce((sum, t) => sum + (Number(t.agent_commission) || 0), 0);
    const netRevenue = txs.reduce((sum, t) => sum + (Number(t.autoace_net_revenue) || 0), 0);
    const dealCount = txs.length;
    const averageDealSize = dealCount > 0 ? Math.round(totalTransactionValue / dealCount) : 0;

    return {
      totalTransactionValue,
      grossCommission,
      agentCommissionDisbursed,
      netRevenue,
      dealCount,
      averageDealSize,
      currency: 'ZMW (K)',
      transactions: txs
    };
  }

  /**
   * Question: "Which agents have unresolved leads?"
   * Cross-references agent active leads, pending tasks, and uncontacted buyers.
   */
  public getAgentsWithUnresolvedLeads(): Array<{
    agent: AgentRecord;
    activeLeadsAssigned: number;
    staleLeadsCount: number;
    pendingTasksCount: number;
    staleBuyerNames: string[];
  }> {
    return this.db.agents.map((agent) => {
      const agentBuyers = this.db.buyers.filter((b) => b.assigned_agent_id === agent.agent_id);
      const staleBuyers = agentBuyers.filter(
        (b) => (b.request_status === 'New' || b.request_status === 'Contacted') && 
               new Date(b.created_at) < new Date('2026-09-10T00:00:00Z')
      );
      const pendingTasks = this.db.tasks.filter(
        (t) => t.assigned_to.includes(agent.agent_name.split(' ')[0]) && t.status !== 'Completed'
      );

      return {
        agent,
        activeLeadsAssigned: agentBuyers.length,
        staleLeadsCount: staleBuyers.length,
        pendingTasksCount: pendingTasks.length,
        staleBuyerNames: staleBuyers.map((b) => `${b.name} (${b.preferred_model})`)
      };
    }).sort((a, b) => b.staleLeadsCount - a.staleLeadsCount);
  }

  /**
   * Question: "Where is the biggest leak in the funnel?"
   * Analyzes conversion drop-offs between Buyer Requests -> Qualified -> Matched -> Connected -> Closed Deals.
   */
  public getFunnelLeakAnalysis(): {
    stages: Array<{
      stage: string;
      count: number;
      conversionFromPrevious: string;
      leakNote: string;
    }>;
    primaryLeakPoint: string;
    recommendedAction: string;
  } {
    const totalRequests = this.db.buyers.length;
    const qualifiedRequests = this.db.buyers.filter(
      (b) => b.request_status !== 'New' && b.request_status !== 'Lost'
    ).length;
    const totalConnections = this.db.connections.length;
    const convertedDeals = this.db.transactions.length;

    const stages = [
      {
        stage: '1. Buyer Requests',
        count: totalRequests,
        conversionFromPrevious: '100%',
        leakNote: 'Top of funnel demand inflow across Lusaka & Copperbelt'
      },
      {
        stage: '2. Qualified Requests',
        count: qualifiedRequests,
        conversionFromPrevious: totalRequests > 0 ? `${Math.round((qualifiedRequests / totalRequests) * 100)}%` : '0%',
        leakNote: `${totalRequests - qualifiedRequests} requests stalled due to lack of immediate agent assignment`
      },
      {
        stage: '3. Physical Yard Connections',
        count: totalConnections,
        conversionFromPrevious: 'N/A (Multi-sourcing)',
        leakNote: `${totalConnections} supply connections introduced to buyers`
      },
      {
        stage: '4. Closed Vehicle Deals',
        count: convertedDeals,
        conversionFromPrevious: totalConnections > 0 ? `${Math.round((convertedDeals / totalConnections) * 100)}%` : '0%',
        leakNote: `MAJOR LEAK: ${Math.max(0, totalConnections - convertedDeals)} connections failed to convert into completed transactions`
      }
    ];

    const conversionRate = totalConnections > 0 ? ((convertedDeals / totalConnections) * 100).toFixed(1) : '0';

    return {
      stages,
      primaryLeakPoint: `Connection-to-Deal Stage (${conversionRate}% conversion)`,
      recommendedAction: 'Focus Jarvis on physical yard price renegotiation (e.g. City Car Den L004 Harrier) and mandatory inspection dispatch within 24 hours.'
    };
  }

  /**
   * Generates a complete live operational snapshot of all key queries for Jarvis.
   * This is sent directly to Jarvis's prompt context so Gemini and the reasoning engine
   * calculate their exact answers based on the live Google Sheets data.
   */
  public getLiveOperationalSummary(): {
    dataSource: string;
    isLive: boolean;
    lastSyncedAt: string | null;
    hotBuyers: {
      count: number;
      unassignedCount: number;
      unassignedList: Array<{ id: string; name: string; car: string; budget: number; city: string }>;
    };
    unassignedBuyers: {
      count: number;
      list: Array<{ id: string; name: string; car: string; budget: number; city: string }>;
    };
    nonConvertingListings: Array<{
      id: string;
      vehicle: string;
      price: number;
      seller: string;
      connections: number;
      cause: string;
    }>;
    contentDemand: {
      topDrivers: Array<{ id: string; platform: string; topic: string; requests: number; sales: number }>;
      vanityList: Array<{ id: string; topic: string; views: number; requests: number }>;
      totalRequests: number;
      totalSales: number;
    };
    revenue: {
      totalSalesValue: number;
      grossCommission: number;
      agentCommissionDisbursed: number;
      netRevenue: number;
      dealCount: number;
      averageDealSize: number;
    };
    agentLeads: Array<{
      name: string;
      activeLeads: number;
      staleLeads: number;
      pendingTasks: number;
    }>;
    funnel: {
      primaryLeak: string;
      recommendation: string;
      stages: Array<{ stage: string; count: number; conversion: string }>;
    };
  } {
    const hot = this.getHotBuyersWaiting();
    const unassigned = this.getUnassignedBuyers();
    const listings = this.getListingsWithInterestNotConverting();
    const content = this.getContentGeneratingDemand();
    const rev = this.getMonthlyRevenue();
    const agents = this.getAgentsWithUnresolvedLeads();
    const funnel = this.getFunnelLeakAnalysis();

    return {
      dataSource: this.metadata.source,
      isLive: this.metadata.isLive,
      lastSyncedAt: this.metadata.lastSyncedAt ? this.metadata.lastSyncedAt.toISOString() : null,
      hotBuyers: {
        count: hot.count,
        unassignedCount: hot.unassignedHotBuyers.length,
        unassignedList: hot.unassignedHotBuyers.map((b) => ({
          id: b.buyer_id,
          name: b.name,
          car: `${b.preferred_make} ${b.preferred_model}`,
          budget: Number(b.budget) || 0,
          city: b.city
        }))
      },
      unassignedBuyers: {
        count: unassigned.count,
        list: unassigned.unassignedBuyers.map((b) => ({
          id: b.buyer_id,
          name: b.name,
          car: `${b.preferred_make} ${b.preferred_model}`,
          budget: Number(b.budget) || 0,
          city: b.city
        }))
      },
      nonConvertingListings: listings.map((l) => ({
        id: l.listing.listing_id,
        vehicle: l.listing.vehicle,
        price: Number(l.listing.price) || 0,
        seller: l.sellerName,
        connections: l.connectionCount,
        cause: l.probableCause
      })),
      contentDemand: {
        topDrivers: content.topDemandDrivers.slice(0, 5).map((c) => ({
          id: c.content_id,
          platform: c.platform,
          topic: c.topic,
          requests: Number(c.buyer_requests) || 0,
          sales: Number(c.resulting_sales) || 0
        })),
        vanityList: content.vanityContentZeroDemand.map((c) => ({
          id: c.content_id,
          topic: c.topic,
          views: Number(c.views) || 0,
          requests: Number(c.buyer_requests) || 0
        })),
        totalRequests: content.totalDemandGenerated,
        totalSales: content.totalSalesFromContent
      },
      revenue: {
        totalSalesValue: rev.totalTransactionValue,
        grossCommission: rev.grossCommission,
        agentCommissionDisbursed: rev.agentCommissionDisbursed,
        netRevenue: rev.netRevenue,
        dealCount: rev.dealCount,
        averageDealSize: rev.averageDealSize
      },
      agentLeads: agents.map((a) => ({
        name: a.agent.agent_name,
        activeLeads: a.activeLeadsAssigned,
        staleLeads: a.staleLeadsCount,
        pendingTasks: a.pendingTasksCount
      })),
      funnel: {
        primaryLeak: funnel.primaryLeakPoint,
        recommendation: funnel.recommendedAction,
        stages: funnel.stages.map((s) => ({ stage: s.stage, count: s.count, conversion: s.conversionFromPrevious }))
      }
    };
  }

  /**
   * Helper to fetch raw database
   */
  public getDatabase(): GoogleSheetsDatabase {
    return this.db;
  }

  /**
   * Dynamically evaluates and returns live Google Sheets Dashboard formulas
   */
  public getDashboardFormulas(): DashboardMetricFormula[] {
    const rev = this.getMonthlyRevenue();
    const hot = this.getHotBuyersWaiting();
    const activeListings = this.db.seller_listings.filter(l => l.listing_status === 'Active').length;
    const connectionsCount = this.db.connections.length;
    const salesCount = this.db.transactions.length;
    const conversionRate = connectionsCount > 0 ? `${((salesCount / connectionsCount) * 100).toFixed(1)}%` : '0%';

    return [
      {
        cell: 'B2',
        metric_name: 'Total Transaction Value',
        formula: `=SUM(transactions!G2:G${this.db.transactions.length + 1})`,
        calculated_value: `K${rev.totalTransactionValue.toLocaleString()}`,
        notes: 'Sum of all completed vehicle transaction amounts in ZMW'
      },
      {
        cell: 'B3',
        metric_name: 'Total AutoAce Commission (Gross)',
        formula: `=SUM(transactions!H2:H${this.db.transactions.length + 1})`,
        calculated_value: `K${rev.grossCommission.toLocaleString()}`,
        notes: 'Total 3% brokerage fees collected on transactions'
      },
      {
        cell: 'B4',
        metric_name: 'Agent Commission Disbursed',
        formula: `=SUM(transactions!I2:I${this.db.transactions.length + 1})`,
        calculated_value: `K${rev.agentCommissionDisbursed.toLocaleString()}`,
        notes: '50% split paid out to deal-closing agents'
      },
      {
        cell: 'B5',
        metric_name: 'AutoAce Net Revenue',
        formula: '=B3 - B4',
        calculated_value: `K${rev.netRevenue.toLocaleString()}`,
        notes: 'Retained brokerage revenue after agent incentives'
      },
      {
        cell: 'B6',
        metric_name: 'Total Active Listings',
        formula: `=COUNTIF(seller_listings!L2:L${this.db.seller_listings.length + 1}, "Active")`,
        calculated_value: activeListings,
        notes: 'Listings ready for buyers in Zambian car yards'
      },
      {
        cell: 'B7',
        metric_name: 'Hot Unassigned Leads',
        formula: `=COUNTIFS(buyers!L2:L${this.db.buyers.length + 1}, "Hot", buyers!M2:M${this.db.buyers.length + 1}, "")`,
        calculated_value: hot.unassignedHotBuyers.length,
        notes: 'CRITICAL: High intent buyers waiting without an assigned agent'
      },
      {
        cell: 'B8',
        metric_name: 'Connection-to-Sale Conversion Rate',
        formula: `=COUNTIF(connections!H2:H${this.db.connections.length + 1}, TRUE)/COUNTA(connections!A2:A${this.db.connections.length + 1})`,
        calculated_value: conversionRate,
        notes: `${salesCount} completed sales out of ${connectionsCount} facilitated connections`
      },
      {
        cell: 'B9',
        metric_name: 'Average Vehicle Deal Size',
        formula: `=AVERAGE(transactions!G2:G${this.db.transactions.length + 1})`,
        calculated_value: `K${rev.averageDealSize.toLocaleString()}`,
        notes: 'Mean vehicle transaction size across Zambia'
      }
    ];
  }

  /**
   * Generates synchronized StatMetric items for the main Dashboard
   * directly derived from the spreadsheet database.
   */
  public getDashboardStatMetrics(): StatMetric[] {
    const rev = this.getMonthlyRevenue();
    const buyersCount = this.db.buyers.length;
    const connectionsCount = this.db.connections.length;
    const dealsCount = this.db.transactions.length;

    return [
      {
        id: '1',
        title: 'Buyer Requests',
        value: buyersCount,
        change: 'Target: 30 / month',
        isPrimary: true,
        trend: 'up'
      },
      {
        id: '2',
        title: 'Qualified Connections',
        value: connectionsCount,
        change: 'Target: 25 / month',
        trend: 'up'
      },
      {
        id: '3',
        title: 'Closed Deals',
        value: dealsCount,
        change: 'Target: 12 / month',
        trend: 'up'
      },
      {
        id: '4',
        title: 'AutoAce Net Revenue',
        value: `K${rev.netRevenue.toLocaleString()}`,
        change: `Gross Commission: K${rev.grossCommission.toLocaleString()}`,
        trend: 'up'
      }
    ];
  }

  /**
   * Generates synchronized Funnel Conversion rate directly from Google Sheets connections & sales
   */
  public getFunnelConversionPercentage(): {
    percentage: string;
    numericRate: number;
    formula: string;
    closedDeals: number;
    totalConnections: number;
  } {
    const connectionsCount = this.db.connections.length;
    const dealsCount = this.db.transactions.length;
    const rate = connectionsCount > 0 ? (dealsCount / connectionsCount) * 100 : 0;
    
    return {
      percentage: `${rate.toFixed(1)}%`,
      numericRate: rate,
      formula: '=COUNTIF(connections!H2:H, TRUE)/COUNTA(connections!A2:A)',
      closedDeals: dealsCount,
      totalConnections: connectionsCount
    };
  }

  /**
   * Maps current buyer database records into ProjectItem format for the dashboard list
   */
  public getDashboardProjects(): ProjectItem[] {
    return this.db.buyers.slice(0, 12).map((buyer) => {
      let category = 'Matching Supply';
      if (buyer.request_status === 'Purchased') category = 'Deal Closed';
      else if (buyer.request_status === 'Connected') category = 'Inspection';
      else if (buyer.request_status === 'New') category = 'New Inquiry';
      else if (buyer.request_status === 'Contacted') category = 'Contacted';
      else if (buyer.request_status === 'Qualified') category = 'Matching Supply';

      let iconBg = 'bg-blue-100';
      let iconColor = 'text-blue-600';
      if (buyer.request_status === 'Purchased') {
        iconBg = 'bg-emerald-100';
        iconColor = 'text-emerald-600';
      } else if (buyer.lead_temperature === 'Hot') {
        iconBg = 'bg-rose-100';
        iconColor = 'text-rose-600';
      }

      const assignedAgent = buyer.assigned_agent_id 
        ? (this.db.agents.find(a => a.agent_id === buyer.assigned_agent_id)?.agent_name || buyer.assigned_agent_id)
        : 'Unassigned';

      return {
        id: buyer.buyer_id,
        title: `${buyer.preferred_make} ${buyer.preferred_model}`,
        dueDate: `K${(buyer.budget / 1000).toFixed(0)}k • ${buyer.city}`,
        category,
        iconBg,
        iconColor,
        status: buyer.request_status === 'Purchased' ? 'Completed' : 'In Progress',
        buyerName: buyer.name,
        contact: buyer.phone,
        budget: `K${buyer.budget.toLocaleString()}`,
        assignedAgent,
        priority: buyer.lead_temperature === 'Hot' ? 'High' : buyer.lead_temperature === 'Medium' ? 'Medium' : 'Low'
      };
    });
  }

  /**
   * Mutates local DAL store when a buyer lead is created, keeping sheets database in sync
   */
  public addBuyer(newBuyer: {
    name: string;
    phone: string;
    city: string;
    budget: number;
    preferred_make: string;
    preferred_model: string;
    preferred_year?: number;
    lead_temperature?: 'Hot' | 'Medium' | 'Cold';
    assigned_agent_id?: string;
  }): BuyerRecord {
    const nextId = `B${String(this.db.buyers.length + 1).padStart(3, '0')}`;
    const record: BuyerRecord = {
      buyer_id: nextId,
      name: newBuyer.name,
      phone: newBuyer.phone,
      city: newBuyer.city || 'Lusaka',
      budget: newBuyer.budget || 150000,
      preferred_make: newBuyer.preferred_make || 'Toyota',
      preferred_model: newBuyer.preferred_model || 'Corolla',
      preferred_year: newBuyer.preferred_year || 2015,
      transmission: 'Automatic',
      fuel: 'Petrol',
      request_status: 'New',
      lead_temperature: newBuyer.lead_temperature || 'Hot',
      assigned_agent_id: newBuyer.assigned_agent_id || '',
      created_at: new Date().toISOString()
    };

    this.db.buyers = [record, ...this.db.buyers];
    this.notify();
    return record;
  }

  /**
   * Updates buyer request status in the DAL and automatically creates transaction if deal closed
   */
  public updateBuyerStatus(buyerId: string, status: BuyerRequestStatus): void {
    this.db.buyers = this.db.buyers.map((b) =>
      b.buyer_id === buyerId ? { ...b, request_status: status } : b
    );

    if (status === 'Purchased') {
      const buyer = this.db.buyers.find(b => b.buyer_id === buyerId);
      if (buyer && !this.db.transactions.some(t => t.buyer_id === buyerId)) {
        const saleValue = buyer.budget;
        const grossComm = Math.round(saleValue * 0.03);
        const agentComm = Math.round(grossComm * 0.5);
        const netRev = grossComm - agentComm;
        const nextTId = `T${String(this.db.transactions.length + 1).padStart(3, '0')}`;
        
        this.db.transactions = [
          {
            transaction_id: nextTId,
            buyer_id: buyerId,
            seller_id: 'S001',
            agent_id: buyer.assigned_agent_id || 'AG001',
            connection_id: `C${String(this.db.connections.length + 1).padStart(3, '0')}`,
            vehicle: `${buyer.preferred_year} ${buyer.preferred_make} ${buyer.preferred_model}`,
            sale_value: saleValue,
            autoace_commission: grossComm,
            agent_commission: agentComm,
            autoace_net_revenue: netRev,
            transaction_status: 'Completed',
            sale_date: new Date().toISOString().split('T')[0]
          },
          ...this.db.transactions
        ];
      }
    }

    this.notify();
  }

  /**
   * Helper to generate CSV export for any sheet
   */
  public exportSheetToCsv(sheetName: keyof typeof autoAceDatabase): string {
    const rows = this.db[sheetName];
    if (!Array.isArray(rows) || rows.length === 0) return '';
    const headers = Object.keys(rows[0]);
    const csvLines = [headers.join(',')];

    (rows as any[]).forEach((row: Record<string, any>) => {
      const values = headers.map((header) => {
        const val = row[header];
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val ?? '';
      });
      csvLines.push(values.join(','));
    });

    return csvLines.join('\n');
  }
}

export const autoAceDAL = new AutoAceDataAccessLayer();
