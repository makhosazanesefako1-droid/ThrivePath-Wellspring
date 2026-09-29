import React from 'react';
import {
  FileText,
  Activity,
  Heart,
  Calendar,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  HeartPulse,
} from 'lucide-react';
import type { StudentProfile, ScreeningRecord, Appointment } from '../types/index.ts';

interface StudentPortalDashboardProps {
  student: StudentProfile | null;
  latestScreening: ScreeningRecord | null;
  appointments: Appointment[];
  onOpenScreening: () => void;
  onNavigateTab: (tab: string) => void;
}

export const StudentPortalDashboard: React.FC<StudentPortalDashboardProps> = ({
  student,
  latestScreening,
  appointments,
  onOpenScreening,
  onNavigateTab,
}) => {
  const pulseScore = student?.pulseScore || (latestScreening ? latestScreening.pulseScore : null);
  const nextApt = appointments.find((a) => a.status === 'booked' || a.status === 'rescheduled');
  const greetingName = student?.fullName ? student.fullName.split(' ')[0] : 'Lethabo';

  const steps = [
    { label: 'Registration start', done: true },
    { label: 'Academic profile', done: true },
    { label: 'Wellbeing check-in', done: Boolean(latestScreening) },
    { label: 'Pulse & patterns', done: Boolean(latestScreening) },
    { label: 'Matched support', done: Boolean(latestScreening) },
    { label: 'Support session', done: Boolean(nextApt) },
    { label: 'Follow-up loop', done: Boolean(latestScreening?.previousScoreDelta !== undefined) },
  ];

  const completedStepsCount = steps.filter((s) => s.done).length;

  return (
    <div className="space-y-6">
      {/* Top Title Banner matching Screenshot 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="text-xs text-slate-500 font-medium">Monday, 28 September</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight mt-0.5">
            Good evening, {greetingName}.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Your registration and wellbeing journey, in one place.
          </p>
        </div>

        <div className="self-start sm:self-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#1b4d3e] border border-emerald-200/60">
            2026 registration
          </span>
        </div>
      </div>

      {/* Primary 2-Card Row: Registration Progress (Left) + Wellbeing Pulse (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Registration Progress (85%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                REGISTRATION PROGRESS
              </span>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>

            <div className="text-4xl font-extrabold font-mono text-slate-900 mt-2">
              85%
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-[#09392b] h-full rounded-full transition-all duration-700"
                style={{ width: '85%' }}
              />
            </div>
          </div>

          {/* Sub-notification box inside: "Wellbeing check-in is next" */}
          <div className="bg-[#fef2f2] border border-rose-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Wellbeing check-in is next
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  A private 60-second screening. Your result never affects registration.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenScreening}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#09392b] text-white text-xs font-semibold rounded-lg hover:bg-[#072d22] transition-colors shrink-0 shadow-2xs"
            >
              <span>Screen now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Card: Wellbeing Pulse (Dark Green Card) */}
        <div className="lg:col-span-5 bg-[#09392b] text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-emerald-200">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                WELLBEING PULSE
              </span>
              <Activity className="w-5 h-5 text-emerald-300" />
            </div>

            <div className="flex items-baseline gap-1 my-3">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
                {pulseScore !== null ? pulseScore : '—'}
              </span>
              <span className="text-base text-emerald-200/70 font-mono">/100</span>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed">
              {pulseScore !== null
                ? pulseScore >= 66
                  ? 'A little stretched. Your next check-in is ready.'
                  : 'Balanced and steady. Your wellness buffer is active.'
                : 'Complete your check-in to see your private pulse.'}
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => onNavigateTab('wellbeing')}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-[#d7f2e4] text-[#09392b] text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <span>View wellbeing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Summary Cards Row (matching Screenshot 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recommended Support */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Recommended support
            </div>
            <div className="text-sm font-bold text-slate-900 font-display">
              {latestScreening
                ? `${latestScreening.primaryIndicator}: 4-7-8 Breathing Pacer & Workshop`
                : 'Complete screening first'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('wellbeing')}
            className="flex items-center gap-1 text-xs font-bold text-[#09392b] hover:text-[#1b4d3e] transition-colors"
          >
            <span>{latestScreening ? 'Open toolkit' : 'Start check-in'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Next Appointment */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-800 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Next appointment
            </div>
            <div className="text-sm font-bold text-slate-900 font-display">
              {nextApt
                ? `${nextApt.formattedDate} · ${nextApt.modality === 'video' ? 'Video' : 'In-person'}`
                : 'No session booked'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('appointments')}
            className="flex items-center gap-1 text-xs font-bold text-[#09392b] hover:text-[#1b4d3e] transition-colors"
          >
            <span>{nextApt ? 'Manage appointment' : 'Book support'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Follow-up */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Follow-up
            </div>
            <div className="text-sm font-bold text-slate-900 font-display">
              {latestScreening?.previousScoreDelta !== undefined
                ? `Measured progress: ${latestScreening.previousScoreDelta} pts`
                : 'Begins after support'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('history')}
            className="flex items-center gap-1 text-xs font-bold text-[#09392b] hover:text-[#1b4d3e] transition-colors"
          >
            <span>View timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. "Your connected journey" Bottom Section (matching Screenshot 5) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 font-display">
            Your connected journey
          </h3>
          <span className="text-xs font-mono font-medium text-slate-500">
            Step {completedStepsCount} of {steps.length}
          </span>
        </div>

        {/* Step dots / tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {steps.map((st, i) => (
            <div
              key={st.label}
              className={`p-3 rounded-xl border text-xs flex flex-col justify-between transition-colors ${
                st.done
                  ? 'border-emerald-200 bg-[#eef7f2] text-slate-900 font-medium'
                  : 'border-slate-100 bg-slate-50/60 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400">0{i + 1}</span>
                {st.done ? (
                  <span className="w-4 h-4 rounded-full bg-[#09392b] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                ) : (
                  <span className="w-3 h-3 rounded-full border border-slate-300" />
                )}
              </div>
              <span className="text-[11px] leading-tight font-medium">{st.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
