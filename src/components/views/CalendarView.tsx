import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { ReminderItem, ProjectItem } from '../../types';

interface CalendarViewProps {
  reminders?: ReminderItem[];
  projects?: ProjectItem[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  reminders = [],
  projects = []
}) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1F]">Calendar</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Schedule meetings, review milestones, and align sprints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-800">November 2024</span>
          <div className="flex items-center gap-1 border border-gray-200 rounded-full p-0.5">
            <button className="p-1 rounded-full hover:bg-gray-100 text-gray-600"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 rounded-full hover:bg-gray-100 text-gray-600"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-4 uppercase">
            {days.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium">
            {dates.map((date) => {
              const isToday = date === 18;
              const hasEvent = date === 26 || date === 28 || date === 30;
              return (
                <div
                  key={date}
                  className={`h-12 rounded-2xl flex flex-col items-center justify-center p-1 transition-colors cursor-pointer ${
                    isToday
                      ? 'bg-[#1E3A8A] text-white font-bold'
                      : hasEvent
                      ? 'bg-[#EFF6FF] text-[#1E3A8A] font-bold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>{date <= 30 ? date : date - 30}</span>
                  {hasEvent && <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-0.5" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming events sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-[#1A1A1F]">Upcoming Events</h3>
          <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-blue-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A]">
              <Video className="w-3.5 h-3.5" />
              <span>Meeting with Arc Company</span>
            </div>
            <p className="text-xs text-gray-600">Time : 02.00 pm - 04.00 pm</p>
            <span className="text-[11px] font-semibold text-blue-600 block">Today</span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>Develop API Endpoints Due</span>
            </div>
            <p className="text-xs text-gray-500">Nov 26, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};
