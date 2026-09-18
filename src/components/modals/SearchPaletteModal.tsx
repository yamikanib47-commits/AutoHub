import React, { useState, useEffect } from 'react';
import { Search, X, FolderKanban, CheckCircle2, User, ArrowRight } from 'lucide-react';
import { ProjectItem, TeamMember, TaskItem } from '../../types';

interface SearchPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  teamMembers: TeamMember[];
  tasks: TaskItem[];
  onSelectProject: (p: ProjectItem) => void;
  onSelectMember: (m: TeamMember) => void;
}

export const SearchPaletteModal: React.FC<SearchPaletteModalProps> = ({
  isOpen,
  onClose,
  projects,
  teamMembers,
  tasks,
  onSelectProject,
  onSelectMember
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMembers = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.taskTitle.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.project.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-gray-200">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, or teammates..."
            className="w-full text-sm text-[#1A1A1F] placeholder-gray-400 bg-transparent border-none outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5 text-[10px]">
                Projects
              </p>
              <div className="space-y-1">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderKanban className="w-4 h-4 text-[#1E3A8A]" />
                      <span className="font-bold text-gray-800 group-hover:text-[#1E3A8A]">
                        {proj.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      Due {proj.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {filteredMembers.length > 0 && (
            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5 text-[10px]">
                Teammates
              </p>
              <div className="space-y-1">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      onSelectMember(member);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-bold text-gray-800">
                        {member.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 truncate max-w-[180px]">
                      {member.taskTitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5 text-[10px]">
                Tasks
              </p>
              <div className="space-y-1">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-800 font-medium">{task.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length === 0 && filteredMembers.length === 0 && filteredTasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No matching items found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
