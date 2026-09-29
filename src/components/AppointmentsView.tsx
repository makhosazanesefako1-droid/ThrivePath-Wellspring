import React, { useState } from 'react';
import { useToast } from './ToastNotification.tsx';
import type { Appointment } from '../types/index.ts';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Footprints,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Bell,
  Star,
  Plus,
} from 'lucide-react';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onOpenBookingModal: () => void;
  onOpenRescheduleModal: (apt: Appointment) => void;
  onOpenFeedbackModal: (apt: Appointment) => void;
  onCancelAppointment: (id: string) => Promise<void>;
  onSendReminder: (id: string) => Promise<void>;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onOpenBookingModal,
  onOpenRescheduleModal,
  onOpenFeedbackModal,
  onCancelAppointment,
  onSendReminder,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'booked' || a.status === 'rescheduled'
  );

  const pastAppointments = appointments.filter(
    (a) => a.status === 'attended' || a.status === 'no_show' || a.status === 'cancelled'
  );

  const handleCancel = async (id: string) => {
    try {
      setCancellingId(id);
      await onCancelAppointment(id);
      showToast('Appointment cancelled successfully.', 'info');
    } finally {
      setCancellingId(null);
    }
  };

  const handleReminder = async (id: string) => {
    try {
      setSendingReminderId(id);
      await onSendReminder(id);
      showToast('Automated reminder notification dispatched to student mobile & institutional email.', 'success');
    } finally {
      setSendingReminderId(null);
    }
  };

  const getModalityBadge = (modality: Appointment['modality']) => {
    switch (modality) {
      case 'in_person':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            <MapPin className="w-3 h-3 text-teal-800" />
            <span>Well-Being Hub Rm 204</span>
          </span>
        );
      case 'video':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            <Video className="w-3 h-3 text-teal-800" />
            <span>Confidential Video Room</span>
          </span>
        );
      case 'walk_and_talk':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            <Footprints className="w-3 h-3 text-teal-800" />
            <span>Campus Gardens Walk</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Campus Mental Health Service
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">
              1-on-1 Confidential Counselling
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-1">
            Appointments & Care Consultations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your scheduled sessions, review psychologist clinical notes, and access automated SMS reminders.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenBookingModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-teal-800 text-white rounded-lg hover:bg-teal-900 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book New Session</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Upcoming Sessions</span>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
            {upcomingAppointments.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'past'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Past Sessions & Clinical Notes</span>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
            {pastAppointments.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'upcoming' ? (
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-800">
                No Upcoming Appointments Scheduled
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                Booking early helps reserve convenient slots around your lecture and exam timetable.
              </p>
              <button
                type="button"
                onClick={onOpenBookingModal}
                className="px-4 py-2 text-xs font-semibold bg-teal-800 text-white rounded-lg hover:bg-teal-900 transition-colors"
              >
                Schedule Appointment
              </button>
            </div>
          ) : (
            upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Confirmed Booking
                    </span>
                    {getModalityBadge(apt.modality)}
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-medium text-slate-600">
                      Focus: {apt.focusArea}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {apt.counsellorName}
                    </h3>
                    <p className="text-xs text-slate-500">{apt.counsellorRole}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{apt.formattedTime}</span>
                    </div>
                  </div>

                  {apt.intakeNotes && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-xl">
                      <strong className="text-slate-800">Your Intake Note:</strong> {apt.intakeNotes}
                    </div>
                  )}

                  {/* Reminder badge */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <Bell className="w-3.5 h-3.5 text-teal-700" />
                    <span>
                      Automated reminders: SMS (24h prior: {apt.reminderStatus.dayPriorSent ? 'Sent' : 'Pending'} · 2h prior: {apt.reminderStatus.hoursPriorSent ? 'Sent' : 'Pending'})
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleReminder(apt.id)}
                    disabled={sendingReminderId === apt.id}
                    className="px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    title="Send immediate reminder SMS & email"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Test Reminder</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenRescheduleModal(apt)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reschedule</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCancel(apt.id)}
                    disabled={cancellingId === apt.id}
                    className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {pastAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border capitalize ${
                        apt.status === 'attended'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : apt.status === 'no_show'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {apt.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {apt.formattedDate} · {apt.formattedTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display mt-1">
                    {apt.counsellorName}
                  </h3>
                </div>

                {apt.status === 'attended' && !apt.rating && (
                  <button
                    type="button"
                    onClick={() => onOpenFeedbackModal(apt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-teal-800 text-white rounded-lg hover:bg-teal-900 transition-colors shrink-0"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Rate Session & Feedback</span>
                  </button>
                )}
              </div>

              {/* Counsellor's Recorded Session Notes */}
              {apt.counsellorSessionNotes && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-700" />
                    <span>Psychologist Session Summary & Interventions:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-sans">
                    {apt.counsellorSessionNotes}
                  </p>
                  {apt.followUpRecommended && (
                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-teal-900">
                      <strong>Recommended Follow-up:</strong> {apt.followUpRecommended}
                    </div>
                  )}
                </div>
              )}

              {/* Student Feedback Record */}
              {apt.rating && (
                <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/60 text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-700 font-bold mb-0.5">
                      {[...Array(apt.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                      <span className="ml-1 text-slate-800">{apt.rating}/5 Student Rating</span>
                    </div>
                    {apt.feedback && <p className="text-slate-600 italic">"{apt.feedback}"</p>}
                  </div>
                  <span className="text-[10px] text-slate-400">Feedback Recorded</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
