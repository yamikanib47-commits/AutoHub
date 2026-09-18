import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TeamMember } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (m: Omit<TeamMember, 'id'>) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember
}) => {
  const [name, setName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [status, setStatus] = useState<TeamMember['status']>('In Progress');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMember({
      name,
      taskTitle: taskTitle || 'Working on Project Modules',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
      status
    });

    setName('');
    setTaskTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#1A1A1F]">
            Add Team Member
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Member Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Liam Vance"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#2D5CF6] outline-none text-xs text-[#1A1A1F]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Current Task Assignment</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Working on API Rate Limiter"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#2D5CF6] outline-none text-xs text-[#1A1A1F]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#2D5CF6] outline-none bg-white text-xs text-[#1A1A1F]"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold transition-all shadow-xs"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
