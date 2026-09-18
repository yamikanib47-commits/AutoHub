import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { StatMetric } from '../types';

interface StatCardProps {
  stat: StatMetric;
  onClickArrow?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, onClickArrow }) => {
  const isPrimary = stat.isPrimary;

  return (
    <div
      className={`
        rounded-3xl p-6 transition-all flex flex-col justify-between min-h-[148px]
        ${
          isPrimary
            ? 'bg-[#1E3A8A] text-white shadow-xs'
            : 'bg-white text-[#1A1A1F] border border-gray-100 shadow-2xs'
        }
      `}
    >
      {/* Top Title & Circular Arrow Button */}
      <div className="flex items-center justify-between">
        <h3
          className={`text-sm font-semibold tracking-normal ${
            isPrimary ? 'text-white' : 'text-[#1A1A1F]'
          }`}
        >
          {stat.title}
        </h3>

        <button
          onClick={onClickArrow}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer
            ${
              isPrimary
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'border border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
            }
          `}
          aria-label={`View details for ${stat.title}`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Metric Number */}
      <div className="my-1">
        <span
          className={`text-4xl font-extrabold tracking-tight ${
            isPrimary ? 'text-white' : 'text-[#1A1A1F]'
          }`}
        >
          {stat.value}
        </span>
      </div>

      {/* Bottom Subtitle / Badge */}
      <div className="flex items-center gap-1.5 text-xs">
        {isPrimary ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#10B981] text-[#064E3B] text-[11px] font-bold">
            <span className="w-3.5 h-3.5 rounded-full bg-white/40 flex items-center justify-center text-[9px]">
              ↗
            </span>
            <span>{stat.change}</span>
          </div>
        ) : stat.trend === 'up' ? (
          <div className="flex items-center gap-1 text-gray-400 font-medium text-[11px]">
            <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[9px] text-gray-500 font-bold">
              ↗
            </span>
            <span>{stat.change}</span>
          </div>
        ) : (
          <span className="text-gray-400 font-medium text-[11px]">
            {stat.change}
          </span>
        )}
      </div>
    </div>
  );
};
