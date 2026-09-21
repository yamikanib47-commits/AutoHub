import { HQNotification, NotificationType, TeamMessage } from '../types';

export type BrowserPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

export interface NotificationToast {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  durationMs?: number;
  metadata?: {
    projectId?: string;
    projectTitle?: string;
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
    statusChange?: {
      oldStatus?: string;
      newStatus: string;
    };
  };
  onClick?: () => void;
}

type ToastListener = (toasts: NotificationToast[]) => void;
type NotificationListener = (notifications: HQNotification[]) => void;
type UnreadCountListener = (counts: { notifications: number; messages: number }) => void;

const NOTIFICATIONS_STORAGE_KEY = 'autoace_hq_notifications_v1';
const MESSAGES_STORAGE_KEY = 'autoace_hq_team_messages_v1';
const PREFS_STORAGE_KEY = 'autoace_hq_notification_prefs_v1';

export interface NotificationPreferences {
  browserNotificationsEnabled: boolean;
  soundEnabled: boolean;
  projectAlertsEnabled: boolean;
  messageAlertsEnabled: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  browserNotificationsEnabled: true,
  soundEnabled: true,
  projectAlertsEnabled: true,
  messageAlertsEnabled: true,
};

const INITIAL_TEAM_MESSAGES: TeamMessage[] = [
  {
    id: 'msg-1',
    senderId: 'brian-chola',
    senderName: 'Brian Chola',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    senderRole: 'Field Agent (Kafue Road)',
    text: 'Client inspected the 2018 Toyota Prado TX at Great East Motors. Suspension is spotless and chassis number verified.',
    timestamp: '12m ago',
    read: true,
    projectId: 'lead-1',
    projectTitle: 'Toyota Prado TX 150'
  },
  {
    id: 'msg-2',
    senderId: 'mutale-phiri',
    senderName: 'Mutale Phiri',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
    senderRole: 'Consignment Manager',
    text: 'Apex Auto Imports accepted our 3% commission agreement for the 2021 Hilux consignment. Buyer inspection booked for 15:00.',
    timestamp: '45m ago',
    read: true,
    projectId: 'lead-3',
    projectTitle: 'Toyota Hilux D-4D D/Cab'
  },
  {
    id: 'msg-3',
    senderId: 'derrick-hall',
    senderName: 'Derrick Hall',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    senderRole: 'Broker Partner',
    text: 'New 2017 Nissan X-Trail just landed from Durban port. In mint condition, ready for the Kitwe buyer.',
    timestamp: '2h ago',
    read: false,
    projectId: 'lead-2',
    projectTitle: 'Nissan X-Trail T31 Clean'
  }
];

class NotificationService {
  private toasts: NotificationToast[] = [];
  private notifications: HQNotification[] = [];
  private teamMessages: TeamMessage[] = [];
  private preferences: NotificationPreferences = DEFAULT_PREFS;
  private audioCtx: AudioContext | null = null;

  private toastListeners: Set<ToastListener> = new Set();
  private notificationListeners: Set<NotificationListener> = new Set();
  private unreadListeners: Set<UnreadCountListener> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    // Load preferences
    try {
      const savedPrefs = localStorage.getItem(PREFS_STORAGE_KEY);
      if (savedPrefs) {
        this.preferences = { ...DEFAULT_PREFS, ...JSON.parse(savedPrefs) };
      }
    } catch (e) {
      console.warn('Failed to load notification prefs:', e);
    }

