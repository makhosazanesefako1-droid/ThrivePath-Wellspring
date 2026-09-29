import React from 'react';
import type { UniversityAnalytics, UserAccount } from '../types/index.ts';
import {
  Users,
  Calendar,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

interface AdminOverviewDashboardProps {
  analytics: UniversityAnalytics | null;
  counsellors: UserAccount[];
  onApproveCounsellor: (id: string) => Promise<void>;
  onRejectCounsellor: (id: string) => Promise<void>;
}

export const AdminOverviewDashboard: React.FC<AdminOverviewDashboardProps> = ({
  analytics,
  counsellors,
  onApproveCounsellor,
  onRejectCounsellor,
}) => {
  // Section 28 metrics
  const screenedCount = '12,450';
  const appointmentsCount = '2,341';
  const attendanceRate = '82%';
  const followUpsCount = '641';

  // 1. Screening Distribution Data
  const screeningDistributionData = [
    { name: 'Low / Mild', value: 48, color: '#16A34A' },
    { name: 'Moderate', value: 34, color: '#2563EB' },
    { name: 'High Concern', value: 18, color: '#F59E0B' },
  ];

  // 2. Counselling Utilisation Data (Term Weeks)
  const utilisationData = [
    { week: 'W1', sessions: 28 },
    { week: 'W2', sessions: 45 },
    { week: 'W3', sessions: 62 },
    { week: 'W4', sessions: 84 },
    { week: 'W5', sessions: 115 },
    { week: 'W6', sessions: 102 },
    { week: 'W7', sessions: 78 },
    { week: 'W8', sessions: 92 },
    { week: 'W9', sessions: 108 },
    { week: 'W10', sessions: 132 },
    { week: 'W11', sessions: 140 },
    { week: 'W12', sessions: 54 },
  ];

  // 3. Appointment Outcomes Data
  const outcomeData = [
    { name: 'Attended', percentage: 82, color: '#16A34A' },
    { name: 'No-Show', percentage: 11, color: '#F59E0B' },
    { name: 'Cancelled', percentage: 7, color: '#64748B' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-[#172033]">
          University Well-being Overview
        </h1>
        <p className="text-sm text-[#64748B] mt-1 font-normal">
          Aggregated cohort insights, utilisation metrics, and counsellor accreditations.
        </p>
      </div>

      {/* ========================================================= */}
      {/* 1. TOP 4 METRICS (Section 28) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-1">
          <div className="text-3xl sm:text-4xl font-bold font-heading text-[#173B57]">
            {screenedCount}
          </div>
          <div className="text-xs font-semibold text-[#172033] pt-1">
            Students screened
          </div>
          <div className="text-[11px] text-[#64748B]">
            88.6% of enrolled cohort
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-1">
          <div className="text-3xl sm:text-4xl font-bold font-heading text-[#2563EB]">
            {appointmentsCount}
          </div>
          <div className="text-xs font-semibold text-[#172033] pt-1">
            Counselling appointments
          </div>
          <div className="text-[11px] text-[#64748B]">
            Across semester sessions
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-1">
          <div className="text-3xl sm:text-4xl font-bold font-heading text-[#16A34A]">
            {attendanceRate}
          </div>
          <div className="text-xs font-semibold text-[#172033] pt-1">
            Attendance
          </div>
          <div className="text-[11px] text-[#64748B]">
            Confirmed session turnout
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-1">
          <div className="text-3xl sm:text-4xl font-bold font-heading text-[#F59E0B]">
            {followUpsCount}
          </div>
          <div className="text-xs font-semibold text-[#172033] pt-1">
            Follow-ups
          </div>
          <div className="text-[11px] text-[#64748B]">
            87.2% improved outcome
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CLEAN CHARTS (Section 28: not overloaded, clean) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Screening Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold font-heading text-[#172033]">
              Screening Distribution
            </h2>
            <p className="text-xs text-[#64748B]">
              Aggregate baseline well-being categories across faculties
            </p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={screeningDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {screeningDistributionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Cohort']}
                  contentStyle={{
                    borderRadius: '12px',
                    borderColor: '#cbd5e1',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 text-xs">
            {screeningDistributionData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-[#64748B] font-medium">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Counselling Utilisation Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold font-heading text-[#172033]">
              Counselling Utilisation by Term Week
            </h2>
            <p className="text-xs text-[#64748B]">
              Session volume peaks during midterm evaluation cycles (W5 & W10)
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilisationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} sessions`, 'Utilisation']}
                  contentStyle={{
                    borderRadius: '12px',
                    borderColor: '#cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="sessions" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. COUNSELLOR VERIFICATION & ACCREDITATION */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold font-heading text-[#172033]">
              Counsellor Accreditations & Approvals
            </h2>
            <p className="text-xs text-[#64748B]">
              Manage registered campus psychologists and clinical staff access.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {counsellors.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-[#172033] flex items-center gap-2">
                  <span>{c.fullName}</span>
                  {c.approved ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#16A34A]">
                      Approved
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#F59E0B]">
                      Pending Review
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#64748B]">
                  {c.title || 'Campus Wellness Specialist'} · {c.email}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {!c.approved ? (
                  <button
                    type="button"
                    onClick={() => onApproveCounsellor(c.id)}
                    className="px-3.5 py-1.5 bg-[#16A34A] text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onRejectCounsellor(c.id)}
                    className="px-3 py-1.5 bg-slate-100 text-[#64748B] hover:text-[#DC2626] text-xs font-medium rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
