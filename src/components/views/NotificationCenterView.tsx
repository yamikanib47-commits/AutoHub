import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Users, 
  Video, 
  Clock, 
  Bot, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { HQNotification, NotificationType, HQTab } from '../../types';

interface NotificationCenterViewProps {
  notifications: HQNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (item: HQNotification) => void;
  onSelectTab: (tab: HQTab) => void;
}

export const NotificationCenterView: React.FC<NotificationCenterViewProps> = ({
  notifications,
  onMarkAllRead,
  onSelectNotification,
  onSelectTab
}) => {
  const [filterType, setFilterType] = useState<'ALL' | NotificationType>('ALL');

  const filtered = notifications.filter((n) => {
    return filterType === 'ALL' || n.type === filterType;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'lead':
        return <Users className="w-4 h-4 text-[#2D5CF6]" />;
      case 'content':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'followup':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'jarvis':
        return <Bot className="w-4 h-4 text-[#C8F169]" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2D5CF6]" />
            <span className="text-[11px] font-extrabold text-[#2D5CF6] uppercase tracking-wider">
              Alert Stream & Inbox
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1F] tracking-tight mt-1">
            NOTIFICATION CENTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Real-time feed of buyer matches, scheduled content alerts, lead follow-ups, and JARVIS recommendations.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-gray-500" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'lead', label: 'Leads & Matches' },
          { id: 'content', label: 'Content' },
          { id: 'followup', label: 'Follow-ups' },
          { id: 'jarvis', label: 'JARVIS' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === tab.id
                ? 'bg-[#1A1A1F] text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {filtered.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => onSelectNotification(item)}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer flex items-start justify-between gap-4 hover:border-[#2D5CF6]/50 ${
                !item.read ? 'border-l-4 border-l-[#2D5CF6] border-gray-200/80 shadow-xs' : 'border-gray-200/60 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-[#1A1A1F]">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#2D5CF6]" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                    {item.message}
                  </p>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {item.actionLabel && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.actionTab) onSelectTab(item.actionTab);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#EEF2FF] hover:text-[#2D5CF6] text-xs font-bold text-gray-700 transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
