import React from 'react';
import { Search, Mail, Bell, Menu, Bot } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleJarvis?: () => void;
  onOpenNotifications?: () => void;
  onOpenMessages?: () => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
  searchQuery,
  onSearchChange,
  onToggleJarvis,
  onOpenNotifications,
  onOpenMessages,
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0
}) => {
  return (
    <header className="flex items-center justify-between gap-4 py-2 mb-6">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onOpenMobileMenu}
        className="lg:hidden p-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-2xs"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Pill Search Input with ⌘ F badge */}
      <div 
        onClick={onOpenSearch}
        className="flex-1 max-w-md bg-white rounded-full px-4 py-2.5 border border-gray-200/80 shadow-2xs flex items-center justify-between cursor-pointer hover:border-[#2D5CF6]/50 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-gray-400">
          <Search className="w-4 h-4" />
          <span className="text-xs sm:text-sm font-normal text-gray-400">
            {searchQuery || 'Search task'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
          <span>⌘</span>
          <span>F</span>
        </div>
      </div>

      {/* Right Controls: Mail, Notifications, Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Mail circle button */}
        <button
          onClick={onOpenMessages}
          className="w-10 h-10 rounded-full bg-white border border-gray-200/80 shadow-2xs flex items-center justify-center text-gray-600 hover:text-[#2D5CF6] hover:bg-gray-50 transition-colors cursor-pointer relative"
          aria-label={`Messages (${unreadMessagesCount} unread)`}
          title="Team Messages & Dispatch"
        >
          <Mail className="w-4 h-4" />
          {unreadMessagesCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-black absolute -top-1 -right-1 ring-2 ring-white flex items-center justify-center shadow-xs animate-in zoom-in-50">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        {/* Bell circle button with notification count */}
        <button
          onClick={onOpenNotifications}
          className="w-10 h-10 rounded-full bg-white border border-gray-200/80 shadow-2xs flex items-center justify-center text-gray-600 hover:text-[#2D5CF6] hover:bg-gray-50 transition-colors cursor-pointer relative"
          aria-label={`Notifications (${unreadNotificationsCount} unread)`}
          title="Notification Center & Browser Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#1E3A8A] text-white text-[10px] font-black absolute -top-1 -right-1 ring-2 ring-white flex items-center justify-center shadow-xs animate-in zoom-in-50">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Profile Pill */}
        <div 
          onClick={() => alert('User profile: Yamikani Banda (Head Admin)')}
          className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white rounded-full border border-gray-200/80 shadow-2xs cursor-pointer hover:border-gray-300 transition-colors"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face"
            alt="Yamikani Banda"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
          />
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-bold text-[#1A1A1F]">Yamikani Banda</p>
            <p className="text-[10px] text-gray-400 font-medium">Head Admin</p>
          </div>
        </div>

        {/* JARVIS Assistant Quick Toggle Button */}
        {onToggleJarvis && (
          <button
            onClick={onToggleJarvis}
            title="Open AI Assistant (⌘J)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-full bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#2563EB] transition-colors shadow-2xs cursor-pointer ml-1 shrink-0"
          >
            <Bot className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span className="hidden sm:inline">AI Co-Pilot</span>
          </button>
        )}
      </div>
    </header>
  );
};
