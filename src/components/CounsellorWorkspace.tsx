import React, { useState } from 'react';
import type { Appointment, AppointmentStatus, UserAccount } from '../types/index.ts';
import {
  Stethoscope,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  FileEdit,
  RotateCcw,
  Bell,
  AlertCircle,
  CheckCircle2,
  Lock,
  Search,
  Filter,
} from 'lucide-react';

interface CounsellorWorkspaceProps {
  appointments: Appointment[];
  currentUser: UserAccount | null;
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  onOpenNotesModal: (apt: Appointment) => void;
  onOpenRescheduleModal: (apt: Appointment) => void;
  onSendReminder: (id: string) => Promise<void>;
  onTriggerReScreening: (studentName: string) => void;
}

export const CounsellorWorkspace: React.FC<CounsellorWorkspaceProps> = ({
  appointments,
  currentUser,
  onUpdateStatus,
  onOpenNotesModal,
  onOpenRescheduleModal,
  onSendReminder,
  onTriggerReScreening,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const counsellorName = currentUser?.fullName || 'Dr. Nomvula Khumalo, Ph.D.';
  const counsellorTitle = currentUser?.title || 'Lead Clinical Psychologist';
  const isApproved = currentUser ? currentUser.approved : true;

  if (!isApproved) {
    return (
      <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">
            Account Pending Administrator Approval
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your counsellor account for <strong>{counsellorName}</strong> has been registered and is currently in the verification queue. The Platform Administrator must approve your clinical credentials before you can access confidential student appointment records.
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
          Tip: You can switch to the <strong>Admin</strong> tab above to approve pending counsellor accounts, or sign in as Dr. Nomvula Khumalo to view an approved schedule.
        </div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.studentFaculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.focusArea.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const highStressCount = appointments.filter((a) => a.stressBand === 'high').length;
  const attendedCount = appointments.filter((a) => a.status === 'attended').length;

  return (
    <div className="space-y-6">
      {/* Clinician Overview Banner */}
      <div className="bg-[#09392b] text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Counsellor Clinical Portal · Scoped Access</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            {counsellorName} — Daily Clinic Roster
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            {counsellorTitle}. You only see students who booked directly with you. Attendance, session notes, rescheduling, and follow-ups are saved permanently.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-xs text-center shrink-0">
          <div>
            <div className="text-emerald-200 text-[10px] uppercase font-bold">Your Bookings</div>
            <div className="text-lg font-mono font-bold text-white">{appointments.length}</div>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <div>
            <div className="text-rose-300 text-[10px] uppercase font-bold">High Stress</div>
            <div className="text-lg font-mono font-bold text-rose-300">{highStressCount}</div>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <div>
            <div className="text-emerald-300 text-[10px] uppercase font-bold">Attended</div>
            <div className="text-lg font-mono font-bold text-emerald-300">{attendedCount}</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student, faculty, focus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#09392b]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs p-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#09392b] bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="attended">Attended</option>
            <option value="no_show">No-Show</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
            No student appointments found matching your search.
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const isHighStress = apt.stressBand === 'high';

            return (
              <div
                key={apt.id}
                className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isHighStress ? 'border-rose-200 bg-[#fffcfc]' : 'border-slate-200/90'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border capitalize ${
                        apt.status === 'attended'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : apt.status === 'no_show'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}
                    >
                      Status: {apt.status.replace(/_/g, ' ')}
                    </span>

                    {isHighStress && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>High Stress Triage</span>
                      </span>
                    )}

                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {apt.formattedDate} ({apt.formattedTime})
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {apt.studentName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {apt.studentFaculty} · Year {apt.studentYear}
                    </p>
                  </div>

                  <div className="text-xs text-slate-700">
                    <strong>Focus:</strong> {apt.focusArea}
                  </div>

                  {apt.intakeNotes && (
                    <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-lg">
                      "{apt.intakeNotes}"
                    </div>
                  )}

                  {apt.counsellorSessionNotes && (
                    <div className="text-[11px] text-emerald-950 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 max-w-lg">
                      <strong>Saved Session Notes:</strong> {apt.counsellorSessionNotes}
                    </div>
                  )}
                </div>

                {/* Counsellor Control Panel */}
                <div className="flex flex-wrap sm:flex-col gap-1.5 shrink-0">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(apt.id, 'attended')}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        apt.status === 'attended'
                          ? 'bg-[#09392b] text-white'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                      title="Verify student attended today's session"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Attended</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateStatus(apt.id, 'no_show')}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        apt.status === 'no_show'
                          ? 'bg-rose-700 text-white'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                      }`}
                      title="Record student absence & prompt proactive follow-up"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>No-Show</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenNotesModal(apt)}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FileEdit className="w-3.5 h-3.5 text-slate-500" />
                    <span>Session Notes & Care Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenRescheduleModal(apt)}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reschedule Slot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTriggerReScreening(apt.studentName)}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                    title="Trigger automated re-screening check in student portal"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Trigger Re-Screening</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
