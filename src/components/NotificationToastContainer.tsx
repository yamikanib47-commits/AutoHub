import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, MessageSquare, ArrowRight, Bell, Car, Sparkles } from 'lucide-react';
import { notificationService, NotificationToast } from '../services/notificationService';

interface NotificationToastContainerProps {
  onOpenProject?: (projectId: string) => void;
  onOpenMessages?: () => void;
}

export const NotificationToastContainer: React.FC<NotificationToastContainerProps> = ({
  onOpenProject,
  onOpenMessages
}) => {
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  useEffect(() => {
    return notificationService.subscribeToToasts((updatedToasts) => {
      setToasts(updatedToasts);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <aside 
      aria-label="Notifications" 
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] pointer-events-none"
    >
      {toasts.map((toast) => {
        const isProject = toast.type === 'project';
        const isMessage = toast.type === 'message';

        return (
          <div
            key={toast.id}
            role="alert"
            className="pointer-events-auto bg-white rounded-2xl border border-gray-200/90 shadow-2xl p-4 transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-top-4 relative overflow-hidden group hover:border-[#1E3A8A]/50"
          >
            {/* Left Accent Stripe */}
            <div
              className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                isProject ? 'bg-[#1E3A8A]' : isMessage ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
            />

            <div className="flex items-start gap-3.5 pl-1.5">
              {/* Icon / Avatar */}
              {isMessage && toast.metadata?.senderAvatar ? (
                <div className="relative shrink-0">
                  <img
                    src={toast.metadata.senderAvatar}
                    alt={toast.metadata.senderName || 'Sender'}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-100"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                    <MessageSquare className="w-2.5 h-2.5 text-white" />
                  </span>
                </div>
              ) : (
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isProject
                      ? 'bg-blue-50 text-[#1E3A8A] border border-blue-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}
                >
                  {isProject ? (
                    <Car className="w-5 h-5" />
                  ) : isMessage ? (
                    <MessageSquare className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>
              )}

              {/* Message Content */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isProject
                        ? 'bg-blue-50 text-[#1E3A8A]'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isProject ? 'Project Status Updated' : isMessage ? 'New Team Message' : 'Alert'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {toast.timestamp}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1F] leading-tight truncate">
                  {toast.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-snug line-clamp-2">
                  {toast.message}
                </p>

                {/* Quick Actions */}
                <div className="mt-2.5 flex items-center gap-2">
                  {isProject && toast.metadata?.projectId && (
                    <button
                      onClick={() => {
                        notificationService.dismissToast(toast.id);
                        if (onOpenProject) {
                          onOpenProject(toast.metadata!.projectId!);
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>View Lead</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {isMessage && (
                    <button
                      onClick={() => {
                        notificationService.dismissToast(toast.id);
                        if (onOpenMessages) {
                          onOpenMessages();
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>Open Thread</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={() => notificationService.dismissToast(toast.id)}
                    className="px-2 py-1 text-[11px] font-semibold text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Close Cross */}
              <button
                onClick={() => notificationService.dismissToast(toast.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </aside>
  );
};
