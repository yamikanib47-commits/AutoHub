import React, { useState } from 'react';
import { X, Users, ArrowLeftRight, Lightbulb, CheckSquare, Bot, Plus } from 'lucide-react';
import { LeadItem, VehicleRequest, HQTask, IdeaItem } from '../../types';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Omit<LeadItem, 'id'>) => void;
  onAddRequest: (req: Omit<VehicleRequest, 'id'>) => void;
  onAddIdea: (idea: Omit<IdeaItem, 'id'>) => void;
  onAddTask: (task: Omit<HQTask, 'id'>) => void;
  onAskJarvis: (prompt: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
  onAddRequest,
  onAddIdea,
  onAddTask,
  onAskJarvis
}) => {
  const [activeType, setActiveType] = useState<'task' | 'idea' | 'lead' | 'request'>('task');

  // Form fields
  const [title, setTitle] = useState('');
  const [secondary, setSecondary] = useState('');
  const [categoryOrBudget, setCategoryOrBudget] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeType === 'task') {
      onAddTask({
        title,
        category: (categoryOrBudget as any) || 'AUTOACE',
        priority: 'High',
        dueDate: secondary || 'Today',
        completed: false
      });
    } else if (activeType === 'idea') {
      onAddIdea({
        title,
        description: secondary || 'Captured from Quick Action',
        category: (categoryOrBudget as any) || 'Business',
        priority: 'NOW',
        impact: 'High',
        createdAt: 'Just now'
      });
    } else if (activeType === 'lead') {
      onAddLead({
        name: title,
        contact: secondary || 'Pending',
        type: 'BUYER',
        status: 'HOT',
        vehicleInterest: categoryOrBudget || 'Vehicle spec pending',
        budgetOrTarget: '$45,000',
        notes: 'Added via Quick Action',
        lastContacted: 'Just now',
        intentScore: 85
      });
    } else if (activeType === 'request') {
      onAddRequest({
        type: 'BUYER',
        clientName: title,
        vehicleSpec: secondary || 'Spec pending',
        budgetOrAsking: categoryOrBudget || '$40,000',
        timeline: '7 days',
        status: 'Open',
        notes: 'Quick action request',
        createdAt: 'Just now'
      });
    }

    onClose();
    setTitle('');
    setSecondary('');
    setCategoryOrBudget('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-[#1A1A1F]">
              Quick Action Center
            </h2>
            <p className="text-xs text-gray-400 font-medium">Log rapid operational items into AutoAce HQ</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Type Selector */}
        <div className="grid grid-cols-4 gap-2 my-4">
          {[
            { id: 'task', label: 'Task', icon: CheckSquare },
            { id: 'idea', label: 'Idea', icon: Lightbulb },
            { id: 'lead', label: 'Lead', icon: Users },
            { id: 'request', label: 'Request', icon: ArrowLeftRight }
          ].map((item) => {
            const Icon = item.icon;
            const isSel = activeType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveType(item.id as any)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  isSel
                    ? 'bg-[#EEF2FF] border-[#2D5CF6] text-[#2D5CF6] font-bold shadow-2xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">
              {activeType === 'task' ? 'Task Description' : activeType === 'idea' ? 'Idea Title' : activeType === 'lead' ? 'Lead Name' : 'Client Name'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Actionable title..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#2D5CF6] outline-none text-xs text-[#1A1A1F]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              {activeType === 'task' ? 'Due Date or Timing' : activeType === 'idea' ? 'Description & Notes' : activeType === 'lead' ? 'Contact Info (Phone/Email)' : 'Vehicle Spec'}
            </label>
            <input
              type="text"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              placeholder="Details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#2D5CF6] outline-none text-xs text-[#1A1A1F]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              {activeType === 'task' ? 'Category' : activeType === 'idea' ? 'Category' : activeType === 'lead' ? 'Vehicle Interest' : 'Budget / Asking Price'}
            </label>
            <input
              type="text"
              value={categoryOrBudget}
              onChange={(e) => setCategoryOrBudget(e.target.value)}
              placeholder="Classification or budget..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#2D5CF6] outline-none text-xs text-[#1A1A1F]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2D5CF6] text-white font-bold hover:bg-[#2045cb] cursor-pointer"
            >
              Save to HQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
