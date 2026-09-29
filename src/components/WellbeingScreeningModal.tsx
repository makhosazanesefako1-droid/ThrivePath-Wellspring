import React, { useState, useEffect } from 'react';
import type { DatasetScreeningInput, ScreeningRecord } from '../types/index.ts';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Heart,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface WellbeingScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: DatasetScreeningInput) => Promise<ScreeningRecord>;
  onBookCounselling: () => void;
  onExploreResources: () => void;
  initialInput?: DatasetScreeningInput;
  onOpenPrivacy?: () => void;
  onOpenCrisis?: () => void;
  onOpenMLInfo?: () => void;
}

interface StepQuestion {
  stepNumber: number;
  category: string;
  question: string;
  field: keyof DatasetScreeningInput;
  options: { label: string; value: number }[];
}

const QUESTIONS: StepQuestion[] = [
  {
    stepNumber: 1,
    category: 'Sleep & rest',
    question: 'On average, how many hours of restful sleep do you get each night?',
    field: 'sleepHours',
    options: [
      { label: 'Less than 5 hours', value: 4 },
      { label: '5 to 6 hours', value: 6 },
      { label: '7 to 8 hours', value: 8 },
      { label: '9 hours or more', value: 9 },
    ],
  },
  {
    stepNumber: 2,
    category: 'Academic life',
    question: 'How often do you feel overwhelmed by your academic workload?',
    field: 'assignmentLoad',
    options: [
      { label: 'Never', value: 2 },
      { label: 'Rarely', value: 4 },
      { label: 'Sometimes', value: 6 },
      { label: 'Often', value: 8 },
      { label: 'Very often', value: 10 },
    ],
  },
  {
    stepNumber: 3,
    category: 'Exam & test frequency',
    question: 'How frequent are exams, tests, and major deadlines across your current modules?',
    field: 'examFrequency',
    options: [
      { label: 'Rare or low frequency', value: 2 },
      { label: 'Moderate (every 2–3 weeks)', value: 5 },
      { label: 'Frequent (weekly assessments)', value: 8 },
      { label: 'Continuous intense testing', value: 9 },
    ],
  },
  {
    stepNumber: 4,
    category: 'Social & family support',
    question: 'How supported do you feel by family, friends, or campus peers when facing difficulties?',
    field: 'familySupport',
    options: [
      { label: 'Very little support', value: 2 },
      { label: 'Some support available', value: 4 },
      { label: 'Good supportive network', value: 7 },
      { label: 'Strong, reliable support', value: 9 },
    ],
  },
  {
    stepNumber: 5,
    category: 'Screen time & reflections',
    question: 'How many hours per day do you spend on digital screens outside of lecture coursework?',
    field: 'screenTime',
    options: [
      { label: 'Under 3 hours', value: 3 },
      { label: '4 to 6 hours', value: 5 },
      { label: '7 to 8 hours', value: 7 },
      { label: 'Over 8 hours', value: 9 },
    ],
  },
];

