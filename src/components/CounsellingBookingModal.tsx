import React, { useState } from 'react';
import { useToast } from './ToastNotification.tsx';
import type { UserAccount, AppointmentModality } from '../types/index.ts';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  Video,
  MapPin,
  Footprints,
} from 'lucide-react';

interface CounsellingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  counsellors: UserAccount[];
  onConfirmBooking: (payload: {
    dateTime: string;
    modality: AppointmentModality;
    focusArea: string;
    intakeNotes?: string;
    counsellorId?: string;
    counsellorName?: string;
    counsellorRole?: string;
  }) => Promise<void>;
  onViewAppointments: () => void;
}

export const CounsellingBookingModal: React.FC<CounsellingBookingModalProps> = ({
  isOpen,
  onClose,
  counsellors,
  onConfirmBooking,
  onViewAppointments,
}) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 'confirmed'>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback approved counsellors
  const activeCounsellors = counsellors.filter((c) => c.approved);
  const defaultCounsellor = activeCounsellors[0] || {
    id: 'usr_counsellor_01',
    fullName: 'Dr. Nomvula Khumalo, Ph.D.',
    title: 'Lead Clinical Psychologist · Student Wellness',
    email: 'dr.khumalo@campus.ac.za',
    role: 'counsellor' as const,
    approved: true,
    createdAt: '',
  };

  const [selectedCounsellor, setSelectedCounsellor] = useState<UserAccount>(defaultCounsellor);
  const [selectedDate, setSelectedDate] = useState('30 September 2026');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedModality, setSelectedModality] = useState<AppointmentModality>('video');

  const handleDownloadCalendar = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UniWell//University Well-being Platform//EN',
      'BEGIN:VEVENT',
      `SUMMARY:UniWell Counselling Session with ${selectedCounsellor.fullName}`,
      `DESCRIPTION:University Well-being appointment. Modality: ${selectedModality}. Time: ${selectedTime}, ${selectedDate}`,
      `LOCATION:${selectedModality === 'in_person' ? 'Student Wellness Center, Room 204' : 'UniWell Secure Video Link'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'uniwell-appointment.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Appointment added to your calendar (.ics downloaded).', 'success');
  };

  if (!isOpen) return null;

  const dates = [
    { day: 'Mon', num: '28', dateStr: '28 September 2026' },
    { day: 'Tue', num: '29', dateStr: '29 September 2026' },
    { day: 'Wed', num: '30', dateStr: '30 September 2026' },
    { day: 'Thu', num: '1', dateStr: '1 October 2026' },
    { day: 'Fri', num: '2', dateStr: '2 October 2026' },
  ];

  const times = ['09:00', '10:00', '11:30', '14:00', '15:30'];

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirmBooking({
        dateTime: '2026-09-30T10:00:00Z',
        modality: selectedModality,
        focusArea: 'Academic stress & study pacing consultation',
        counsellorId: selectedCounsellor.id,
        counsellorName: selectedCounsellor.fullName,
        counsellorRole: selectedCounsellor.title || 'Student Wellness Counsellor',
      });
      setStep('confirmed');
    } catch (err) {
      console.error('Failed to book appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#173B57] uppercase tracking-wider">
              {step === 'confirmed' ? 'Booking Confirmed' : `Step ${step} of 4 · Book Support`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CHOOSE A COUNSELLOR */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-heading text-[#172033]">
                Choose a counsellor
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Select a licensed student wellness practitioner for your session.
              </p>
            </div>

            <div className="space-y-3">
              {(activeCounsellors.length > 0 ? activeCounsellors : [defaultCounsellor]).map((c) => {
                const isSelected = selectedCounsellor.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCounsellor(c)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between min-h-[56px] ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50/70 ring-1 ring-[#2563EB]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#173B57] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {c.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#172033]">
                          {c.fullName}
                        </div>
                        <div className="text-xs text-[#64748B]">
                          {c.title || 'Student Wellness Specialist'}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#2563EB] text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Choose a date</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE A DATE */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-heading text-[#172033]">
                Choose a date
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Select an upcoming day that suits your timetable.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#173B57] uppercase tracking-wider">
                September / October 2026
              </div>

              <div className="grid grid-cols-5 gap-2 pt-1">
                {dates.map((d) => {
                  const isSelected = selectedDate === d.dateStr;
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(d.dateStr)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#2563EB] bg-blue-50 text-[#173B57] font-bold shadow-xs ring-1 ring-[#2563EB]'
                          : 'border-slate-200 bg-white text-[#172033] hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[11px] text-[#64748B] font-normal">{d.day}</div>
                      <div className="text-lg font-bold font-heading mt-0.5">{d.num}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modality choice */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-[#172033] block">
                Session format
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModality('video')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    selectedModality === 'video'
                      ? 'border-[#2563EB] bg-blue-50 text-[#173B57] font-semibold'
                      : 'border-slate-200 bg-white text-[#64748B] hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#2563EB]" />
                  <span>Video call</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedModality('in_person')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    selectedModality === 'in_person'
                      ? 'border-[#2563EB] bg-blue-50 text-[#173B57] font-semibold'
                      : 'border-slate-200 bg-white text-[#64748B] hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#173B57]" />
                  <span>In-person</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedModality('walk_and_talk')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    selectedModality === 'walk_and_talk'
                      ? 'border-[#2563EB] bg-blue-50 text-[#173B57] font-semibold'
                      : 'border-slate-200 bg-white text-[#64748B] hover:bg-slate-50'
                  }`}
                >
                  <Footprints className="w-4 h-4 text-[#16A34A]" />
                  <span>Walk & Talk</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-[#172033] hover:bg-slate-100 rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Available times</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AVAILABLE TIMES */}
        {step === 3 && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-heading text-[#172033]">
                Available times
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Selected date: <span className="font-semibold text-[#172033]">{selectedDate}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {times.map((t) => {
                const isSelected = selectedTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50 text-[#173B57] shadow-xs ring-1 ring-[#2563EB]'
                        : 'border-slate-200 bg-white text-[#172033] hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-[#64748B]" />
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-[#64748B]">
              Standard student consultations run for 50 minutes. All sessions are confidential.
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-sm font-medium text-[#172033] hover:bg-slate-100 rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Review & confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRM */}
        {step === 4 && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-heading text-[#172033]">
                Confirm appointment
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Please review your details before finalising.
              </p>
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-5 space-y-3.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Counsellor:</span>
                <span className="font-bold text-[#172033]">{selectedCounsellor.fullName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Date:</span>
                <span className="font-bold text-[#172033]">{selectedDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Time:</span>
                <span className="font-bold text-[#172033]">{selectedTime}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Format:</span>
                <span className="font-bold text-[#172033] capitalize">
                  {selectedModality === 'video' ? 'Video consultation' : selectedModality.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 text-sm font-medium text-[#172033] hover:bg-slate-100 rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isSubmitting ? 'Confirming...' : 'Confirm appointment'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CONFIRMATION SCREEN (Section 21) */}
        {/* ========================================================= */}
        {step === 'confirmed' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-heading text-[#172033]">
                Appointment confirmed
              </h2>
              <p className="text-sm text-[#64748B]">
                Your booking has been added to the university support schedule.
              </p>
            </div>

            {/* Clear appointment summary card (Section 21) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-sm mx-auto space-y-1">
              <div className="text-lg font-bold font-heading text-[#173B57]">
                {selectedDate}
              </div>
              <div className="text-base font-semibold text-[#172033]">
                {selectedTime}
              </div>
              <div className="text-xs text-[#64748B] pt-2 border-t border-slate-200/70 mt-2">
                <span className="font-semibold text-[#172033]">{selectedCounsellor.fullName}</span>
                <br />
                Student Wellness
              </div>
            </div>

            {/* Actions (Section 21: [Add to calendar] [View appointment]) */}
            <div className="space-y-2.5 max-w-sm mx-auto pt-2">
              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200/80 text-[#172033] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Add to calendar (.ics)
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCloseModal();
                  onViewAppointments();
                }}
                className="w-full py-3 px-4 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                View appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
