import React from 'react';
import { 
  LayoutDashboard, 
  Target,
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  Sparkles,
  X,
  Smartphone
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenMobileAppModal: () => void;
  pendingTasksCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onOpenMobileAppModal,
  pendingTasksCount = 12
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'Goals & KPIs', label: 'Goals & KPIs', icon: Target, badge: 'Core' },
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Tasks', label: 'Tasks', icon: CheckSquare, badge: `${pendingTasksCount}+` },
    { id: 'Calendar', label: 'Calendar', icon: Calendar },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'Team', label: 'Team', icon: Users },
  ];

  const generalItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'Settings', label: 'Settings', icon: Settings },
    { id: 'Help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 bottom-0 left-0 z-50
          w-64 bg-white flex flex-col justify-between p-6
          border-r border-gray-100 lg:border-r-0
          transition-transform duration-300 ease-in-out
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:rounded-3xl lg:my-0 shrink-0 select-none
        `}
      >
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between pb-8">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => {
                onSelectTab('Dashboard');
                onCloseMobile();
              }}
            >
              {/* Concentric Modern Blue Logo Icon */}
              <div className="w-8 h-8 rounded-full border-2 border-[#2D5CF6] flex items-center justify-center p-1">
                <div className="w-4 h-4 rounded-full border-2 border-[#2D5CF6] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2D5CF6]" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#1A1A1F]">
                Autoace Hub
              </span>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MENU Section */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-400 tracking-wider px-3 mb-2 uppercase">
              MENU
            </p>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <div key={item.id} className="relative flex items-center">
                    {/* Active Left Indicator Bar in Primary Blue */}
                    {isActive && (
                      <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#2D5CF6] rounded-r-full" />
                    )}

                    <button
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`
                        w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer
                        ${
                          isActive
                            ? 'text-[#1A1A1F] font-bold'
                            : 'text-gray-500 hover:text-[#1A1A1F] hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#2D5CF6]' : 'text-gray-400'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1A1A1F] text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* GENERAL Section */}
          <div className="mt-8 space-y-1">
            <p className="text-[11px] font-bold text-gray-400 tracking-wider px-3 mb-2 uppercase">
              GENERAL
            </p>
            <nav className="space-y-1">
              {generalItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer
                      ${
                        isActive
                          ? 'text-[#1A1A1F] font-bold'
                          : 'text-gray-500 hover:text-[#1A1A1F] hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Logout */}
              <button
                onClick={() => alert('Logged out successfully.')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-rose-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Download our Mobile App card (Themed in Dark Blue / Waves) */}
        <div className="mt-6 rounded-2xl p-4 relative overflow-hidden bg-dark-wave text-white border border-slate-800 shadow-md">
          {/* Subtle glow circle */}
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <Smartphone className="w-4 h-4 text-[#93C5FD]" />
          </div>

          <h4 className="text-sm font-bold text-white leading-tight">
            Download our Mobile App
          </h4>
          <p className="text-[11px] text-slate-300 mt-1 mb-4 font-normal">
            Get easy in another way
          </p>

          <button
            onClick={onOpenMobileAppModal}
            className="w-full py-2 px-3 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-xs font-bold text-white transition-all cursor-pointer shadow-xs active:scale-98"
          >
            Download
          </button>
        </div>
      </aside>
    </>
  );
};
