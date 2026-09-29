import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  HeartHandshake,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  PhoneCall,
  Scale,
  FileText,
  EyeOff,
  Server,
} from 'lucide-react';
import { fetchPrivacyLimits } from '../lib/api.ts';

interface PrivacyAndClinicalSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCrisis?: () => void;
  onOpenSafetyTests?: () => void;
}

export const PrivacyAndClinicalSafetyModal: React.FC<PrivacyAndClinicalSafetyModalProps> = ({
  isOpen,
  onClose,
  onOpenCrisis,
  onOpenSafetyTests,
}) => {
  const [backendLimits, setBackendLimits] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPrivacyLimits()
        .then((data) => setBackendLimits(data))
        .catch((err) => console.warn('Could not fetch backend limits:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="safety-modal-title" className="text-xl font-bold font-heading text-[#172033]">
                  Privacy & Clinical Safety Limits
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                  <Server className="w-2.5 h-2.5" />
                  {backendLimits?.version || 'v47.0-strict backend'}
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                UniWell Student Well-Being Governance & Ethical Boundaries (Section 47)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#172033] leading-relaxed">
          {/* Section A: Purpose Limitation */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 font-bold font-heading text-[#173B57]">
              <Scale className="w-4 h-4 text-[#2563EB]" />
              <span>A. Purpose Limitation</span>
            </div>
            <p className="text-xs text-[#172033]/90 leading-relaxed">
              UniWell is strictly designed as a <strong>student well-being screening and support routing system</strong>.
              It is <strong>not</strong> a medical diagnostic or psychiatric treatment system. The platform identifies
              potential stress indicators and connects you with university services. It never replaces a qualified psychologist,
              counsellor, doctor, or healthcare provider.
            </p>
          </div>

          {/* Section B: The Connected Care Pipeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              B. Screening & Support Pipeline (Human-in-the-Loop)
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 w-full sm:w-auto font-medium">
                Student Responses
              </div>
              <span className="text-[#64748B] font-bold">↓</span>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 w-full sm:w-auto font-medium">
                ML Screening Model
              </div>
              <span className="text-[#64748B] font-bold">↓</span>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 w-full sm:w-auto font-medium text-[#2563EB]">
                Screening Indicator
              </div>
              <span className="text-[#64748B] font-bold">↓</span>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 w-full sm:w-auto font-medium text-[#16A34A]">
                Qualified Human Support
              </div>
            </div>
          </div>

          {/* Section C: Student Autonomy & Non-Punitive Guarantee */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              C. Student Autonomy & Rights
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#172033]">
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span><strong>100% Non-Punitive:</strong> Never impacts course registration, academic standing, grades, or scholarships.</span>
              </li>
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span><strong>Voluntary Choice:</strong> You choose whether to book counselling, explore tools, or complete later.</span>
              </li>
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span><strong>Open Support:</strong> You can book university counselling at any time, regardless of your screening score.</span>
              </li>
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span><strong>No Automatic Actions:</strong> The algorithm cannot make clinical decisions or prescribe treatment.</span>
              </li>
            </ul>
          </div>

          {/* Section D: Privacy by Design & Data Minimisation */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              D. Data Minimisation & Strict Role-Based Isolation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="font-bold text-[#173B57] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Student View</span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Access only your personal check-ins, history, and booked appointments.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="font-bold text-[#173B57] flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Counsellor View</span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Access only students booked in your clinic for attendance & notes.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="font-bold text-[#173B57] flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Administrator View</span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  De-identified population statistics only. Never individual health records.
                </p>
              </div>
            </div>
          </div>

          {/* Section E: Emergency Contacts (Never Invented) */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold font-heading text-[#DC2626] flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                <span>Emergency & Crisis Support Pathways</span>
              </div>
              {onOpenCrisis && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCrisis();
                  }}
                  className="text-xs font-bold text-[#DC2626] underline cursor-pointer"
                >
                  View emergency contacts →
                </button>
              )}
            </div>
            <p className="text-xs text-rose-950/90 leading-relaxed">
              The normal ML check-in workflow is not an emergency response system. If you or someone you know is in immediate
              danger, contact your university campus protection or verified national helplines:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 bg-white/80 rounded-lg border border-rose-200">
                <span className="font-bold">SADAG 24/7 Student Helpline:</span> 0800 567 567
              </div>
              <div className="p-2 bg-white/80 rounded-lg border border-rose-200">
                <span className="font-bold">National Emergency Service:</span> 10111 / 112
              </div>
            </div>
          </div>

          {/* Section F: 14 Absolute Safety Rules */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              E. 14 Absolute Safety Rules
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-[#172033]">
              <div>1. Never diagnose a mental-health condition.</div>
              <div>2. Never claim clinical certainty from an ML prediction.</div>
              <div>3. Never predict suicide or self-harm using the general stress model.</div>
              <div>4. Never recommend medication or medical treatment.</div>
              <div>5. Never replace qualified human professionals.</div>
              <div>6. Never automatically punish or restrict students based on screening results.</div>
              <div>7. Never expose sensitive student information to unauthorized users.</div>
              <div>8. Never display individual sensitive information in public or general analytics.</div>
              <div>9. Never invent an ML result when the model fails.</div>
              <div>10. Never present a low result as proof that a student has no concerns.</div>
              <div>11. Never present a high result as proof that a student has a disorder.</div>
              <div>12. Never use screening results for unrelated academic or disciplinary purposes.</div>
              <div>13. Never use real student identifiable data in test/demonstration environments.</div>
              <div>14. Never store secrets, passwords, or credentials in source code.</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="text-xs text-[#64748B]">
            UniWell Protocol Version: <strong>HPCSA-aligned v3.2</strong>
          </div>
          <div className="flex items-center gap-2">
            {onOpenSafetyTests && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSafetyTests();
                }}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] border border-emerald-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Run Automated Tests</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#173B57] hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              I understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
