import React, { useState } from 'react';
import { Plus, ArrowUpRight, Calculator, CheckCircle2, FileSpreadsheet, X, Sparkles, ExternalLink, Table2 } from 'lucide-react';
import { StatMetric, DayAnalytic, ProjectItem, TeamMember, ReminderItem } from '../../types';
import { StatCard } from '../StatCard';
import { ProjectAnalyticsCard } from '../ProjectAnalyticsCard';
import { RemindersCard } from '../RemindersCard';
import { ProjectListCard } from '../ProjectListCard';
import { TeamCollaborationCard } from '../TeamCollaborationCard';
import { ProjectProgressCard } from '../ProjectProgressCard';
import { TimeTrackerCard } from '../TimeTrackerCard';
import { autoAceDAL } from '../../services/dataAccessLayer';

interface DashboardViewProps {
  stats: StatMetric[];
  projects: ProjectItem[];
  teamMembers: TeamMember[];
  reminder: ReminderItem;
  conversionRate?: {
    percentage: string;
    numericRate: number;
    formula: string;
    closedDeals: number;
    totalConnections: number;
  };
  onOpenAddProject: () => void;
  onOpenImportData: () => void;
  onOpenAddMember: () => void;
  onStartMeeting: () => void;
  onSelectProject: (project: ProjectItem) => void;
  onSelectMember: (member: TeamMember) => void;
  onNavigateToGoals?: () => void;
  onNavigateToSheets?: () => void;
  onSelectStat?: (stat: StatMetric) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  projects,
  teamMembers,
  reminder,
  conversionRate,
  onOpenAddProject,
  onOpenImportData,
  onOpenAddMember,
  onStartMeeting,
  onSelectProject,
  onSelectMember,
  onNavigateToGoals,
  onNavigateToSheets,
  onSelectStat
}) => {
  const [isFormulaInspectorOpen, setIsFormulaInspectorOpen] = useState(false);
  const formulas = autoAceDAL.getDashboardFormulas();
  const dalMetadata = autoAceDAL.getMetadata();

  return (
    <div className="space-y-6 pb-6">
      {/* Title & Action Buttons Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1F] tracking-tight">
              Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced to Sheets DAL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            AutoAce demand capture, qualified supply connections & deal flow • Head Admin: Yamikani Banda
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Formulas Pill */}
          <button
            onClick={() => setIsFormulaInspectorOpen(true)}
            className="px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-[#1A1A1F] border border-gray-200 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-98"
            title="Inspect dynamic Google Sheets formulas powering this dashboard"
          >
            <Calculator className="w-4 h-4 text-[#1E3A8A]" />
            <span>Formulas (=)</span>
          </button>

          {/* + Add Buyer Lead Button (Deep Blue Pill) */}
          <button
            onClick={onOpenAddProject}
            className="px-5 py-2 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-98"
            aria-label="Log buyer lead"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Buyer Lead</span>
          </button>

          {/* 90-Day Goals Button */}
          <button
            onClick={onNavigateToGoals || onOpenImportData}
            className="px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-[#1E3A8A] border border-[#1E3A8A] text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer active:scale-98"
          >
            90-Day Goals
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
                setIsFormulaInspectorOpen(true);
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
            percentage={conversionRate ? conversionRate.percentage : "33.3%"}
            statusLabel={`${conversionRate ? conversionRate.closedDeals : 10} Deals / ${conversionRate ? conversionRate.totalConnections : 30} Connections`}
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
            subtitle="Live synchronized buyer demand"
            onNewProject={onOpenAddProject}
            onSelectProject={onSelectProject}
          />
          <TimeTrackerCard />
        </div>
      </div>

      {/* Formula & Data Sync Inspector Modal */}
      {isFormulaInspectorOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E3A8A]">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1F]">
                    Live Dashboard Formulas & Sync
                  </h3>
                  <p className="text-xs text-gray-500">
                    Calculated via actual spreadsheet formulas synchronized with the AutoAce database
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormulaInspectorOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Formulas Table */}
            <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-3">
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
                <div className="text-xs text-[#1E3A8A] space-y-0.5">
                  <p className="font-semibold">Actual Spreadsheet Math Implemented</p>
                  <p className="text-blue-900/80">
                    When seeded to Google Sheets, these exact formulas are written directly into cells. Net Revenue (<code className="font-mono bg-white/70 px-1 py-0.5 rounded text-blue-900">=B3-B4</code>) and 3% Commissions (<code className="font-mono bg-white/70 px-1 py-0.5 rounded text-blue-900">=G2*0.03</code>) compute dynamically.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white">
                {formulas.map((item) => (
                  <div key={item.cell} className="p-3.5 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                          {item.cell}
                        </span>
                        <span className="text-xs font-bold text-[#1A1A1F]">
                          {item.metric_name}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {item.notes}
                      </p>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0">
                      <span className="font-mono text-xs font-bold text-[#1E3A8A] bg-blue-50/80 border border-blue-100 px-2.5 py-1 rounded-full">
                        {item.calculated_value}
                      </span>
                      <code className="text-[11px] font-mono text-gray-500 mt-0.5">
                        {item.formula}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Source: {dalMetadata.source}</span>
              </div>
              <div className="flex items-center gap-2">
                {onNavigateToSheets && (
                  <button
                    onClick={() => {
                      setIsFormulaInspectorOpen(false);
                      onNavigateToSheets();
                    }}
                    className="px-4 py-2 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Open Sheets Tables</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFormulaInspectorOpen(false)}
                  className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
