import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Flame, 
  Phone, 
  Mail, 
  Bot, 
  ArrowUpRight, 
  Clock, 
  Filter,
  DollarSign
} from 'lucide-react';
import { LeadItem, LeadStatus, LeadType } from '../../types';

interface LeadCenterViewProps {
  leads: LeadItem[];
  onAddLead: (lead: Omit<LeadItem, 'id'>) => void;
  onDraftFollowUp: (lead: LeadItem) => void;
}

export const LeadCenterView: React.FC<LeadCenterViewProps> = ({
  leads,
  onAddLead,
  onDraftFollowUp
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add lead form states
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newType, setNewType] = useState<LeadType>('BUYER');
  const [newStatus, setNewStatus] = useState<LeadStatus>('HOT');
  const [newInterest, setNewInterest] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.vehicleInterest.toLowerCase().includes(search.toLowerCase()) ||
      lead.notes.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || lead.status === selectedStatus;
    const matchesType = selectedType === 'ALL' || lead.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddLead({
      name: newName,
      contact: newContact || 'Contact pending',
      type: newType,
      status: newStatus,
      vehicleInterest: newInterest || 'Vehicle spec pending',
      budgetOrTarget: newBudget || '$40k-$60k',
      notes: newNotes || 'Added via Lead Center',
      lastContacted: 'Just now',
      intentScore: newStatus === 'HOT' ? 90 : newStatus === 'MEDIUM' ? 65 : 40
    });
    setIsAddModalOpen(false);
    setNewName('');
    setNewContact('');
    setNewInterest('');
    setNewBudget('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2D5CF6]" />
            <span className="text-[11px] font-extrabold text-[#2D5CF6] uppercase tracking-wider">
              Inbound & VIP Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1F] tracking-tight mt-1">
            LEAD CENTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Pre-qualified automotive buyers, high-equity private sellers, agents, and importers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2D5CF6] hover:bg-[#2045cb] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lead name, vehicle, or notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#2D5CF6] outline-none text-xs text-[#1A1A1F] bg-gray-50/50"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-bold text-gray-400 mr-1">Status:</span>
          {['ALL', 'HOT', 'MEDIUM', 'COLD'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === status
                  ? 'bg-[#1A1A1F] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Type Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-bold text-gray-400 mr-1">Type:</span>
          {['ALL', 'BUYER', 'SELLER', 'AGENT', 'IMPORT'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                selectedType === type
                  ? 'bg-[#2D5CF6] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeads.map((lead) => {
          const isHot = lead.status === 'HOT';
          return (
            <div
              key={lead.id}
              className={`bg-white p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isHot ? 'border-rose-200 shadow-xs' : 'border-gray-200/80 shadow-2xs'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-extrabold text-base text-[#1A1A1F]">
                      {lead.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {lead.contact}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      lead.status === 'HOT'
                        ? 'bg-rose-100 text-rose-700'
                        : lead.status === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2D5CF6] uppercase">
                      {lead.type}
                    </span>
                  </div>
                </div>

                {/* Intent Score Indicator */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                    <span>Intent Strength</span>
                    <span className={lead.intentScore >= 80 ? 'text-rose-600' : 'text-gray-600'}>
                      {lead.intentScore}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        lead.intentScore >= 80
                          ? 'bg-rose-500'
                          : lead.intentScore >= 60
                          ? 'bg-amber-500'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${lead.intentScore}%` }}
                    />
                  </div>
                </div>

                {/* Vehicle Interest & Budget */}
                <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-gray-100 mb-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1A1A1F]">
                      {lead.vehicleInterest}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#2D5CF6]">
                    Budget / Target: {lead.budgetOrTarget}
                  </p>
                </div>

                {/* Operational Notes */}
                <p className="text-xs text-gray-600 leading-relaxed bg-white p-2 rounded-xl border border-dashed border-gray-200">
                  {lead.notes}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Contacted {lead.lastContacted}
                </span>

                <button
                  onClick={() => onDraftFollowUp(lead)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1A1F] hover:bg-[#2D5CF6] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-[#C8F169]" />
                  <span>Draft with JARVIS</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <h2 className="text-lg font-black text-[#1A1A1F] mb-1">
              Add New Lead to Pipeline
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Enter vehicle request, budget, and contact info.
            </p>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Lead Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Brandon Chase"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as LeadType)}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6] bg-white"
                  >
                    <option value="BUYER">BUYER</option>
                    <option value="SELLER">SELLER</option>
                    <option value="AGENT">AGENT</option>
                    <option value="IMPORT">IMPORT</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6] bg-white"
                  >
                    <option value="HOT">HOT</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="COLD">COLD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Contact Info</label>
                <input
                  type="text"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="+1 (555) 000-0000 or email"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Vehicle Interest</label>
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="e.g. 2021 BMW M340i xDrive under 40k miles"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Budget / Target Price</label>
                <input
                  type="text"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="e.g. $45,000 cash pre-approved"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Operational Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Specific requirements, trade-in details, financing status..."
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2D5CF6] text-white font-bold hover:bg-[#2045cb] cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
