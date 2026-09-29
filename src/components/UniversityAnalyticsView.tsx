import React from 'react';
import { useToast } from './ToastNotification.tsx';
import type { UniversityAnalytics } from '../types/index.ts';
import {
  Building2,
  TrendingDown,
  TrendingUp,
  Users,
  CheckCircle2,
  CalendarCheck,
  Star,
  Download,
  AlertTriangle,
  Award,
} from 'lucide-react';

interface UniversityAnalyticsViewProps {
  analytics: UniversityAnalytics | null;
}

export const UniversityAnalyticsView: React.FC<UniversityAnalyticsViewProps> = ({ analytics }) => {
  const { showToast } = useToast();

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <div className="text-sm font-bold text-slate-800">Loading University Analytics...</div>
      </div>
    );
  }

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\r\n' +
      `Total Screenings,${analytics.totalScreened}\r\n` +
      `Screening Completion Rate,${analytics.screeningRatePercent}%\r\n` +
      `Appointments Attended,${analytics.appointmentMetrics.attendedCount}\r\n` +
      `Attendance Rate,${analytics.appointmentMetrics.attendedPercent}%\r\n` +
      `Average Satisfaction,${analytics.averageSatisfactionRating}/5.0\r\n` +
      `Avg Stress Reduction,${analytics.reScreeningMetrics.avgStressReductionPercent}%\r\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'uniwell_dean_executive_briefing.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Executive Analytics Briefing (CSV) downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Executive Institutional Intelligence · Office of the Dean</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Campus-Wide Well-Being & Closed-Loop Care Analytics
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Population-level aggregated metrics verifying screening participation, early stress indicator identification, counselling clinic utilisation, and follow-up re-screening outcomes. Zero identifiable personal health data exposed.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Executive Report</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Screening Participation
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
              {analytics.screeningRatePercent}%
            </span>
            <span className="text-xs text-emerald-700 font-bold">+18.4% YoY</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            {analytics.totalScreened.toLocaleString()} / {analytics.totalEnrolled.toLocaleString()} Students
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Counselling Utilisation
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
              {analytics.appointmentMetrics.attendedPercent}%
            </span>
            <span className="text-xs text-teal-800 font-bold font-mono">
              {analytics.appointmentMetrics.totalBooked} Sessions
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg Triage Wait: <strong className="font-mono">{analytics.appointmentMetrics.avgWaitDays} days</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            No-Show Rate
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
              {analytics.appointmentMetrics.noShowPercent}%
            </span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" />
              <span>-44% with SMS</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            {analytics.appointmentMetrics.noShowCount} missed sessions recorded
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Closed-Loop Recovery
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-800 tabular-nums">
              -{analytics.reScreeningMetrics.avgStressReductionPercent}%
            </span>
            <span className="text-xs text-emerald-700 font-bold">Reduction</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <strong className="font-mono">{analytics.reScreeningMetrics.improvedOutcomePercent}%</strong> of re-screened students improved
          </div>
        </div>
      </div>

      {/* Stress Band Distribution & Closed-Loop Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stress Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display mb-1">
              Cohort Stress Band Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown across {analytics.totalScreened.toLocaleString()} screened students
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Low / Mild Stress (0-35)</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {analytics.stressBandDistribution.lowPercent}% ({analytics.stressBandDistribution.lowCount})
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${analytics.stressBandDistribution.lowPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Moderate Stress (36-65)</span>
                  <span className="font-mono font-bold text-amber-800">
                    {analytics.stressBandDistribution.moderatePercent}% ({analytics.stressBandDistribution.moderateCount})
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${analytics.stressBandDistribution.moderatePercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">High Stress / Priority Triage (66-100)</span>
                  <span className="font-mono font-bold text-rose-800">
                    {analytics.stressBandDistribution.highPercent}% ({analytics.stressBandDistribution.highCount})
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-600 h-full rounded-full"
                    style={{ width: `${analytics.stressBandDistribution.highPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            High-stress students automatically receive expedited appointment slots within 48h.
          </div>
        </div>

        {/* 12-Week Term Stress Curve */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Academic Term Stress Progression Curve (Weeks 1 - 12)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Mean Stress Score (0-100)</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time trend displaying physiological & academic stress spikes during Week 5 Midterms and Week 11 Finals.
            </p>

            {/* Visual Bar Chart */}
            <div className="grid grid-cols-12 gap-1.5 h-36 items-end pt-4 pb-2 border-b border-slate-200">
              {analytics.weeklyTrend.map((wt) => {
                const heightPercent = wt.avgStressScore;
                const isMidterm = wt.termWeek === 5;
                const isFinals = wt.termWeek === 11;

                return (
                  <div key={wt.week} className="flex flex-col items-center h-full justify-end group relative">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        isMidterm || isFinals
                          ? 'bg-rose-600 group-hover:bg-rose-700'
                          : wt.avgStressScore > 55
                          ? 'bg-amber-500 group-hover:bg-amber-600'
                          : 'bg-teal-700 group-hover:bg-teal-800'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <div className="text-[10px] font-mono text-slate-500 mt-1 truncate">
                      W{wt.termWeek}
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                      <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-mono whitespace-nowrap shadow-lg">
                        {wt.week}: {wt.avgStressScore} pts · {wt.counsellingSessionsCount} sessions
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-teal-700 rounded-xs" /> Baseline / Normal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs" /> Elevated
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-rose-600 rounded-xs" /> Exam Spikes (W5 & W11)
              </span>
            </div>
            <span>Student Satisfaction: <strong className="font-mono text-slate-800">{analytics.averageSatisfactionRating} / 5.0</strong></span>
          </div>
        </div>
      </div>

      {/* Faculty Vulnerability Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Faculty Vulnerability & Departmental Need Analysis
            </h3>
            <p className="text-xs text-slate-500">
              Informs resource allocation and clinical psychologist staffing per school
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            5 Faculties Monitored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold">Faculty / Academic Unit</th>
                <th className="px-6 py-3 font-semibold text-right">Enrolled Students</th>
                <th className="px-6 py-3 font-semibold text-right">Mean Stress Score</th>
                <th className="px-6 py-3 font-semibold text-right">High-Stress Cohort %</th>
                <th className="px-6 py-3 font-semibold">Recommended University Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.facultyBreakdown.map((fac) => (
                <tr key={fac.faculty} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900">
                    {fac.faculty}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-600 text-right">
                    {fac.totalStudents.toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900 text-right">
                    {fac.avgScore} / 100
                  </td>
                  <td className="px-6 py-3.5 font-mono font-bold text-right">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        fac.highStressPercent > 20
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {fac.highStressPercent}%
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600">
                    {fac.highStressPercent > 24
                      ? 'Deploy embedded clinical psychologist to engineering / clinical labs'
                      : fac.highStressPercent > 18
                      ? 'Expand STEM peer study circles and midterm exam chunking modules'
                      : 'Maintain routine psychoeducation and quarterly well-being checks'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
