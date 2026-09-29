import React from 'react';
import type { Appointment } from '../types/index.ts';
import {
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  Footprints,
  Plus,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface AppointmentsPageProps {
  appointments: Appointment[];
  onOpenBooking: () => void;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointmentId: string) => Promise<void>;
  onSendReminder: (appointmentId: string) => Promise<void>;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  appointments,
  onOpenBooking,
  onReschedule,
  onCancel,
  onSendReminder,
}) => {
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'booked' || a.status === 'rescheduled'
  );

  const pastAppointments = appointments.filter(
    (a) => a.status === 'attended' || a.status === 'no_show' || a.status === 'cancelled'
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Title & Booking CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[#172033]">
            Counselling Appointments
          </h1>
          <p className="text-sm text-[#64748B] mt-1 font-normal">
            Manage your university student wellness consultations.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenBooking}
          className="self-start sm:self-auto px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book an appointment</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. UPCOMING APPOINTMENT (Section 22) */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-[#172033]">
          Upcoming appointment
        </h2>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6"
              >
                {/* Main details formatted cleanly as in Section 22 */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#173B57] uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-[#2563EB]" />
                      <span>{apt.formattedDate}</span>
                      <span>·</span>
                      <Clock className="w-4 h-4 text-[#2563EB]" />
                      <span>{apt.formattedTime || '10:00 - 10:50'}</span>
                    </div>

                    <h3 className="text-xl font-bold font-heading text-[#172033]">
                      {apt.counsellorName}
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      {apt.counsellorRole || 'Student Wellness Specialist'} · {apt.modality === 'video' ? 'Video consultation' : 'In-person session'}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="self-start">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-[#16A34A] border border-emerald-200">
                      CONFIRMED
                    </span>
                  </div>
                </div>

                {/* Important direct actions (Section 22: Do not hide in menus) */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onReschedule(apt)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-[#172033] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Reschedule
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you wish to cancel this appointment? You can book again whenever you need.')) {
                        onCancel(apt.id);
                      }
                    }}
                    className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-[#DC2626] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel appointment
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendReminder(apt.id)}
                    className="ml-auto text-xs text-[#64748B] hover:text-[#173B57] transition-colors font-medium underline"
                  >
                    Send SMS reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State (Section 31) */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-lg font-bold font-heading text-[#172033]">
                No upcoming appointments
              </h3>
              <p className="text-sm text-[#64748B]">
                You don't have a counselling appointment scheduled yet.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Book an appointment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. PAST APPOINTMENTS & COMPLETED SESSIONS */}
      {/* ========================================================= */}
      {pastAppointments.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-lg font-bold font-heading text-[#172033]">
            Previous sessions
          </h2>

          <div className="space-y-3">
            {pastAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
              >
                <div className="space-y-1">
                  <div className="font-bold text-[#172033]">{apt.counsellorName}</div>
                  <div className="text-xs text-[#64748B]">
                    {apt.formattedDate} · {apt.focusArea || 'General check-in'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {apt.status === 'attended' && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-[#16A34A] border border-emerald-200">
                      Completed
                    </span>
                  )}
                  {apt.status === 'no_show' && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-[#F59E0B] border border-amber-200">
                      Missed
                    </span>
                  )}
                  {apt.status === 'cancelled' && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-[#64748B]">
                      Cancelled
                    </span>
                  )}

                  {apt.followUpRecommended && (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Follow-up recommended
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
