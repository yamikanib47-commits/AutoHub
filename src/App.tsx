import React, { useState, useEffect } from 'react';
import { 
  NavTab, 
  StatMetric, 
  ProjectItem, 
  TeamMember, 
  ReminderItem, 
  TaskItem,
  LeadItem,
  VehicleRequest,
  HQTask
} from './types';
import { 
  statMetrics as initialStatMetrics, 
  initialProjects, 
  initialTeamMembers, 
  initialReminder, 
  initialTasksList,
  initialLeads,
  initialRequests,
  initialTasks
} from './data/mockData';
import { autoAceDAL } from './services/dataAccessLayer';
import { BuyerRequestStatus } from './types/database';

// Layout & Core Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { JarvisAgentDrawer } from './components/JarvisAgentDrawer';

// Views
import { GoalsAndKpiViewer } from './components/kpi/GoalsAndKpiViewer';
import { DashboardView } from './components/views/DashboardView';
import { TasksView } from './components/views/TasksView';
import { CalendarView } from './components/views/CalendarView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { TeamView } from './components/views/TeamView';
import { GoogleSheetsView } from './components/views/GoogleSheetsView';
import { NotificationCenterView } from './components/views/NotificationCenterView';

// Notification System & Modals
import { NotificationToastContainer } from './components/NotificationToastContainer';
import { NotificationCenterModal } from './components/modals/NotificationCenterModal';
import { TeamMessagesModal } from './components/modals/TeamMessagesModal';
import { notificationService } from './services/notificationService';
import { HQNotification } from './types';

