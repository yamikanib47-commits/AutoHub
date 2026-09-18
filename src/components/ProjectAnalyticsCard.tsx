import React from 'react';
import { projectAnalyticsData } from '../data/mockData';
import { DayAnalytic } from '../types';

interface ProjectAnalyticsCardProps {
  data?: DayAnalytic[];
  title?: string;
  subtitle?: string;
}

export const ProjectAnalyticsCard: React.FC<ProjectAnalyticsCardProps> = ({
  data = projectAnalyticsData,
  title = 'Demand Inflow Analytics',
  subtitle = 'Weekly buyer intent across Zambia'
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between h-[270px]">
      {/* Card Header */}
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

      {/* Bars Container */}
      <div className="flex items-end justify-between gap-2 sm:gap-3.5 h-44 pt-6 pb-2 px-1">
        {data.map((item, index) => {
          return (
            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end relative group">
              {/* Tooltip on Tuesday (or items with tooltip) */}
              {item.tooltip && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-white border border-gray-200 shadow-2xs text-[10px] font-bold text-gray-700 whitespace-nowrap">
                  {item.tooltip}
                </div>
              )}

              {/* Bar Pill */}
              <div className="w-full max-w-[34px] flex items-end justify-center h-full">
                {item.type === 'hatched' ? (
                  <div
                    style={{ height: `${item.value}%` }}
                    className="w-full rounded-full bg-hatched-blue border border-blue-100 transition-all duration-300 hover:opacity-85"
                  />
                ) : item.type === 'solid-dark' ? (
                  <div
                    style={{ height: `${item.value}%` }}
                    className="w-full rounded-full bg-[#1E3A8A] transition-all duration-300 hover:bg-[#1e40af]"
                  />
                ) : (
                  <div
                    style={{ height: `${item.value}%` }}
                    className="w-full rounded-full bg-[#60A5FA] transition-all duration-300 hover:bg-[#3B82F6]"
                  />
                )}
              </div>

              {/* Day Label */}
              <span className="text-xs font-semibold text-gray-400 mt-2">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
