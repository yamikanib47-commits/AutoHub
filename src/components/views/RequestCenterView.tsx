import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  Search, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Clock, 
  DollarSign, 
  Car
} from 'lucide-react';
import { VehicleRequest, RequestType } from '../../types';

interface RequestCenterViewProps {
  requests: VehicleRequest[];
  onAddRequest: (req: Omit<VehicleRequest, 'id'>) => void;
  onAskJarvis: (prompt: string) => void;
}

export const RequestCenterView: React.FC<RequestCenterViewProps> = ({
  requests,
  onAddRequest,
  onAskJarvis
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'BUYER' | 'SELLER' | 'MATCHES'>('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newType, setNewType] = useState<RequestType>('BUYER');
  const [newClient, setNewClient] = useState('');
  const [newSpec, setNewSpec] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newTimeline, setNewTimeline] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const buyerRequests = requests.filter((r) => r.type === 'BUYER');
  const sellerRequests = requests.filter((r) => r.type === 'SELLER');
  const matchedRequests = requests.filter((r) => r.status === 'Matched');

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = 
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicleSpec.toLowerCase().includes(search.toLowerCase()) ||
      r.notes.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'BUYER') return matchesSearch && r.type === 'BUYER';
    if (activeTab === 'SELLER') return matchesSearch && r.type === 'SELLER';
    if (activeTab === 'MATCHES') return matchesSearch && r.status === 'Matched';
    return matchesSearch;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim()) return;

    onAddRequest({
      type: newType,
      clientName: newClient,
      vehicleSpec: newSpec || 'Vehicle specification',
      budgetOrAsking: newAmount || '$40,000',
      timeline: newTimeline || 'Immediate',
      status: 'Open',
      notes: newNotes || 'Logged in Request Center',
      createdAt: 'Just now'
    });

    setIsModalOpen(false);
    setNewClient('');
    setNewSpec('');
    setNewAmount('');
    setNewTimeline('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-[#2D5CF6]" />
            <span className="text-[11px] font-extrabold text-[#2D5CF6] uppercase tracking-wider">
              Vehicle Sourcing & Consignment Matrix
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1F] tracking-tight mt-1">
            REQUEST CENTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Active buyer vehicle wishlists and private seller inventory with real-time match detection.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2D5CF6] hover:bg-[#2045cb] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Request</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'ALL', label: `All Requests (${requests.length})` },
            { id: 'BUYER', label: `Buyers (${buyerRequests.length})` },
            { id: 'SELLER', label: `Sellers (${sellerRequests.length})` },
            { id: 'MATCHES', label: `Live Matches (${matchedRequests.length})`, highlight: true }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1A1A1F] text-white shadow-xs'
                  : tab.highlight
                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-extrabold'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spec, client, or terms..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-gray-200 focus:border-[#2D5CF6] outline-none text-xs text-[#1A1A1F] bg-gray-50/50"
          />
        </div>
      </div>

      {/* Live Match Callout Card */}
      {matchedRequests.length > 0 && activeTab !== 'BUYER' && activeTab !== 'SELLER' && (
        <div className="bg-[#1A1A1F] text-white p-6 rounded-3xl border border-gray-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-[#2D5CF6] text-white">
                <Sparkles className="w-4 h-4 text-[#C8F169]" />
              </span>
              <span className="font-extrabold text-sm text-white">
                Algorithmic Match Discovered
              </span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#C8F169] text-[#1A1A1F]">
              +$3,200 Commission Spread
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Buyer Request</p>
              <h4 className="font-bold text-sm text-white mt-1">Marcus Vance</h4>
              <p className="text-gray-300 mt-0.5">2021 BMW M340i xDrive, under 38k mi, Adaptive Suspension</p>
              <p className="text-[#C8F169] font-bold mt-2">Budget: $45,000 cash ready</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Seller Consignment</p>
              <h4 className="font-bold text-sm text-white mt-1">Derrick Hall</h4>
              <p className="text-gray-300 mt-0.5">2021 BMW M340i xDrive, 32,400 mi, clean Carfax, Austin BMW</p>
              <p className="text-[#C8F169] font-bold mt-2">Seller Net: $41,800</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-gray-400">Next Action: Review DME scan before preparing closing escrow package.</span>
            <button
              onClick={() => onAskJarvis('Draft the complete buyer & seller closing terms for Marcus Vance ($45k) and Derrick Hall ($41.8k) M340i match')}
              className="px-4 py-2 rounded-xl bg-[#2D5CF6] hover:bg-[#2048d4] text-white font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-[#C8F169]" />
              <span>Draft Deal Contract with JARVIS</span>
            </button>
          </div>
        </div>
      )}

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => {
          const isBuyer = req.type === 'BUYER';
          const isMatched = req.status === 'Matched';
          return (
            <div
              key={req.id}
              className={`bg-white p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isMatched ? 'border-blue-300 shadow-xs' : 'border-gray-200/80 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      isBuyer ? 'bg-[#EEF2FF] text-[#2D5CF6]' : 'bg-[#F1FCE4] text-[#3b6611]'
                    }`}>
                      {req.type}
                    </span>
                    <h3 className="font-extrabold text-base text-[#1A1A1F] mt-1">
                      {req.clientName}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isMatched
                      ? 'bg-emerald-100 text-emerald-800'
                      : req.status === 'Open'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1F]">
                    <Car className="w-3.5 h-3.5 text-[#2D5CF6]" />
                    <span>{req.vehicleSpec}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-[#2D5CF6]">
                      {isBuyer ? 'Max Budget: ' : 'Asking Net: '}{req.budgetOrAsking}
                    </span>
                    <span className="text-gray-400 font-medium">
                      Timeline: {req.timeline}
                    </span>
                  </div>
                </div>

                {req.matchFound && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mb-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Matched With: {req.matchFound.title}</span>
                      <span className="text-[11px] text-emerald-700">{req.matchFound.equitySpread}</span>
                    </div>
                    <button
                      onClick={() => onAskJarvis(`Prepare closing brief for match between ${req.clientName} and ${req.matchFound?.title}`)}
                      className="text-[11px] font-bold text-[#2D5CF6] hover:underline"
                    >
                      View
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-500 leading-relaxed">
                  {req.notes}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {req.createdAt}
                </span>

                <button
                  onClick={() => onAskJarvis(`Source candidate vehicles across nationwide private market for ${req.clientName}'s request: ${req.vehicleSpec} with budget ${req.budgetOrAsking}`)}
                  className="inline-flex items-center gap-1 font-bold text-[#2D5CF6] hover:underline cursor-pointer"
                >
                  <span>Scan Inventory</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <h2 className="text-lg font-black text-[#1A1A1F] mb-1">
              Log Vehicle Request
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Add a new buyer wishlist or private seller consignment.
            </p>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Request Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as RequestType)}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6] bg-white"
                  >
                    <option value="BUYER">BUYER (Searching)</option>
                    <option value="SELLER">SELLER (Consignment)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Vehicle Specification</label>
                <input
                  type="text"
                  required
                  value={newSpec}
                  onChange={(e) => setNewSpec(e.target.value)}
                  placeholder="e.g. 2021 BMW M340i, under 40k mi, Tanzanite Blue"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Budget / Asking Price</label>
                  <input
                    type="text"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. $45,000"
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Timeline</label>
                  <input
                    type="text"
                    value={newTimeline}
                    onChange={(e) => setNewTimeline(e.target.value)}
                    placeholder="e.g. 7 days / Ready now"
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Notes & Criteria</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Condition requirements, service history expectations, trade-in..."
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2D5CF6] text-white font-bold hover:bg-[#2045cb] cursor-pointer"
                >
                  Save Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
