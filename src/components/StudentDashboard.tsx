import React, { useState, useEffect } from 'react';
import type { StudentProfile, ScreeningRecord, Appointment } from '../types/index.ts';
import {
  ArrowRight,
  CheckCircle,
  Calendar,
  Heart,
  Clock,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  AlertCircle,
  Wind,
  Compass,
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  MessageCircle,
  ChevronRight,
  Coffee,
  Brain,
  Smile,
  Zap,
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

type DailyMood = 'energized' | 'calm' | 'pressured' | 'overwhelmed' | 'exhausted';

const DAILY_MOOD_CONFIG: Record<
  DailyMood,
  { label: string; icon: string; title: string; advice: string; suggestedAction: string; actionTab?: string; actionType?: 'screening' | 'booking' | 'breathing' | 'grounding' }
> = {
  energized: {
    label: 'Energized',
    icon: '⚡',
    title: 'Great energy today!',
    advice: 'Channel this focus into your highest-priority engineering or coursework tasks. Protect your momentum with 5-minute screen breaks.',
    suggestedAction: 'Use the 25-Min Study Timer below',
  },
  calm: {
    label: 'Balanced',
    icon: '😌',
    title: 'Steady and grounded',
    advice: 'You have a healthy baseline today. A great time to review challenging concepts or plan out assignment deadlines with calm clarity.',
    suggestedAction: 'Explore student study guides',
    actionTab: 'resources',
  },
  pressured: {
    label: 'Pressured',
    icon: '⏳',
    title: 'Academic deadline pressure',
    advice: 'When deadlines stack up, break big tasks into 25-minute Pomodoro sessions. Focus on completing just one small milestone at a time.',
    suggestedAction: 'Start 25-min study timer',
  },
  overwhelmed: {
    label: 'Overwhelmed',
    icon: '🌊',
    title: 'Taking care of yourself right now',
    advice: 'Feeling overwhelmed is a physiological signal to pause and regulate, not a sign of failure. Try a 2-minute somatic breathing or grounding reset.',
    suggestedAction: 'Try 5-4-3-2-1 Grounding Reset',
    actionType: 'grounding',
  },
  exhausted: {
    label: 'Exhausted',
    icon: '💤',
    title: 'Fatigue & sleep deficit',
    advice: 'Memory and problem-solving diminish significantly with sleep deprivation. Prioritize restorative rest tonight—your brain will thank you.',
    suggestedAction: 'Read Sleep Recovery Guide',
    actionTab: 'resources',
  },
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  latestScreening,
  appointments,
  resourcesCount = 12,
  onStartScreening,
  onBookAppointment,
  onNavigateTab,
  onOpenCrisis,
  onOpenBreathing,
  onOpenGrounding,
  onOpenReframe,
}) => {
  const firstName = student?.fullName ? student.fullName.split(' ')[0] : 'Siqiniseko';
  const nextAppointment = appointments.find(
    (a) => a.status === 'booked' || a.status === 'rescheduled'
  );
  const isScreened = Boolean(latestScreening);

  // Daily Mood Quick Log State
  const [selectedMood, setSelectedMood] = useState<DailyMood | null>(() => {
    try {
      const saved = localStorage.getItem('uniwell_daily_mood');
      return (saved as DailyMood) || 'calm';
    } catch {
      return 'calm';
    }
  });

  const handleSelectMood = (mood: DailyMood) => {
    setSelectedMood(mood);
    try {
      localStorage.setItem('uniwell_daily_mood', mood);
    } catch {
      // Ignore localStorage restrictions
    }
  };

  // Pomodoro Study & Break Timer State
  const [pomodoroMode, setPomodoroMode] = useState<'study' | 'break'>('study');
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => {
          if (prev <= 1) {
            if (pomodoroMode === 'study') {
              setPomodoroMode('break');
              setCompletedSessions((c) => c + 1);
              return 5 * 60;
            } else {
              setPomodoroMode('study');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, pomodoroMode]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setPomodoroSeconds(pomodoroMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Next step determination
  const lastAttendedAppointment = appointments.find(
    (a) => a.status === 'attended' && a.followUpRecommended
  );

  let nextStepTitle = 'Complete your well-being screening';
  let nextStepDescription = 'It takes about 3–5 minutes. Your responses help us connect you with the right university support.';
  let nextStepActionLabel = 'Start screening →';
  let nextStepAction = onStartScreening;
  let nextStepBadge = 'Recommended for you';

  if (!isScreened) {
    nextStepTitle = 'Complete your well-being screening';
    nextStepDescription = 'It takes about 3–5 minutes. Your answers are private and never affect your academic registration.';
    nextStepActionLabel = 'Start screening →';
    nextStepAction = onStartScreening;
    nextStepBadge = 'First check-in';
  } else if (lastAttendedAppointment && !nextAppointment) {
    nextStepTitle = 'Follow-up appointment available';
    nextStepDescription = 'Your counsellor recommended a follow-up appointment to check on your study pacing and well-being.';
    nextStepActionLabel = 'Schedule follow-up →';
    nextStepAction = onBookAppointment;
    nextStepBadge = 'Follow-up recommended';
  } else if (nextAppointment) {
    nextStepTitle = `Upcoming appointment on ${nextAppointment.formattedDate}`;
    nextStepDescription = `With ${nextAppointment.counsellorName} (${nextAppointment.modality === 'video' ? 'Confidential Video' : 'In-person clinic session'}).`;
    nextStepActionLabel = 'View appointment details →';
    nextStepAction = () => onNavigateTab('appointments');
    nextStepBadge = 'Confirmed appointment';
  } else if (latestScreening?.stressBand === 'moderate' || latestScreening?.stressBand === 'high') {
    nextStepTitle = 'Connect with a university counsellor';
    nextStepDescription = 'Your screening responses indicate that speaking with a student wellness psychologist could be helpful.';
    nextStepActionLabel = 'Book confidential session →';
    nextStepAction = onBookAppointment;
    nextStepBadge = 'Counselling available';
  } else {
    nextStepTitle = 'Explore your student wellness toolkit';
    nextStepDescription = 'Browse guided study pacing strategies, sleep optimization checklists, and campus peer circles.';
    nextStepActionLabel = 'Explore resources →';
    nextStepAction = () => onNavigateTab('resources');
    nextStepBadge = 'Wellness active';
  }

  const moodConfig = selectedMood ? DAILY_MOOD_CONFIG[selectedMood] : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* ========================================================= */}
      {/* 1. Header Greeting & Student Context */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#2563EB] border border-blue-200/60 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span>Term Week 8 · Academic Session 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#172033] tracking-tight">
            Good day, {firstName} 👋
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-1 font-normal">
            {student?.faculty || 'Faculty of Engineering & Built Environment'} · {student?.program || 'B.Sc. Electrical Engineering'}
          </p>
        </div>

        {/* Quick Emergency Button */}
        <button
          type="button"
          onClick={onOpenCrisis}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-[#DC2626] hover:bg-rose-100 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <PhoneCall className="w-4 h-4 text-[#DC2626]" />
          <span>24/7 Crisis Help</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. THE SINGLE "YOUR NEXT STEP" HERO CARD */}
      {/* ========================================================= */}
      <div className="bg-[#173B57] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              YOUR NEXT STEP
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
              {nextStepBadge}
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              {nextStepTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              {nextStepDescription}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={nextStepAction}
              className="px-6 py-3.5 bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{nextStepActionLabel}</span>
            </button>

            {isScreened && (
              <button
                type="button"
                onClick={onStartScreening}
                className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Re-take check-in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE CALMING & SELF-REGULATION STATION */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Immediate Coping & Grounding Station
            </span>
            <h3 className="text-xl font-bold font-heading text-[#172033] mt-0.5">
              Tools to de-stress & regain focus right now
            </h3>
          </div>
          <span className="text-xs text-[#64748B]">Free · Instant · 100% Confidential</span>
        </div>

        {/* 4 Interactive Tool Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tool 1: 4-7-8 Breathing Pacer */}
          <button
            type="button"
            onClick={onOpenBreathing}
            className="p-4 rounded-xl border border-teal-200/80 bg-teal-50/50 hover:bg-teal-50 hover:border-teal-300 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Wind className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#172033] group-hover:text-teal-800">
                4-7-8 Breathing Pacer
              </h4>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Slow down heart rate and lower acute tension in 2 minutes.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal-700">
              <span>Start breathing</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Tool 2: 5-4-3-2-1 Sensory Grounding Reset */}
          <button
            type="button"
            onClick={onOpenGrounding}
            className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#172033] group-hover:text-blue-800">
                5-4-3-2-1 Grounding
              </h4>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Sensory reset for panic, racing thoughts, or test anxiety.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
              <span>Begin reset</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Tool 3: Cognitive Thought Reframer */}
          <button
            type="button"
            onClick={onOpenReframe}
            className="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#173B57] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#172033] group-hover:text-indigo-800">
                Thought Reframer
              </h4>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Challenge "I'm going to fail everything" catastrophizing.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#173B57]">
              <span>Reframe thoughts</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Tool 4: Book 1-on-1 Session */}
          <button
            type="button"
            onClick={onBookAppointment}
            className="p-4 rounded-xl border border-violet-200/80 bg-violet-50/50 hover:bg-violet-50 hover:border-violet-300 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#172033] group-hover:text-violet-800">
                Counselling Booking
              </h4>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Confidential session with Dr. Khumalo or Mr. Dlamini.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-violet-700">
              <span>Choose time slot</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. DAILY WELL-BEING PULSE & STUDY PACING SECTION */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box A: 10-Second Daily Check-in */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Daily Check-in
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Anonymous & Private
              </span>
            </div>
            <h3 className="text-lg font-bold font-heading text-[#172033]">
              How is your energy right now?
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Tap a pulse to receive tailored well-being guidance for your day.
            </p>

            {/* Mood selector buttons */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {(Object.keys(DAILY_MOOD_CONFIG) as DailyMood[]).map((moodKey) => {
                const item = DAILY_MOOD_CONFIG[moodKey];
                const isSelected = selectedMood === moodKey;
                return (
                  <button
                    key={moodKey}
                    type="button"
                    onClick={() => handleSelectMood(moodKey)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] shadow-2xs font-semibold'
                        : 'bg-slate-50 border-slate-200 text-[#64748B] hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[11px] truncate w-full text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advice card based on selection */}
          {moodConfig && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-base">{moodConfig.icon}</span>
                <span className="text-xs font-bold text-[#172033]">
                  {moodConfig.title}
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {moodConfig.advice}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">Recommended:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (moodConfig.actionType === 'grounding' && onOpenGrounding) {
                      onOpenGrounding();
                    } else if (moodConfig.actionType === 'breathing' && onOpenBreathing) {
                      onOpenBreathing();
                    } else if (moodConfig.actionTab) {
                      onNavigateTab(moodConfig.actionTab);
                    }
                  }}
                  className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  {moodConfig.suggestedAction} →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Box B: Pomodoro Study Pacer & Break Timer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Study & Recovery Pacer
              </span>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {pomodoroMode === 'study' ? '25 Min Focus' : '5 Min Restorative Break'}
              </span>
            </div>
            <h3 className="text-lg font-bold font-heading text-[#172033]">
              {pomodoroMode === 'study' ? 'Deep Work Interval' : 'Screen-Free Rest Interval'}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              {pomodoroMode === 'study'
                ? 'Focus on one subject or problem set without browser tab switching.'
                : 'Step away from your screen. Stretch, hydrate, or look outside a window.'}
            </p>

            {/* Timer Display */}
            <div className="my-4 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-[#173B57] tracking-tight">
                {formatTimer(pomodoroSeconds)}
              </div>
              <div className="text-xs text-[#64748B] mt-1">
                Completed today: <span className="font-semibold text-[#172033]">{completedSessions} blocks</span>
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={toggleTimer}
              className={`px-6 py-2.5 text-xs font-semibold rounded-xl text-white shadow-xs transition-colors flex items-center gap-2 cursor-pointer ${
                isTimerRunning
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#2563EB] hover:bg-blue-700'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{pomodoroSeconds < (pomodoroMode === 'study' ? 25 * 60 : 5 * 60) ? 'Resume' : 'Start Focus'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetTimer}
              className="p-2.5 rounded-xl border border-slate-200 text-[#64748B] hover:bg-slate-100 hover:text-[#172033] transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                const nextMode = pomodoroMode === 'study' ? 'break' : 'study';
                setPomodoroMode(nextMode);
                setIsTimerRunning(false);
                setPomodoroSeconds(nextMode === 'study' ? 25 * 60 : 5 * 60);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Switch to {pomodoroMode === 'study' ? 'Break' : 'Study'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. THREE CORE DASHBOARD STATUS CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Well-being Screening Status */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Well-being Screening
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl font-bold font-heading text-[#172033]">
                {isScreened
                  ? latestScreening?.stressBand?.toUpperCase() === 'HIGH' ||
                    latestScreening?.stressBand?.toUpperCase() === 'MODERATE'
                    ? 'Moderate'
                    : 'Low / Mild'
                  : 'Not completed'}
              </div>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                {isScreened
                  ? `Last check-in: ${new Date(latestScreening!.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} (Pulse: ${latestScreening?.pulseScore || 68}/100)`
                  : 'Takes 3–5 minutes. Confidential self-reflection'}
              </p>
            </div>
          </div>

          <div>
            {isScreened ? (
              <button
                type="button"
                onClick={() => onNavigateTab('wellbeing')}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-[#172033] text-sm font-semibold rounded-xl transition-colors text-center cursor-pointer"
              >
                View result & advice
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartScreening}
                className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors text-center cursor-pointer"
              >
                Start check-in
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Appointment Booking Status */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Counselling Session
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#173B57] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl font-bold font-heading text-[#172033]">
                {nextAppointment
                  ? nextAppointment.formattedDate
                  : 'None scheduled'}
              </div>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                {nextAppointment
                  ? `With ${nextAppointment.counsellorName.split(',')[0]} (${nextAppointment.formattedTime})`
                  : 'Free, confidential sessions with university wellness psychologists'}
              </p>
            </div>
          </div>

          <div>
            {nextAppointment ? (
              <button
                type="button"
                onClick={() => onNavigateTab('appointments')}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-[#172033] text-sm font-semibold rounded-xl transition-colors text-center cursor-pointer"
              >
                Manage appointment
              </button>
            ) : (
              <button
                type="button"
                onClick={onBookAppointment}
                className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors text-center cursor-pointer"
              >
                Book support session
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Resources Library */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Student Resources
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl font-bold font-heading text-[#172033]">
                {resourcesCount} Guides available
              </div>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Exam strategies, sleep hygiene, financial aid navigation & peer circles
              </p>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => onNavigateTab('resources')}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-[#172033] text-sm font-semibold rounded-xl transition-colors text-center cursor-pointer"
            >
              Browse resource library
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. COMPREHENSIVE CRISIS & EMERGENCY SUPPORT BAR */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#DC2626] flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-[#172033] font-heading flex items-center gap-2">
                <span>Immediate 24/7 Student Crisis Helplines</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-rose-100 text-[#DC2626]">
                  Always Open
                </span>
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">
                If you are in severe distress, experiencing panic, or need someone to listen, help is 100% free and immediate.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCrisis}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-[#DC2626] text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            View full crisis directory →
          </button>
        </div>

        {/* 3 Quick Direct-Action Contact Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          {/* Action 1: SADAG Student Helpline */}
          <a
            href="tel:0800567567"
            className="p-3 rounded-xl bg-slate-50 hover:bg-rose-50/60 border border-slate-200/80 flex items-center justify-between group transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-[#172033] group-hover:text-[#DC2626]">
                SADAG Student Line
              </div>
              <div className="text-[11px] text-[#64748B]">Toll-free 24/7 call</div>
            </div>
            <span className="text-xs font-bold text-[#DC2626]">0800 567 567</span>
          </a>

          {/* Action 2: WhatsApp Crisis Chat */}
          <a
            href="https://wa.me/27768822775?text=Hello%20UniWell%20Crisis%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 flex items-center justify-between group transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-[#172033] group-hover:text-emerald-700">
                Crisis WhatsApp Chat
              </div>
              <div className="text-[11px] text-[#64748B]">Silent text-based support</div>
            </div>
            <span className="text-xs font-bold text-[#16A34A]">076 882 2775</span>
          </a>

          {/* Action 3: Campus Protection */}
          <a
            href="tel:+27115552222"
            className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 flex items-center justify-between group transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-[#172033] group-hover:text-[#2563EB]">
                Campus Protection
              </div>
              <div className="text-[11px] text-[#64748B]">On-campus emergency dispatch</div>
            </div>
            <span className="text-xs font-bold text-[#2563EB]">ext. 2222</span>
          </a>
        </div>
      </div>
    </div>
  );
};
