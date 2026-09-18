import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Users, 
  ArrowLeftRight, 
  Lightbulb, 
  CheckSquare, 
  Send, 
  TrendingUp, 
  ShieldCheck, 
  Plus,
  Compass
} from 'lucide-react';
import { TodaySlot, LeadItem, VehicleRequest, HQTask, IdeaItem, HQTab } from '../../types';

interface HQViewProps {
  todaySlots: TodaySlot[];
  onToggleSlotStatus: (id: string) => void;
  leads: LeadItem[];
  requests: VehicleRequest[];
  tasks: HQTask[];
  ideas: IdeaItem[];
  onAskJarvis: (prompt: string) => void;
  onSelectTab: (tab: HQTab) => void;
  onOpenQuickAction: () => void;
}

export const HQView: React.FC<HQViewProps> = ({
  todaySlots,
  onToggleSlotStatus,
  leads,
  requests,
  tasks,
  ideas,
  onAskJarvis,
  onSelectTab,
  onOpenQuickAction
}) => {
  const [quickJarvisInput, setQuickJarvisInput] = useState('');

  const activeLeadsCount = leads.length;
  const hotLeads = leads.filter((l) => l.status === 'HOT');
  const pendingRequestsCount = requests.length;
  const matchedRequests = requests.filter((r) => r.status === 'Matched');
  const backlogIdeasCount = ideas.filter((i) => i.priority === 'NOW' || i.priority === 'NEXT').length;
  const uncompletedTasks = tasks.filter((t) => !t.completed);

  const handleJarvisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickJarvisInput.trim()) return;
    onAskJarvis(quickJarvisInput);
    setQuickJarvisInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D5CF6]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2D5CF6]">
              Operational Headquarters
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1F] tracking-tight mt-1">
            AUTOACE HQ
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Your command center for demand, content and connections.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onAskJarvis('What should I do next for AutoAce right now? Give me the single most impactful move.')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A1A1F] hover:bg-[#25252c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 border border-gray-800"
          >
            <Bot className="w-4 h-4 text-[#C8F169]" />
            <span>"What Should I Do Next?"</span>
          </button>
          
          <button
            onClick={onOpenQuickAction}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2D5CF6] hover:bg-[#234bd4] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Action</span>
          </button>
        </div>
      </div>

      {/* Quick Status Pills Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Leads Pill */}
        <div 
          onClick={() => onSelectTab('leads')}
          className="bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-[#2D5CF6]/60 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#2D5CF6]" />
              Active Leads
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600">
              {hotLeads.length} Hot
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#1A1A1F]">{activeLeadsCount}</span>
            <span className="text-xs text-gray-400 font-medium group-hover:text-[#2D5CF6] flex items-center gap-0.5">
              Pipeline <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Pending Requests Pill */}
        <div 
          onClick={() => onSelectTab('requests')}
          className="bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-[#2D5CF6]/60 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <ArrowLeftRight className="w-4 h-4 text-[#C8F169] bg-[#1A1A1F] p-0.5 rounded" />
              Pending Requests
            </span>
            {matchedRequests.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                {matchedRequests.length} Matched!
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#1A1A1F]">{pendingRequestsCount}</span>
            <span className="text-xs text-gray-400 font-medium group-hover:text-[#2D5CF6] flex items-center gap-0.5">
              Buyer/Seller <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Ideas in Backlog Pill */}
        <div 
          onClick={() => onSelectTab('ideas')}
          className="bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-[#2D5CF6]/60 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Ideas Backlog
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
              Vault
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#1A1A1F]">{backlogIdeasCount}</span>
            <span className="text-xs text-gray-400 font-medium group-hover:text-[#2D5CF6] flex items-center gap-0.5">
              Now/Next <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Today's Tasks Pill */}
        <div 
          onClick={() => onSelectTab('tasks')}
          className="bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-[#2D5CF6]/60 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              Uncompleted Tasks
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
              Today
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#1A1A1F]">{uncompletedTasks.length}</span>
            <span className="text-xs text-gray-400 font-medium group-hover:text-[#2D5CF6] flex items-center gap-0.5">
              Task Center <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Prominent JARVIS Operational Card */}
      <div className="bg-[#1A1A1F] text-white p-6 sm:p-7 rounded-3xl border border-gray-800 shadow-lg relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D5CF6]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#2D5CF6] flex items-center justify-center text-white shadow-md">
                <Bot className="w-6 h-6 text-[#C8F169]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-white">
                    JARVIS AI Operations Engine
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C8F169] text-[#1A1A1F] uppercase">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Concise, practical, automotive intelligence. Answering "What should I do next?"
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[11px] text-gray-400 font-medium">AutoAce Live Recommendation:</p>
              <p className="text-xs font-bold text-[#C8F169] mt-0.5">
                Lock DME scan for Derrick Hall's 2021 M340i to close Marcus Vance ($3.2k spread)
              </p>
            </div>
          </div>

          {/* Interactive JARVIS Command Box */}
          <form onSubmit={handleJarvisSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={quickJarvisInput}
                onChange={(e) => setQuickJarvisInput(e.target.value)}
                placeholder="Ask JARVIS or give an instruction (e.g. 'Draft message to Marcus Vance' or 'Give me 3 content hooks')..."
                className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-white/10 border border-white/15 focus:border-[#C8F169] focus:bg-white/15 outline-none text-xs sm:text-sm text-white placeholder-gray-400 transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={!quickJarvisInput.trim()}
              className="px-5 py-3 sm:py-3.5 rounded-2xl bg-[#2D5CF6] hover:bg-[#244ad4] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-40 flex items-center gap-2 shrink-0 shadow-md active:scale-95"
            >
              <span>Consult</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-gray-400 mr-1">Quick Directives:</span>
            {[
              { label: 'Prioritize Today', prompt: 'Prioritize my day for AutoAce. What are the 3 actions that will move revenue and demand fastest?' },
              { label: 'Write Content', prompt: 'Generate 3 high-impact automotive reels concepts for AutoAce with hooks, b-roll angles, and CTAs.' },
              { label: 'Review Leads', prompt: 'Review our hot leads pipeline and tell me who to follow up with and exact messaging angle.' },
              { label: 'Summarize Week', prompt: 'Summarize our weekly performance across demand, sourcing requests, content reach, and commissions.' }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onAskJarvis(chip.prompt)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-[#C8F169] hover:text-[#1A1A1F] text-gray-200 border border-white/10 transition-all cursor-pointer active:scale-95"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TODAY: Three Priority Slots Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-gray-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-[#2D5CF6] uppercase">
                Execution Framework
              </span>
              <h2 className="text-lg font-black text-[#1A1A1F] tracking-tight">
                TODAY'S THREE PRIORITY SLOTS
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              One clear non-negotiable anchor for each life-force pillar.
            </p>
          </div>

          <span className="text-xs font-bold text-gray-400">
            {todaySlots.filter((s) => s.status === 'Done').length} of {todaySlots.length} completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todaySlots.map((slot) => {
            const isDone = slot.status === 'Done';
            return (
              <div
                key={slot.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isDone 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-[#FBFBFA] border-gray-200/90 hover:border-[#2D5CF6]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      {slot.pillar}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {slot.tag}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold text-[#1A1A1F] leading-snug mb-2 ${
                    isDone ? 'line-through text-gray-400' : ''
                  }`}>
                    {slot.priorityTitle}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {slot.recommendation}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                  <button
                    onClick={() => onToggleSlotStatus(slot.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      isDone ? 'text-emerald-700 hover:text-emerald-800' : 'text-[#2D5CF6] hover:text-[#1e46c7]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isDone ? 'Completed' : 'Mark Complete'}</span>
                  </button>

                  <button
                    onClick={() => onAskJarvis(`Help me break down and execute: ${slot.priorityTitle}`)}
                    className="text-[11px] font-semibold text-gray-400 hover:text-[#1A1A1F]"
                  >
                    Ask JARVIS
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lower Dashboard Grid: Urgent Match Room & Top Hot Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Hot Lead Spotlight */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <h3 className="font-extrabold text-[#1A1A1F] text-sm">
                  Priority Lead Pipeline
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('leads')}
                className="text-xs font-bold text-[#2D5CF6] hover:underline"
              >
                View All ({leads.length})
              </button>
            </div>

            <div className="space-y-3">
              {hotLeads.slice(0, 2).map((lead) => (
                <div 
                  key={lead.id}
                  className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-[#1A1A1F]">{lead.name}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase">
                      {lead.status} • {lead.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-semibold mb-1">
                    {lead.vehicleInterest}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {lead.notes}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">Budget: {lead.budgetOrTarget}</span>
                    <button
                      onClick={() => onAskJarvis(`Draft a direct follow-up message to ${lead.name} regarding ${lead.vehicleInterest} with budget ${lead.budgetOrTarget}`)}
                      className="px-2.5 py-1 rounded-lg bg-[#2D5CF6] text-white text-[11px] font-bold hover:bg-[#2044c2] transition-colors cursor-pointer"
                    >
                      Draft Follow-up
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
            <span>Average buyer turnaround: 4.2 days</span>
            <span className="font-bold text-emerald-600">96% qualified intent</span>
          </div>
        </div>

        {/* Live Vehicle Match Spotlight */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-[#2D5CF6]" />
                <h3 className="font-extrabold text-[#1A1A1F] text-sm">
                  Active Vehicle Match Room
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('requests')}
                className="text-xs font-bold text-[#2D5CF6] hover:underline"
              >
                Match Matrix
              </button>
            </div>

            {matchedRequests.length > 0 ? (
              <div className="p-4 rounded-2xl bg-[#F0F5FF] border border-[#BFDBFE] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#2D5CF6] text-white uppercase">
                    High Spread Match
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    +$3,200 Potential Spread
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Buyer</p>
                    <p className="font-bold text-gray-900">Marcus Vance</p>
                    <p className="text-gray-500 text-[11px]">2021 BMW M340i</p>
                    <p className="text-[#2D5CF6] font-bold mt-1">$45,000 Budget</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Seller</p>
                    <p className="font-bold text-gray-900">Derrick Hall</p>
                    <p className="text-gray-500 text-[11px]">2021 BMW M340i (32k mi)</p>
                    <p className="text-emerald-600 font-bold mt-1">$41,800 Net</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-600">Status: Pending DME scan review</span>
                  <button
                    onClick={() => onAskJarvis('Draft the closing agreement terms between Marcus Vance and Derrick Hall for the 2021 BMW M340i')}
                    className="text-xs font-bold text-[#2D5CF6] hover:underline flex items-center gap-1"
                  >
                    <span>Execute Match</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No active matches today.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">AutoAce Concierge Escrow Ready</span>
            <span className="font-bold text-[#1A1A1F]">0% Buyer Friction</span>
          </div>
        </div>
      </div>
    </div>
  );
};
