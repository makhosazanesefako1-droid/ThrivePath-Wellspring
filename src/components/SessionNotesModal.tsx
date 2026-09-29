import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, CalendarClock } from 'lucide-react';
import type { Appointment, AppointmentStatus } from '../types/index.ts';

interface SessionNotesModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveNotes: (
    id: string,
    notes: string,
    followUp: string,
    status: AppointmentStatus
  ) => Promise<void>;
}

export const SessionNotesModal: React.FC<SessionNotesModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSaveNotes,
}) => {
  const [status, setStatus] = useState<AppointmentStatus>(appointment?.status || 'attended');
  const [notes, setNotes] = useState(appointment?.counsellorSessionNotes || '');
  const [followUp, setFollowUp] = useState(appointment?.followUpRecommended || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (appointment) {
      setStatus(appointment.status);
      setNotes(appointment.counsellorSessionNotes || '');
      setFollowUp(appointment.followUpRecommended || '');
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSaveNotes(appointment.id, notes, followUp, status);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-800" />
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Clinical Session Record & Care Plan
              </h3>
              <p className="text-xs text-slate-500">
                Student: {appointment.studentName} · {appointment.studentFaculty}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Attendance Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Attendance Verification
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('attended')}
                className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                  status === 'attended'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Attended & Completed
              </button>
              <button
                type="button"
                onClick={() => setStatus('no_show')}
                className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                  status === 'no_show'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Mark No-Show
              </button>
              <button
                type="button"
                onClick={() => setStatus('rescheduled')}
                className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                  status === 'rescheduled'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Reschedule Needed
              </button>
            </div>
          </div>

          {/* Clinical Session Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Session Notes (Confidential Health Record)
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detail interventions introduced (e.g., 4-7-8 breathing, sleep contract, cognitive reframing), student affect, and risk evaluation..."
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 font-sans"
              required
            />
          </div>

          {/* Follow-up Plan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Follow-Up & Closed-Loop Re-Screening Plan
            </label>
            <textarea
              rows={2}
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="e.g. Trigger Week 7 re-screening survey in student portal; refer to engineering peer study circle..."
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 font-sans"
            />
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>
              Saving clinical notes updates the student's care timeline and prepares the re-screening indicator delta tracker.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold bg-teal-800 text-white rounded-lg hover:bg-teal-900 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Clinical Record...' : 'Save & Update Care Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
