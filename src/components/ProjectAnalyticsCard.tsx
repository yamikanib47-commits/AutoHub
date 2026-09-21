import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause } from 'lucide-react';
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
  // Tuesday (index 2) is the initial focus element
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Fluidly move along weekly buyer inquiries across Zambia
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, data.length]);

  const activeItem = data[activeIndex] || data[0];

  return (
    <div 
      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between h-[270px] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#1A1A1F]">
              {title}
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#1E3A8A] border border-blue-100/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              Zambia Flow
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              {subtitle} • <span className="text-[#1E3A8A] font-semibold">{activeItem.fullDay || 'Day'}: {activeItem.inquiries ? `${activeItem.inquiries} inquiries (${activeItem.region || 'Active'})` : activeItem.tooltip}</span>
            </p>
          )}
        </div>

        {/* Fluid Flow Control Button */}
        <button
          type="button"
          onClick={() => setIsAutoPlaying((prev) => !prev)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 border cursor-pointer shrink-0 active:scale-95 ${
            isAutoPlaying 
              ? 'bg-blue-50/90 text-[#1E3A8A] border-blue-200 hover:bg-blue-100/80' 
              : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
          }`}
          title={isAutoPlaying ? "Pause weekly fluid flow" : "Resume fluid movement along weekly buyer inquiries"}
        >
          {isAutoPlaying ? (
            <>
              <Pause className="w-2.5 h-2.5 text-[#1E3A8A]" />
              <span>Flowing</span>
            </>
          ) : (
            <>
              <Play className="w-2.5 h-2.5 text-gray-600" />
              <span>Play Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Bars Container */}
      <div className="flex items-end justify-between gap-2 sm:gap-3.5 h-44 pt-6 pb-2 px-1 relative">
        {data.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div 
              key={index} 
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
            >
              {/* Fluid Active Indicator Pill (moves fluidly along weekly buyer inquiries across Zambia) */}
              {isActive && (
                <motion.div
                  layoutId="weeklyBuyerInquiryIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-blue-200/90 shadow-md text-[10px] font-bold text-[#1A1A1F] whitespace-nowrap flex items-center gap-1.5 pointer-events-none"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-ping" />
                  <span>
                    {item.inquiries ? `${item.inquiries} Inquiries` : item.tooltip || `${item.value}% Flow`}
                    {item.region ? ` • ${item.region.split(' ')[0]}` : ''}
                  </span>
                  {/* Fluid pointer triangle pointing at bar */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-blue-200/90 rotate-45" />
                </motion.div>
              )}

              {/* Bar Pill */}
              <div className="w-full max-w-[34px] flex items-end justify-center h-full">
                {item.type === 'hatched' ? (
                  <div
                    style={{ height: `${item.value}%` }}
                    className={`w-full rounded-full bg-hatched-blue border transition-all duration-300 ${
                      isActive 
                        ? 'border-blue-400 ring-2 ring-blue-300/50 shadow-xs' 
                        : 'border-blue-100 hover:opacity-85'
                    }`}
                  />
                ) : item.type === 'solid-dark' ? (
                  <div
                    style={{ height: `${item.value}%` }}
                    className={`w-full rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#1E3A8A] ring-2 ring-blue-400/50 shadow-md' 
                        : 'bg-[#1E3A8A] hover:bg-[#1e40af]'
                    }`}
                  />
                ) : (
                  <div
                    style={{ height: `${item.value}%` }}
                    className={`w-full rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#2563EB] ring-2 ring-blue-300/60 shadow-xs' 
                        : 'bg-[#60A5FA] hover:bg-[#3B82F6]'
                    }`}
                  />
                )}
              </div>

              {/* Day Label */}
              <span className={`text-xs font-semibold mt-2 transition-all ${
                isActive ? 'text-[#1E3A8A] font-bold scale-110' : 'text-gray-400'
              }`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
