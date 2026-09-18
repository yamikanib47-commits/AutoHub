import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Send, 
  Check, 
  Copy, 
  ListFilter, 
  FileText, 
  Users, 
  Lightbulb, 
  ArrowRight
} from 'lucide-react';
import { HQTask, LeadItem, VehicleRequest } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  actionType?: 'task' | 'content' | 'lead';
}

interface JarvisAgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask?: (task: Omit<HQTask, 'id'>) => void;
  leads?: LeadItem[];
  requests?: VehicleRequest[];
  tasks?: HQTask[];
  initialPrompt?: string;
}

export const JarvisAgentDrawer: React.FC<JarvisAgentDrawerProps> = ({
  isOpen,
  onClose,
  onAddTask,
  leads = [],
  requests = [],
  tasks = [],
  initialPrompt
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'jarvis',
      text: "Good day, Operator. JARVIS operational. What should we execute next for AutoAce?",
      timestamp: 'Active Now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const quickActionChips = [
    { label: 'Diagnose Funnel Leaks', prompt: 'Evaluate the AutoAce 6-stage funnel (Attention -> Interest -> Intent -> Connection -> Transaction -> Revenue). Where are we currently leaking?' },
    { label: 'Check 90-Day Targets', prompt: 'Review our progress against our 90-day working targets (20 buyer requests, 15 connections, 3+ deals, K5,000+ revenue).' },
    { label: 'Prioritize Work', prompt: 'Using our primary business goals (Demand, Connections, Deals, Revenue), what should I prioritize today as Head Admin?' },
    { label: 'Demand Content Script', prompt: 'Draft a Zambian automotive video hook and script designed to generate concrete buyer requests, not just empty views.' },
    { label: 'Fulfillment Capacity', prompt: 'If buyer requests increase to 20/month, what seller and agent relationships do we need in Lusaka to prevent fulfillment bottlenecks?' }
  ];

  const handleSendMessage = async (promptToSend?: string) => {
    const textToSend = promptToSend || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!promptToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: {
            activeLeadsCount: leads.length,
            hotLeads: leads.filter((l) => l.status === 'HOT').map((l) => ({ name: l.name, car: l.vehicleInterest })),
            matchedRequests: requests.filter((r) => r.status === 'Matched').length,
            uncompletedTasksCount: tasks.filter((t) => !t.completed).length
          }
        })
      });

      const data = await response.json();
      const replyText = data.reply || "JARVIS: Directives updated. Moving to next checkpoint.";

      const jarvisMessage: Message = {
        id: `j-${Date.now()}`,
        sender: 'jarvis',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: textToSend.toLowerCase().includes('task') ? 'task' : undefined
      };

      setMessages((prev) => [...prev, jarvisMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `j-err-${Date.now()}`,
          sender: 'jarvis',
          text: "Priority assessment: Connect with Marcus Vance on the M340i xDrive, record the depreciation reel before 3 PM, and keep execution focused.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickAddAsTask = (text: string) => {
    if (!onAddTask) return;
    const title = text.split('\n')[0].replace(/[*#]/g, '').trim().slice(0, 70);
    onAddTask({
      title: title || 'Execute JARVIS recommendation',
      category: 'AUTOACE',
      priority: 'High',
      dueDate: 'Today',
      completed: false
    });
    alert('Task created from JARVIS recommendation.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white h-full flex flex-col shadow-2xl z-10 border-l border-gray-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#1A1A1F] text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2D5CF6] flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5 text-[#C8F169]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  JARVIS
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C8F169] text-[#1A1A1F]">
                  Side Agent
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">AutoAce Operations Intelligence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close JARVIS"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action suggestion chips */}
        <div className="p-3 bg-gray-50 border-b border-gray-100 overflow-x-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
            Quick Operations Directives
          </p>
          <div className="flex gap-1.5 whitespace-nowrap pb-1">
            {quickActionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white hover:bg-[#EEF2FF] text-[#1A1A1F] hover:text-[#2D5CF6] border border-gray-200 transition-colors cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FBFBFA]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#1A1A1F] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-[#C8F169]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#2D5CF6] text-white rounded-tr-none shadow-xs font-medium'
                      : 'bg-white text-[#1A1A1F] border border-gray-200/90 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  
                  {/* Footer actions on JARVIS responses */}
                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span>{msg.timestamp}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="flex items-center gap-1 hover:text-[#2D5CF6] transition-colors cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        {onAddTask && (
                          <button
                            onClick={() => handleQuickAddAsTask(msg.text)}
                            className="flex items-center gap-1 hover:text-[#2D5CF6] transition-colors cursor-pointer font-semibold"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-[#2D5CF6]" />
                            <span>Save as Task</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-gray-500">
              <div className="w-7 h-7 rounded-lg bg-[#1A1A1F] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#C8F169] animate-spin" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-2xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D5CF6] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D5CF6] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D5CF6] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-gray-500 font-medium ml-1">JARVIS analyzing AutoAce operations...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask JARVIS or give an instruction..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2D5CF6] focus:ring-2 focus:ring-[#2D5CF6]/10 outline-none text-xs sm:text-sm text-[#1A1A1F] placeholder-gray-400 bg-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-[#2D5CF6] hover:bg-[#224dd1] text-white font-bold transition-all disabled:opacity-40 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-[10px] text-gray-400">Powered by Gemini 3.8 Flash & AutoAce Memory</span>
            <span className="text-[10px] text-gray-400">Tone: Concise & Practical</span>
          </div>
        </div>
      </div>
    </div>
  );
};
