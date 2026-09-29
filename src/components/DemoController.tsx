import React, { useState } from 'react';
import type { UserRole } from '../types/index.ts';
import {
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  User,
  Shield,
  Layers,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface DemoControllerProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onResetDemo: () => Promise<void>;
  onTriggerScreening: () => void;
  onTriggerBooking: () => void;
  onNavigateTab: (tab: string) => void;
  onTriggerSafetyTests?: () => void;
}

export const DemoController: React.FC<DemoControllerProps> = ({
  currentRole,
  onRoleChange,
  onResetDemo,
  onTriggerScreening,
  onTriggerBooking,
  onNavigateTab,
  onTriggerSafetyTests,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    try {
      setIsResetting(true);
      await onResetDemo();
      onRoleChange('student');
      onNavigateTab('dashboard');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed bottom-16 md:bottom-4 right-4 z-40">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden text-xs">
        {/* Toggle Pill */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3.5 py-2 text-[#173B57] font-semibold hover:bg-slate-50 transition-colors w-full"
        >
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span>Demo Controller</span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-[#64748B]" />
          )}
        </button>

        {isExpanded && (
          <div className="p-3.5 border-t border-slate-100 bg-[#F8FAFC] space-y-3 w-64">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Quick Persona Switch
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onRoleChange('student');
                    onNavigateTab('dashboard');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors ${
                    currentRole === 'student'
                      ? 'bg-[#173B57] text-white font-semibold'
                      : 'bg-white border border-slate-200 text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRoleChange('counsellor');
                    onNavigateTab('appointments');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors ${
                    currentRole === 'counsellor'
                      ? 'bg-[#173B57] text-white font-semibold'
                      : 'bg-white border border-slate-200 text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  Counsellor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRoleChange('admin');
                    onNavigateTab('dashboard');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors ${
                    currentRole === 'admin'
                      ? 'bg-[#173B57] text-white font-semibold'
                      : 'bg-white border border-slate-200 text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Quick Actions
              </span>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={onTriggerScreening}
                  className="w-full text-left py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 text-[#172033] hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Open 3–5 min Check-in</span>
                </button>
                <button
                  type="button"
                  onClick={onTriggerBooking}
                  className="w-full text-left py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 text-[#172033] hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Book Counselling Modal</span>
                </button>
                {onTriggerSafetyTests && (
                  <button
                    type="button"
                    onClick={onTriggerSafetyTests}
                    className="w-full text-left py-1.5 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#16A34A] hover:bg-emerald-100 flex items-center justify-between font-semibold"
                  >
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Clinical Safety Tests</span>
                    </div>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-200 text-[#16A34A] font-bold">
                      9/9
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Reset Demo button */}
            <div className="pt-1 border-t border-slate-200/60">
              <button
                type="button"
                onClick={handleReset}
                disabled={isResetting}
                className="w-full py-1.5 px-2.5 bg-slate-200/80 hover:bg-slate-300/80 text-[#172033] rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
