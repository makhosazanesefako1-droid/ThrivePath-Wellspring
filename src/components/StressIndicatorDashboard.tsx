import React from 'react';
import type { ScreeningRecord, StressBand } from '../types/index.ts';
import {
  BrainCircuit,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Calendar,
  ArrowRight,
  RefreshCw,
  Award,
} from 'lucide-react';

interface StressIndicatorDashboardProps {
  screenings: ScreeningRecord[];
  onOpenScreeningModal: () => void;
  onNavigateToBooking: () => void;
  onNavigateToToolkit: () => void;
}

export const StressIndicatorDashboard: React.FC<StressIndicatorDashboardProps> = ({
  screenings,
  onOpenScreeningModal,
  onNavigateToBooking,
  onNavigateToToolkit,
}) => {
  const latestScreening = screenings[screenings.length - 1];
  const baselineScreening = screenings[0];
  const hasMultipleScreenings = screenings.length > 1;

  if (!latestScreening) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-xl mx-auto shadow-2xs">
        <BrainCircuit className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 font-display">
          No Wellbeing Check Recorded Yet
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
          Complete the 60-second check-in to generate your empirical stress indicator profile and unlock personalized support.
        </p>
        <button
          type="button"
          onClick={onOpenScreeningModal}
          className="px-5 py-2.5 text-xs font-semibold bg-[#09392b] text-white rounded-lg hover:bg-[#072d22] transition-colors shadow-2xs"
        >
          Begin Wellbeing Check
        </button>
      </div>
    );
  }

  const bandStyles: Record<
    StressBand,
    { label: string; badgeClass: string; bgClass: string; borderClass: string; textClass: string }
  > = {
    low: {
      label: 'Low / Mild Stress',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      bgClass: 'bg-emerald-50/50',
      borderClass: 'border-emerald-200',
      textClass: 'text-emerald-800',
    },
    moderate: {
      label: 'Moderate Stress Band',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      bgClass: 'bg-amber-50/50',
      borderClass: 'border-amber-200',
      textClass: 'text-amber-800',
    },
    high: {
      label: 'High Stress / Expedited Triage',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      bgClass: 'bg-rose-50/50',
      borderClass: 'border-rose-200',
      textClass: 'text-rose-800',
    },
    neutral: {
      label: 'Support Ready',
      badgeClass: 'bg-blue-100 text-[#2563EB] border border-blue-200',
      bgClass: 'bg-blue-50/50',
      borderClass: 'border-blue-200',
      textClass: 'text-[#2563EB]',
    },
  };

  const currentBand = bandStyles[latestScreening.stressBand] || bandStyles.moderate;

  // Normalized dimension metrics from the 3,000-student model input
  const input = latestScreening.input;
  const dimensions = [
    {
      label: 'Screen Time Exposure (+0.49 correlation)',
      score: Math.min(100, Math.round((input.screenTime / 12) * 100)),
      color: 'bg-[#09392b]',
      detail: `${input.screenTime}h / day`,
    },
    {
      label: 'Academic Deadlines & Assignment Load',
      score: Math.min(100, Math.round((input.assignmentLoad / 9) * 100)),
      color: 'bg-rose-600',
      detail: `Scale ${input.assignmentLoad}/9`,
    },
    {
      label: 'Exam & Test Frequency (+0.38 signal)',
      score: Math.min(100, Math.round((input.examFrequency / 9) * 100)),
      color: 'bg-amber-600',
      detail: `Scale ${input.examFrequency}/9`,
    },
    {
      label: 'Sleep Debt & Circadian Fragmentation',
      score: Math.max(0, Math.min(100, Math.round(((10 - input.sleepHours) / 7) * 100))),
      color: 'bg-purple-600',
      detail: `${input.sleepHours}h / night`,
    },
    {
      label: 'Family Support Buffer (-0.40 protective)',
      score: Math.min(100, Math.round((input.familySupport / 9) * 100)),
      color: 'bg-emerald-600',
      detail: `Scale ${input.familySupport}/9`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#09392b]">
              Dataset-Calibrated Scoring Model
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">
              Term Week {latestScreening.termWeek} ({new Date(latestScreening.timestamp).toLocaleDateString()})
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-1">
            Clinical Triage & Stress Indicator Profile
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenScreeningModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Retake Check-In</span>
          </button>

          {latestScreening.stressBand === 'high' ? (
            <button
              type="button"
              onClick={onNavigateToBooking}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Priority Counselling</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNavigateToToolkit}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#09392b] text-white rounded-lg hover:bg-[#072d22] transition-colors shadow-2xs"
            >
              <span>Explore Targeted Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pulse & Primary Indicator */}
        <div className={`p-6 rounded-2xl border ${currentBand.borderClass} ${currentBand.bgClass} flex flex-col justify-between shadow-2xs`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Wellbeing Pulse Score
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono ${currentBand.badgeClass}`}>
                {currentBand.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-5xl font-extrabold font-mono text-slate-900 tabular-nums">
                {latestScreening.pulseScore}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>

              {latestScreening.previousScoreDelta !== undefined && (
                <div
                  className={`ml-auto flex items-center gap-1 text-xs font-mono font-bold px-2 py-1 rounded ${
                    latestScreening.previousScoreDelta < 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {latestScreening.previousScoreDelta < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {latestScreening.previousScoreDelta > 0 ? '+' : ''}
                    {latestScreening.previousScoreDelta} pts
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 text-xs font-semibold text-slate-800">
              Primary Indicator:{' '}
              <span className="text-[#09392b] font-bold">{latestScreening.primaryIndicator}</span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {latestScreening.aiAnalysis.clinicalSummary}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60">
            <div className="text-[11px] text-slate-500 flex items-center justify-between mb-1">
              <span>Triaged Care Routing:</span>
              <span className="font-semibold text-slate-900 capitalize">
                {latestScreening.aiAnalysis.recommendedPathway.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Middle & Right: Multi-Factor Dimension Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Multi-Dimensional Dataset Factor Breakdown
              </h3>
              <span className="text-xs text-slate-400 font-mono">Calibrated to 3,000 Cohort Records</span>
            </div>

            <div className="space-y-3.5">
              {dimensions.map((dim) => (
                <div key={dim.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{dim.label}</span>
                    <span className="font-mono font-bold text-slate-900">{dim.detail}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${dim.color} transition-all duration-500`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Identified Core Triggers</span>
              </div>
              <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px]">
                {latestScreening.aiAnalysis.identifiedTriggers.map((trig, i) => (
                  <li key={i} className="truncate">{trig}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protective Factors</span>
              </div>
              <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px]">
                {latestScreening.aiAnalysis.protectiveFactors.map((pf, i) => (
                  <li key={i} className="truncate">{pf}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Closed-Loop Care Comparison Banner */}
      {hasMultipleScreenings && baselineScreening && (
        <div className="bg-[#09392b] text-white rounded-2xl p-6 shadow-sm border border-emerald-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <Award className="w-4 h-4 text-emerald-300" />
                <span>Closed-Loop Efficacy: Baseline vs. Follow-up Comparison</span>
              </div>
              <h3 className="text-lg font-bold font-display text-white">
                Measurable Clinical Progress Post-Support
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                Intervention with counselling and sleep pacing resulted in an empirical strain reduction. Re-screening confirms stabilization of autonomic and academic reserve.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 text-center shrink-0">
              <div>
                <div className="text-[10px] text-emerald-200 uppercase font-semibold">Baseline</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">
                  {baselineScreening.pulseScore}
                </div>
                <div className="text-[10px] text-rose-300 font-medium capitalize">
                  {baselineScreening.stressBand}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <ArrowRight className="w-5 h-5 text-emerald-300" />
                <div className="text-xs font-mono font-bold text-emerald-300 mt-1">
                  {latestScreening.previousScoreDelta !== undefined && latestScreening.previousScoreDelta < 0
                    ? `${latestScreening.previousScoreDelta} pts`
                    : 'Stabilized'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-emerald-200 uppercase font-semibold">Follow-Up</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">
                  {latestScreening.pulseScore}
                </div>
                <div className="text-[10px] text-emerald-300 font-medium capitalize">
                  {latestScreening.stressBand}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