    // Load notifications
    try {
      const savedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications);
      } else {
        this.notifications = [
          {
            id: 'notif-seed-1',
            type: 'project',
            title: 'Project Status Updated: Mercedes C200',
            message: 'Deal Closing phase initiated. Buyer financing cleared with Prime Motors.',
            timestamp: '15m ago',
            read: false,
            actionLabel: 'View Project',
            metadata: {
              projectId: 'lead-4',
              projectTitle: 'Mercedes-Benz C200 W204',
              statusChange: {
                oldStatus: 'Inspection Stage',
                newStatus: 'Deal Closing'
              }
            }
          },
          {
            id: 'notif-seed-2',
            type: 'message',
            title: 'Team Message: Derrick Hall',
            message: 'New 2017 Nissan X-Trail just landed from Durban port.',
            timestamp: '2h ago',
            read: false,
            actionLabel: 'Reply',
            metadata: {
              senderId: 'derrick-hall',
              senderName: 'Derrick Hall',
              senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face'
            }
          }
        ];
        this.saveNotifications();
      }
    } catch (e) {
      console.warn('Failed to load notifications:', e);
    }

    // Load team messages
    try {
      const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (savedMessages) {
        this.teamMessages = JSON.parse(savedMessages);
      } else {
        this.teamMessages = INITIAL_TEAM_MESSAGES;
        this.saveMessages();
      }
    } catch (e) {
      console.warn('Failed to load team messages:', e);
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(this.notifications.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to save notifications:', e);
    }
    this.notifyNotificationListeners();
    this.notifyUnreadListeners();
  }

  private saveMessages() {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(this.teamMessages));
    } catch (e) {
      console.warn('Failed to save messages:', e);
    }
    this.notifyUnreadListeners();
  }

  private savePreferences() {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (e) {
      console.warn('Failed to save preferences:', e);
    }
  }

  // --- Browser Notification API Methods ---

  public getBrowserPermission(): BrowserPermissionStatus {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission as BrowserPermissionStatus;
  }

  public async requestBrowserPermission(): Promise<BrowserPermissionStatus> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.preferences.browserNotificationsEnabled = true;
        this.savePreferences();
        // Send confirmation welcome notification
        this.dispatchBrowserNotification(
          '🔔 AutoAce Notifications Enabled',
          'You will now receive desktop alerts whenever a project status changes or a teammate sends a message.'
        );
      }
      return permission as BrowserPermissionStatus;
    } catch (err) {
      console.warn('Could not request notification permission:', err);
      return this.getBrowserPermission();
    }
  }

  public setPreferences(newPrefs: Partial<NotificationPreferences>) {
    this.preferences = { ...this.preferences, ...newPrefs };
    this.savePreferences();
  }

  public getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // Dual-tone subtle pleasant alert sound
  private playSound() {
    if (!this.preferences.soundEnabled) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch (err) {
      // Graceful silence on restricted autoplay
    }
  }

  private dispatchBrowserNotification(title: string, body: string, iconUrl?: string, onClick?: () => void) {
    if (!this.preferences.browserNotificationsEnabled) return;
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        body,
        icon: iconUrl || '/public/favicon.ico',
        badge: '/public/favicon.ico',
        tag: `autoace-${Date.now()}`
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (onClick) onClick();
      };
    } catch (err) {
      console.warn('Browser notification dispatch failed (possibly running in sandboxed iframe):', err);
    }
  }

  // --- Public Trigger: Project Status Updated ---
  public notifyProjectStatusUpdated(params: {
    projectId: string;
    projectTitle: string;
    newStatus: string;
    oldStatus?: string;
    buyerName?: string;
    assignedAgent?: string;
    onClick?: () => void;
  }) {
    if (!this.preferences.projectAlertsEnabled) return;

    const title = `Project Status: ${params.projectTitle}`;
    const buyerInfo = params.buyerName ? ` (Buyer: ${params.buyerName})` : '';
    const message = `Status changed to "${params.newStatus}"${buyerInfo}. All team members notified.`;

    // 1. Play subtle audio chime
    this.playSound();

    // 2. Dispatch native desktop notification
    this.dispatchBrowserNotification(
      `📋 ${title}`,
      message,
      undefined,
      params.onClick
    );

    // 3. Add to in-app notification center log
    const newNotif: HQNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'project',
      title,
      message,
      timestamp: 'Just now',
      read: false,
      actionLabel: 'View Project',
      metadata: {
        projectId: params.projectId,
        projectTitle: params.projectTitle,
        statusChange: {
          oldStatus: params.oldStatus,
          newStatus: params.newStatus
        }
      }
    };

    this.notifications = [newNotif, ...this.notifications];
    this.saveNotifications();

    // 4. Slide in in-app floating banner toast
    this.addToast({
      id: `toast-${Date.now()}`,
      type: 'project',
      title,
      message,
      timestamp: 'Just now',
      durationMs: 6000,
      metadata: newNotif.metadata,
      onClick: params.onClick
    });
  }

  // --- Public Trigger: New Team Message Received ---
  public notifyNewTeamMessage(message: TeamMessage, onOpenThread?: () => void) {
    if (!this.preferences.messageAlertsEnabled) return;

    // 1. Play audio chime
    this.playSound();

    // 2. Dispatch native desktop notification
    const projectContext = message.projectTitle ? ` regarding ${message.projectTitle}` : '';
    const bodyText = `${message.senderName} (${message.senderRole}): "${message.text}"`;

    this.dispatchBrowserNotification(
      `💬 New Message: ${message.senderName}${projectContext}`,
      message.text,
      message.senderAvatar,
      onOpenThread
    );

    // 3. Store message in local messages log
    this.teamMessages = [message, ...this.teamMessages];
    this.saveMessages();

    // 4. Add to Notification Log
    const newNotif: HQNotification = {
      id: `notif-msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'message',
      title: `Team Message: ${message.senderName}`,
      message: message.text,
      timestamp: 'Just now',
      read: false,
      actionLabel: 'Open Chat',
      metadata: {
        projectId: message.projectId,
        projectTitle: message.projectTitle,
        senderId: message.senderId,
        senderName: message.senderName,
        senderAvatar: message.senderAvatar
      }
    };

    this.notifications = [newNotif, ...this.notifications];
    this.saveNotifications();

    // 5. Slide in floating toast
    this.addToast({
      id: `toast-${Date.now()}`,
      type: 'message',
      title: `${message.senderName} • ${message.senderRole}`,
      message: message.text,
      timestamp: 'Just now',
      durationMs: 6500,
      metadata: newNotif.metadata,
      onClick: onOpenThread
    });
  }

  // --- Toast Management ---
  private addToast(toast: NotificationToast) {
    this.toasts = [toast, ...this.toasts].slice(0, 4);
    this.notifyToastListeners();

    // Auto dismiss
    const duration = toast.durationMs || 5000;
    setTimeout(() => {
      this.dismissToast(toast.id);
    }, duration);
  }

  public dismissToast(toastId: string) {
    this.toasts = this.toasts.filter((t) => t.id !== toastId);
    this.notifyToastListeners();
  }

  // --- Notification Log Management ---
  public getNotifications(): HQNotification[] {
    return [...this.notifications];
  }

  public markNotificationAsRead(id: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveNotifications();
  }

  public markAllNotificationsAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.saveNotifications();
  }

  public clearAllNotifications() {
    this.notifications = [];
    this.saveNotifications();
  }

  // --- Team Messages Management ---
  public getTeamMessages(): TeamMessage[] {
    return [...this.teamMessages];
  }

  public addSentMessage(text: string, projectId?: string, projectTitle?: string): TeamMessage {
    const newMsg: TeamMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'yamikani-banda',
      senderName: 'Yamikani Banda',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
      senderRole: 'Head Admin',
      text,
      timestamp: 'Just now',
      read: true,
      projectId,
      projectTitle
    };

    this.teamMessages = [newMsg, ...this.teamMessages];
    this.saveMessages();
    return newMsg;
  }

  public markMessagesAsRead() {
    this.teamMessages = this.teamMessages.map((m) => ({ ...m, read: true }));
    this.saveMessages();
  }

  // Helper to simulate an incoming message (for immediate testing & verification)
  public simulateIncomingPartnerMessage(partner?: { 
    name: string; 
    role: string; 
    text: string; 
    projectTitle: string; 
    avatar?: string;
  }) {
    const templates = [
      {
        name: 'Brian Chola',
        role: 'Field Agent (Kafue Road)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
        text: 'Buyer just deposited K15,000 reservation fee for the Hilux. Ready for title transfer paperwork.',
        projectTitle: 'Toyota Hilux D-4D D/Cab'
      },
      {
        name: 'Derrick Hall',
        role: 'Consignment Broker',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
        text: 'Clean 2020 Land Cruiser Prado available at Great East yard. Mileage is only 42,000km.',
        projectTitle: 'Toyota Prado TX 150'
      },
      {
        name: 'Mutale Phiri',
        role: 'Inspection Lead',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
        text: 'Full 85-point inspection completed on Nissan X-Trail. Gearbox and engine in superb condition.',
        projectTitle: 'Nissan X-Trail T31 Clean'
      }
    ];

    const pick = partner || templates[Math.floor(Math.random() * templates.length)];
    const simulatedMsg: TeamMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      senderId: pick.name.toLowerCase().replace(/\s+/g, '-'),
      senderName: pick.name,
      senderAvatar: (pick as any).avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      senderRole: pick.role,
      text: pick.text,
      timestamp: 'Just now',
      read: false,
      projectTitle: pick.projectTitle
    };

    this.notifyNewTeamMessage(simulatedMsg);
  }

  // --- Subscriptions ---
  public subscribeToToasts(listener: ToastListener): () => void {
    this.toastListeners.add(listener);
    listener([...this.toasts]);
    return () => this.toastListeners.delete(listener);
  }

  public subscribeToNotifications(listener: NotificationListener): () => void {
    this.notificationListeners.add(listener);
    listener([...this.notifications]);
    return () => this.notificationListeners.delete(listener);
  }

  public subscribeToUnreadCounts(listener: UnreadCountListener): () => void {
    this.unreadListeners.add(listener);
    this.notifyUnreadListeners();
    return () => this.unreadListeners.delete(listener);
  }

  private notifyToastListeners() {
    this.toastListeners.forEach((l) => l([...this.toasts]));
  }

  private notifyNotificationListeners() {
    this.notificationListeners.forEach((l) => l([...this.notifications]));
  }

  private notifyUnreadListeners() {
    const counts = {
      notifications: this.notifications.filter((n) => !n.read).length,
      messages: this.teamMessages.filter((m) => !m.read).length
    };
    this.unreadListeners.forEach((l) => l(counts));
  }
}

export const notificationService = new NotificationService();
