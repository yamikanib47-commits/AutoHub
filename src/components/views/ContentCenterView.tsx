import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Plus, 
  Send, 
  Bot, 
  Clock, 
  Copy, 
  Check, 
  ArrowRight, 
  Layers, 
  Film,
  Flame
} from 'lucide-react';
import { ContentItem } from '../../types';

interface ContentCenterViewProps {
  contentList: ContentItem[];
  onAddContent: (item: Omit<ContentItem, 'id'>) => void;
  onAskJarvis: (prompt: string) => void;
}

export const ContentCenterView: React.FC<ContentCenterViewProps> = ({
  contentList,
  onAddContent,
  onAskJarvis
}) => {
  const [mode, setMode] = useState<'PIPELINE' | 'AGENT'>('PIPELINE');
  const [topicFocus, setTopicFocus] = useState('Used German Performance Value & Common Traps');
  const [vehicleFocus, setVehicleFocus] = useState('BMW M340i, Audi S4/RS5, Porsche 718 Cayman');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Manual Add Form
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<ContentItem['platform']>('Reels');
  const [newHook, setNewHook] = useState('');
  const [newScript, setNewScript] = useState('');
  const [newVisual, setNewVisual] = useState('');
  const [newCta, setNewCta] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/content-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusTopic: topicFocus, vehicleType: vehicleFocus })
      });
      const data = await res.json();
      setGeneratedResult(data.content);
    } catch (err) {
      setGeneratedResult("Error generating concepts. JARVIS fallback: Create a 30s breakdown comparing 2018 Porsche Cayman 2.0T vs 2016 981 2.7L flat-six sound & depreciation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newHook.trim()) return;

    onAddContent({
      title: newTitle,
      platform: newPlatform,
      status: 'Idea',
      hook: newHook,
      script: newScript,
      visualAngle: newVisual,
      callToAction: newCta
    });

    setIsAddOpen(false);
    setNewTitle('');
    setNewHook('');
    setNewScript('');
    setNewVisual('');
    setNewCta('');
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#2D5CF6]" />
            <span className="text-[11px] font-extrabold text-[#2D5CF6] uppercase tracking-wider">
              Organic Demand Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1F] tracking-tight mt-1">
            CONTENT CENTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Short-form scripts, viral automotive hooks, visual staging angles, and AI Content Agent.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setMode(mode === 'PIPELINE' ? 'AGENT' : 'PIPELINE')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
              mode === 'AGENT'
                ? 'bg-[#1A1A1F] text-[#C8F169] border border-gray-800'
                : 'bg-[#F1FCE4] text-[#2c520a] hover:bg-[#E4F9AF]'
            }`}
          >
            <Bot className="w-4 h-4 text-[#2D5CF6]" />
            <span>{mode === 'AGENT' ? 'Back to Pipeline' : 'Launch Content Agent'}</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2D5CF6] hover:bg-[#2045cb] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Video Script</span>
          </button>
        </div>
      </div>

      {/* Mode: Content Agent Generator */}
      {mode === 'AGENT' && (
        <div className="bg-[#1A1A1F] text-white p-6 sm:p-7 rounded-3xl border border-gray-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2D5CF6] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-[#C8F169]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  AutoAce Weekly Content Agent
                </h3>
                <p className="text-xs text-gray-400">
                  Generate 3 high-converting concepts (Hook, Script, Visual Angle, CTA) calibrated for car enthusiasts.
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gray-300">
              Gemini 3.8 Flash Driven
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-300 block mb-1.5">Focus Topic or Angle</label>
              <input
                type="text"
                value={topicFocus}
                onChange={(e) => setTopicFocus(e.target.value)}
                placeholder="e.g. Depreciation curves, dealer trade-in traps, hidden inspection checks"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white focus:border-[#C8F169] outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-gray-300 block mb-1.5">Vehicle Targets</label>
              <input
                type="text"
                value={vehicleFocus}
                onChange={(e) => setVehicleFocus(e.target.value)}
                placeholder="e.g. BMW B58 / M340i, Porsche Macan S, Cayman, AMG C63"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white focus:border-[#C8F169] outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="w-full py-3 rounded-2xl bg-[#2D5CF6] hover:bg-[#2045cb] text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#C8F169]" />
            <span>{isGenerating ? 'Content Agent Synthesizing...' : 'Generate 3 Automotive Concepts'}</span>
          </button>

          {/* Generated Result Output */}
          {generatedResult && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-bold text-[#C8F169]">Generated Concepts for AutoAce:</span>
                <button
                  onClick={() => handleCopyText(generatedResult)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gray-300 hover:text-white cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>

              <div className="whitespace-pre-wrap text-gray-200 leading-relaxed font-normal">
                {generatedResult}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onAddContent({
                      title: 'Content Agent Sourced Reel',
                      platform: 'Reels',
                      status: 'Idea',
                      hook: 'Extracted from Content Agent generation',
                      script: generatedResult.slice(0, 200) + '...',
                      callToAction: 'DM SOURCED for clean enthusiast builds'
                    });
                    setMode('PIPELINE');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C8F169] text-[#1A1A1F] font-bold text-xs hover:bg-[#bce65b] cursor-pointer"
                >
                  Save to Content Pipeline
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Pipeline Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">
            Active Content Pipeline ({contentList.length})
          </h2>
          <span className="text-xs text-gray-400">Target: 4 reels / week</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentList.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs hover:border-[#2D5CF6]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-[#2D5CF6] uppercase">
                      {item.platform}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#1A1A1F] leading-snug mb-3">
                    {item.title}
                  </h3>

                  {/* Hook Box */}
                  <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-gray-100 mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      The Hook (First 3s)
                    </p>
                    <p className="text-xs font-semibold text-[#1A1A1F] italic">
                      "{item.hook}"
                    </p>
                  </div>

                  {item.script && (
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Script / Angle
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {item.script}
                      </p>
                    </div>
                  )}

                  {item.callToAction && (
                    <p className="text-[11px] text-gray-500 font-medium">
                      CTA: <strong className="text-[#2D5CF6]">{item.callToAction}</strong>
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">
                    {item.scheduledFor || 'Ready to film'}
                  </span>

                  <button
                    onClick={() => onAskJarvis(`Help me refine the short-form script and visual b-roll shots for this video: "${item.title}". Hook: "${item.hook}"`)}
                    className="inline-flex items-center gap-1 font-bold text-[#2D5CF6] hover:underline"
                  >
                    <span>Script with JARVIS</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Script Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <h2 className="text-lg font-black text-[#1A1A1F] mb-1">
              Add Video Script to Pipeline
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Enter hook, script notes, and call-to-action.
            </p>

            <form onSubmit={handleSaveManual} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Why Carvana Offers $8k Less on Used Porsche"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Platform</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6] bg-white"
                >
                  <option value="Reels">Instagram Reels</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Newsletter">Newsletter</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">The Hook (First 3 Seconds)</label>
                <textarea
                  rows={2}
                  required
                  value={newHook}
                  onChange={(e) => setNewHook(e.target.value)}
                  placeholder="The arresting opening phrase that stops the scroll..."
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Core Script (30-45 seconds)</label>
                <textarea
                  rows={3}
                  value={newScript}
                  onChange={(e) => setNewScript(e.target.value)}
                  placeholder="Point 1, Point 2, value takeaway..."
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Call To Action (CTA)</label>
                <input
                  type="text"
                  value={newCta}
                  onChange={(e) => setNewCta(e.target.value)}
                  placeholder="e.g. Comment SOURCED to get our private buyer wishlist"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#2D5CF6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2D5CF6] text-white font-bold hover:bg-[#2045cb] cursor-pointer"
                >
                  Save Script
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
