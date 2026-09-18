import React, { useState } from 'react';
import { CheckSquare, Plus, Check, Clock } from 'lucide-react';
import { TaskItem } from '../../types';

interface TasksViewProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (t: Omit<TaskItem, 'id'>) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask
}) => {
  const [filter, setFilter] = useState<'All' | 'Todo' | 'In Progress' | 'Done'>('All');
  const [newTitle, setNewTitle] = useState('');

  const filtered = tasks.filter((t) => filter === 'All' || t.status === filter);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle,
      project: 'Active Sprint',
      dueDate: 'Tomorrow',
      priority: 'High',
      status: 'Todo'
    });
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1F]">Tasks</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Manage, track, and complete team deliverables.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-full text-xs font-bold">
          {(['All', 'Todo', 'In Progress', 'Done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                filter === f ? 'bg-white text-[#1A1A1F] shadow-2xs' : 'text-gray-500 hover:text-[#1A1A1F]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Add Task Input */}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-2xs flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 text-xs sm:text-sm outline-none text-[#1A1A1F] bg-transparent font-medium"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Tasks List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs divide-y divide-gray-100 overflow-hidden">
        {filtered.map((t) => (
          <div key={t.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <button
                onClick={() => onToggleTask(t.id)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  t.status === 'Done'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-gray-300 hover:border-[#1E3A8A] bg-white'
                }`}
              >
                {t.status === 'Done' && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <div className="min-w-0">
                <p className={`text-sm font-bold text-[#1A1A1F] truncate ${t.status === 'Done' ? 'line-through text-gray-400' : ''}`}>
                  {t.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {t.project} • Priority: {t.priority}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs">
              <span className="text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {t.dueDate}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
