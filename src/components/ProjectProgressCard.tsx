import React from 'react';

interface ProjectProgressCardProps {
  title?: string;
  percentage?: string;
  statusLabel?: string;
  legend?: {
    completed: string;
    inProgress: string;
    pending: string;
  };
}

export const ProjectProgressCard: React.FC<ProjectProgressCardProps> = ({
  title = 'Funnel Conversion Rate',
  percentage = '70%',
  statusLabel = 'Demand Converted',
  legend = {
    completed: 'Closed Deals',
    inProgress: 'Active Matches',
    pending: 'Pending Demand'
  }
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
      {/* Title */}
      <h3 className="text-base font-bold text-[#1A1A1F]">
        {title}
      </h3>

      {/* Semi-circular gauge */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg
          viewBox="0 0 200 115"
          className="w-48 sm:w-56 h-auto overflow-visible"
        >
          <defs>
            {/* Pattern for pending segment */}
            <pattern
              id="progress-hatch-blue"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#93C5FD"
                strokeWidth="2.5"
              />
            </pattern>
          </defs>

          {/* Background track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Completed Segment (Dark Blue) */}
          <path
            d="M 20 100 A 80 80 0 0 1 85 24"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* In Progress Segment (Medium Blue) */}
          <path
            d="M 85 24 A 80 80 0 0 1 135 34"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="24"
            strokeLinecap="butt"
          />

          {/* Pending Segment (Hatched Blue) */}
          <path
            d="M 135 34 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#progress-hatch-blue)"
            strokeWidth="24"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute bottom-1 text-center">
          <span className="text-3xl font-black text-[#1A1A1F] tracking-tight block">
            {percentage}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 -mt-1 block">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-gray-500 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]" />
          <span className="text-[11px]">{legend.completed}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
          <span className="text-[11px]">{legend.inProgress}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-hatched-blue border border-blue-200" />
          <span className="text-[11px]">{legend.pending}</span>
        </div>
      </div>
    </div>
  );
};
