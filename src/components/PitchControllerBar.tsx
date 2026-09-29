import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  RotateCcw,
  Maximize2,
  Minimize2,
  BrainCircuit,
  Eye,
  CheckCircle,
} from 'lucide-react';

export interface PitchStep {
  id: number;
  label: string;
  tag: string;
  role: 'public' | 'student' | 'counsellor' | 'dean' | 'admin';
  tab: string;
  description: string;
}

export const PITCH_STEPS: PitchStep[] = [
  {
    id: 1,
    label: '1. Problem & Landing',
    tag: 'Problem',
    role: 'public',
    tab: 'landing',
    description: 'The problem: Students experience academic, sleep, financial & emotional pressure, but support is often delayed. Our solution integrates screening into registration.',
  },
  {
    id: 2,
    label: '2. Registration (85%)',
    tag: 'Registration',
    role: 'student',
    tab: 'registration',
    description: 'Registration flow: Well-being screening is placed right inside official university registration (85% progress). Never blocks enrollment.',
  },
  {
    id: 3,
    label: '3. 5-Factor Screening',
    tag: 'Screening',
    role: 'student',
    tab: 'screening_modal',
    description: 'Multi-step questionnaire across Academic, Lifestyle, Financial, Social, and Well-being factors + free-text feelings box.',
  },
  {
    id: 4,
    label: '4. ML Result & Dots',
    tag: 'ML Result',
    role: 'student',
    tab: 'wellbeing',
    description: 'ML scoring model outputs MODERATE/HIGH indicator (e.g. ●●●●●●○○○○). Non-diagnostic triage routing.',
  },
  {
    id: 5,
    label: '5. Book Counselling',
    tag: 'Booking',
    role: 'student',
    tab: 'booking_modal',
    description: 'Student easily books qualified campus counsellor with preferred modality (in-person, video, walk & talk).',
  },
  {
    id: 6,
    label: '6. Appointment Dashboard',
    tag: 'Appointments',
    role: 'student',
    tab: 'appointments',
    description: 'Upcoming session view with automated SMS reminders and non-shaming no-show reschedule pathway.',
  },
  {
    id: 7,
    label: '7. Counsellor Portal',
    tag: 'Counsellor',
    role: 'counsellor',
    tab: 'counsellor_schedule',
    description: 'Counsellor sees only their booked students. Marks attendance, logs session notes, and selects "Follow-up Required".',
  },
  {
    id: 8,
    label: '8. Re-Screening Loop',
    tag: 'Re-Screening',
    role: 'student',
    tab: 'rescreening_compare',
    description: 'The Closed Loop: Student completes 4-week re-screening check. Before (68/Moderate) vs After (34/Mild) comparison.',
  },
  {
    id: 9,
    label: '9. University Analytics',
    tag: 'Executive',
    role: 'dean',
    tab: 'dean_analytics',
    description: 'Dean & leadership executive dashboard: 89% screened, 82% attendance, -44% no-shows with reminders, zero individual record exposure.',
  },
  {
    id: 10,
    label: '10. ML Audit (No Leakage)',
    tag: 'ML Model',
    role: 'public',
    tab: 'ml_inspect',
    description: 'Model architecture review: 3,000 dataset, feature correlations, confusion matrix, and target leakage prevention proof.',
  },
];

interface PitchControllerBarProps {
  currentStepIndex: number;
  onSelectStepIndex: (index: number) => void;
  onResetDemo: () => void;
  onOpenMLInspection: () => void;
}

export const PitchControllerBar: React.FC<PitchControllerBarProps> = ({
  currentStepIndex,
  onSelectStepIndex,
  onResetDemo,
  onOpenMLInspection,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeStep = PITCH_STEPS[currentStepIndex] || PITCH_STEPS[0]!;

  const handleNext = () => {
    if (currentStepIndex < PITCH_STEPS.length - 1) {
      onSelectStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      onSelectStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="bg-slate-900 text-white border-b border-emerald-950/80 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Pitch Mode Indicator */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold tracking-wider uppercase font-display text-emerald-400">
                Judge Pitch Controller
              </span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-xs font-mono text-slate-300 hidden sm:inline">
              Step {currentStepIndex + 1} of {PITCH_STEPS.length}
            </span>
          </div>

          {/* Middle: Active Pitch Narration Prompt */}
          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-2xl px-2">
            <div className="text-[11px] text-slate-300 truncate bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
              <strong className="text-emerald-300 font-semibold mr-1">
                {activeStep.tag}:
              </strong>
              <span>{activeStep.description}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenMLInspection}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 rounded-md transition-colors"
              title="Inspect ML training, weights, and zero-leakage proof"
            >
              <BrainCircuit className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">ML Architecture</span>
            </button>

            <button
              type="button"
              onClick={onResetDemo}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Reset demo data to clean initial state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 border-l border-slate-700/80 pl-2">
              <button
                type="button"
                disabled={currentStepIndex === 0}
                onClick={handlePrev}
                className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={currentStepIndex === PITCH_STEPS.length - 1}
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1 text-[11px] font-bold bg-emerald-700 hover:bg-emerald-600 text-white rounded transition-colors shadow-xs"
              >
                <span>Next Pitch Step</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-slate-400 hover:text-white rounded"
              title={isCollapsed ? 'Expand pitch steps' : 'Collapse pitch steps'}
            >
              {isCollapsed ? (
                <Maximize2 className="w-3.5 h-3.5" />
              ) : (
                <Minimize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Step Buttons Ribbon (Visible when not collapsed) */}
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
            {PITCH_STEPS.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onSelectStepIndex(idx)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90 hover:text-white border border-slate-700/50'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-80">{step.id}.</span>
                  <span>{step.tag}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
