import React from 'react';
import { X, HelpCircle, PhoneCall, ShieldCheck, Mail, BookOpen } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCrisis: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onOpenCrisis }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-base font-bold text-[#172033] font-heading">
              UniWell Student Help & FAQ
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#172033]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
          <div className="space-y-1.5">
            <h4 className="font-bold text-[#172033] text-sm">
              Will my screening results affect my university registration?
            </h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              No. Well-being screenings are completely confidential and independent of academic progression or course registration. They are designed solely to connect you with supportive wellness resources.
            </p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-[#172033] text-sm">
              How do counselling appointments work?
            </h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Appointments are free for enrolled students and run for 50 minutes. You can choose confidential video consultations or in-person sessions at the campus Student Wellness Centre.
            </p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-[#172033] text-sm">
              Who has access to my session notes?
            </h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Only your designated student wellness psychologist has access to your consultation records. Faculty deans and course instructors never have access to private student well-being files.
            </p>
          </div>

          {/* Quick contact box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 mt-4">
            <div className="text-xs font-bold text-[#173B57]">
              Campus Student Wellness Office
            </div>
            <div className="text-xs text-[#64748B]">
              Email: <span className="text-[#172033] font-mono">wellness@campus.ac.za</span> · Phone: <span className="text-[#172033] font-mono">+27 (0)11 717 9140</span>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCrisis();
                }}
                className="text-xs font-semibold text-[#DC2626] hover:underline flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>View emergency crisis contacts</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-xl hover:bg-blue-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
