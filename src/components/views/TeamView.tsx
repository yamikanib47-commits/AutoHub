import React from 'react';
import { TeamCollaborationCard } from '../TeamCollaborationCard';
import { TeamMember } from '../../types';

interface TeamViewProps {
  members: TeamMember[];
  onAddMember: () => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ members, onAddMember }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1F]">Team</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Active contributors, ownership areas, and delivery milestones.
          </p>
        </div>
      </div>

      <TeamCollaborationCard members={members} onAddMember={onAddMember} />
    </div>
  );
};
