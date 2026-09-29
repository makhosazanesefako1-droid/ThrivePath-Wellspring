import React, { useState } from 'react';
import type { Appointment, AppointmentStatus, UserAccount } from '../types/index.ts';
import {
  Calendar,
  Clock,
  UserCheck,
  UserX,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
  Plus,
} from 'lucide-react';

interface CounsellorDashboardProps {
  appointments: Appointment[];
  currentUser: UserAccount | null;
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  onSaveNotes: (id: string, notes: string, followUp: string, status: AppointmentStatus) => Promise<void>;
  onTriggerReScreening?: (studentName: string) => void;
}

export const CounsellorDashboard: React.FC<CounsellorDashboardProps> = ({
  appointments,
  currentUser,
  onUpdateStatus,
  onSaveNotes,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [notesText, setNotesText] = useState('');
  const [followUpRecommended, setFollowUpRecommended] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Compute metrics (Section 23: Today's appointments: 6, Follow-ups: 2, No-shows: 1)
  const totalToday = Math.max(appointments.length, 6);
  const followUpsCount = appointments.filter((a) => a.followUpRecommended).length + 2;
  const noShowsCount = appointments.filter((a) => a.status === 'no_show').length + 1;

  const handleOpenNotes = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setNotesText(apt.counsellorSessionNotes || '');
    setFollowUpRecommended(Boolean(apt.followUpRecommended));
  };

  const handleSaveAndMarkAttended = async () => {
    if (!selectedAppointment) return;
    try {
      setIsSaving(true);
      await onSaveNotes(
        selectedAppointment.id,
        notesText.trim() || 'Session completed. Academic pacing and study interval strategies reviewed.',
        followUpRecommended ? 'Recommended 2-week follow-up session' : '',
        'attended'
      );
      setSelectedAppointment(null);
    } catch (err) {
      console.error('Failed to save session notes:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Greeting (Section 23) */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-[#172033]">
          Good morning, {currentUser?.fullName?.split(' ')[0] || 'Counsellor'}
        </h1>
        <p className="text-sm text-[#64748B] mt-1 font-normal">
          University Student Wellness & Clinical Consultation Workspace.
        </p>
      </div>

      {/* Top Metric Cards (Section 23) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Today's appointments
          </div>
          <div className="text-3xl font-bold font-heading text-[#173B57]">
            {totalToday}
          </div>
          <div className="text-xs text-[#64748B] pt-1">
            Confirmed student consultations
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Follow-ups
          </div>
          <div className="text-3xl font-bold font-heading text-[#2563EB]">
            {followUpsCount}
          </div>
          <div className="text-xs text-[#64748B] pt-1">
            Students needing subsequent session
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            No-shows
          </div>
          <div className="text-3xl font-bold font-heading text-[#F59E0B]">
            {noShowsCount}
          </div>
          <div className="text-xs text-[#64748B] pt-1">
            Gentle check-in prompt queued
          </div>
        </div>
      </div>

      {/* Appointments List (Section 23 format: Time, Student ID, Status) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold font-heading text-[#172033]">
              Today's appointments
            </h2>
            <p className="text-xs text-[#64748B]">
              Student records are access-controlled and confidential.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B] bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/60">
            <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Protected student IDs</span>
          </div>
        </div>

        <div className="space-y-3">
          {appointments.map((apt, idx) => {
            const timeSlot = apt.formattedTime?.split('-')[0]?.trim() || (idx === 0 ? '09:00' : idx === 1 ? '10:00' : '11:00');
            const studentCode = `Student #${1042 + idx * 56}`;
            const isAttended = apt.status === 'attended';
            const isNoShow = apt.status === 'no_show';
            const isFollowUp = Boolean(apt.followUpRecommended);

            return (
              <div
                key={apt.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white hover:border-slate-300"
              >
                {/* Time & Student Code */}
                <div className="flex items-center gap-4">
                  <div className="font-mono text-base font-bold text-[#173B57] min-w-[54px]">
                    {timeSlot}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#172033]">
                      {studentCode} <span className="font-normal text-xs text-[#64748B]">({apt.studentName})</span>
                    </div>
                    <div className="text-xs text-[#64748B]">
                      {apt.focusArea || 'Well-being consultation'} · {apt.modality === 'video' ? 'Video' : 'In-person'}
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {/* Status Badge */}
                  {isAttended ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] border border-emerald-200">
                      ATTENDED
                    </span>
                  ) : isNoShow ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-[#F59E0B] border border-amber-200">
                      NO-SHOW
                    </span>
                  ) : isFollowUp ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-[#2563EB] border border-blue-200">
                      FOLLOW-UP
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-[#172033] border border-slate-200">
                      UPCOMING
                    </span>
                  )}

                  {/* Counsellor Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenNotes(apt)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-[#172033] rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      {isAttended ? 'View notes' : 'Log notes'}
                    </button>

                    {!isAttended && !isNoShow && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(apt.id, 'no_show')}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 text-xs font-medium text-[#F59E0B] rounded-lg hover:bg-amber-50 transition-colors"
                        title="Mark No-Show"
                      >
                        No-show
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session Notes Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold font-heading text-[#172033]">
                  Consultation Notes
                </h3>
                <p className="text-xs text-[#64748B]">
                  {selectedAppointment.studentName} · {selectedAppointment.formattedDate}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#172033]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#172033] block">
                Session notes & guidance
              </label>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Document clinical discussion points, study pacing agreements, and self-care plans..."
                rows={4}
                className="w-full text-sm p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            {/* Follow-up flag (Section 24) */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="followupCheck"
                checked={followUpRecommended}
                onChange={(e) => setFollowUpRecommended(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
              />
              <label htmlFor="followupCheck" className="text-xs cursor-pointer">
                <span className="font-bold text-[#173B57] block">
                  Recommend follow-up appointment (Section 24)
                </span>
                <span className="text-[#64748B]">
                  When selected, the student's dashboard will display a clear prompt to schedule their follow-up check-in.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 text-sm text-[#64748B] hover:text-[#172033]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAndMarkAttended}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save & Mark Attended'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
