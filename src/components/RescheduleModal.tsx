import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import type { Appointment } from '../types/index.ts';

interface RescheduleModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (id: string, newDate: string, newTime: string) => Promise<void>;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onReschedule,
}) => {
  const [newDate, setNewDate] = useState('Thu, 01 Oct');
  const [newTime, setNewTime] = useState('14:00 - 14:50');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onReschedule(appointment.id, newDate, newTime);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-base font-bold text-[#172033] font-heading">
              Reschedule Appointment
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="font-bold text-[#173B57]">Current Appointment:</div>
            <div className="text-[#64748B]">
              {appointment.counsellorName} · {appointment.formattedDate} ({appointment.formattedTime})
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#172033] block">
              Select new date
            </label>
            <select
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white"
            >
              <option value="Thu, 01 Oct">Thursday, 01 October 2026</option>
              <option value="Fri, 02 Oct">Friday, 02 October 2026</option>
              <option value="Mon, 05 Oct">Monday, 05 October 2026</option>
              <option value="Wed, 07 Oct">Wednesday, 07 October 2026</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#172033] block">
              Select new time slot
            </label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white"
            >
              <option value="09:00 - 09:50">09:00 - 09:50 AM</option>
              <option value="11:30 - 12:20">11:30 - 12:20 AM</option>
              <option value="14:00 - 14:50">14:00 - 14:50 PM</option>
              <option value="15:30 - 16:20">15:30 - 16:20 PM</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#64748B] hover:text-[#172033]"
            >
              Keep current
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              {isSubmitting ? 'Rescheduling...' : 'Confirm New Time'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
