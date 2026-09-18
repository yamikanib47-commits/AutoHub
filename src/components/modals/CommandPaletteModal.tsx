import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Users, 
  ArrowLeftRight, 
  Lightbulb, 
  CheckSquare, 
  Bot, 
  Video, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { LeadItem, VehicleRequest, HQTask, IdeaItem, HQTab } from '../../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadItem[];
  requests: VehicleRequest[];
  tasks: HQTask[];
  ideas: IdeaItem[];
  onSelectTab: (tab: HQTab) => void;
  onAskJarvis: (prompt: string) => void;
  onOpenQuickAction: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  leads,
  requests,
  tasks,
  ideas,
  onSelectTab,
  onAskJarvis,
  onOpenQuickAction
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase()) ||
    l.vehicleInterest.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRequests = requests.filter((r) =>
    r.clientName.toLowerCase().includes(query.toLowerCase()) ||
    r.vehicleSpec.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredIdeas = ideas.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-gray-200">
        {/* Search Bar */}
        <div className="flex items-center px-5 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search leads, requests, or ask JARVIS..."
            className="w-full text-sm text-[#1A1A1F] placeholder-gray-400 bg-transparent border-none outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Commands */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Direct Quick Shortcuts */}
          <div>
            <p className="font-bold text-gray-400 uppercase tracking-wider px-2 mb-2 text-[10px]">
              Quick Actions
            </p>
            <div className="space-y-1">
              <div
                onClick={() => {
                  onClose();
                  onAskJarvis(query ? query : 'What should I do next for AutoAce right now?');
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#EEF2FF] cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#1A1A1F] text-white flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#C8F169]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1A1A1F] group-hover:text-[#2D5CF6]">
                      {query ? `Ask JARVIS: "${query}"` : 'Ask JARVIS: "What should I do next?"'}
                    </span>
                    <p className="text-[11px] text-gray-400">Launch AI operations co-pilot</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2D5CF6]" />
              </div>

              <div
                onClick={() => {
                  onClose();
                  onOpenQuickAction();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#2D5CF6] text-white flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[#1A1A1F]">Create New Record (Lead, Request, Idea, Task)</span>
                </div>
                <span className="text-[11px] text-gray-400">Modal</span>
              </div>
            </div>
          </div>

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <p className="font-bold text-gray-400 uppercase tracking-wider px-2 mb-1.5 text-[10px]">
                Leads
              </p>
              <div className="space-y-1">
                {filteredLeads.slice(0, 3).map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      onSelectTab('leads');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#2D5CF6]" />
                      <span className="font-bold text-[#1A1A1F]">{lead.name}</span>
                      <span className="text-gray-400 truncate max-w-[200px]">{lead.vehicleInterest}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Requests */}
          {filteredRequests.length > 0 && (
            <div>
              <p className="font-bold text-gray-400 uppercase tracking-wider px-2 mb-1.5 text-[10px]">
                Vehicle Sourcing Requests
              </p>
              <div className="space-y-1">
                {filteredRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    onClick={() => {
                      onSelectTab('requests');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <ArrowLeftRight className="w-4 h-4 text-[#C8F169] bg-[#1A1A1F] p-0.5 rounded" />
                      <span className="font-bold text-[#1A1A1F]">{req.clientName}</span>
                      <span className="text-gray-400 truncate max-w-[220px]">{req.vehicleSpec}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">
                      {req.budgetOrAsking}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ideas */}
          {filteredIdeas.length > 0 && (
            <div>
              <p className="font-bold text-gray-400 uppercase tracking-wider px-2 mb-1.5 text-[10px]">
                Idea Vault
              </p>
              <div className="space-y-1">
                {filteredIdeas.slice(0, 3).map((idea) => (
                  <div
                    key={idea.id}
                    onClick={() => {
                      onSelectTab('ideas');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-[#1A1A1F]">{idea.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {idea.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
