import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, Lightbulb, RefreshCw } from 'lucide-react';

interface CognitiveReframeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_DISTORTIONS = [
  {
    thought: "If I don't score above 90% on this Organic Chemistry midterm, my GPA is ruined and I'll never get into medical school.",
    distortion: 'All-or-Nothing Thinking & Catastrophizing',
    reframe: 'One exam grade does not define my capability or future. Admissions and career paths evaluate cumulative persistence, and there are multiple avenues to achieve my goals.',
  },
  {
    thought: "Everyone else in my engineering lab finishes their coding projects in half the time. I'm fundamentally slower and don't belong here.",
    distortion: 'Imposter Phenomenon & Upward Social Comparison',
    reframe: 'I am comparing my behind-the-scenes effort to other students’ external confidence. Learning curves vary by topic, and asking for clarification is a core engineering skill.',
  },
  {
    thought: "I feel completely overwhelmed today, which proves I can't handle university academic rigor.",
    distortion: 'Emotional Reasoning',
    reframe: 'Feeling exhausted is a physiological response to sleep deprivation and intense deadlines, not proof of intellectual inadequacy. Rest will restore my perspective.',
  },
];

export const CognitiveReframeModal: React.FC<CognitiveReframeModalProps> = ({ isOpen, onClose }) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customThought, setCustomThought] = useState('');
  const [generatedReframe, setGeneratedReframe] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPreset = PRESET_DISTORTIONS[selectedPresetIndex];

  const handleApplyReframe = () => {
    if (customThought.trim()) {
      setGeneratedReframe(
        `Balanced perspective: While "${customThought.trim()}" feels intensely pressing right now, acknowledging the pressure allows me to break the challenge into single manageable steps without catastrophic projection.`
      );
    } else {
      setGeneratedReframe(currentPreset.reframe);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Exam Catastrophizing & Cognitive Reframer
            </h3>
            <p className="text-xs text-slate-500">
              CBT-grounded systematic thought re-appraisal
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Step 1: Automatic Thought */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                1. Identify the Automatic Stress Thought
              </label>
              <div className="flex gap-1">
                {PRESET_DISTORTIONS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedPresetIndex(i);
                      setCustomThought('');
                      setGeneratedReframe(null);
                    }}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                      selectedPresetIndex === i && !customThought
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Scenario {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 italic">
              "{currentPreset.thought}"
            </div>

            <div className="mt-2">
              <input
                type="text"
                placeholder="Or type your own anxious thought here..."
                value={customThought}
                onChange={(e) => {
                  setCustomThought(e.target.value);
                  setGeneratedReframe(null);
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Step 2: Cognitive Distortion Detected */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span>Cognitive Trap Detected:</span>
            </div>
            <p className="text-xs text-amber-800">
              {currentPreset.distortion} — exaggerating negative outcomes and overlooking protective competencies.
            </p>
          </div>

          {/* Step 3: Balanced Reframe Action */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                2. Balanced Cognitive Re-Appraisal
              </span>
              <button
                type="button"
                onClick={handleApplyReframe}
                className="flex items-center gap-1 text-xs font-medium text-teal-800 hover:text-teal-900"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generate Reframe</span>
              </button>
            </div>

            {generatedReframe ? (
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-teal-950 leading-relaxed">
                    {generatedReframe}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
                Click "Generate Reframe" to transform cognitive strain into adaptive focus.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
          <span className="text-[11px] text-slate-500">
            Source: University Cognitive Behavioral Therapy Protocols
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Done & Save Insight
          </button>
        </div>
      </div>
    </div>
  );
};
