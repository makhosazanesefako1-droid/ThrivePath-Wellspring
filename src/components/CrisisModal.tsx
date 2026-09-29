import React from 'react';
import { X, PhoneCall, ShieldAlert, Heart, MapPin } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Urgent Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-50 border-b border-rose-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950 font-heading">
                Immediate Crisis & Support Helplines
              </h3>
              <p className="text-xs text-rose-800">
                Confidential, free 24/7 student emergency services
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-rose-700 hover:text-rose-950 hover:bg-rose-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resources list */}
        <div className="p-6 space-y-3.5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-[#172033]">
                SADAG Student Crisis Line
              </div>
              <div className="text-xs text-[#64748B]">
                South African Depression & Anxiety Group · Toll-free 24/7
              </div>
              <div className="text-sm font-mono font-bold text-[#2563EB] pt-1">
                0800 567 567
              </div>
            </div>
            <a
              href="tel:0800567567"
              className="px-3.5 py-2 text-xs font-semibold bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-[#172033]">
                Campus Protection Services (CPS)
              </div>
              <div className="text-xs text-[#64748B]">
                Immediate on-campus safety & emergency medical response
              </div>
              <div className="text-sm font-mono font-bold text-[#173B57] pt-1">
                +27 11 717 4444 (24h)
              </div>
            </div>
            <a
              href="tel:+27117174444"
              className="px-3.5 py-2 text-xs font-semibold bg-[#173B57] text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-[#172033]">
                LifeLine 24-Hour Crisis Line
              </div>
              <div className="text-xs text-[#64748B]">
                Free emotional support, trauma de-escalation & guidance
              </div>
              <div className="text-sm font-mono font-bold text-[#16A34A] pt-1">
                0861 322 322
              </div>
            </div>
            <a
              href="tel:0861322322"
              className="px-3.5 py-2 text-xs font-semibold bg-[#16A34A] text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-xs font-semibold text-[#172033] rounded-xl hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
