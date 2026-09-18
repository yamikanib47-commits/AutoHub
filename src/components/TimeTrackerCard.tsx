import React, { useState, useEffect } from 'react';
import { Pause, Play, Square } from 'lucide-react';

export const TimeTrackerCard: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(5048); // 01:24:08 = 3600 + 1440 + 8 = 5048
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="rounded-3xl p-6 bg-dark-wave text-white border border-slate-800 shadow-md flex flex-col justify-between min-h-[170px] relative overflow-hidden">
      {/* Title */}
      <h3 className="text-sm font-bold text-slate-300">
        Time Tracker
      </h3>

      {/* Monospace Digital Display */}
      <div className="my-2 text-center">
        <span className="font-mono-timer text-3xl sm:text-4xl font-black tracking-wider text-white select-none">
          {formatTime(seconds)}
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={toggleTimer}
          className="w-10 h-10 rounded-full bg-white text-[#0F172A] flex items-center justify-center hover:bg-slate-100 transition-transform active:scale-95 cursor-pointer shadow-sm"
          aria-label={isRunning ? 'Pause timer' : 'Resume timer'}
        >
          {isRunning ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Stop/Reset Button */}
        <button
          onClick={resetTimer}
          className="w-10 h-10 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:bg-[#DC2626] transition-transform active:scale-95 cursor-pointer shadow-sm"
          aria-label="Stop and reset timer"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
};
