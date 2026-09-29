import React from 'react';
import type { ScreeningRecord, Appointment } from '../types/index.ts';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ClipboardList,
  Sparkles,
} from 'lucide-react';

interface HistoryTimelineViewProps {
  screenings: ScreeningRecord[];
  appointments: Appointment[];
  onStartReScreening: () => void;
}

export const HistoryTimelineView: React.FC<HistoryTimelineViewProps> = ({
  screenings,
  appointments,
  onStartReScreening,
}) => {
  const latestScreening = screenings[screenings.length - 1];
  const lastScreeningDate = latestScreening
    ? new Date(latestScreening.timestamp).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      })
    : '29 September';

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-[#172033]">
          My Well-Being Journey
        </h1>
        <p className="text-sm text-[#64748B] mt-1 font-normal">
          A neutral record of your screenings, support milestones, and follow-ups.
        </p>
      </div>

      {/* ========================================================= */}
      {/* 1. RE-SCREENING PROMPT CARD (Section 25) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Periodic Review
          </span>
          <h2 className="text-xl font-bold font-heading text-[#172033]">
            Time for a check-in
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            You completed your previous well-being screening on {lastScreeningDate}. Would you like to complete a follow-up screening?
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={onStartReScreening}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start re-screening</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SIMPLE TIMELINE (Section 26) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] pb-2 border-b border-slate-100">
          MY WELL-BEING JOURNEY
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {/* Milestone 1: Initial screening */}
          <div className="relative space-y-1">
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#173B57] ring-4 ring-white" />
            <div className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
              22 Sep 2026
            </div>
            <div className="text-base font-bold text-[#172033] font-heading">
              Initial screening
            </div>
            <div className="text-sm font-medium text-amber-600 bg-amber-50 inline-block px-2.5 py-0.5 rounded-md border border-amber-200">
              Moderate
            </div>
            <p className="text-xs text-[#64748B] pt-1">
              Primary indicator noted: Academic workload during mid-semester period.
            </p>
          </div>

          {/* Milestone 2: Counselling */}
          <div className="relative space-y-1">
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#2563EB] ring-4 ring-white" />
            <div className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
              30 Sep 2026
            </div>
            <div className="text-base font-bold text-[#172033] font-heading">
              Counselling
            </div>
            <div className="text-sm font-medium text-[#16A34A] bg-emerald-50 inline-block px-2.5 py-0.5 rounded-md border border-emerald-200">
              Completed
            </div>
            <p className="text-xs text-[#64748B] pt-1">
              50-minute consultation with Dr. Nomvula Khumalo. Formulated study intervals and restful wind-down routine.
            </p>
          </div>

          {/* Milestone 3: Follow-up check-in */}
          {screenings.length > 1 ? (
            <div className="relative space-y-1">
              <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#16A34A] ring-4 ring-white" />
              <div className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
                {new Date(latestScreening.timestamp).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div className="text-base font-bold text-[#172033] font-heading">
                Follow-up screening
              </div>
              <div className="text-sm font-medium text-[#16A34A] bg-emerald-50 inline-block px-2.5 py-0.5 rounded-md border border-emerald-200">
                {latestScreening.stressBand === 'low' ? 'Low / Mild' : 'Moderate'}
              </div>
              <p className="text-xs text-[#64748B] pt-1">
                Subsequent check-in. Sleep hours improved from 6h to 7.5h per night.
              </p>
            </div>
          ) : (
            <div className="relative space-y-1 opacity-70">
              <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-white" />
              <div className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
                Upcoming
              </div>
              <div className="text-base font-semibold text-[#64748B]">
                Follow-up screening
              </div>
              <p className="text-xs text-[#64748B]">
                Scheduled for mid-October to check on semester progress.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
