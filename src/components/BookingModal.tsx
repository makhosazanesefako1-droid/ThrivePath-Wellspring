import React, { useState } from 'react';
import { X, Calendar, Clock, Video, Users, Footprints, ShieldCheck } from 'lucide-react';
import type { AppointmentModality } from '../types/index.ts';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (data: {
    dateTime: string;
    modality: AppointmentModality;
    focusArea: string;
    intakeNotes?: string;
    counsellorId: string;
    counsellorName: string;
    counsellorRole: string;
  }) => Promise<void>;
  preselectedFocus?: string;
}

const COUNSELLORS = [
  {
    id: 'cns_dr_jenkins',
    name: 'Dr. Sarah Jenkins, Ph.D.',
    role: 'Lead Clinical Psychologist & STEM Well-Being Director',
    specialty: 'Acute Exam Overwhelm, Sleep Collapse & Performance Anxiety',
  },
  {
    id: 'cns_marcus_vance',
    name: 'Marcus Vance, LCSW',
    role: 'Senior Mental Health Specialist',
    specialty: 'First-Year Transition, Imposter Phenomenon & Family Stress',
  },
  {
    id: 'cns_dr_nair',
    name: 'Dr. Priya Nair, Psy.D.',
    role: 'Mindfulness & Somatic Health Clinician',
    specialty: 'Somatic Panic, Vagal Grounding & Chronic Burnout',
  },
];

const TIME_SLOTS = [
  { label: '09:00 AM - 09:50 AM', time: '09:00' },
  { label: '10:00 AM - 10:50 AM', time: '10:00' },
  { label: '11:30 AM - 12:20 PM', time: '11:30' },
  { label: '02:00 PM - 02:50 PM', time: '14:00' },
  { label: '03:30 PM - 04:20 PM', time: '15:30' },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onBook,
  preselectedFocus = 'Academic Overwhelm & Sleep Deprivation',
}) => {
  const [selectedCounsellorId, setSelectedCounsellorId] = useState(COUNSELLORS[0].id);
  const [modality, setModality] = useState<AppointmentModality>('in_person');
  const [selectedDate, setSelectedDate] = useState('2026-10-24');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1].time);
  const [focusArea, setFocusArea] = useState(preselectedFocus);
  const [intakeNotes, setIntakeNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectedCounsellor = COUNSELLORS.find((c) => c.id === selectedCounsellorId)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const isoDateTime = `${selectedDate}T${selectedTimeSlot}:00Z`;
      await onBook({
        dateTime: isoDateTime,
        modality,
        focusArea,
        intakeNotes,
        counsellorId: selectedCounsellor.id,
        counsellorName: selectedCounsellor.name,
        counsellorRole: selectedCounsellor.role,
      });
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Schedule Counselling Session
            </h3>
            <p className="text-xs text-slate-500">
              Confidential clinical support covered 100% by University Student Well-Being
            </p>
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
          {/* Select Counsellor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Campus Psychologist / Clinician
            </label>
            <div className="space-y-2">
              {COUNSELLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCounsellorId(c.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    selectedCounsellorId === c.id
                      ? 'border-teal-700 bg-teal-50/70 ring-1 ring-teal-700/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-slate-600 text-[11px]">{c.role}</div>
                  <div className="text-teal-800 text-[11px] mt-0.5 font-medium">
                    Focus: {c.specialty}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Session Modality */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Preferred Session Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setModality('in_person')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  modality === 'in_person'
                    ? 'border-teal-700 bg-teal-50 text-teal-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-center mb-1">
                  <Users className="w-4 h-4 text-teal-800" />
                </div>
                <div className="text-xs">In-Person</div>
                <div className="text-[10px] text-slate-500">Hub Rm 204</div>
              </button>

              <button
                type="button"
                onClick={() => setModality('video')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  modality === 'video'
                    ? 'border-teal-700 bg-teal-50 text-teal-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-center mb-1">
                  <Video className="w-4 h-4 text-teal-800" />
                </div>
                <div className="text-xs">Confidential Video</div>
                <div className="text-[10px] text-slate-500">Encrypted Link</div>
              </button>

              <button
                type="button"
                onClick={() => setModality('walk_and_talk')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  modality === 'walk_and_talk'
                    ? 'border-teal-700 bg-teal-50 text-teal-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-center mb-1">
                  <Footprints className="w-4 h-4 text-teal-800" />
                </div>
                <div className="text-xs">Walk & Talk</div>
                <div className="text-[10px] text-slate-500">Campus Gardens</div>
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Available Time Slot
              </label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t.time} value={t.time}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Focus & Intake Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Focus Topic
            </label>
            <input
              type="text"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="e.g. Exam panic, sleep rhythm, panic attacks"
              className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Intake Notes for Counsellor (Confidential)
            </label>
            <textarea
              rows={2}
              value={intakeNotes}
              onChange={(e) => setIntakeNotes(e.target.value)}
              placeholder="Any details you'd like Dr. Jenkins to know prior to the meeting..."
              className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-teal-800 shrink-0" />
            <span>
              Automated reminders will be dispatched via SMS 24 hours and 2 hours prior to prevent no-shows.
            </span>
          </div>

          {/* Actions */}
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
              {isSubmitting ? 'Confirming Appointment...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
