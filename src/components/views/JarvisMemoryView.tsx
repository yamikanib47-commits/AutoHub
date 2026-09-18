import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Target, 
  Sparkles, 
  MessageSquare,
  Bot
} from 'lucide-react';
import { MemoryItem } from '../../types';

interface JarvisMemoryViewProps {
  memoryItems: MemoryItem[];
  onAddMemory: (item: Omit<MemoryItem, 'id'>) => void;
  onDeleteMemory: (id: string) => void;
  onAskJarvis: (prompt: string) => void;
}

export const JarvisMemoryView: React.FC<JarvisMemoryViewProps> = ({
  memoryItems,
  onAddMemory,
  onDeleteMemory,
  onAskJarvis
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCat, setNewCat] = useState<MemoryItem['category']>('Operator Preference');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddMemory({
      category: newCat,
      title: newTitle,
      content: newContent,
      updatedAt: 'Added today'
    });

    setIsAddOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const getCatIcon = (cat: MemoryItem['category']) => {
    switch (cat) {
      case 'Operator Preference':
        return <BrainCircuit className="w-4 h-4 text-[#2D5CF6]" />;
      case 'Core Principle':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'Monthly Goal':
        return <Target className="w-4 h-4 text-amber-500" />;
      case 'Tone Guideline':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#2D5CF6]" />
            <span className="text-[11px] font-extrabold text-[#2D5CF6] uppercase tracking-wider">
              Operational Context & Grounding
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1F] tracking-tight mt-1">
            JARVIS MEMORY
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Persistent context layer holding Operator preferences, AutoAce core vehicle principles, monthly targets, and tone guidelines.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2D5CF6] hover:bg-[#2045cb] text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Memory Record</span>
        </button>
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memoryItems.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      {getCatIcon(item.category)}
                    </div>
                    <span className="text-[11px] font-extrabold uppercase text-gray-500">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-gray-400">
                    {item.updatedAt}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[#1A1A1F] mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed bg-[#F8F9FA] p-3.5 rounded-2xl border border-gray-100">
                  {item.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onAskJarvis(`Confirm how you are applying this memory rule in AutoAce decisions: "${item.title}"`)}
                  className="font-bold text-[#2D5CF6] hover:underline"
                >
                  Verify with JARVIS
                </button>

                <button
                  onClick={() => onDeleteMemory(item.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Remove memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Memory Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <h2 className="text-lg font-black text-[#1A1A1F] mb-1">
              Add Operational Memory Record
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Ground JARVIS in your preferences, principles, or current targets.
            </p>

            <form onSubmit={handleSaveMemory} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Memory Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6] bg-white"
                >
                  <option value="Operator Preference">Operator Preference</option>
                  <option value="Core Principle">Core Principle</option>
                  <option value="Monthly Goal">Monthly Goal</option>
                  <option value="Tone Guideline">Tone Guideline</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Rule or Concept Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sourcing Inspection Standard"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Context / Instructions for JARVIS</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Exact operational guidelines, thresholds, or priorities..."
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2D5CF6] text-white font-bold hover:bg-[#2045cb] cursor-pointer"
                >
                  Save to Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
