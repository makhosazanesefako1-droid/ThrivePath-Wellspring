import React from 'react';
import type { StudentProfile, ScreeningRecord, Appointment } from '../types/index.ts';
import {
  FileText,
  Activity,
  Heart,
  Calendar,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Brain,
  CheckCircle,
} from 'lucide-react';

interface StudentDashboardProps {
  student: StudentProfile | null;
  latestScreening: ScreeningRecord | null;
  appointments: Appointment[];
  resourcesCount?: number;
  onStartScreening: () => void;
  onBookAppointment: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenCrisis: () => void;
  onOpenBreathing?: () => void;
  onOpenGrounding?: () => void;
  onOpenReframe?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  latestScreening,
  appointments,
  onStartScreening,
  onBookAppointment,
  onNavigateTab,
}) => {
  // Lethabo from Screenshot 5 or active student name
  const displayName = student?.fullName ? student.fullName.split(' ')[0] : 'Lethabo';
  const hasScreened = Boolean(latestScreening);
  const pulseScore = latestScreening?.pulseScore ?? (student?.pulseScore || 72);
  const nextAppointment = appointments.find((a) => a.status === 'booked' || a.status === 'rescheduled');

  return (
    <div className="space-y-6 max-w-6xl mx-auto selection:bg-emerald-100">
      {/* 1. Header Greeting (matching Screenshot 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">
            Monday, 28 September
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#0A2E23] tracking-tight">
            Good evening, {displayName}.
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Your registration and wellbeing journey, in one place.
          </p>
        </div>

        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#D1F2E2] text-[#0A5737]">
            2026 registration
          </span>
        </div>
      </div>

      {/* 2. Top Two Hero Cards (Registration Progress + Wellbeing Pulse) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Card: Registration Progress (85%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                REGISTRATION PROGRESS
              </span>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>

            <div className="text-4xl sm:text-5xl font-extrabold text-[#0A2E23] tracking-tight mb-4 tabular-nums">
              85%
            </div>

            {/* Dark green progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="bg-[#0B3B2C] h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: '85%' }}
              />
            </div>
          </div>

          {/* Embedded callout inside the card */}
          <div className="bg-[#FAFDFB] border border-emerald-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FEEBE8] text-[#E11D48] flex items-center justify-center shrink-0 mt-0.5">
                <Activity className="w-4 h-4 text-[#E11D48]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0A2E23]">
                  Wellbeing check-in is next
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  A private 60-second screening. Your result never affects registration.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onStartScreening}
              className="px-4 py-2 bg-[#0B3B2C] hover:bg-[#07291F] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
            >
              <span>Screen now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Card: Wellbeing Pulse (Dark Forest Green) */}
        <div className="lg:col-span-5 bg-[#0B3B2C] text-white rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-200 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                WELLBEING PULSE
              </span>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2 tabular-nums">
              {hasScreened ? (
                <>
                  {pulseScore}
                  <span className="text-2xl font-normal text-emerald-200">/100</span>
                </>
              ) : (
                <>
                  —<span className="text-2xl font-normal text-emerald-200">/100</span>
                </>
              )}
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xs">
              {hasScreened
                ? latestScreening?.aiAnalysis?.clinicalSummary || 'A little stretched. Your next check-in is ready.'
                : 'Complete your check-in to see your private pulse.'}
            </p>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => onNavigateTab('wellbeing')}
              className="w-full sm:w-auto px-4 py-2 bg-[#D1F2E2] hover:bg-[#bbf0d5] text-[#0A5737] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View wellbeing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Three Bottom Cards (Recommended support, Next appointment, Follow-up) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Recommended support */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-40">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#E2F7EC] text-[#0A5737] flex items-center justify-center mb-3">
              <Heart className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-400">Recommended support</div>
            <div className="text-sm font-bold text-[#0A2E23] mt-1">
              {hasScreened ? '4-7-8 Somatic Grounding' : 'Complete screening first'}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={hasScreened ? () => onNavigateTab('resources') : onStartScreening}
              className="text-xs font-semibold text-[#0B3B2C] hover:text-[#07291F] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{hasScreened ? 'Open tool' : 'Start check-in'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Next appointment */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-40">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#E2F7EC] text-[#0A5737] flex items-center justify-center mb-3">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-400">Next appointment</div>
            <div className="text-sm font-bold text-[#0A2E23] mt-1">
              {nextAppointment ? `${nextAppointment.formattedDate} · ${nextAppointment.modality}` : 'No session booked'}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={onBookAppointment}
              className="text-xs font-semibold text-[#0B3B2C] hover:text-[#07291F] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{nextAppointment ? 'Manage session' : 'Book support'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Follow-up */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-40">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#E2F7EC] text-[#0A5737] flex items-center justify-center mb-3">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-400">Follow-up</div>
            <div className="text-sm font-bold text-[#0A2E23] mt-1">
              {hasScreened ? 'Re-screening scheduled' : 'Begins after support'}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => onNavigateTab('history')}
              className="text-xs font-semibold text-[#0B3B2C] hover:text-[#07291F] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View timeline</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Connected Journey Pathway Progress Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-[#0A2E23]">Your connected journey</div>
          <div className="text-xs font-medium text-slate-400">Step 1 of 7</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { step: '1', label: 'Registration', status: 'completed' },
            { step: '2', label: 'Screening', status: hasScreened ? 'completed' : 'current' },
            { step: '3', label: 'Indicator Profile', status: hasScreened ? 'completed' : 'upcoming' },
            { step: '4', label: 'Care Pathway', status: 'upcoming' },
            { step: '5', label: 'Support Session', status: 'upcoming' },
            { step: '6', label: 'Self-Care Tools', status: 'upcoming' },
            { step: '7', label: 'Re-Screening', status: 'upcoming' },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-2.5 rounded-lg border text-center transition-colors ${
                item.status === 'completed'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                  : item.status === 'current'
                  ? 'bg-[#0B3B2C] border-[#0B3B2C] text-white shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-bold uppercase opacity-80">Step {item.step}</div>
              <div className="text-xs font-semibold mt-0.5 truncate">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
