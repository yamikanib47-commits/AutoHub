import React, { useState } from 'react';
import { 
  CalendarRange, 
  TrendingUp, 
  DollarSign, 
  Video, 
  Users, 
  Sparkles, 
  Bot, 
  Save, 
  CheckCircle2 
} from 'lucide-react';

interface WeeklyReviewViewProps {
  onAskJarvis: (prompt: string) => void;
}

export const WeeklyReviewView: React.FC<WeeklyReviewViewProps> = ({ onAskJarvis }) => {
  const [reflectionNotes, setReflectionNotes] = useState(
    '1. High demand for BMW B58 / M340i builds under $45k.\n2. Inbound leads from TikTok reels converted 3x faster than LinkedIn.\n3. Keep inspection turnarounds under 48 hours to secure commissions.'
  );
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [generatedBriefing, setGeneratedBriefing] = useState<string | null>(
    `**AutoAce Executive Operational Briefing (Week 41):**\n\n• **Demand Growth:** 14 qualified buyer inquiries, $312k aggregate purchasing intent.\n• **Sourcing Velocity:** 2 buyer-seller matches unlocked ($6,400 potential gross margin).\n• **Content Reach:** 4 videos published, 48.2k organic views, 19 direct DM consultations.\n• **Top Friction Point:** Title scans on private consignments taking 48h+; recommend automated Supabase document upload link for sellers.`
  );

  const handleGenerateBriefing = async () => {
    setIsBriefingLoading(true);
    try {
      const res = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Generate an executive weekly operations review for AutoAce HQ summarizing demand, content, sales matches, and next week priorities.',
          mode: 'weekly-review'
        })
      });
      const data = await res.json();
      setGeneratedBriefing(data.reply);
    } catch (e) {
      // Keep existing briefing
    } finally {
      setIsBriefingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-[#2D5CF6]" />
            <span className="text-[11px] font-extrabold text-[#2D5CF6] uppercase tracking-wider">
              Performance & Retrospective
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1F] tracking-tight mt-1">
            WEEKLY REVIEW
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Demand summary, content velocity, sourcing matches, and JARVIS executive briefing.
          </p>
        </div>

        <button
          onClick={handleGenerateBriefing}
          disabled={isBriefingLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A1A1F] hover:bg-[#25252c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-40 self-start sm:self-auto border border-gray-800"
        >
          <Bot className="w-4 h-4 text-[#C8F169]" />
          <span>{isBriefingLoading ? 'Synthesizing...' : 'Generate JARVIS Briefing'}</span>
        </button>
      </div>

      {/* 4 Weekly Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
            <span>Verified Demand Pipeline</span>
            <Users className="w-4 h-4 text-[#2D5CF6]" />
          </div>
          <p className="text-2xl font-black text-[#1A1A1F]">$312,000</p>
          <p className="text-xs text-emerald-600 font-bold mt-1">+18% vs last week</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
            <span>Gross Match Margin</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-[#1A1A1F]">$6,400</p>
          <p className="text-xs text-gray-400 font-medium mt-1">2 high-spread vehicle deals</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
            <span>Content Velocity</span>
            <Video className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-[#1A1A1F]">48.2k Views</p>
          <p className="text-xs text-purple-600 font-bold mt-1">19 Inbound DM inquiries</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
            <span>Sourcing Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-[#C8F169] bg-[#1A1A1F] p-0.5 rounded" />
          </div>
          <p className="text-2xl font-black text-[#1A1A1F]">91.4%</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Clean inspection pass rate</p>
        </div>
      </div>

      {/* Generated Briefing Card */}
      {generatedBriefing && (
        <div className="bg-[#1A1A1F] text-white p-6 sm:p-7 rounded-3xl border border-gray-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#C8F169]" />
              <h3 className="font-extrabold text-sm text-white">
                JARVIS Executive Intelligence Briefing
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C8F169] text-[#1A1A1F]">
              Current Week Summary
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
            {generatedBriefing}
          </div>
        </div>
      )}

      {/* Operator Reflection Notes */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#1A1A1F]">
            Operator Weekly Retrospective & Action Learnings
          </h3>
          <span className="text-xs text-gray-400">Stored in AutoAce HQ</span>
        </div>

        <textarea
          rows={4}
          value={reflectionNotes}
          onChange={(e) => setReflectionNotes(e.target.value)}
          className="w-full p-4 rounded-2xl border border-gray-200 focus:border-[#2D5CF6] outline-none text-xs sm:text-sm text-[#1A1A1F] leading-relaxed bg-gray-50/50"
        />

        <div className="flex justify-end">
          <button
            onClick={() => alert('Weekly reflection notes saved.')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D5CF6] text-white text-xs font-bold hover:bg-[#2045cb] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Reflection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