// Modals
import { AddProjectModal } from './components/modals/AddProjectModal';
import { AddMemberModal } from './components/modals/AddMemberModal';
import { MeetingModal } from './components/modals/MeetingModal';
import { ImportDataModal } from './components/modals/ImportDataModal';
import { MobileAppModal } from './components/modals/MobileAppModal';
import { SearchPaletteModal } from './components/modals/SearchPaletteModal';
import { LeadDetailModal } from './components/modals/LeadDetailModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('Dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data States - Synchronized with AutoAce Google Sheets Data Access Layer
  const [stats, setStats] = useState<StatMetric[]>(autoAceDAL.getDashboardStatMetrics());
  const [projects, setProjects] = useState<ProjectItem[]>(autoAceDAL.getDashboardProjects());
  const [conversionRate, setConversionRate] = useState(autoAceDAL.getFunnelConversionPercentage());
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [reminder, setReminder] = useState<ReminderItem>(initialReminder);
  const [tasksList, setTasksList] = useState<TaskItem[]>(initialTasksList);

  // Subscribe to live AutoAce DAL updates (triggered by Google Sheets sync or lead mutations)
  useEffect(() => {
    const syncFromDal = () => {
      setStats(autoAceDAL.getDashboardStatMetrics());
      setProjects(autoAceDAL.getDashboardProjects());
      setConversionRate(autoAceDAL.getFunnelConversionPercentage());
    };

    syncFromDal();
    return autoAceDAL.subscribe(syncFromDal);
  }, []);

  // AutoAce HQ Extended Data (for AI Co-pilot & Intelligence)
  const [leads] = useState<LeadItem[]>(initialLeads);
  const [requests] = useState<VehicleRequest[]>(initialRequests);
  const [hqTasks, setHqTasks] = useState<HQTask[]>(initialTasks);

  // Search & Global State
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ProjectItem | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isImportDataOpen, setIsImportDataOpen] = useState(false);
  const [isMobileAppOpen, setIsMobileAppOpen] = useState(false);
  const [isSearchPaletteOpen, setIsSearchPaletteOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isTeamMessagesOpen, setIsTeamMessagesOpen] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({ notifications: 0, messages: 0 });
  const [notificationsList, setNotificationsList] = useState<HQNotification[]>(notificationService.getNotifications());

  // Listen to live unread counts and notifications from notification service
  useEffect(() => {
    const unsubUnread = notificationService.subscribeToUnreadCounts(setUnreadCounts);
    const unsubNotifs = notificationService.subscribeToNotifications(setNotificationsList);
    return () => {
      unsubUnread();
      unsubNotifs();
    };
  }, []);

  const handleOpenProjectById = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setSelectedLead(found);
    }
  };

  // JARVIS Drawer state
  const [isJarvisOpen, setIsJarvisOpen] = useState(false);
  const [jarvisInitialPrompt, setJarvisInitialPrompt] = useState<string | undefined>(undefined);

  // Global Keyboard Shortcuts (⌘F for search, ⌘J for JARVIS)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsSearchPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsJarvisOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers - Mutates AutoAce DAL ensuring 100% synchronization with Google Sheets
  const handleAddProject = (newProjData: Omit<ProjectItem, 'id'>) => {
    const parts = newProjData.title.trim().split(' ');
    const make = parts[0] || 'Toyota';
    const model = parts.slice(1).join(' ') || 'Vehicle';
    const budgetNumber = parseInt((newProjData.dueDate || newProjData.budget || '150000').replace(/[^0-9]/g, '')) * 1000 || 150000;

    autoAceDAL.addBuyer({
      name: newProjData.buyerName || 'Lusaka Buyer',
      phone: newProjData.contact || '+260 97 000 0000',
      city: 'Lusaka',
      budget: budgetNumber > 10000 ? budgetNumber : 150000,
      preferred_make: make,
      preferred_model: model,
      preferred_year: 2016,
      lead_temperature: newProjData.priority === 'High' ? 'Hot' : 'Medium'
    });

    // Alert team and dispatch browser notification for new project
    notificationService.notifyProjectStatusUpdated({
      projectId: `lead-${Date.now()}`,
      projectTitle: newProjData.title,
      oldStatus: 'Inbound Intake',
      newStatus: newProjData.category || 'Matching Supply',
      buyerName: newProjData.buyerName,
    });
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: string) => {
    const existingProject = projects.find((p) => p.id === leadId);
    const oldStatus = existingProject?.category || 'Active';

    let buyerStatus: BuyerRequestStatus = 'Qualified';
    if (newStatus === 'Deal Closing' || newStatus === 'Deal Closed' || newStatus === 'Done') {
      buyerStatus = 'Purchased';
    } else if (newStatus === 'Inspection' || newStatus === 'Connected') {
      buyerStatus = 'Connected';
    } else if (newStatus === 'Contacted') {
      buyerStatus = 'Contacted';
    } else if (newStatus === 'Matching Supply' || newStatus === 'In Progress') {
      buyerStatus = 'Qualified';
    }
    autoAceDAL.updateBuyerStatus(leadId, buyerStatus);
    setSelectedLead((prev) => (prev && prev.id === leadId ? { ...prev, category: newStatus } : prev));

    // DISPATCH BROWSER NOTIFICATION & IN-APP TOAST
    notificationService.notifyProjectStatusUpdated({
      projectId: leadId,
      projectTitle: existingProject?.title || 'Vehicle Project',
      oldStatus,
      newStatus,
      buyerName: existingProject?.buyerName,
      onClick: () => {
        if (existingProject) {
          setSelectedLead({ ...existingProject, category: newStatus });
        }
      }
    });
  };

  const handleAddMember = (newMemberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...newMemberData,
      id: `m-${Date.now()}`
    };
    setTeamMembers((prev) => [newMember, ...prev]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasksList((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'Done' ? 'Todo' : 'Done' }
          : t
      )
    );
  };

  const handleAddTask = (newTaskData: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...newTaskData,
      id: `t-${Date.now()}`
    };
    setTasksList((prev) => [newTask, ...prev]);
  };

  const handleAddHQTask = (newTaskData: Omit<HQTask, 'id'>) => {
    const newTask: HQTask = {
      ...newTaskData,
      id: `hqt-${Date.now()}`
    };
    setHqTasks((prev) => [newTask, ...prev]);
  };

  const pendingTasksCount = tasksList.filter((t) => t.status !== 'Done').length;

  return (
    <div className="min-h-screen bg-[#ECEFF2] text-[#1A1A1F] p-3 sm:p-5 lg:p-6 flex flex-col justify-between selection:bg-[#2D5CF6] selection:text-white">
      <div className="max-w-[1600px] mx-auto w-full flex gap-5 lg:gap-6 flex-1 items-stretch">
        {/* Left Sidebar (Matching Screenshot with Blue Theme) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenMobileAppModal={() => setIsMobileAppOpen(true)}
          pendingTasksCount={pendingTasksCount}
          unreadNotificationsCount={unreadCounts.notifications}
          onOpenJarvis={() => {
            setJarvisInitialPrompt(undefined);
            setIsJarvisOpen(true);
          }}
        />

        {/* Main Dashboard / View Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onOpenSearch={() => setIsSearchPaletteOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleJarvis={() => {
              setJarvisInitialPrompt(undefined);
              setIsJarvisOpen(true);
            }}
            onOpenNotifications={() => setIsNotificationCenterOpen(true)}
            onOpenMessages={() => setIsTeamMessagesOpen(true)}
            unreadNotificationsCount={unreadCounts.notifications}
            unreadMessagesCount={unreadCounts.messages}
          />

          {/* Sub-Views Router */}
          <div className="flex-1">
            {(currentTab === 'Data Sync' || currentTab === 'Google Sheets DB') && (
              <GoogleSheetsView />
            )}

            {currentTab === 'Goals & KPIs' && (
              <GoalsAndKpiViewer />
            )}

            {currentTab === 'Notifications' && (
              <NotificationCenterView
                notifications={notificationsList}
                onMarkAllRead={() => notificationService.markAllNotificationsAsRead()}
                onSelectNotification={(n) => {
                  notificationService.markNotificationAsRead(n.id);
                  if (n.type === 'project' && n.metadata?.projectId) {
                    handleOpenProjectById(n.metadata.projectId);
                  } else if (n.type === 'message') {
                    setIsTeamMessagesOpen(true);
                  }
                }}
                onSelectTab={(tab) => setCurrentTab(tab as any)}
                onSelectProject={handleOpenProjectById}
                onOpenMessages={() => setIsTeamMessagesOpen(true)}
              />
            )}

            {currentTab === 'Dashboard' && (
              <DashboardView
                stats={stats}
                projects={projects}
                teamMembers={teamMembers}
                reminder={reminder}
                conversionRate={conversionRate}
                onOpenAddProject={() => setIsAddProjectOpen(true)}
                onOpenImportData={() => setIsImportDataOpen(true)}
                onOpenAddMember={() => setIsAddMemberOpen(true)}
                onStartMeeting={() => setIsMeetingOpen(true)}
                onSelectProject={(p) => setSelectedLead(p)}
                onSelectMember={(m) => alert(`Partner Yard: ${m.name} - ${m.taskTitle}`)}
                onNavigateToGoals={() => setCurrentTab('Goals & KPIs')}
                onNavigateToSheets={() => setCurrentTab('Data Sync')}
              />
            )}

            {currentTab === 'Tasks' && (
              <TasksView
                tasks={tasksList}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
              />
            )}

            {currentTab === 'Calendar' && (
              <CalendarView
                reminders={[reminder]}
                projects={projects}
              />
            )}

            {currentTab === 'Analytics' && (
              <AnalyticsView />
            )}

            {currentTab === 'Team' && (
              <TeamView
                members={teamMembers}
                onAddMember={() => setIsAddMemberOpen(true)}
              />
            )}

            {(currentTab === 'Settings' || currentTab === 'Help') && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-2xs text-center py-16">
                <h2 className="text-xl font-bold text-[#1A1A1F] mb-2">{currentTab}</h2>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  Manage organization settings, workspace preferences, member roles, and integrations.
                </p>
                <button
                  onClick={() => setCurrentTab('Dashboard')}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#2563EB] transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Persistent Global AI Assistant Drawer */}
      <JarvisAgentDrawer
        isOpen={isJarvisOpen}
        onClose={() => setIsJarvisOpen(false)}
        onAddTask={handleAddHQTask}
        leads={leads}
        requests={requests}
        tasks={hqTasks}
        initialPrompt={jarvisInitialPrompt}
      />

      {/* Modals */}
      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onAddProject={handleAddProject}
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={handleAddMember}
      />

      <MeetingModal
        isOpen={isMeetingOpen}
        onClose={() => setIsMeetingOpen(false)}
        meetingTitle={reminder.title}
        timeRange={reminder.timeRange}
      />

      <ImportDataModal
        isOpen={isImportDataOpen}
        onClose={() => setIsImportDataOpen(false)}
        onImportComplete={() => {
          setStats((prev) =>
            prev.map((s) => (s.id === '1' ? { ...s, value: Number(s.value) + 3 } : s))
          );
        }}
      />

      <MobileAppModal
        isOpen={isMobileAppOpen}
        onClose={() => setIsMobileAppOpen(false)}
      />

      <SearchPaletteModal
        isOpen={isSearchPaletteOpen}
        onClose={() => setIsSearchPaletteOpen(false)}
        projects={projects}
        teamMembers={teamMembers}
        tasks={tasksList}
        onSelectProject={(p) => {
          setSelectedLead(p);
          setIsSearchPaletteOpen(false);
        }}
        onSelectMember={(m) => alert(`Selected partner: ${m.name}`)}
      />

      {/* Lead Detail & Fast-Action Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={handleUpdateLeadStatus}
      />

      {/* Notification Center Popover & Browser Alert Management */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onSelectProject={handleOpenProjectById}
        onOpenMessages={() => {
          setIsNotificationCenterOpen(false);
          setIsTeamMessagesOpen(true);
        }}
      />

      {/* Team Dispatch & Messages Modal */}
      <TeamMessagesModal
        isOpen={isTeamMessagesOpen}
        onClose={() => setIsTeamMessagesOpen(false)}
        projects={projects}
        onSelectProject={handleOpenProjectById}
      />

      {/* High-Visibility Floating Browser Notification Toast Container */}
      <NotificationToastContainer
        onOpenProject={handleOpenProjectById}
        onOpenMessages={() => setIsTeamMessagesOpen(true)}
      />
    </div>
  );
}
