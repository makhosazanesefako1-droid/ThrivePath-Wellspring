import React from 'react';
import type { JourneyStep, StressBand } from '../types/index.ts';
import {
  UserCheck,
  ClipboardCheck,
  BrainCircuit,
  HeartHandshake,
  CalendarCheck,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

interface JourneyBannerProps {
  currentStep: JourneyStep;
  latestStressBand?: StressBand;
  hasFollowUpScreening: boolean;
  onSelectStep: (step: JourneyStep) => void;
}

export const JourneyBanner: React.FC<JourneyBannerProps> = ({
  currentStep,
  latestStressBand,
  hasFollowUpScreening,
  onSelectStep,
}) => {
  const steps: {
    key: JourneyStep;
    number: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: 'registration',
      number: '01',
      title: 'Registration',
      subtitle: 'Student registers & consents',
      icon: UserCheck,
    },
    {
      key: 'screening',
      number: '02',
      title: 'Well-Being Check',
      subtitle: '5-factor screening check',
      icon: ClipboardCheck,
    },
    {
      key: 'analysis',
      number: '03',
      title: 'ML Stress Analysis',
      subtitle: 'Indicator score & triage',
      icon: BrainCircuit,
    },
    {
      key: 'support',
      number: '04',
      title: 'Targeted Support',
      subtitle: 'Tailored digital toolkit',
      icon: HeartHandshake,
    },
    {
      key: 'counselling',
      number: '05',
      title: 'Counselling Care',
      subtitle: 'Intake, attendance & notes',
      icon: CalendarCheck,
    },
    {
      key: 'followup',
      number: '06',
      title: 'Re-Screening Loop',
      subtitle: 'Outcome comparison & delta',
      icon: RefreshCw,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Closed-Loop Care Pathway
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-slate-500">
              Interactive Pitch Walkthrough
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Branching Logic:</span>
            <span className="text-emerald-700 font-medium">Low/Mild (0-35) → Self-care & Workshops</span>
            <span className="text-slate-300">·</span>
            <span className="text-amber-700 font-medium">Moderate (36-65) → Guided Peer Support</span>
            <span className="text-slate-300">·</span>
            <span className="text-rose-700 font-medium">High (66-100) → Priority Counselling & Crisis Net</span>
          </div>
        </div>

        {/* Horizontal Process Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = currentStep === s.key;
            const isCompleted =
              s.key === 'registration' ||
              (s.key === 'screening') ||
              (s.key === 'analysis') ||
              (s.key === 'support') ||
              (s.key === 'counselling') ||
              (s.key === 'followup' && hasFollowUpScreening);

            return (
              <button
                key={s.key}
                type="button"
                onClick={() => onSelectStep(s.key)}
                className={`group text-left p-2.5 rounded-lg border transition-all relative ${
                  isActive
                    ? 'border-teal-700 bg-teal-50/70 ring-1 ring-teal-700/20'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-semibold ${
                        isActive
                          ? 'bg-teal-800 text-white'
                          : isCompleted
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {s.number}
                    </div>
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive
                          ? 'text-teal-800'
                          : isCompleted
                          ? 'text-slate-600'
                          : 'text-slate-400'
                      }`}
                    />
                  </div>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block w-3 h-3 text-slate-300 group-hover:text-slate-400" />
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-900 truncate">
                  {s.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
