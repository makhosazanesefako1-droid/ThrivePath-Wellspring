import React, { useState } from 'react';
import { X, Settings, Bell, Shield, Eye, Smartphone, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#173B57]" />
            <h3 className="text-base font-bold text-[#172033] font-heading">
              Platform Settings
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

        <div className="p-6 space-y-5 text-sm">
          {/* Notifications */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
              Reminders & Notifications
            </span>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-[#2563EB]" />
                <span className="text-xs font-semibold text-[#172033]">SMS appointment reminders</span>
              </div>
              <input
                type="checkbox"
                checked={smsReminders}
                onChange={(e) => setSmsReminders(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-[#2563EB]" />
                <span className="text-xs font-semibold text-[#172033]">Campus email notifications</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
              />
            </label>
          </div>

          {/* Privacy & Accessibility */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
              Accessibility & Display
            </span>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-[#16A34A]" />
                <div>
                  <div className="text-xs font-semibold text-[#172033]">Enhanced WCAG contrast mode</div>
                  <div className="text-[10px] text-[#64748B]">Maximum text readability</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
              />
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#64748B] hover:text-[#172033]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Save preferences</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
