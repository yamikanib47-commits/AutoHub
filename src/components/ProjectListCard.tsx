import React from 'react';
import { Plus, Car, Compass, ShieldCheck, Zap, Key } from 'lucide-react';
import { ProjectItem } from '../types';
import { initialProjects } from '../data/mockData';

interface ProjectListCardProps {
  projects?: ProjectItem[];
  title?: string;
  subtitle?: string;
  onNewProject?: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

export const ProjectListCard: React.FC<ProjectListCardProps> = ({
  projects = initialProjects,
  title = 'Buyer Leads',
  subtitle = 'Quick view of active demand',
  onNewProject,
  onSelectProject
}) => {
  const getProjectIcon = (index: number) => {
    switch (index % 5) {
      case 0:
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
            <Car className="w-4 h-4" />
          </div>
        );
      case 1:
        return (
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Key className="w-4 h-4" />
          </div>
        );
      case 4:
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
        );
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Matching Supply':
        return 'bg-blue-50 text-[#1E3A8A] border border-blue-100';
      case 'Qualified Lead':
        return 'bg-teal-50 text-teal-700 border border-teal-100';
      case 'Inspection Stage':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'Deal Closing':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'New Request':
      default:
        return 'bg-purple-50 text-purple-700 border border-purple-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1A1F]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-gray-400 font-medium -mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <button
          onClick={onNewProject}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          aria-label="Add new buyer lead"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Lead</span>
        </button>
      </div>

      {/* Leads list */}
      <div className="space-y-3">
        {projects.slice(0, 5).map((p, idx) => {
          return (
            <div
              key={p.id}
              onClick={() => onSelectProject?.(p)}
              className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-gray-50/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {getProjectIcon(idx)}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1F] truncate group-hover:text-[#1E3A8A] transition-colors">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium truncate">
                    {p.buyerName ? `${p.buyerName} • ${p.dueDate}` : p.dueDate}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${getCategoryBadgeClass(p.category)}`}>
                {p.category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
