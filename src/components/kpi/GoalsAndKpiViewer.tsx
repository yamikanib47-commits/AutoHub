import React, { useState } from 'react';
import { 
  Target, 
  ArrowRight, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  Sliders, 
  ShieldCheck, 
  Banknote, 
  Users, 
  Eye, 
  FileCheck, 
  Shuffle, 
  Star, 
  Clock, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { 
  AUTOACE_CORE_IDENTITY, 
  AUTOACE_PRIMARY_GOALS, 
  AUTOACE_90_DAY_TARGETS, 
  AUTOACE_FUNNEL_STAGES, 
  AUTOACE_KPI_DEFINITIONS, 
  DEFAULT_OPERATING_SNAPSHOT, 
  evaluateFunnelAndDiagnose 
} from '../../models/kpiModel';
import { OperatingMetricsSnapshot, FunnelStageId } from '../../types/kpi';

export const GoalsAndKpiViewer: React.FC = () => {
  const [snapshot, setSnapshot] = useState<OperatingMetricsSnapshot>(DEFAULT_OPERATING_SNAPSHOT);
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<FunnelStageId>('INTENT');
  const [activeScenario, setActiveScenario] = useState<string>('default');

  // Evaluate diagnoses with current snapshot
  const diagnoses = evaluateFunnelAndDiagnose(snapshot);

  // Preset scenarios to test JARVIS behavior
  const loadScenario = (scenarioKey: string) => {
    setActiveScenario(scenarioKey);
    switch (scenarioKey) {
      case 'leak_attention':
        // Scenario 1: Views high, but requests low
        setSnapshot({
          contentPublished: 24,
          contentViews: 22000,
          contentInteractions: 310,
          buyerRequests: 8, // Below target of 15
          sellerAgentRelationships: 10,
          qualifiedConnections: 6,
          hotLeadFollowUpRate: 100,
          closedDeals: 2,
          revenueZmw: 3800,
          googleReviews: 5
        });
        setSelectedFunnelStage('INTENT');
        break;

      case 'leak_fulfillment':
        // Scenario 2: Requests high, connections low
        setSnapshot({
          contentPublished: 18,
          contentViews: 11500,
          contentInteractions: 140,
          buyerRequests: 22, // Above target 20
          sellerAgentRelationships: 3, // bottleneck
          qualifiedConnections: 7, // Low fulfillment ratio
          hotLeadFollowUpRate: 100,
          closedDeals: 2,
          revenueZmw: 3500,
          googleReviews: 4
        });
        setSelectedFunnelStage('CONNECTION');
        break;

      case 'leak_closing':
        // Scenario 3: Connections high, deals low
        setSnapshot({
          contentPublished: 19,
          contentViews: 12000,
          contentInteractions: 130,
          buyerRequests: 21,
          sellerAgentRelationships: 12,
          qualifiedConnections: 16, // Strong connections
          hotLeadFollowUpRate: 98,
          closedDeals: 1, // Only 1 closed deal
          revenueZmw: 1800,
          googleReviews: 3
        });
        setSelectedFunnelStage('TRANSACTION');
        break;

      case 'leak_monetization':
        // Scenario 4: Deals high, revenue low
        setSnapshot({
          contentPublished: 20,
          contentViews: 13000,
          contentInteractions: 145,
          buyerRequests: 20,
          sellerAgentRelationships: 11,
          qualifiedConnections: 15,
          hotLeadFollowUpRate: 100,
          closedDeals: 4, // 4 deals closed!
          revenueZmw: 2900, // But only K2,900 revenue (under K5,000 target)
          googleReviews: 6
        });
        setSelectedFunnelStage('REVENUE');
        break;

      case 'balanced':
        // Healthy 90-day target achievement
        setSnapshot({
          contentPublished: 22,
          contentViews: 16000,
          contentInteractions: 180,
          buyerRequests: 23,
          sellerAgentRelationships: 12,
          qualifiedConnections: 17,
          hotLeadFollowUpRate: 100,
          closedDeals: 4,
          revenueZmw: 6400,
          googleReviews: 6
        });
        setSelectedFunnelStage('REVENUE');
        break;

      default:
        setSnapshot(DEFAULT_OPERATING_SNAPSHOT);
        setSelectedFunnelStage('INTENT');
        break;
    }
  };

  const primaryKpis = AUTOACE_KPI_DEFINITIONS.filter(k => k.category === 'PRIMARY');
  const leadingKpis = AUTOACE_KPI_DEFINITIONS.filter(k => k.category === 'LEADING');
  const supportingKpis = AUTOACE_KPI_DEFINITIONS.filter(k => k.category === 'SUPPORTING_ATTENTION');

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Top Banner: Core Business Premise & Cardinal Rule */}
      <div className="bg-gradient-to-r from-[#0F2347] via-[#16356B] to-[#1E3A8A] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-3 border border-white/10 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>AutoAce Foundation Model • Head Admin Yamikani Banda</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            AutoAce Goals & KPI Framework
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal mb-5">
            AutoAce is a <span className="text-white font-semibold underline decoration-blue-400 underline-offset-4">Zambian automotive demand-and-connection business</span>. 
            The most vital asset is genuine consumer demand and intent—not raw vehicle listings.
          </p>

          {/* Cardinal Rule Callout */}
          <div className="bg-black/20 rounded-2xl p-4 border border-white/10 flex items-start gap-3.5 backdrop-blur-xs">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-0.5">
                The Non-Negotiable AutoAce Rule
              </p>
              <p className="text-xs sm:text-sm text-gray-200 font-medium">
                "{AUTOACE_CORE_IDENTITY.operatingRule}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Primary Business Goals */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-base font-bold text-[#1A1A1F] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#1E3A8A]" />
              The 4 Primary Business Outcomes
            </h2>
            <p className="text-xs text-gray-500">
              AutoAce optimizes toward these four real outcomes over any vanity metrics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AUTOACE_PRIMARY_GOALS.map((goal) => (
            <div 
              key={goal.id}
              className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-xl bg-blue-50 text-[#1E3A8A] font-extrabold text-xs flex items-center justify-center border border-blue-100">
                    0{goal.number}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Core Outcome
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1A1F] mb-1.5">
                  {goal.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {goal.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-medium text-blue-900 bg-blue-50/60 -mx-2 -mb-2 p-2.5 rounded-xl">
                <span className="font-semibold text-gray-500">Asset:</span>
                <span className="truncate">{goal.assetFocus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 6-Stage Funnel & Leak Diagnostic Engine */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]" />
              <h2 className="text-base font-bold text-[#1A1A1F]">
                The AutoAce Conversion Funnel
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              The purpose of the KPI system is to identify exactly where this funnel is leaking.
            </p>
          </div>

          {/* Quick Scenario Tester for Head Admin & JARVIS */}
          <div className="flex items-center flex-wrap gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
            <span className="text-[11px] font-bold text-gray-400 px-2 flex items-center gap-1">
              <Sliders className="w-3 h-3" /> Test Scenarios:
            </span>
            {[
              { key: 'default', label: 'Benchmark' },
              { key: 'leak_attention', label: 'Leak: Intent Gap' },
              { key: 'leak_fulfillment', label: 'Leak: Supply Gap' },
              { key: 'leak_closing', label: 'Leak: Deal Drop' },
              { key: 'leak_monetization', label: 'Leak: Revenue' },
              { key: 'balanced', label: 'Target Hit' }
            ].map((sc) => (
              <button
                key={sc.key}
                onClick={() => loadScenario(sc.key)}
                className={`text-xs px-2.5 py-1 rounded-xl font-medium transition-all ${
                  activeScenario === sc.key
                    ? 'bg-[#1E3A8A] text-white shadow-2xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-black border border-gray-200/60'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Funnel Steps Visualizer */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
          {AUTOACE_FUNNEL_STAGES.map((stage, idx) => {
            const isSelected = selectedFunnelStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedFunnelStage(stage.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-blue-50/70 border-[#1E3A8A] ring-2 ring-blue-500/20 shadow-xs' 
                    : 'bg-gray-50/70 border-gray-200/80 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-[#1E3A8A] text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      0{stage.order}
                    </span>
                    {idx < AUTOACE_FUNNEL_STAGES.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-gray-400 hidden lg:block" />
                    )}
                  </div>
                  <p className="text-xs font-extrabold text-[#1A1A1F] uppercase tracking-wide">
                    {stage.name}
                  </p>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                    {stage.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200/60">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">
                    Stage Focus
                  </span>
                  <p className="text-[11px] font-medium text-gray-700 truncate">
                    {stage.metricLabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail & Diagnostic Callout */}
        {(() => {
          const stageInfo = AUTOACE_FUNNEL_STAGES.find(s => s.id === selectedFunnelStage);
          if (!stageInfo) return null;

          return (
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#1E3A8A] font-bold shadow-2xs">
                  0{stageInfo.order}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1A1F] uppercase tracking-wide">
                      Funnel Stage: {stageInfo.name} ({stageInfo.subtitle})
                    </span>
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    {stageInfo.description}
                  </p>
                </div>
              </div>

              <div className="bg-white px-3.5 py-2 rounded-xl border border-gray-200 shrink-0 text-left md:text-right">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">
                  Diagnostic Leak Question
                </span>
                <span className="font-semibold text-blue-900">
                  "{stageInfo.leakQuestion}"
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* JARVIS Intelligent Diagnostic Output (Direct Translation of Business Rules) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-blue-500 text-white flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1A1A1F]">
                JARVIS Funnel Intelligence & Leak Detector
              </h2>
              <p className="text-xs text-gray-500">
                Automated evaluation connecting current metrics to core business outcomes.
              </p>
            </div>
          </div>

          <button 
            onClick={() => loadScenario(activeScenario)}
            className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-evaluate
          </button>
        </div>

        <div className="space-y-3">
          {diagnoses.map((diag) => {
            const isCritical = diag.priorityLevel === 'CRITICAL';
            const isWarning = diag.priorityLevel === 'WARNING';
            const isHealthy = diag.priorityLevel === 'HEALTHY';

            return (
              <div 
                key={diag.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCritical 
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
                    : isWarning 
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    isCritical 
                      ? 'bg-rose-100 text-rose-700' 
                      : isWarning 
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {isHealthy ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {diag.headline}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isCritical 
                          ? 'bg-rose-600 text-white' 
                          : isWarning 
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        Stage: {diag.stageTriggered}
                      </span>
                    </div>

                    <p className="text-sm font-semibold my-1 leading-snug">
                      "{diag.diagnosticPrompt}"
                    </p>

                    <p className="text-xs opacity-90 leading-relaxed mt-2 pt-2 border-t border-current/10">
                      <strong className="font-bold">Operator Priority Action:</strong> {diag.recommendedAction}
                    </p>

                    <div className="flex items-center gap-2 mt-3 flex-wrap text-[11px] opacity-75">
                      <span className="font-medium">Metrics evaluated:</span>
                      {diag.metricsInvolved.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-black/5 font-mono text-[10px]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Hierarchy & 90-Day Working Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Primary & Leading KPIs vs 90-Day Targets */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-2xs space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-[#1A1A1F] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#1E3A8A]" />
                Primary KPIs (Operating Progress)
              </h2>
              <span className="text-[11px] font-bold text-[#1E3A8A] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                4 Primary Metrics
              </span>
            </div>
            <p className="text-xs text-gray-500">
              These determine whether the business is actually progressing toward revenue and closed deals.
            </p>
          </div>

          {/* Primary KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {primaryKpis.map((kpi) => {
              let currentValue = 0;
              let unitDisplay = kpi.unit;
              if (kpi.id === 'kpi_buyer_requests') currentValue = snapshot.buyerRequests;
              if (kpi.id === 'kpi_qualified_connections') currentValue = snapshot.qualifiedConnections;
              if (kpi.id === 'kpi_closed_deals') currentValue = snapshot.closedDeals;
              if (kpi.id === 'kpi_revenue') {
                currentValue = snapshot.revenueZmw;
                unitDisplay = 'ZMW (K)';
              }

              const progressPercent = Math.min(Math.round((currentValue / kpi.targetMonthly) * 100), 100);
              const isTargetReached = currentValue >= kpi.targetMonthly;

              return (
                <div key={kpi.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#1A1A1F]">{kpi.name}</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
                      {kpi.funnelStage}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-[#1A1A1F]">
                      {kpi.prefix || ''}{currentValue.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      / {kpi.prefix || ''}{kpi.targetMonthly.toLocaleString()} {unitDisplay}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-gray-500">90-Day Target</span>
                      <span className={`font-bold ${isTargetReached ? 'text-emerald-600' : 'text-blue-900'}`}>
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTargetReached ? 'bg-emerald-500' : 'bg-[#1E3A8A]'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-2.5 leading-tight">
                    {kpi.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Leading KPIs Section */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-[#1A1A1F] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Leading KPIs (Operational Levers)
              </h3>
              <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                Explains WHY Primary Moves
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Operational actions that directly generate and nurture demand.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {leadingKpis.map((kpi) => {
                let currentValue = 0;
                if (kpi.id === 'kpi_content_published') currentValue = snapshot.contentPublished;
                if (kpi.id === 'kpi_content_interactions') currentValue = snapshot.contentInteractions;
                if (kpi.id === 'kpi_seller_relationships') currentValue = snapshot.sellerAgentRelationships;
                if (kpi.id === 'kpi_hot_lead_followup') currentValue = snapshot.hotLeadFollowUpRate;
                if (kpi.id === 'kpi_google_reviews') currentValue = snapshot.googleReviews;

                return (
                  <div key={kpi.id} className="p-3.5 rounded-xl border border-gray-200 bg-white">
                    <span className="text-[11px] font-bold text-gray-700 block truncate">
                      {kpi.name}
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-lg font-extrabold text-[#1A1A1F]">
                        {currentValue}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        / {kpi.targetMonthly} {kpi.unit}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 line-clamp-2">
                      {kpi.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Anti-Vanity Metric Guardrail & 90-Day Target Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Vanity Metric Guardrail */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-3xl p-5 sm:p-6 text-[#1A1A1F]">
            <div className="flex items-center gap-2 mb-2 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Attention Metrics Discipline
              </h3>
            </div>
            
            <p className="text-xs text-amber-950 font-medium mb-3 leading-relaxed">
              <strong>Rule:</strong> Follower count and raw impressions are supporting attention metrics only. They must <strong>NEVER</strong> be counted as primary business progress.
            </p>

            <div className="space-y-2">
              {supportingKpis.map((kpi) => {
                const val = kpi.id === 'kpi_raw_views' ? snapshot.contentViews : 1240;
                return (
                  <div key={kpi.id} className="p-3 bg-white/90 rounded-xl border border-amber-200/70 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-gray-800">{kpi.name}</p>
                      <p className="text-[10px] text-gray-500">Supporting attention only</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-gray-900">{val.toLocaleString()}</span>
                      <span className="text-[10px] text-rose-600 block font-semibold">Not Primary</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 90-Day Target Quick Cheat Sheet */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs">
            <h3 className="text-sm font-bold text-[#1A1A1F] mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1E3A8A]" />
              90-Day Operating Targets
            </h3>
            <p className="text-[11px] text-gray-500 mb-4">
              Working targets to recalibrate after sufficient Zambian market data is collected.
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Buyer Requests', target: `${AUTOACE_90_DAY_TARGETS.buyerRequestsMonthly} / month` },
                { label: 'Qualified Connections', target: `${AUTOACE_90_DAY_TARGETS.qualifiedConnectionsMonthly} / month` },
                { label: 'Closed Deals', target: `${AUTOACE_90_DAY_TARGETS.closedDealsMonthly}+ / month` },
                { label: 'AutoAce Revenue', target: `K${AUTOACE_90_DAY_TARGETS.revenueZmwMonthly.toLocaleString()}+ / month` },
                { label: 'Seller/Agent Relationships', target: `${AUTOACE_90_DAY_TARGETS.newSellerRelationshipsMonthly} / month` },
                { label: 'Content Published', target: `${AUTOACE_90_DAY_TARGETS.contentPublishedMonthly} pieces / month` },
                { label: 'Hot-Lead Follow-Up', target: `${AUTOACE_90_DAY_TARGETS.hotLeadFollowUpRatePercent}% within 24 hours` },
                { label: 'Google Reviews', target: `${AUTOACE_90_DAY_TARGETS.googleReviewsMonthly} / month` }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-bold text-[#1A1A1F]">{item.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
