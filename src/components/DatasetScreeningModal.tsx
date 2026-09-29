import React, { useState } from 'react';
import { X, Sparkles, Loader2, Info, Check, ShieldCheck } from 'lucide-react';
import type { DatasetScreeningInput, ScreeningRecord } from '../types/index.ts';

interface DatasetScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: DatasetScreeningInput) => Promise<ScreeningRecord>;
  initialInput?: Partial<DatasetScreeningInput>;
}

export const DatasetScreeningModal: React.FC<DatasetScreeningModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialInput,
}) => {
  const [formData, setFormData] = useState<DatasetScreeningInput>({
    studyHours: initialInput?.studyHours ?? 8,
    classAttendance: initialInput?.classAttendance ?? 85,
    examFrequency: initialInput?.examFrequency ?? 7,
    assignmentLoad: initialInput?.assignmentLoad ?? 8,
    sleepHours: initialInput?.sleepHours ?? 6,
    physicalExercise: initialInput?.physicalExercise ?? true,
    screenTime: initialInput?.screenTime ?? 8,
    socialMediaUse: initialInput?.socialMediaUse ?? 4,
    familySupport: initialInput?.familySupport ?? 4,
    peerPressure: initialInput?.peerPressure ?? 6,
    anxietyLevel: initialInput?.anxietyLevel ?? 7,
    feelingText:
      initialInput?.feelingText ??
      'Overlapping engineering computer systems exams and lab deliverables. Struggling to get more than 6 hours of sleep.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#f8fbf9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#173B57] text-white flex items-center justify-center font-bold text-xs">
              UW
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Private Wellbeing Check-In
              </h3>
              <p className="text-xs text-slate-500">
                Calibrated on 3,000 South African student records · Results never affect registration
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitting ? (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#09392b] animate-spin" />
            <div className="text-base font-bold text-slate-900 font-display">
              Computing Wellbeing Pulse
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Applying the 3,000-student empirical scoring model and synthesizing supportive care recommendations...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {step === 1 ? (
              <>
                <div className="text-xs font-semibold text-[#09392b] uppercase tracking-wider">
                  Step 1 of 2: Academic & Lifestyle Signals
                </div>

                {/* Academic Load & Exams */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Assignment Load (1 - 9)
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-1.5">
                      Current workload and deadline volume
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={9}
                      value={formData.assignmentLoad}
                      onChange={(e) =>
                        setFormData({ ...formData, assignmentLoad: Number(e.target.value) })
                      }
                      className="w-full accent-[#09392b]"
                    />
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-700 mt-1">
                      <span>Light</span>
                      <span className="text-[#09392b]">{formData.assignmentLoad} / 9</span>
                      <span>Heavy</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Exam Frequency (1 - 9)
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-1.5">
                      (+0.38 academic pressure signal)
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={9}
                      value={formData.examFrequency}
                      onChange={(e) =>
                        setFormData({ ...formData, examFrequency: Number(e.target.value) })
                      }
                      className="w-full accent-[#09392b]"
                    />
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-700 mt-1">
                      <span>Occasional</span>
                      <span className="text-[#09392b]">{formData.examFrequency} / 9</span>
                      <span>Constant tests</span>
                    </div>
                  </div>
                </div>

                {/* Sleep & Screen Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Average Sleep Hours ({formData.sleepHours}h)
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-1.5">
                      (-0.24 protective recovery association)
                    </span>
                    <input
                      type="range"
                      min={3}
                      max={10}
                      value={formData.sleepHours}
                      onChange={(e) =>
                        setFormData({ ...formData, sleepHours: Number(e.target.value) })
                      }
                      className="w-full accent-[#09392b]"
                    />
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-700 mt-1">
                      <span>3h</span>
                      <span className="text-[#09392b]">{formData.sleepHours} hours/night</span>
                      <span>10h</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Daily Screen Time ({formData.screenTime}h)
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-1.5">
                      (+0.49 strongest positive association)
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={formData.screenTime}
                      onChange={(e) =>
                        setFormData({ ...formData, screenTime: Number(e.target.value) })
                      }
                      className="w-full accent-[#09392b]"
                    />
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-700 mt-1">
                      <span>1h</span>
                      <span className="text-[#09392b]">{formData.screenTime} hours/day</span>
                      <span>12h+</span>
                    </div>
                  </div>
                </div>

                {/* Physical Exercise & Attendance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Regular Physical Exercise?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, physicalExercise: true })}
                        className={`p-2 text-xs font-bold rounded-lg border text-center transition-all ${
                          formData.physicalExercise
                            ? 'bg-[#09392b] text-white border-[#09392b]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Yes (Active)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, physicalExercise: false })}
                        className={`p-2 text-xs font-bold rounded-lg border text-center transition-all ${
                          !formData.physicalExercise
                            ? 'bg-[#09392b] text-white border-[#09392b]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        No / Rare
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Class Attendance: {formData.classAttendance}%
                    </label>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      step={5}
                      value={formData.classAttendance}
                      onChange={(e) =>
                        setFormData({ ...formData, classAttendance: Number(e.target.value) })
                      }
                      className="w-full accent-[#09392b] mt-2"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                      <span>40%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs font-semibold text-[#09392b] uppercase tracking-wider">
                  Step 2 of 2: Support Buffers & Qualitative Thoughts
                </div>

                {/* Family Support & Anxiety */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Family & Home Support (1 - 9)
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-1.5">
                      (-0.40 strong protective buffer)
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={9}
                      value={formData.familySupport}
                      onChange={(e) =>
                        setFormData({ ...formData, familySupport: Number(e.target.value) })
                      }
                      className="w-full accent-[#09392b]"
                    />
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-700 mt-1">
                      <span>Isolated</span>
                      <span className="text-[#09392b]">{formData.familySupport} / 9</span>
                      <span>Strong Support</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Current Anxiety Level (1 - 9)
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-1.5">
                      Nervousness, palpitations or dread
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={9}
                      value={formData.anxietyLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, anxietyLevel: Number(e.target.value) })
                      }
                      className="w-full accent-[#09392b]"
                    />
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-700 mt-1">
                      <span>Calm</span>
                      <span className="text-[#09392b]">{formData.anxietyLevel} / 9</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </div>

                {/* Social Media & Peer Pressure */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Social Media Use ({formData.socialMediaUse}h)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={8}
                      value={formData.socialMediaUse}
                      onChange={(e) =>
                        setFormData({ ...formData, socialMediaUse: Number(e.target.value) })
                      }
                      className="w-full accent-[#09392b]"
                    />
                    <div className="flex justify-between text-xs font-mono text-slate-700 mt-1">
                      <span>0h</span>
                      <span>{formData.socialMediaUse}h/day</span>
                      <span>8h</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Academic Peer Pressure (1 - 9)
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={9}
                      value={formData.peerPressure}
                      onChange={(e) =>
                        setFormData({ ...formData, peerPressure: Number(e.target.value) })
                      }
                      className="w-full accent-[#09392b]"
                    />
                    <div className="flex justify-between text-xs font-mono text-slate-700 mt-1">
                      <span>Low</span>
                      <span>{formData.peerPressure} / 9</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>

                {/* "Tell us how you're feeling" box (explicitly required to stay) */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Tell us how you're feeling
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                    Share any context in your own words (midterm fatigue, residence hall environment, family stress). This helps psychologists understand your situation before any session.
                  </p>
                  <textarea
                    rows={3}
                    value={formData.feelingText}
                    onChange={(e) => setFormData({ ...formData, feelingText: e.target.value })}
                    placeholder="e.g. Electrical engineering circuits exam is on Friday and I feel stretched..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#09392b]"
                  />
                </div>
              </>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  ← Back to Signals
                </button>
              ) : (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                  <span>FERPA protected</span>
                </div>
              )}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next: Feelings & Buffers →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Compute Wellbeing Pulse</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
