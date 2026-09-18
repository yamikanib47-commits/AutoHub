import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Check, 
  Clock, 
  AlertCircle, 
  Calendar,
  Filter,
  Bot
} from 'lucide-react';
import { HQTask, TaskCategory, TaskPriority } from '../../types';

interface TaskCenterViewProps {
  tasks: HQTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<HQTask, 'id'>) => void;
  onAskJarvis: (prompt: string) => void;
}

export const TaskCenterView: React.FC<TaskCenterViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onAskJarvis
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<TaskCategory>('AUTOACE');
  const [quickPriority, setQuickPriority] = useState<TaskPriority>('High');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddTask({
      title: quickTitle,
      category: quickCategory,
      priority: quickPriority,
      dueDate: 'Today',
      completed: false
    });

    setQuickTitle('');
  };

  const categories: TaskCategory[] = ['AUTOACE', 'CONTENT', 'CAREER', 'PERSONAL', 'ADMIN'];

  const filteredTasks = tasks.filter((t) => {
    return selectedCategory === 'ALL' || t.category === selectedCategory;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#2D5CF6]" />
            <span className="text-[11px] font-extrabold text-[#2D5CF6] uppercase tracking-wider">
              Operational Focus Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1F] tracking-tight mt-1">
            TASK CENTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Categorized tasks: AUTOACE, CONTENT, CAREER, PERSONAL, and ADMIN.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onAskJarvis('Review my current uncompleted tasks and prioritize the optimal execution order for today.')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A1A1F] hover:bg-[#25252c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 border border-gray-800"
          >
            <Bot className="w-4 h-4 text-[#C8F169]" />
            <span>Prioritize with JARVIS</span>
          </button>
        </div>
      </div>

      {/* Quick Add Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-xs">
        <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Add new task (e.g. 'Call inspector for 2019 Macan S title check')..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2D5CF6] outline-none text-xs sm:text-sm text-[#1A1A1F] placeholder-gray-400 bg-gray-50/50 font-medium"
          />

          <select
            value={quickCategory}
            onChange={(e) => setQuickCategory(e.target.value as TaskCategory)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={quickPriority}
            onChange={(e) => setQuickPriority(e.target.value as TaskPriority)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white outline-none"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#2D5CF6] hover:bg-[#2045cb] text-white font-bold text-xs transition-all disabled:opacity-40 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>
      </div>

      {/* Category Pills & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1F] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-gray-500">
          Completed: {completedCount} / {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden divide-y divide-gray-100">
        {filteredTasks.map((task) => {
          return (
            <div
              key={task.id}
              className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-all hover:bg-gray-50/70 ${
                task.completed ? 'bg-gray-50/40 opacity-70' : ''
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Checkbox */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-gray-300 hover:border-[#2D5CF6] bg-white'
                  }`}
                  aria-label="Toggle task completion"
                >
                  {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 uppercase">
                      {task.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : task.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  <p className={`text-sm font-semibold text-[#1A1A1F] truncate ${
                    task.completed ? 'line-through text-gray-400' : ''
                  }`}>
                    {task.title}
                  </p>
                  
                  {task.notes && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{task.notes}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {task.dueDate}
                </span>

                <button
                  onClick={() => onAskJarvis(`Give me actionable guidance on completing this task: "${task.title}" (${task.category})`)}
                  className="hidden sm:inline-block text-[11px] font-bold text-[#2D5CF6] hover:underline"
                >
                  Ask JARVIS
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
