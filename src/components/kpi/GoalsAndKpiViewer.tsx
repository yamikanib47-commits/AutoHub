import React, { useState } from 'react';
import { 
  Target, 
  ArrowRight, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Users, 
  Clock, 
  RefreshCw,
  Layers,
  FileText,
  Activity,
  ChevronRight
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

type KpiSection = 'overview' | 'funnel' | 'kpis' | 'principles';

export const GoalsAndKpiViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<KpiSection>('overview');
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

  const criticalIssuesCount = diagnoses.filter(d => d.priorityLevel === 'CRITICAL').length;
  const warningIssuesCount = diagnoses.filter(d => d.priorityLevel === 'WARNING').length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* 1. Header: Standardized with AutoAce Design System */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1F] tracking-tight">Goals & KPI Framework</h1>
          <p className="text-sm text-gray-500">
            Strategic outcome benchmarks, pipeline leak diagnostics, and demand-first performance metrics
          </p>
        </div>

        {/* Quick Scenario Tester Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-gray-200 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 px-2.5 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-[#1E3A8A]" /> Sim:
            </span>
            {[
              { key: 'default', label: 'Benchmark' },
              { key: 'leak_attention', label: 'Intent Leak' },
              { key: 'leak_fulfillment', label: 'Supply Bottleneck' },
              { key: 'leak_closing', label: 'Deal Drop' },
              { key: 'balanced', label: 'Target Hit' }
            ].map((sc) => (
              <button
                key={sc.key}
                onClick={() => loadScenario(sc.key)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                  activeScenario === sc.key
                    ? 'bg-[#1E3A8A] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => loadScenario('default')}
            title="Reset to default benchmark"
            className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Primary Navigation Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-gray-100 shadow-2xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'overview' as const, label: 'Executive Overview', icon: Activity },
            { id: 'funnel' as const, label: 'Funnel & Diagnostics', icon: Layers, badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} Alert` : undefined },
            { id: 'kpis' as const, label: 'KPI Metrics & Targets', icon: Target },
            { id: 'principles' as const, label: 'Strategic Outcomes', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-3 text-xs text-gray-500 hidden sm:flex">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Active Phase: 90-Day Market Calibration</span>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Non-Negotiable Operating Rule Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-2xs relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1E3A8A] text-xs font-bold border border-blue-100/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  <span>The Non-Negotiable AutoAce Cardinal Rule</span>
                </div>
                <h2 className="text-xl font-bold text-[#1A1A1F] leading-snug">
                  "{AUTOACE_CORE_IDENTITY.operatingRule}"
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  AutoAce is a <span className="font-semibold text-[#1A1A1F]">Zambian automotive demand-and-connection platform</span>. 
                  The primary strategic asset is verified consumer buying intent—not raw vehicle listings.
                </p>
              </div>

              <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block">Executive Admin</span>
                  <span className="text-xs font-bold text-[#1A1A1F]">Yamikani Banda</span>
                </div>
                <button
                  onClick={() => setActiveSection('funnel')}
                  className="px-4 py-2 rounded-full bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#2563EB] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Inspect Funnel</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Core 4 KPIs Snapshot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div 
                  key={kpi.id} 
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs hover:border-blue-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#1A1A1F] truncate pr-2">{kpi.name}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-[#1E3A8A] border border-blue-100/60">
                        {kpi.funnelStage}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-black text-[#1A1A1F]">
                        {kpi.prefix || ''}{currentValue.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        / {kpi.prefix || ''}{kpi.targetMonthly.toLocaleString()} {unitDisplay}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-gray-400 font-medium">90-Day Target</span>
                      <span className={`font-bold ${isTargetReached ? 'text-emerald-700' : 'text-[#1E3A8A]'}`}>
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTargetReached ? 'bg-emerald-500' : 'bg-[#1E3A8A]'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Diagnostic Alert Banner */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1F]">Current Jarvis Intelligence Evaluation</h3>
                  <p className="text-xs text-gray-400">Automated diagnostic rules linking metrics to concrete business operations</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                criticalIssuesCount > 0 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : warningIssuesCount > 0
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {criticalIssuesCount > 0 ? `${criticalIssuesCount} Critical Bottleneck` : warningIssuesCount > 0 ? `${warningIssuesCount} Attention Needed` : 'All Systems Healthy'}
              </span>
            </div>

            <div className="space-y-3">
              {diagnoses.slice(0, 2).map((diag) => {
                const isCritical = diag.priorityLevel === 'CRITICAL';
                const isWarning = diag.priorityLevel === 'WARNING';
                return (
                  <div
                    key={diag.id}
                    className={`p-4 rounded-2xl border text-xs ${
                      isCritical
                        ? 'bg-rose-50/50 border-rose-100 text-rose-950'
                        : isWarning
                        ? 'bg-amber-50/50 border-amber-100 text-amber-950'
                        : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                        isCritical ? 'bg-rose-100 text-rose-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isCritical || isWarning ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold uppercase tracking-wide text-[11px]">{diag.headline}</span>
                          <span className="font-semibold text-[10px] text-gray-500">Stage: {diag.stageTriggered}</span>
                        </div>
                        <p className="font-medium text-gray-800 mt-1">"{diag.diagnosticPrompt}"</p>
                        <p className="text-gray-600 mt-1.5 pt-1.5 border-t border-gray-200/50">
                          <strong className="text-gray-900">Recommended Action:</strong> {diag.recommendedAction}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FUNNEL & DIAGNOSTICS */}
      {activeSection === 'funnel' && (
        <div className="space-y-6">
          {/* Funnel Visualizer */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#1A1A1F]">The 6-Stage Conversion Funnel</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Click any stage below to inspect diagnostic leak questions and operational targets.
              </p>
            </div>

            {/* 6 Stage Flow Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {AUTOACE_FUNNEL_STAGES.map((stage, idx) => {
                const isSelected = selectedFunnelStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedFunnelStage(stage.id)}
                    className={`text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50/80 border-[#1E3A8A] ring-2 ring-blue-500/20 shadow-xs' 
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          isSelected ? 'bg-[#1E3A8A] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          0{stage.order}
                        </span>
                        {idx < AUTOACE_FUNNEL_STAGES.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-gray-300 hidden lg:block" />
                        )}
                      </div>
                      <p className="text-xs font-bold text-[#1A1A1F] uppercase tracking-wide">
                        {stage.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-snug">
                        {stage.subtitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Focus</span>
                      <p className="text-[11px] font-bold text-[#1E3A8A] truncate mt-0.5">
                        {stage.metricLabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Funnel Stage Detail Card */}
            {(() => {
              const stageInfo = AUTOACE_FUNNEL_STAGES.find(s => s.id === selectedFunnelStage);
              if (!stageInfo) return null;

              return (
                <div className="bg-gray-50/60 rounded-2xl p-5 border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      0{stageInfo.order}
                    </div>
                    <div>
                      <div className="font-bold text-[#1A1A1F] text-sm">
                        Stage {stageInfo.order}: {stageInfo.name} ({stageInfo.subtitle})
                      </div>
                      <p className="text-gray-500 mt-0.5 leading-relaxed">
                        {stageInfo.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shrink-0 text-left md:text-right shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      Diagnostic Leak Question
                    </span>
                    <span className="font-bold text-[#1E3A8A]">
                      "{stageInfo.leakQuestion}"
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Full Jarvis Diagnostic Engine Output */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1A1A1F] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Jarvis Automated Leak Diagnoses</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Complete evaluation across all 6 stages based on current operational metrics.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">
                  {diagnoses.length} Evaluation Rules Tested
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {diagnoses.map((diag) => {
                const isCritical = diag.priorityLevel === 'CRITICAL';
                const isWarning = diag.priorityLevel === 'WARNING';
                const isHealthy = diag.priorityLevel === 'HEALTHY';

                return (
                  <div 
                    key={diag.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCritical 
                        ? 'bg-rose-50/50 border-rose-200/70 text-rose-950' 
                        : isWarning 
                        ? 'bg-amber-50/50 border-amber-200/70 text-amber-950'
                        : 'bg-emerald-50/50 border-emerald-200/70 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
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
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            isCritical 
                              ? 'bg-rose-600 text-white' 
                              : isWarning 
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            Stage: {diag.stageTriggered}
                          </span>
                        </div>

                        <p className="text-sm font-semibold my-1 text-[#1A1A1F] leading-snug">
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
        </div>
      )}

      {/* SECTION 3: KPI METRICS & TARGETS */}
      {activeSection === 'kpis' && (
        <div className="space-y-6">
          {/* Primary vs 90-Day Working Targets */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1A1A1F] flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Primary KPIs (Operating Progress)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Direct measures of whether the business is turning buyer attention into completed deals.
                </p>
              </div>
              <span className="text-xs font-bold text-[#1E3A8A] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                4 Primary Metrics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div key={kpi.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-200 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#1A1A1F]">{kpi.name}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-[#1E3A8A] border border-blue-100/60">
                        {kpi.funnelStage}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-black text-[#1A1A1F]">
                        {kpi.prefix || ''}{currentValue.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        / {kpi.prefix || ''}{kpi.targetMonthly.toLocaleString()} {unitDisplay}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-gray-500">90-Day Working Target</span>
                        <span className={`font-bold ${isTargetReached ? 'text-emerald-600' : 'text-[#1E3A8A]'}`}>
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

                    <p className="text-[11px] text-gray-500 mt-2.5 leading-relaxed">
                      {kpi.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leading KPIs & Operational Levers */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1A1A1F] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Leading KPIs (Operational Levers)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Actionable daily inputs that explain WHY the primary metrics move.
                </p>
              </div>
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                5 Daily Levers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {leadingKpis.map((kpi) => {
                let currentValue = 0;
                if (kpi.id === 'kpi_content_published') currentValue = snapshot.contentPublished;
                if (kpi.id === 'kpi_content_interactions') currentValue = snapshot.contentInteractions;
                if (kpi.id === 'kpi_seller_relationships') currentValue = snapshot.sellerAgentRelationships;
                if (kpi.id === 'kpi_hot_lead_followup') currentValue = snapshot.hotLeadFollowUpRate;
                if (kpi.id === 'kpi_google_reviews') currentValue = snapshot.googleReviews;

                return (
                  <div key={kpi.id} className="p-4 rounded-2xl border border-gray-100 bg-white shadow-2xs space-y-1">
                    <span className="text-xs font-bold text-gray-700 block truncate">
                      {kpi.name}
                    </span>
                    <div className="flex items-baseline gap-1.5 pt-1">
                      <span className="text-xl font-black text-[#1A1A1F]">
                        {currentValue}
                      </span>
                      <span className="text-xs text-gray-400">
                        / {kpi.targetMonthly} {kpi.unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-2 pt-1">
                      {kpi.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attention & Anti-Vanity Discipline */}
          <div className="bg-amber-50/50 border border-amber-200/70 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Attention Metrics Discipline & Anti-Vanity Guardrail
              </h3>
            </div>
            
            <p className="text-xs text-amber-950 font-medium leading-relaxed">
              <strong>Non-Negotiable Policy:</strong> Follower count and raw impressions are supporting attention metrics only. 
              They must <strong>NEVER</strong> be reported or counted as primary business progress.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supportingKpis.map((kpi) => {
                const val = kpi.id === 'kpi_raw_views' ? snapshot.contentViews : 1240;
                return (
                  <div key={kpi.id} className="p-3.5 bg-white rounded-xl border border-amber-200/60 flex items-center justify-between text-xs shadow-2xs">
                    <div>
                      <p className="font-bold text-gray-800">{kpi.name}</p>
                      <p className="text-[10px] text-gray-400">Supporting attention only</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-gray-900 text-sm">{val.toLocaleString()}</span>
                      <span className="text-[10px] text-rose-600 block font-semibold">Not Primary</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: STRATEGIC OUTCOMES & 90-DAY TARGETS */}
      {activeSection === 'principles' && (
        <div className="space-y-6">
          {/* 4 Primary Business Goals */}
          <div>
            <div className="mb-4">
              <h2 className="text-base font-bold text-[#1A1A1F] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#1E3A8A]" />
                <span>The 4 Primary Business Outcomes</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                AutoAce operates exclusively toward these four authentic commercial outcomes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AUTOACE_PRIMARY_GOALS.map((goal) => (
                <div 
                  key={goal.id}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs hover:border-blue-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E3A8A] font-extrabold text-xs flex items-center justify-center border border-blue-100">
                        0{goal.number}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Core Outcome
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1A1A1F] mb-1.5">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {goal.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-[11px] font-medium text-[#1E3A8A] bg-blue-50/50 p-2.5 rounded-xl">
                    <span className="font-semibold text-gray-400">Asset:</span>
                    <span className="truncate font-semibold">{goal.assetFocus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 90-Day Target Summary Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1A1A1F] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1E3A8A]" />
                  <span>90-Day Operating Target Calibration</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Working calibration benchmarks to be refined after collecting verified Zambian auto transaction data.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {[
                { label: 'Buyer Requests', target: `${AUTOACE_90_DAY_TARGETS.buyerRequestsMonthly} / mo`, desc: 'Verified consumer requests' },
                { label: 'Qualified Connections', target: `${AUTOACE_90_DAY_TARGETS.qualifiedConnectionsMonthly} / mo`, desc: 'Buyer-seller connections' },
                { label: 'Closed Deals', target: `${AUTOACE_90_DAY_TARGETS.closedDealsMonthly}+ / mo`, desc: 'Verified purchases' },
                { label: 'AutoAce Revenue', target: `K${AUTOACE_90_DAY_TARGETS.revenueZmwMonthly.toLocaleString()}+ / mo`, desc: '3% platform commission' },
                { label: 'Seller Partnerships', target: `${AUTOACE_90_DAY_TARGETS.newSellerRelationshipsMonthly} / mo`, desc: 'Active yards & agents' },
                { label: 'Content Published', target: `${AUTOACE_90_DAY_TARGETS.contentPublishedMonthly} / mo`, desc: 'Demand-generating videos' },
                { label: 'Follow-Up Rate', target: `${AUTOACE_90_DAY_TARGETS.hotLeadFollowUpRatePercent}%`, desc: 'Within 24 hours' },
                { label: 'Google Reviews', target: `${AUTOACE_90_DAY_TARGETS.googleReviewsMonthly} / mo`, desc: '5-star trust reputation' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-2xs space-y-1">
                  <div className="text-xs font-semibold text-gray-500">{item.label}</div>
                  <div className="text-base font-extrabold text-[#1A1A1F]">{item.target}</div>
                  <div className="text-[11px] text-gray-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
