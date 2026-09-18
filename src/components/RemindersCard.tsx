import React from 'react';
import { Video } from 'lucide-react';
import { ReminderItem } from '../types';

interface RemindersCardProps {
  reminder?: ReminderItem;
  cardTitle?: string;
  buttonText?: string;
  onStartMeeting?: () => void;
}

export const RemindersCard: React.FC<RemindersCardProps> = ({
  reminder = {
    id: 'r1',
    title: 'Vehicle Inspection: Prado TX for Chanda M.',
    timeRange: '02.00 pm - 04.00 pm • Great East Motors'
  },
  cardTitle = 'Priority Action',
  buttonText = 'Coordinate Inspection',
  onStartMeeting
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between h-[270px]">
      <div>
        <h3 className="text-base font-bold text-[#1A1A1F] mb-6">
          {cardTitle}
        </h3>

        <div className="space-y-1 mt-2">
          <h4 className="text-lg font-bold text-[#1A1A1F] leading-snug">
            {reminder.title}
          </h4>
          <p className="text-xs text-gray-400 font-medium">
            Time : {reminder.timeRange}
          </p>
        </div>
      </div>

      <div>
        <button
          onClick={onStartMeeting}
          className="w-full py-3 px-5 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 active:scale-98"
        >
          <Video className="w-4 h-4 fill-white" />
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
};
