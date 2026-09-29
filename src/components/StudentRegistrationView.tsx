import React from 'react';
import type { StudentProfile } from '../types/index.ts';
import { UserCheck, ShieldCheck, School, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';

interface StudentRegistrationViewProps {
  student: StudentProfile;
  onProceedToScreening: () => void;
}

export const StudentRegistrationView: React.FC<StudentRegistrationViewProps> = ({
  student,
  onProceedToScreening,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-teal-900 text-white rounded-xl p-6 shadow-sm border border-teal-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <UserCheck className="w-4 h-4" />
              <span>Step 01 / Registration & Well-Being Onboarding</span>
            </div>
            <h2 className="text-xl font-bold font-display text-white">
              Official Student Registration & Care Consent Record
            </h2>
            <p className="text-xs text-teal-100/90 mt-1 leading-relaxed">
              Every enrolled student is paired with ThrivePath Wellspring. Completed registration includes an integrated well-being check to proactively detect early academic burnout and match support before crisis points emerge.
            </p>
          </div>

          <button
            type="button"
            onClick={onProceedToScreening}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-teal-950 font-bold text-xs rounded-lg hover:bg-teal-50 transition-colors shadow-xs shrink-0"
          >
            <span>Proceed to Well-Being Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Student Card & Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                {student.fullName}
              </h3>
              <p className="text-xs text-slate-500">
                Student ID: <span className="font-mono font-medium">{student.studentId}</span> · Pronouns: {student.preferredPronouns}
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Active Enrolment
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-400 font-medium">Faculty & School</div>
              <div className="text-slate-900 font-semibold mt-0.5">{student.faculty}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-400 font-medium">Program & Cohort Year</div>
              <div className="text-slate-900 font-semibold mt-0.5">
                {student.program} (Year {student.yearOfStudy})
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-400 font-medium">Institutional Email</div>
              <div className="text-slate-900 font-semibold mt-0.5 font-mono">{student.email}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-400 font-medium">Housing & Campus Status</div>
              <div className="text-slate-900 font-semibold mt-0.5 capitalize">
                {student.residentialStatus.replace(/_/g, ' ')} Residence Hall
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              Designated Emergency Contact
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{student.emergencyContact.name}</span>{' '}
                <span className="text-slate-500">({student.emergencyContact.relationship})</span>
              </div>
              <span className="font-mono text-slate-700 font-medium">
                {student.emergencyContact.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Confidentiality & Ethics Panel */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-800 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-bold font-display text-slate-900">
                Data Privacy & Ethical AI Charter
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Student Wellspring enforces strict FERPA and HIPAA-equivalent privacy safeguards:
            </p>

            <ul className="text-xs text-slate-600 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-700 mt-1.5 shrink-0" />
                <span>
                  <strong>Non-Punitive:</strong> Well-being screening results are strictly confidential and never block registration or appear on academic transcripts.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-700 mt-1.5 shrink-0" />
                <span>
                  <strong>Triage-Only:</strong> ML algorithms solely assist licensed psychologists in prioritizing triage queues; no algorithmic gatekeeping.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-700 mt-1.5 shrink-0" />
                <span>
                  <strong>Aggregated Oversight:</strong> University executive views contain zero personally identifiable mental health data.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 text-[11px] text-slate-400">
            Registration Timestamp: {new Date(student.registeredAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
