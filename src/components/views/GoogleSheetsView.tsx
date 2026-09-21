import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Search, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { autoAceDatabase, README_SCHEMA_DOC } from '../../data/sheets';
import { autoAceDAL } from '../../services/dataAccessLayer';
import { GoogleSheetsConnectionBar } from '../GoogleSheetsConnectionBar';

type SheetTab = 
  | 'dashboard'
  | 'schema'
  | 'business'
  | 'kpis'
  | 'buyers'
  | 'seller_listings'
  | 'sellers'
  | 'agents'
  | 'connections'
  | 'transactions'
  | 'content'
  | 'tasks'
  | 'business_events'
  | 'jarvis_queries';

export const GoogleSheetsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'tables' | 'jarvis' | 'schema'>('tables');
  const [activeTable, setActiveTable] = useState<SheetTab>('buyers');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedJarvisQuery, setSelectedJarvisQuery] = useState<string>('hot_buyers');
  const [db, setDb] = useState(autoAceDAL.getDatabase());

  useEffect(() => {
    return autoAceDAL.subscribe(() => {
      setDb({ ...autoAceDAL.getDatabase() });
    });
  }, []);

  const relationalTables: Array<{ id: SheetTab; label: string; count: number }> = [
    { id: 'buyers', label: 'Buyers', count: db.buyers.length },
    { id: 'seller_listings', label: 'Listings', count: db.seller_listings.length },
    { id: 'sellers', label: 'Sellers', count: db.sellers.length },
    { id: 'agents', label: 'Agents', count: db.agents.length },
    { id: 'connections', label: 'Connections', count: db.connections.length },
    { id: 'transactions', label: 'Transactions', count: db.transactions.length },
    { id: 'content', label: 'Content', count: db.content.length },
    { id: 'tasks', label: 'Tasks', count: db.tasks.length },
    { id: 'kpis', label: 'KPIs', count: db.kpis.length },
    { id: 'business', label: 'Business', count: db.business.length },
    { id: 'business_events', label: 'Events', count: db.business_events.length },
  ];

  const currentTab = activeSection === 'dashboard' ? 'dashboard' : activeSection === 'schema' ? 'schema' : activeSection === 'jarvis' ? 'jarvis_queries' : activeTable;

  // Helper to copy current sheet to CSV
  const handleCopyCsv = () => {
    if (activeSection === 'schema' || activeSection === 'jarvis') return;
    const csv = activeSection === 'dashboard' 
      ? 'Cell,Metric,Formula,Calculated Value,Notes\n' + db.dashboard_formulas.map(f => `"${f.cell}","${f.metric_name}","${f.formula}","${f.calculated_value}","${f.notes}"`).join('\n')
      : autoAceDAL.exportSheetToCsv(activeTable as keyof typeof autoAceDatabase);
    
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    if (activeSection === 'schema' || activeSection === 'jarvis') return;
    const csv = activeSection === 'dashboard'
      ? 'Cell,Metric,Formula,Calculated Value,Notes\n' + db.dashboard_formulas.map(f => `"${f.cell}","${f.metric_name}","${f.formula}","${f.calculated_value}","${f.notes}"`).join('\n')
      : autoAceDAL.exportSheetToCsv(activeTable as keyof typeof autoAceDatabase);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `autoace_${currentTab}_sheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Jarvis Analytical Answers
  const hotBuyersData = autoAceDAL.getHotBuyersWaiting();
  const unassignedBuyersData = autoAceDAL.getUnassignedBuyers();
  const nonConvertingListings = autoAceDAL.getListingsWithInterestNotConverting();
  const contentDemand = autoAceDAL.getContentGeneratingDemand();
  const monthlyRevenue = autoAceDAL.getMonthlyRevenue();
  const agentPerformance = autoAceDAL.getAgentsWithUnresolvedLeads();
  const funnelLeak = autoAceDAL.getFunnelLeakAnalysis();

  return (
    <div className="space-y-6" id="google-sheets-database-view">
      {/* Top Header matching AutoAce design system */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1F] tracking-tight">
            Data Sync
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            11 relational operational tables, dynamic formula cells & Jarvis reasoning data layer
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyCsv}
            disabled={activeSection === 'schema' || activeSection === 'jarvis'}
            className="px-4 py-2 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-[#1A1A1F] transition-all shadow-2xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer active:scale-98"
            title="Copy current table to CSV"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
            <span>{copied ? 'Copied CSV!' : 'Copy CSV'}</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            disabled={activeSection === 'schema' || activeSection === 'jarvis'}
            className="px-4 py-2 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-xs font-bold text-white transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Google Sheets / Data Connection Section */}
      <GoogleSheetsConnectionBar />

      {/* Primary Section Switcher Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-gray-100 shadow-2xs overflow-x-auto">
          <button
            onClick={() => setActiveSection('tables')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'tables'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1A1A1F] hover:bg-gray-50'
            }`}
          >
            <span>Relational Tables</span>
            <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
              activeSection === 'tables' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              11
            </span>
          </button>

          <button
            onClick={() => setActiveSection('dashboard')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'dashboard'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1A1A1F] hover:bg-gray-50'
            }`}
          >
            Metrics Summary
          </button>

          <button
            onClick={() => setActiveSection('jarvis')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'jarvis'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1A1A1F] hover:bg-gray-50'
            }`}
          >
            Jarvis Reasoning Tests
          </button>

          <button
            onClick={() => setActiveSection('schema')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'schema'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1A1A1F] hover:bg-gray-50'
            }`}
          >
            Database Schema
          </button>
        </div>

        {/* Sub-selector for Relational Tables */}
        {activeSection === 'tables' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium hidden md:inline">Table:</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {relationalTables.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTable(t.id);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeTable === t.id
                      ? 'bg-[#1A1A1F] text-white shadow-2xs font-bold'
                      : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-300 hover:text-gray-900'
                  }`}
                >
                  {t.label} <span className="opacity-60 text-[10px]">({t.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Sheet / Card Content */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden">
        {/* Search & Filter Bar (Shown on Tables) */}
        {activeSection === 'tables' && (
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/40">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${activeTable} table by any field...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="font-mono bg-blue-50 text-[#1E3A8A] font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                Table: {activeTable}
              </span>
              <span>•</span>
              <span className="text-gray-500 text-xs">
                Relational foreign key linkages mapped
              </span>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Metrics Summary */}
        {activeSection === 'dashboard' && (
          <div className="p-6 sm:p-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#1E3A8A] text-white shadow-xs">
                <div className="text-xs font-semibold text-white/80">AutoAce Net Revenue</div>
                <div className="text-3xl font-extrabold tracking-tight mt-1">K31,800</div>
                <div className="text-[11px] font-medium text-blue-100 mt-2 bg-white/10 px-2 py-0.5 rounded w-fit">
                  50% Net Profit Split
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                <div className="text-xs font-semibold text-gray-400">Gross Commission</div>
                <div className="text-3xl font-extrabold text-[#1A1A1F] tracking-tight mt-1">K63,600</div>
                <div className="text-[11px] font-medium text-gray-600 mt-2 bg-gray-50 px-2 py-0.5 rounded w-fit border border-gray-100">
                  3% Fee on Closed Deals
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                <div className="text-xs font-semibold text-gray-400">Hot Priority Leads</div>
                <div className="text-3xl font-extrabold text-[#1A1A1F] tracking-tight mt-1">2 Leads</div>
                <div className="text-[11px] font-medium text-amber-700 mt-2 bg-amber-50 px-2 py-0.5 rounded w-fit border border-amber-100">
                  Urgent Matching Required
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                <div className="text-xs font-semibold text-gray-400">Connection Conversion</div>
                <div className="text-3xl font-extrabold text-[#1A1A1F] tracking-tight mt-1">33.3%</div>
                <div className="text-[11px] font-medium text-blue-700 mt-2 bg-blue-50 px-2 py-0.5 rounded w-fit border border-blue-100">
                  10 Deals of 30 Connections
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#1A1A1F]">
                  Executive Operational Metrics
                </h3>
                <span className="text-xs text-gray-400">AutoAce performance indicators</span>
              </div>
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/70 text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4">Metric Name</th>
                      <th className="py-3 px-4">Current Value</th>
                      <th className="py-3 px-4">Calculation Method</th>
                      <th className="py-3 px-4">Operational Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {autoAceDatabase.dashboard_formulas.map((row) => {
                      let readableCalculation = row.notes;
                      if (row.metric_name.includes('GMV') || row.metric_name.includes('Gross Merchandise')) {
                        readableCalculation = 'Sum of all completed vehicle transaction values';
                      } else if (row.metric_name.includes('Gross Commission')) {
                        readableCalculation = '3% broker fee calculated on closed sales';
                      } else if (row.metric_name.includes('Partner Payout')) {
                        readableCalculation = '50% broker split distributed to partner agent yards';
                      } else if (row.metric_name.includes('Net Revenue')) {
                        readableCalculation = 'Gross Commission minus Partner Payouts and Costs';
                      } else if (row.metric_name.includes('Active Inventory')) {
                        readableCalculation = 'Count of active verified vehicle listings in network';
                      } else if (row.metric_name.includes('Hot Unassigned')) {
                        readableCalculation = 'Inquiries flagged as Hot requiring immediate dealer assignment';
                      } else if (row.metric_name.includes('Conversion')) {
                        readableCalculation = 'Closed vehicle deals divided by total connections';
                      }

                      return (
                        <tr key={row.cell} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-900">{row.metric_name}</td>
                          <td className="py-3 px-4 font-bold text-[#1E3A8A]">{row.calculated_value}</td>
                          <td className="py-3 px-4 text-gray-600">{readableCalculation}</td>
                          <td className="py-3 px-4 text-gray-500">{row.notes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: README & Schema */}
        {activeSection === 'schema' && (
          <div className="p-6 sm:p-7 space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
              <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">PostgreSQL & Supabase Ready Relational Architecture</p>
                <p className="mt-1 text-blue-800">
                  Every sheet maps 1:1 to a database table with strong ID types (`B001`, `S001`, `L001`, `AG001`, `C001`, `T001`). Schema definitions with foreign keys and indexes have been generated in <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">src/db/schema.sql</code>.
                </p>
              </div>
            </div>

            <div className="bg-gray-900 text-gray-100 p-5 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre">
              {README_SCHEMA_DOC.trim()}
            </div>
          </div>
        )}

        {/* TAB CONTENT: Jarvis Data Layer Tests */}
        {activeSection === 'jarvis' && (
          <div className="p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#1A1A1F] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
                  <span>Jarvis Business Reasoning Engine</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Analytical evaluation queries run by Jarvis over the Google Sheets DAL to isolate bottlenecks and high-intent buyers.
                </p>
              </div>

              {/* Query Pill Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'hot_buyers', label: 'Hot Buyers' },
                  { id: 'listings_not_converting', label: 'Stalled Listings' },
                  { id: 'content_demand', label: 'Content Drivers' },
                  { id: 'monthly_revenue', label: 'Revenue Model' },
                  { id: 'unresolved_agents', label: 'Agent Workload' },
                  { id: 'funnel_leak', label: 'Funnel Leaks' }
                ].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedJarvisQuery(q.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedJarvisQuery === q.id
                        ? 'bg-[#1E3A8A] text-white font-bold shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Jarvis Query Results */}
            <div className="p-5 sm:p-6 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-4">
              {selectedJarvisQuery === 'hot_buyers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1F]">Query: "How many hot buyers are currently waiting?"</h4>
                      <p className="text-xs text-gray-500">Filter criteria: `lead_temperature = 'Hot'` and status not in ('Purchased', 'Lost')</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                      {hotBuyersData.count} Hot Buyers Waiting
                    </span>
                  </div>

                  {hotBuyersData.unassignedHotBuyers.length > 0 && (
                    <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>CRITICAL BOTTLENECK: {hotBuyersData.unassignedHotBuyers.length} Hot Leads Have No Assigned Agent!</span>
                      </div>
                      <div className="mt-3 space-y-2 text-xs text-rose-900">
                        {hotBuyersData.unassignedHotBuyers.map(b => (
                          <div key={b.buyer_id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl border border-rose-100 gap-2">
                            <span className="font-bold text-gray-900">{b.buyer_id}: {b.name} ({b.city})</span>
                            <span className="font-mono text-gray-600">Budget: K{b.budget.toLocaleString()} • Seeking: {b.preferred_make} {b.preferred_model}</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] w-fit">UNASSIGNED</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-700">In-flight Hot Buyers in Pipeline:</div>
                    {hotBuyersData.inFlightHotBuyers.map(b => (
                      <div key={b.buyer_id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-2xs text-xs gap-2">
                        <span className="font-bold text-[#1A1A1F]">{b.buyer_id} • {b.name}</span>
                        <span className="text-gray-500">{b.preferred_make} {b.preferred_model} ({b.city})</span>
                        <span className="font-mono font-bold text-gray-900">K{b.budget.toLocaleString()}</span>
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-semibold text-[11px] w-fit">{b.request_status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJarvisQuery === 'listings_not_converting' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1F]">Query: "Which listings are getting interest but not converting?"</h4>
                    <p className="text-xs text-gray-500">Cross-references connections vs completed sales (connections ≥ 2 with 0 sales)</p>
                  </div>

                  <div className="space-y-2.5">
                    {nonConvertingListings.map(item => (
                      <div key={item.listing.listing_id} className="p-4 bg-white border border-gray-100 shadow-2xs rounded-2xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{item.listing.listing_id}: {item.listing.vehicle}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                            {item.connectionCount} Connections • 0 Sales
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <span>Seller: {item.sellerName} ({item.listing.location})</span>
                          <span className="font-mono font-bold text-gray-900">Asking: K{item.listing.price.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                          <span className="text-rose-700 font-semibold">Diagnosed Cause: {item.probableCause}</span>
                          <span className="text-gray-400 font-mono">Potential Revenue Stalled: K{item.potentialRevenueLost.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJarvisQuery === 'content_demand' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1F]">Query: "Which content actually generated buyer demand?"</h4>
                    <p className="text-xs text-gray-500">Contrasting high-vanity content against authentic demand drivers</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3">
                      <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span>Top Real Demand Generators (High Buyer Inflow)</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        {contentDemand.topDemandDrivers.slice(0, 4).map(c => (
                          <div key={c.content_id} className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900">{c.content_id} ({c.platform})</span>
                              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[11px]">
                                {c.buyer_requests} Requests • {c.resulting_sales} Sales
                              </span>
                            </div>
                            <p className="text-gray-600 truncate">{c.topic}</p>
                            <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                              <span>Views: {c.views.toLocaleString()}</span>
                              <span>Inquiries: {c.inquiries}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-3">
                      <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Vanity Content (High Views, Zero Business Value)</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        {contentDemand.vanityContentZeroDemand.map(c => (
                          <div key={c.content_id} className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900">{c.content_id} ({c.platform})</span>
                              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-bold text-[11px]">0 Requests</span>
                            </div>
                            <p className="text-gray-600 truncate">{c.topic}</p>
                            <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                              <span>Views: {c.views.toLocaleString()}</span>
                              <span className="text-rose-600 font-semibold">Sales: 0</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedJarvisQuery === 'monthly_revenue' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1F]">Query: "How much revenue did AutoAce generate this month?"</h4>
                      <p className="text-xs text-gray-500">Evaluated over 10 closed transactions</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-700 font-mono bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Net: K{monthlyRevenue.netRevenue.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-2xs">
                      <div className="text-gray-400 font-medium">Gross Sales Value</div>
                      <div className="text-base font-extrabold text-[#1A1A1F] mt-1">K{monthlyRevenue.totalTransactionValue.toLocaleString()}</div>
                    </div>
                    <div className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-2xs">
                      <div className="text-gray-400 font-medium">AutoAce Commission (3%)</div>
                      <div className="text-base font-extrabold text-[#1E3A8A] mt-1">K{monthlyRevenue.grossCommission.toLocaleString()}</div>
                    </div>
                    <div className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-2xs">
                      <div className="text-gray-400 font-medium">Agent Splits (50%)</div>
                      <div className="text-base font-extrabold text-gray-700 mt-1">K{monthlyRevenue.agentCommissionDisbursed.toLocaleString()}</div>
                    </div>
                    <div className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-2xs">
                      <div className="text-gray-400 font-medium">Average Deal Size</div>
                      <div className="text-base font-extrabold text-[#1A1A1F] mt-1">K{monthlyRevenue.averageDealSize.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedJarvisQuery === 'unresolved_agents' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1F]">Query: "Which agents have unresolved leads?"</h4>
                    <p className="text-xs text-gray-500">Assessing agent lead velocity and dormant buyer requests</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    {agentPerformance.map(a => (
                      <div key={a.agent.agent_id} className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-gray-900">{a.agent.agent_name} ({a.agent.city})</div>
                          <div className="text-gray-500 text-[11px] mt-0.5">
                            Active Leads: {a.activeLeadsAssigned} • Closed Deals: {a.agent.completed_deals} • Pending Tasks: {a.pendingTasksCount}
                          </div>
                          {a.staleBuyerNames.length > 0 && (
                            <div className="text-rose-600 text-[11px] font-semibold mt-1">
                              ⚠️ Stale Inquiries: {a.staleBuyerNames.join(', ')}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            a.staleLeadsCount > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {a.staleLeadsCount > 0 ? `${a.staleLeadsCount} Stale Leads` : 'Optimal'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJarvisQuery === 'funnel_leak' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1F]">Query: "Where is the biggest leak in the funnel?"</h4>
                    <p className="text-xs text-gray-500">Full pipeline drop-off analysis</p>
                  </div>

                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
                    <div className="text-xs font-bold text-amber-900">{funnelLeak.primaryLeakPoint}</div>
                    <div className="text-xs text-amber-800 mt-1">{funnelLeak.recommendedAction}</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {funnelLeak.stages.map((st, i) => (
                      <div key={i} className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-2xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-900">{st.stage}</div>
                          <div className="text-gray-500 text-[11px] mt-0.5">{st.leakNote}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-900 text-sm">{st.count}</span>
                          <div className="text-[11px] text-[#1E3A8A] font-bold">{st.conversionFromPrevious}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: Raw Relational Spreadsheet Tables */}
        {activeSection === 'tables' && (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            {renderGenericSheetTable(activeTable, searchQuery, (db as any)[activeTable])}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Generic renderer for each of the 11 database sheets
 */
function renderGenericSheetTable(tab: SheetTab, search: string, tableData?: any[]) {
  const data = tableData || autoAceDatabase[tab as keyof typeof autoAceDatabase];
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="p-12 text-center text-sm text-gray-400">No records found in this table.</div>;
  }

  const headers = Object.keys(data[0]);

  const filtered = data.filter((row: Record<string, any>) => {
    if (!search) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <table className="w-full text-left text-xs">
      <thead className="bg-gray-50/80 sticky top-0 z-10 border-b border-gray-100 text-gray-500 font-semibold">
        <tr>
          <th className="py-3 px-3.5 w-10 text-gray-400 font-mono text-[11px]">#</th>
          {headers.map(header => (
            <th key={header} className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px] tracking-tight">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100/70">
        {filtered.map((row: Record<string, any>, idx: number) => (
          <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
            <td className="py-2.5 px-3.5 text-gray-400 font-mono text-[11px] bg-gray-50/30">{idx + 1}</td>
            {headers.map(header => {
              const val = row[header];
              const isId = header.endsWith('_id');
              const isStatus = header.includes('status') || header === 'lead_temperature';
              const isMoney = header.includes('budget') || header.includes('price') || header.includes('revenue') || header.includes('commission') || header.includes('sale_value');

              return (
                <td key={header} className="py-2.5 px-3.5 whitespace-nowrap">
                  {isId ? (
                    <span className="font-mono font-semibold text-[#1E3A8A] bg-blue-50/70 border border-blue-100/60 px-2 py-0.5 rounded-md">
                      {String(val || '—')}
                    </span>
                  ) : isStatus ? (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      val === 'Hot' || val === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      val === 'Purchased' || val === 'Closed' || val === 'Completed' || val === 'Verified' || val === 'On Track' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      val === 'Needs Attention' || val === 'Under Inspection' || val === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {String(val)}
                    </span>
                  ) : isMoney && typeof val === 'number' ? (
                    <span className="font-mono font-bold text-[#1A1A1F]">
                      K{val.toLocaleString()}
                    </span>
                  ) : typeof val === 'boolean' ? (
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${val ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                      {val ? 'TRUE' : 'FALSE'}
                    </span>
                  ) : (
                    <span className="text-gray-700">{String(val ?? '—')}</span>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
