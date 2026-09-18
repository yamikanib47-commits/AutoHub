import React from 'react';
import { Plus, ArrowUpRight } from 'lucide-react';
import { StatMetric, DayAnalytic, ProjectItem, TeamMember, ReminderItem } from '../../types';
import { StatCard } from '../StatCard';
import { ProjectAnalyticsCard } from '../ProjectAnalyticsCard';
import { RemindersCard } from '../RemindersCard';
import { ProjectListCard } from '../ProjectListCard';
import { TeamCollaborationCard } from '../TeamCollaborationCard';
import { ProjectProgressCard } from '../ProjectProgressCard';
import { TimeTrackerCard } from '../TimeTrackerCard';

interface DashboardViewProps {
  stats: StatMetric[];
  projects: ProjectItem[];
  teamMembers: TeamMember[];
  reminder: ReminderItem;
  onOpenAddProject: () => void;
  onOpenImportData: () => void;
  onOpenAddMember: () => void;
  onStartMeeting: () => void;
  onSelectProject: (project: ProjectItem) => void;
  onSelectMember: (member: TeamMember) => void;
  onNavigateToGoals?: () => void;
  onSelectStat?: (stat: StatMetric) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  projects,
  teamMembers,
  reminder,
  onOpenAddProject,
  onOpenImportData,
  onOpenAddMember,
  onStartMeeting,
  onSelectProject,
  onSelectMember,
  onNavigateToGoals,
  onSelectStat
}) => {
  return (
    <div className="space-y-6 pb-6">
      {/* Title & Action Buttons Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1F] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            AutoAce demand capture, qualified supply connections & deal flow • Head Admin: Yamikani Banda
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* + Add Buyer Lead Button (Deep Blue Pill) */}
          <button
            onClick={onOpenAddProject}
            className="px-5 py-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-98"
            aria-label="Log buyer lead"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Buyer Lead</span>
          </button>

          {/* 90-Day Goals Button (White Pill with Blue Border) */}
          <button
            onClick={onNavigateToGoals || onOpenImportData}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-50 text-[#1E3A8A] border border-[#1E3A8A] text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer active:scale-98"
          >
            90-Day KPI Goals
          </button>
        </div>
      </div>

      {/* Row 1: 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            stat={stat}
            onClickArrow={() => {
              if (onSelectStat) {
                onSelectStat(stat);
              } else {
                alert(`KPI Metric: ${stat.title}\nCurrent: ${stat.value}\nBenchmark: ${stat.change}`);
              }
            }}
          />
        ))}
      </div>

      {/* Row 2: 3-Column Bento Grid Matching the Design System Exactly */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (lg:col-span-5): Demand Analytics + Seller Network */}
        <div className="lg:col-span-5 space-y-5">
          <ProjectAnalyticsCard
            title="Demand Inflow Analytics"
            subtitle="Weekly buyer inquiries across Zambia"
          />
          <TeamCollaborationCard
            members={teamMembers}
            title="Seller & Partner Network"
            subtitle="Verified car yards & Japan import brokers"
            addButtonText="Add Partner"
            onAddMember={onOpenAddMember}
            onSelectMember={onSelectMember}
          />
        </div>

        {/* Center Column (lg:col-span-4): Priority Action + Funnel Progress */}
        <div className="lg:col-span-4 space-y-5">
          <RemindersCard
            reminder={reminder}
            cardTitle="Priority Deal Action"
            buttonText="Coordinate Inspection"
            onStartMeeting={onStartMeeting}
          />
          <ProjectProgressCard
            title="Funnel Conversion Rate"
            percentage="70%"
            statusLabel="Demand Converted"
            legend={{
              completed: 'Closed Deals',
              inProgress: 'Active Matches',
              pending: 'Pending Demand'
            }}
          />
        </div>

        {/* Right Column (lg:col-span-3): Buyer Leads Quick View + Time Tracker */}
        <div className="lg:col-span-3 space-y-5">
          <ProjectListCard
            projects={projects}
            title="Buyer Leads"
            subtitle="Quick view of active demand"
            onNewProject={onOpenAddProject}
            onSelectProject={onSelectProject}
          />
          <TimeTrackerCard />
        </div>
      </div>
    </div>
  );
};
