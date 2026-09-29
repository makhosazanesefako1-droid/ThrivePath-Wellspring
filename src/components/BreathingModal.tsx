import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, ShieldCheck } from 'lucide-react';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'ready';

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('ready');
  const [countdown, setCountdown] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      setPhase('ready');
      setCountdown(4);
      setCycleCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning) {
      if (phase === 'ready') {
        setPhase('inhale');
        setCountdown(4);
      } else {
        timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev > 1) {
              return prev - 1;
            }

            // Phase transition
            if (phase === 'inhale') {
              setPhase('hold');
              return 7;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 8;
            } else if (phase === 'exhale') {
              setCycleCount((c) => c + 1);
              setPhase('inhale');
              return 4;
            }
            return 4;
          });
        }, 1000);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, phase]);

  if (!isOpen) return null;

  const phaseDetails: Record<Phase, { text: string; sub: string; color: string; ringScale: string }> = {
    ready: {
      text: 'Ready to Reset',
      sub: 'Sit comfortably with feet flat on the floor',
      color: 'text-slate-700',
      ringScale: 'scale-90',
    },
    inhale: {
      text: 'Inhale Quietly Through Nose',
      sub: 'Filling chest and abdomen gently',
      color: 'text-teal-700',
      ringScale: 'scale-125',
    },
    hold: {
      text: 'Hold Breath Steadily',
      sub: 'Allowing oxygen saturation to settle',
      color: 'text-emerald-700',
      ringScale: 'scale-125',
    },
    exhale: {
      text: 'Exhale Completely Through Mouth',
      sub: 'Releasing somatic tension with an audible whoosh',
      color: 'text-sky-700',
      ringScale: 'scale-95',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              4-7-8 Somatic Vagal Grounding Pacer
            </h3>
            <p className="text-xs text-slate-500">
              Clinical parasympathetic nervous system regulator
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

        {/* Visualizer Area */}
        <div className="p-8 flex flex-col items-center justify-center min-h-[320px] bg-slate-50/50">
          <div className="relative flex items-center justify-center w-56 h-56">
            {/* Outer animated glow ring */}
            <div
              className={`absolute inset-0 rounded-full border-2 border-teal-500/20 bg-teal-500/5 transition-transform duration-1000 ${
                phaseDetails[phase].ringScale
              }`}
            />
            {/* Inner pulsating core */}
            <div
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-inner transition-all duration-700 ${
                phase === 'inhale'
                  ? 'bg-teal-700 text-white scale-110 shadow-teal-700/20'
                  : phase === 'hold'
                  ? 'bg-emerald-700 text-white scale-110 shadow-emerald-700/20'
                  : phase === 'exhale'
                  ? 'bg-sky-700 text-white scale-90 shadow-sky-700/20'
                  : 'bg-slate-200 text-slate-700 scale-95'
              }`}
            >
              <span className="text-4xl font-mono font-bold tabular-nums">
                {isRunning ? countdown : '4-7-8'}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider opacity-90 mt-1">
                {phase === 'ready' ? 'Standby' : phase}
              </span>
            </div>
          </div>

          <div className="text-center mt-6">
            <h4 className={`text-base font-semibold ${phaseDetails[phase].color}`}>
              {phaseDetails[phase].text}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {phaseDetails[phase].sub}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-6 text-xs text-slate-500">
            <span>Completed Cycles: <strong className="text-slate-800 font-mono">{cycleCount}</strong> / 4</span>
            <span>·</span>
            <span>Recommended Duration: 4 Cycles (~2.5 min)</span>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Reduces acute cortisol spike</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setPhase('ready');
                setCountdown(4);
              }}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg text-white transition-colors ${
                isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-800 hover:bg-teal-900'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Pacer</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Pacing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
