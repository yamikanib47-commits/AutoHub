import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Car, 
  CheckCheck, 
  Sparkles, 
  Bot, 
  Phone, 
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { TeamMessage, ProjectItem } from '../../types';

interface TeamMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: ProjectItem[];
  onSelectProject?: (projectId: string) => void;
}

export const TeamMessagesModal: React.FC<TeamMessagesModalProps> = ({
  isOpen,
  onClose,
  projects = [],
  onSelectProject
}) => {
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(notificationService.getTeamMessages());
    notificationService.markMessagesAsRead();

    // Subscribe to updates
    const unsubscribe = notificationService.subscribeToNotifications(() => {
      setMessages(notificationService.getTeamMessages());
    });

    return unsubscribe;
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const matchedProject = projects.find((p) => p.id === selectedProjectId);
    notificationService.addSentMessage(
      inputText.trim(),
      selectedProjectId || undefined,
      matchedProject?.title || undefined
    );

    setInputText('');
    setMessages(notificationService.getTeamMessages());

    // Auto-trigger realistic simulated response from the field agent after 2.5 seconds
    if (selectedProjectId || Math.random() > 0.3) {
      setTimeout(() => {
        notificationService.simulateIncomingPartnerMessage({
          name: 'Brian Chola',
          role: 'Field Agent (Kafue Road)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
          text: `Acknowledged, Yamikani. Confirming with the buyer right now. Will update project status in the pipeline shortly.`,
          projectTitle: matchedProject?.title || 'Active Deal'
        });
      }, 2500);
    }
  };

  const handleTriggerSimulatedMessage = () => {
    setIsSimulating(true);
    setTimeout(() => {
      notificationService.simulateIncomingPartnerMessage();
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 flex flex-col h-[85vh] max-h-[750px] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[#1A1A1F]">
                  Team Dispatch & Messages
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Channel
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Communication stream with field agents, consignment yards, and mechanics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerSimulatedMessage}
              disabled={isSimulating}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Test browser notification by simulating an incoming message from a partner"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulating...' : 'Simulate Partner Message'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F8FAFC]">
          {messages.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <MessageSquare className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p className="font-bold text-sm text-gray-600">No messages yet</p>
              <p className="text-xs">Send a message or test incoming partner dispatch.</p>
            </div>
          ) : (
            messages.slice().reverse().map((msg) => {
              const isMe = msg.senderId === 'yamikani-banda';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                    isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-gray-200 shrink-0 mt-0.5"
                  />

                  <div className={`space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                      <span className="font-bold text-gray-800">{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.senderRole}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-[#1E3A8A] text-white rounded-tr-xs font-medium'
                          : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.projectTitle && (
                        <div
                          onClick={() => {
                            if (msg.projectId && onSelectProject) {
                              onSelectProject(msg.projectId);
                              onClose();
                            }
                          }}
                          className={`mt-2 p-2 rounded-xl text-[11px] flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                            isMe
                              ? 'bg-blue-900/50 hover:bg-blue-900 text-blue-100 border border-blue-800'
                              : 'bg-blue-50/70 hover:bg-blue-100/70 text-[#1E3A8A] border border-blue-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <Car className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-bold truncate">Project: {msg.projectTitle}</span>
                          </div>
                          <span className="text-[10px] uppercase font-black opacity-75 shrink-0">
                            View &rarr;
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Project Tag Selector & Chat Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white space-y-2.5">
          {projects.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium shrink-0 flex items-center gap-1">
                <Car className="w-3.5 h-3.5" />
                <span>Link to Project:</span>
              </span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">None (General Team Broadcast)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message to field agents & partner yards..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white transition-all text-gray-800"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] disabled:opacity-40 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