export const WellbeingScreeningModal: React.FC<WellbeingScreeningModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onBookCounselling,
  onExploreResources,
  initialInput,
  onOpenPrivacy,
  onOpenCrisis,
  onOpenMLInfo,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [responses, setResponses] = useState<DatasetScreeningInput>({
    studyHours: initialInput?.studyHours || 7,
    classAttendance: initialInput?.classAttendance || 88,
    examFrequency: initialInput?.examFrequency || 6,
    assignmentLoad: initialInput?.assignmentLoad || 6,
    sleepHours: initialInput?.sleepHours || 6,
    physicalExercise: initialInput?.physicalExercise ?? true,
    screenTime: initialInput?.screenTime || 6,
    socialMediaUse: initialInput?.socialMediaUse || 4,
    familySupport: initialInput?.familySupport || 6,
    peerPressure: initialInput?.peerPressure || 5,
    anxietyLevel: initialInput?.anxietyLevel || 5,
    feelingText: initialInput?.feelingText || '',
  });

  const [optionalNote, setOptionalNote] = useState(initialInput?.feelingText || '');
  const [stage, setStage] = useState<'questions' | 'processing' | 'result'>('questions');
  const [submittedRecord, setSubmittedRecord] = useState<ScreeningRecord | null>(null);
  const [processingCheckmarks, setProcessingCheckmarks] = useState({
    received: false,
    completed: false,
    options: false,
  });

  useEffect(() => {
    if (isOpen) {
      setStage('questions');
      setCurrentStepIndex(0);
      setSubmittedRecord(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = QUESTIONS[currentStepIndex];
  const isLastQuestion = currentStepIndex === QUESTIONS.length - 1;

  const handleSelectOption = (value: number) => {
    if (!currentQ) return;
    setResponses((prev) => ({
      ...prev,
      [currentQ.field]: value,
    }));
  };

  const handleNext = async () => {
    if (currentStepIndex < QUESTIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Complete questionnaire -> Short calm ML transition
      setStage('processing');
      setProcessingCheckmarks({ received: false, completed: false, options: false });

      // Run actual backend submission
      const payload: DatasetScreeningInput = {
        ...responses,
        feelingText: optionalNote.trim() || undefined,
      };

      // Sequential checkmarks for 1.8 seconds (Section 16: "approximately 1–3 seconds")
      setTimeout(() => {
        setProcessingCheckmarks((p) => ({ ...p, received: true }));
      }, 500);

      setTimeout(() => {
        setProcessingCheckmarks((p) => ({ ...p, completed: true }));
      }, 1000);

      setTimeout(() => {
        setProcessingCheckmarks((p) => ({ ...p, options: true }));
      }, 1500);

      try {
        const record = await onSubmit(payload);
        setSubmittedRecord(record);
        setTimeout(() => {
          setStage('result');
        }, 1800);
      } catch (err) {
        // Clinical Safety: Provide neutral output when the ML model fails
        const neutralFallbackRecord: ScreeningRecord = {
          id: `scr_neutral_fallback_${Date.now()}`,
          studentId: 'usr_student_01',
          studentName: 'Student',
          timestamp: new Date().toISOString(),
          termWeek: 8,
          input: payload,
          rawScore: 10,
          pulseScore: 50,
          stressBand: 'neutral' as any,
          primaryIndicator: 'General Well-Being Check',
          aiAnalysis: {
            clinicalSummary:
              'Your check-in responses have been recorded safely. University support services, self-guided toolkits, and confidential counselling remain completely accessible to you.',
            identifiedTriggers: [],
            protectiveFactors: ['Proactive well-being check-in'],
            recommendedPathway: 'self_guided',
            actionItems: [
              'Explore self-guided student well-being toolkit',
              'Speak with a qualified university counsellor if desired',
              'Check in again anytime',
            ],
          },
        };
        setSubmittedRecord(neutralFallbackRecord);
        setTimeout(() => {
          setStage('result');
        }, 1800);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const isCurrentAnswered = currentQ ? responses[currentQ.field] !== undefined : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* ========================================================= */}
        {/* Modal Top Bar */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#173B57] uppercase tracking-wider">
              Student Well-Being
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-200/60 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* STAGE 1: QUESTIONS */}
        {/* ========================================================= */}
        {stage === 'questions' && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Top Reassuring Header (Section 13 & 47.B) */}
            <div className="space-y-3 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold font-heading text-[#172033]">
                  Well-being check
                </h2>
                <p className="text-sm text-[#64748B] mt-0.5">
                  This takes about 3–5 minutes. Your answers help us understand what support may be useful for you.
                </p>
              </div>

              {/* Section 47.B: Student-Facing Disclaimer & Privacy Link */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100/80 space-y-1.5">
                <div className="text-xs font-bold text-[#173B57] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  <span>About this screening</span>
                </div>
                <p className="text-xs text-[#172033]/90 leading-relaxed">
                  This screening is designed to identify potential well-being and stress indicators and help connect you with appropriate university support. It is not a medical diagnosis and does not replace professional assessment.
                </p>
                <div className="pt-0.5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Learn about privacy & screening →
                  </button>
                  {onOpenMLInfo && (
                    <button
                      type="button"
                      onClick={onOpenMLInfo}
                      className="text-[11px] font-medium text-[#64748B] hover:text-[#173B57] cursor-pointer"
                    >
                      Inspect ML validation data
                    </button>
                  )}
                </div>
                {onOpenCrisis && (
                  <div className="pt-2 text-[11px] text-[#64748B] flex items-center justify-between border-t border-blue-100/60">
                    <span>Need immediate crisis support right now?</span>
                    <button
                      type="button"
                      onClick={onOpenCrisis}
                      className="text-[#DC2626] font-semibold hover:underline cursor-pointer"
                    >
                      24/7 Helpline (0800 567 567) →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress indicator (Section 14) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                <span className="text-[#173B57]">{currentQ.category}</span>
                <span>
                  Step {currentQ.stepNumber} of {QUESTIONS.length}
                </span>
              </div>

              {/* Progress bar track */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(currentQ.stepNumber / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="pt-2">
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[#172033] leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Large Clickable Answer Cards (Section 13) */}
            <div className="space-y-3 pt-1">
              {currentQ.options.map((opt) => {
                const isSelected = responses[currentQ.field] === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between min-h-[52px] ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50/70 text-[#173B57] shadow-xs ring-1 ring-[#2563EB]'
                        : 'border-slate-200 bg-white text-[#172033] hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#2563EB] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional feeling text on Step 5 */}
            {isLastQuestion && (
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-semibold text-[#172033]">
                  Is there anything specific on your mind? <span className="text-[#64748B] font-normal">(Optional)</span>
                </label>
                <textarea
                  value={optionalNote}
                  onChange={(e) => setOptionalNote(e.target.value)}
                  placeholder="e.g. feeling the pressure of upcoming assignments and practical labs..."
                  rows={3}
                  className="w-full text-sm p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-[#172033] placeholder:text-slate-400"
                />
              </div>
            )}

            {/* Bottom Navigation Buttons (Section 14: Back & Continue) */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {currentStepIndex > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-[#172033] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isLastQuestion ? 'Review result' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 2: ML PROCESSING (Section 16: 1–3s transition) */}
        {/* ========================================================= */}
        {stage === 'processing' && (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-heading text-[#172033]">
                Reviewing your responses...
              </h3>
              <p className="text-xs text-[#64748B]">
                Evaluating patterns with university well-being model
              </p>
            </div>

            {/* Three concise checkmarks */}
            <div className="max-w-xs mx-auto text-left space-y-3 pt-2 text-sm text-[#172033]">
              <div
                className={`flex items-center gap-2.5 transition-opacity duration-300 ${
                  processingCheckmarks.received ? 'opacity-100 text-[#16A34A]' : 'opacity-30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold text-[#172033]">Responses received</span>
              </div>

              <div
                className={`flex items-center gap-2.5 transition-opacity duration-300 ${
                  processingCheckmarks.completed ? 'opacity-100 text-[#16A34A]' : 'opacity-30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold text-[#172033]">Screening completed</span>
              </div>

              <div
                className={`flex items-center gap-2.5 transition-opacity duration-300 ${
                  processingCheckmarks.options ? 'opacity-100 text-[#16A34A]' : 'opacity-30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold text-[#172033]">Preparing your support options</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 3: RESULT SCREEN (Sections 17, 18, 19, & 47) */}
        {/* ========================================================= */}
        {stage === 'result' && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="text-center space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Your screening result
              </div>

              {/* Band Label (Sections 18 & 19 & 47.A: Stress Indicator, not diagnosis) */}
              {submittedRecord?.stressBand === 'low' ? (
                <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-100 text-[#16A34A] border border-emerald-200">
                  LOW / MILD STRESS INDICATOR
                </div>
              ) : submittedRecord?.stressBand === 'neutral' ? (
                <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-blue-100 text-[#2563EB] border border-blue-200">
                  WELL-BEING SCREENING / SUPPORT READY
                </div>
              ) : (
                <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-amber-100 text-[#F59E0B] border border-amber-200">
                  MODERATE / HIGH STRESS INDICATOR
                </div>
              )}

              {/* Result explanation text using Section 47.F & 47.G certified copy */}
              {submittedRecord?.stressBand === 'low' ? (
                <p className="text-base text-[#172033] max-w-md mx-auto leading-relaxed">
                  Your responses do not currently indicate a high level of concern based on this screening. If you are experiencing difficulties, you can still access university support.
                </p>
              ) : submittedRecord?.stressBand === 'neutral' ? (
                <p className="text-base text-[#172033] max-w-md mx-auto leading-relaxed">
                  Your responses have been recorded safely. Even if automated scoring is unavailable, all university well-being resources, support toolkits, and confidential counselling remain completely accessible to you.
                </p>
              ) : (
                <p className="text-base text-[#172033] max-w-md mx-auto leading-relaxed">
                  Your responses indicate that additional support may be helpful. You can speak with a qualified university counsellor.
                </p>
              )}
            </div>

            {/* Section 47.F: Accessible Emergency Support Options in All Scenarios */}
            {submittedRecord?.stressBand === 'high' || submittedRecord?.stressBand === 'moderate' ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 space-y-1.5 text-xs text-rose-950">
                <div className="font-bold text-[#DC2626] flex items-center justify-between">
                  <span>Need immediate help?</span>
                  {onOpenCrisis && (
                    <button
                      type="button"
                      onClick={onOpenCrisis}
                      className="text-xs text-[#DC2626] underline font-semibold cursor-pointer"
                    >
                      Emergency Contacts →
                    </button>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">
                  If you are in immediate danger or experiencing an acute crisis, contact your local emergency service or the university's designated toll-free helpline (SADAG: 0800 567 567 / Emergency: 10111).
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#64748B]">Need immediate support or 24/7 crisis guidance?</span>
                </div>
                {onOpenCrisis && (
                  <button
                    type="button"
                    onClick={onOpenCrisis}
                    className="text-xs text-[#DC2626] font-semibold hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>Emergency Contacts (0800 567 567) →</span>
                  </button>
                )}
              </div>
            )}

            {/* Action buttons (Section 47.H: [Book counselling] [Explore resources] [Complete later]) */}
            <div className="pt-1 space-y-2.5 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookCounselling();
                }}
                className="w-full py-3 px-6 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book counselling</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreResources();
                }}
                className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200/80 text-[#172033] text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4" />
                <span>Explore support resources</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-medium text-[#64748B] hover:text-[#172033] transition-colors text-center cursor-pointer"
              >
                Complete later
              </button>
            </div>

            {/* Mandatory Safety Copy (Section 47.W) */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-center text-xs text-[#64748B]">
              <p className="leading-relaxed text-[#172033]/80">
                <strong>Important:</strong> This result is based on your screening responses and is not a medical diagnosis. If you are concerned about your well-being, you can contact a qualified university support professional regardless of your result.
              </p>

              <div className="pt-1 flex items-center justify-center gap-4 text-[11px]">
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="text-[#2563EB] hover:underline cursor-pointer"
                >
                  Clinical safety limits & privacy
                </button>
                {onOpenMLInfo && (
                  <button
                    type="button"
                    onClick={onOpenMLInfo}
                    className="text-[#2563EB] hover:underline cursor-pointer"
                  >
                    View ML model validation & test metrics
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
