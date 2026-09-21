import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Car, 
  MessageSquare, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Trash2
} from 'lucide-react';
import { notificationService, BrowserPermissionStatus } from '../../services/notificationService';
import { HQNotification } from '../../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
  onOpenMessages?: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onOpenMessages
}) => {
  const [notifications, setNotifications] = useState<HQNotification[]>([]);
  const [permission, setPermission] = useState<BrowserPermissionStatus>('default');
  const [prefs, setPrefs] = useState(notificationService.getPreferences());
  const [filter, setFilter] = useState<'ALL' | 'project' | 'message'>('ALL');

  useEffect(() => {
    setPermission(notificationService.getBrowserPermission());
    setPrefs(notificationService.getPreferences());

    const unsubscribe = notificationService.subscribeToNotifications((list) => {
      setNotifications(list);
    });

    return unsubscribe;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnableBrowserNotifications = async () => {
    const res = await notificationService.requestBrowserPermission();
    setPermission(res);
    setPrefs(notificationService.getPreferences());
  };

  const handleToggleSound = () => {
    const updated = !prefs.soundEnabled;
    notificationService.setPreferences({ soundEnabled: updated });
    setPrefs(notificationService.getPreferences());
  };

  const handleToggleBrowserPref = () => {
    const updated = !prefs.browserNotificationsEnabled;
    notificationService.setPreferences({ browserNotificationsEnabled: updated });
    setPrefs(notificationService.getPreferences());
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E3A8A]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[#1A1A1F]">
                  Notification Center
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#1E3A8A] text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Real-time alerts for project status changes and team messages
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Browser Permission & Sound Controls Strip */}
        <div className="px-5 py-3.5 bg-blue-50/50 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              permission === 'granted' ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-500 animate-pulse'
            }`} />
            <div>
              <span className="font-bold text-gray-800">
                {permission === 'granted'
                  ? 'Browser Alerts Active'
                  : permission === 'denied'
                  ? 'Browser Alerts Blocked in Settings'
                  : 'Desktop Browser Notifications'}
              </span>
              <p className="text-[11px] text-gray-500">
                {permission === 'granted'
                  ? 'Desktop alerts pop up when you are in other tabs.'
                  : 'Receive notifications even when AutoAce is minimized.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {permission !== 'granted' && permission !== 'unsupported' ? (
              <button
                onClick={handleEnableBrowserNotifications}
                className="px-3.5 py-1.5 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-98"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Enable Browser Alerts</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  notificationService.notifyProjectStatusUpdated({
                    projectId: 'lead-1',
                    projectTitle: 'Toyota Prado TX 150',
                    newStatus: 'Inspection Stage',
                    buyerName: 'Chanda M.'
                  });
                }}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                title="Send a sample notification to test desktop display & audio"
              >
                <Play className="w-3 h-3 text-[#1E3A8A]" />
                <span>Test Alert</span>
              </button>
            )}

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                prefs.soundEnabled
                  ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}
              title={prefs.soundEnabled ? 'Mute notification sounds' : 'Unmute notification sounds'}
            >
              {prefs.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Filter Tabs & Bulk Actions */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Alerts' },
              { id: 'project', label: 'Projects' },
              { id: 'message', label: 'Team Messages' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === t.id
                    ? 'bg-[#1E3A8A] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => notificationService.markAllNotificationsAsRead()}
                className="text-[11px] font-bold text-gray-600 hover:text-[#1E3A8A] flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => notificationService.clearAllNotifications()}
                className="text-[11px] font-semibold text-gray-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                title="Clear all alerts"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notification Stream Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto text-gray-400 mb-3">
                <Bell className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-sm font-bold text-gray-700">No alerts in this category</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                When project statuses change or teammates send messages, you will be notified here instantly.
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const isProject = item.type === 'project';
              const isMessage = item.type === 'message';

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    notificationService.markNotificationAsRead(item.id);
                    if (isProject && item.metadata?.projectId && onSelectProject) {
                      onSelectProject(item.metadata.projectId);
                      onClose();
                    } else if (isMessage && onOpenMessages) {
                      onOpenMessages();
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 hover:border-[#1E3A8A]/40 ${
                    !item.read
                      ? 'bg-blue-50/30 border-blue-100 shadow-2xs'
                      : 'bg-white border-gray-100 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isProject
                          ? 'bg-blue-50 text-[#1E3A8A] border border-blue-100'
                          : isMessage
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isProject ? (
                        <Car className="w-4 h-4" />
                      ) : isMessage ? (
                        <MessageSquare className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1F] truncate">
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-[#1E3A8A] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 leading-snug">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  {item.actionLabel && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        notificationService.markNotificationAsRead(item.id);
                        if (isProject && item.metadata?.projectId && onSelectProject) {
                          onSelectProject(item.metadata.projectId);
                          onClose();
                        } else if (isMessage && onOpenMessages) {
                          onOpenMessages();
                          onClose();
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#1E3A8A] hover:text-white text-gray-700 text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Auto-synced with Web Audio & Browser Notification API</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
