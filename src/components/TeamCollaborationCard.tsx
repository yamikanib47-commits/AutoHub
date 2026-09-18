import React from 'react';
import { Plus } from 'lucide-react';
import { TeamMember } from '../types';
import { initialTeamMembers } from '../data/mockData';

interface TeamCollaborationCardProps {
  members?: TeamMember[];
  title?: string;
  subtitle?: string;
  addButtonText?: string;
  onAddMember?: () => void;
  onSelectMember?: (member: TeamMember) => void;
}

export const TeamCollaborationCard: React.FC<TeamCollaborationCardProps> = ({
  members = initialTeamMembers,
  title = 'Seller & Partner Network',
  subtitle = 'Verified yards & Japan import brokers',
  addButtonText = 'Add Seller',
  onAddMember,
  onSelectMember
}) => {
  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#D97706]">
            In Progress
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#E11D48]">
            Pending
          </span>
        );
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
          onClick={onAddMember}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{addButtonText}</span>
        </button>
      </div>

      {/* Member rows */}
      <div className="space-y-3">
        {members.slice(0, 4).map((m) => {
          return (
            <div
              key={m.id}
              onClick={() => onSelectMember?.(m)}
              className="flex items-center justify-between gap-3 p-1 rounded-xl hover:bg-gray-50/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-100 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1F] truncate">
                    {m.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium truncate max-w-[220px]">
                    {m.taskTitle}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {getStatusBadge(m.status)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
