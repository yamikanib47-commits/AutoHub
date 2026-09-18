import React from 'react';
import { ProjectAnalyticsCard } from '../ProjectAnalyticsCard';
import { ProjectProgressCard } from '../ProjectProgressCard';
import { TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
        <h1 className="text-2xl font-bold text-[#1A1A1F]">Analytics</h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          Real-time delivery velocity, completion rates, and throughput.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs">
          <p className="text-xs font-semibold text-gray-400">Completion Rate</p>
          <p className="text-3xl font-extrabold text-[#1A1A1F] mt-1">94.2%</p>
          <span className="text-xs text-emerald-600 font-bold mt-2 block">+4.8% vs last sprint</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs">
          <p className="text-xs font-semibold text-gray-400">Avg Turnaround</p>
          <p className="text-3xl font-extrabold text-[#1A1A1F] mt-1">2.4 Days</p>
          <span className="text-xs text-emerald-600 font-bold mt-2 block">-0.6 Days faster</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs">
          <p className="text-xs font-semibold text-gray-400">Active Blockers</p>
          <p className="text-3xl font-extrabold text-[#1A1A1F] mt-1">0</p>
          <span className="text-xs text-emerald-600 font-bold mt-2 block">All pipelines clear</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs">
          <p className="text-xs font-semibold text-gray-400">Team Velocity</p>
          <p className="text-3xl font-extrabold text-[#1A1A1F] mt-1">68 Pts</p>
          <span className="text-xs text-blue-600 font-bold mt-2 block">+12 Pts higher</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectAnalyticsCard />
        <ProjectProgressCard />
      </div>
    </div>
  );
};
