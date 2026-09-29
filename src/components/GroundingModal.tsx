import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Eye, Hand, Volume2, Sparkles, Heart } from 'lucide-react';

interface GroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const STEPS = [
  {
    step: 5,
    title: '5 Things You Can See',
    subtitle: 'Look around your room or study space. Notice 5 distinct visual details.',
    icon: Eye,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    prompt: 'Name 5 things in your field of vision (e.g., the grain of your desk, shadow on the wall, edge of your screen, a book spine, a plant leaf).',
    examples: ['Desk surface texture', 'Window light reflection', 'Color of my pen', 'Pattern on my clothing', 'Shape of the door frame'],
  },
  {
    step: 4,
    title: '4 Things You Can Physically Touch',
    subtitle: 'Bring full awareness to physical sensations right where you are sitting.',
    icon: Hand,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    prompt: 'Notice 4 physical textures or contact points anchoring you to the present moment.',
    examples: ['Feet firmly grounded on the floor', 'The back of the chair supporting your spine', 'The fabric of your sleeve against your arm', 'The cool air against your fingertips'],
  },
  {
    step: 3,
    title: '3 Things You Can Hear',
    subtitle: 'Listen closely to the ambient soundscape around you.',
    icon: Volume2,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    prompt: 'Focus your auditory attention on 3 distinct sounds, near or distant.',
    examples: ['The soft hum of a laptop fan or air conditioning', 'Distant birds, breeze, or campus activity', 'The sound of your own quiet, steady breathing'],
  },
  {
    step: 2,
    title: '2 Things You Can Smell',
    subtitle: 'Inhale gently and notice the scent of your environment or remember a comforting scent.',
    icon: Sparkles,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    prompt: 'Notice 2 scents around you (fresh air, coffee, paper) or visualize a calming scent (lavender, rain on soil).',
    examples: ['A warm beverage or clean room air', 'A soothing memory of fresh eucalyptus or rain'],
  },
  {
    step: 1,
    title: '1 Positive Truth About Yourself',
    subtitle: 'Ground yourself in self-compassion and reality.',
    icon: Heart,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    prompt: 'Repeat this grounding anchor to yourself: "I am safe in this present moment. Academic stress is temporary, and I can take things one step at a time."',
    examples: ['I am doing my best with the energy I have today', 'My worth as a human is not defined by one exam or grade'],
  },
];

export const GroundingModal: React.FC<GroundingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const current = STEPS[currentStepIndex]!;
  const isFinished = currentStepIndex >= STEPS.length;
  const StepIcon = current.icon;

  const handleNext = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps((prev) => [...prev, currentStepIndex]);
    }
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setCustomNote('');
    } else {
      setCurrentStepIndex(STEPS.length);
      if (onComplete) onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setCustomNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-[#172033] font-heading flex items-center gap-2">
              <span>5-4-3-2-1 Sensory Grounding Reset</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Clinically backed exercise to interrupt acute anxiety and panic
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          {STEPS.map((s, idx) => (
            <div
              key={s.step}
              className={`h-full flex-1 transition-all duration-300 ${
                idx < currentStepIndex || isFinished
                  ? 'bg-[#2563EB]'
                  : idx === currentStepIndex
                  ? 'bg-blue-400'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!isFinished ? (
            <>
              {/* Step indicator */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Step {currentStepIndex + 1} of 5
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
                  {current.step} Sensory Anchor{current.step > 1 ? 's' : ''}
                </span>
              </div>

              {/* Step Title & Icon */}
              <div className="flex items-start gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${current.color}`}>
                  <StepIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#172033] font-heading">
                    {current.title}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    {current.subtitle}
                  </p>
                </div>
              </div>

              {/* Prompt Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="text-xs font-semibold text-[#172033]">
                  {current.prompt}
                </div>
                <div className="text-[11px] text-[#64748B] space-y-1">
                  <span className="font-semibold text-slate-700 block">Helpful ideas:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {current.examples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Optional note or reflection input */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Your observations (optional, for your focus):
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder={`e.g., I notice ${current.examples[0]?.toLowerCase()}...`}
                  className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[#172033]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNext();
                  }}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
                    currentStepIndex === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-[#64748B] hover:text-[#172033] hover:bg-slate-100'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentStepIndex === STEPS.length - 1 ? 'Complete reset' : 'Next step'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            /* Completed Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold font-heading text-[#172033]">
                  Somatic Reset Complete
                </h4>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">
                  Your nervous system has re-oriented to your physical surroundings. Notice if your shoulders have dropped or your breathing feels slightly more natural.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-[#16A34A] font-medium max-w-md mx-auto">
                Remember: Whenever studying feels overwhelming, this 2-minute reset is always available to bring you back to safety.
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#172033] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Repeat exercise
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Back to student dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
