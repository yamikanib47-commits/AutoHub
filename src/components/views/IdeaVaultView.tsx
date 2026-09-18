import React, { useState } from 'react';
import { 
  Lightbulb, 
  Plus, 
  Filter, 
  ArrowRight, 
  Flame, 
  Pause, 
  Trash2, 
  Clock, 
  Sparkles,
  Bot
} from 'lucide-react';
import { IdeaItem, IdeaPriority, IdeaCategory } from '../../types';

interface IdeaVaultViewProps {
  ideas: IdeaItem[];
  onAddIdea: (idea: Omit<IdeaItem, 'id'>) => void;
  onUpdatePriority: (id: string, newPriority: IdeaPriority) => void;
  onAskJarvis: (prompt: string) => void;
}

export const IdeaVaultView: React.FC<IdeaVaultViewProps> = ({
  ideas,
  onAddIdea,
  onUpdatePriority,
  onAskJarvis
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | IdeaPriority>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<IdeaCategory>('Business');
  const [quickPriority, setQuickPriority] = useState<IdeaPriority>('NOW');

  const handleQuickCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddIdea({
      title: quickTitle,
      description: 'Captured directly into Idea Vault.',
      category: quickCategory,
      priority: quickPriority,
      impact: quickPriority === 'NOW' ? 'High' : 'Medium',
      createdAt: 'Just now'
    });

    setQuickTitle('');
  };

  const filteredIdeas = ideas.filter((idea) => {
    const matchesPriority = selectedFilter === 'ALL' || idea.priority === selectedFilter;
    const matchesCategory = selectedCategory === 'ALL' || idea.category === selectedCategory;
    return matchesPriority && matchesCategory;
  });

  const getPriorityBadgeClass = (priority: IdeaPriority) => {
    switch (priority) {
      case 'NOW':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'NEXT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PARKED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CUT':
        return 'bg-rose-100 text-rose-800 border-rose-200 line-through';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider">
              Strategic Idea Repository
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1F] tracking-tight mt-1">
            IDEA VAULT
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Capture, classify, and relentlessly prioritize ideas into NOW, NEXT, PARKED, or CUT.
          </p>
        </div>

        <button
          onClick={() => onAskJarvis('Evaluate my Idea Vault. Which idea has the highest probability of moving demand or revenue this week?')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A1A1F] hover:bg-[#25252c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Bot className="w-4 h-4 text-[#C8F169]" />
          <span>Audit Vault with JARVIS</span>
        </button>
      </div>

      {/* Quick Capture Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-xs">
        <form onSubmit={handleQuickCapture} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick capture an idea (e.g. 'Private buyer WhatsApp broadcast' or 'B58 engine short-form reel')..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2D5CF6] outline-none text-xs sm:text-sm text-[#1A1A1F] placeholder-gray-400 bg-gray-50/50 font-medium"
          />

          <select
            value={quickCategory}
            onChange={(e) => setQuickCategory(e.target.value as IdeaCategory)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white outline-none"
          >
            <option value="Content">Content</option>
            <option value="Feature">Feature</option>
            <option value="Business">Business</option>
            <option value="Marketing">Marketing</option>
            <option value="Personal">Personal</option>
          </select>

          <select
            value={quickPriority}
            onChange={(e) => setQuickPriority(e.target.value as IdeaPriority)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white outline-none"
          >
            <option value="NOW">NOW</option>
            <option value="NEXT">NEXT</option>
            <option value="PARKED">PARKED</option>
            <option value="CUT">CUT</option>
          </select>

          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#2D5CF6] hover:bg-[#2045cb] text-white font-bold text-xs transition-all disabled:opacity-40 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Capture</span>
          </button>
        </form>
      </div>

      {/* Priority Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: `All (${ideas.length})` },
            { id: 'NOW', label: `NOW (${ideas.filter((i) => i.priority === 'NOW').length})`, color: 'text-emerald-700' },
            { id: 'NEXT', label: `NEXT (${ideas.filter((i) => i.priority === 'NEXT').length})`, color: 'text-blue-700' },
            { id: 'PARKED', label: `PARKED (${ideas.filter((i) => i.priority === 'PARKED').length})`, color: 'text-amber-700' },
            { id: 'CUT', label: `CUT (${ideas.filter((i) => i.priority === 'CUT').length})`, color: 'text-rose-700' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[#1A1A1F] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-400">Category:</span>
          {['ALL', 'Content', 'Feature', 'Business', 'Marketing', 'Personal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2D5CF6] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.map((idea) => {
          return (
            <div
              key={idea.id}
              className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs hover:border-[#2D5CF6]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 uppercase">
                    {idea.category}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase ${getPriorityBadgeClass(idea.priority)}`}>
                    {idea.priority}
                  </span>
                </div>

                <h3 className={`font-bold text-sm text-[#1A1A1F] leading-snug mb-1.5 ${
                  idea.priority === 'CUT' ? 'line-through text-gray-400' : ''
                }`}>
                  {idea.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {idea.description}
                </p>
              </div>

              {/* Status change actions */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                  <span>Impact: <strong className="text-gray-700">{idea.impact}</strong></span>
                  <span>{idea.createdAt}</span>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Move:</span>
                  <div className="flex items-center gap-1">
                    {(['NOW', 'NEXT', 'PARKED', 'CUT'] as IdeaPriority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => onUpdatePriority(idea.id, p)}
                        disabled={idea.priority === p}
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold cursor-pointer transition-colors ${
                          idea.priority === p
                            ? 'bg-gray-200 text-gray-400 cursor-default'
                            : 'bg-gray-100 hover:bg-[#EEF2FF] hover:text-[#2D5CF6] text-gray-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
