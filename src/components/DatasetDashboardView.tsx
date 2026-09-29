import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { DATASET_ANALYTICS, DatasetRecord } from '../lib/datasetAnalytics.ts';
import {
  Database,
  TrendingUp,
  Brain,
  Moon,
  Tv,
  GraduationCap,
  Filter,
  Download,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface DatasetDashboardViewProps {
  onStartScreening?: () => void;
  onExploreCare?: () => void;
}

export const DatasetDashboardView: React.FC<DatasetDashboardViewProps> = ({
  onStartScreening,
}) => {
  const [selectedUniFilter, setSelectedUniFilter] = useState<string>('All');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('All');

  // Filter sample records
  const sampleRecords = DATASET_ANALYTICS.sampleRecords || [];
  const filteredRecords = sampleRecords.filter((r: DatasetRecord) => {
    if (selectedUniFilter !== 'All' && r.University_Type !== selectedUniFilter) return false;
    if (selectedLevelFilter !== 'All' && r.Stress_Level !== selectedLevelFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 selection:bg-emerald-100">
      {/* 1. Header Banner */}
      <div className="bg-[#0B3B2C] text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 mb-3 border border-emerald-700/60">
            <Database className="w-3.5 h-3.5" />
            <span>3,000 University Student Dataset Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight text-white mb-2">
            Evidence-Based Student Stress & Behavioral Patterns
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Direct exploratory analysis from South African and higher-education student records. Investigating the interplay between academic deliverable volume, sleep debt, screen saturation, and protective buffers.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Records</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#0B3B2C] tabular-nums">3,000</div>
          <div className="text-xs text-slate-500 mt-1">Validated multi-factor student observations</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">High Strain Rate</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 tabular-nums">
            {DATASET_ANALYTICS.classDistribution.find((c) => c.name.includes('High'))?.percentage}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Prioritized for proactive clinical care pathways</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Screen Exposure Link</span>
            <Tv className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-[#0B3B2C] tabular-nums">+0.49</div>
          <div className="text-xs text-slate-500 mt-1">Strongest positive behavioral indicator</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sleep Recovery Buffer</span>
            <Moon className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 tabular-nums">-0.24</div>
          <div className="text-xs text-slate-500 mt-1">Sleep hours exhibit active protective buffering</div>
        </div>
      </div>

      {/* 3. Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Stress Level Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading">Stress Level Prevalence (3,000 Cohort)</h2>
            <p className="text-xs text-slate-500">Distribution across verified student screening outcomes</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATASET_ANALYTICS.classDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {DATASET_ANALYTICS.classDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value} students (${item.payload.percentage}%)`,
                    item.payload.name,
                  ]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value, entry: any) => (
                    <span className="text-xs text-slate-700 font-medium">{value} ({entry.payload.percentage}%)</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Screen Time vs Average Stress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading">Screen Time vs. Stress Level Severity</h2>
            <p className="text-xs text-slate-500">Average composite score escalates consistently with screen saturation</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATASET_ANALYTICS.screenTimeVsStress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="screenHoursRange" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} domain={[0, 60]} />
                <Tooltip
                  formatter={(value: any) => [`${value} avg score`, 'Stress Score']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="avgStressScore" fill="#0B3B2C" radius={[6, 6, 0, 0]} name="Avg Stress Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Sleep Hours Protective Curve */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading">Sleep Duration & Stress Reduction Curve</h2>
            <p className="text-xs text-slate-500">Students with 7+ hours sleep experience 42% lower high-strain occurrences</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATASET_ANALYTICS.sleepHoursVsStress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="sleepHoursRange" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} domain={[0, 60]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Area type="monotone" dataKey="avgStressScore" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#sleepGrad)" name="Avg Stress Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: University Type Strain Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading">Institutional Profile Comparison</h2>
            <p className="text-xs text-slate-500">Average stress score and high-strain percentages across campus categories</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATASET_ANALYTICS.universityTypeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} domain={[0, 50]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Legend verticalAlign="bottom" />
                <Bar dataKey="avgStress" fill="#0D5C3A" radius={[4, 4, 0, 0]} name="Average Stress" />
                <Bar dataKey="highStressRate" fill="#E11D48" radius={[4, 4, 0, 0]} name="High Strain %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Empirical Statistical Correlation Summary (matching Screenshot 3) */}
      <div className="bg-[#EDF7F2] border border-emerald-200/80 rounded-2xl p-6 sm:p-8">
        <div className="max-w-2xl mb-6">
          <div className="text-xs font-bold tracking-wider uppercase text-emerald-800 mb-1">
            Empirical Correlation Insights
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0B3B2C]">
            Behavioral Predictors of University Student Stress
          </h2>
          <p className="text-xs text-emerald-900/80 mt-1">
            Standardized correlation coefficients derived from multi-variable regression analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DATASET_ANALYTICS.correlations.map((c) => (
            <div key={c.feature} className="bg-white p-5 rounded-xl border border-emerald-100 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.feature}</div>
              <div className={`text-2xl font-extrabold mt-1 ${c.type === 'risk' ? 'text-emerald-800' : 'text-teal-700'}`}>
                {c.coefficient > 0 ? `+${c.coefficient}` : c.coefficient}
              </div>
              <div className="text-xs text-slate-600 mt-1">{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Live Interactive Sample Records Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Dataset Live Explorer</h2>
            <p className="text-xs text-slate-500">Inspect demographic, behavioral, and clinical indicator rows</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Campus:</span>
              <select
                aria-label="Filter by campus"
                value={selectedUniFilter}
                onChange={(e) => setSelectedUniFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="All">All Campuses</option>
                <option value="National University">National University</option>
                <option value="Public University">Public University</option>
                <option value="Private University">Private University</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span>Stress Level:</span>
              <select
                aria-label="Filter by stress level"
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Age / Gender</th>
                <th className="py-3 px-3">University</th>
                <th className="py-3 px-3">Study Hrs</th>
                <th className="py-3 px-3">Screen Time</th>
                <th className="py-3 px-3">Sleep</th>
                <th className="py-3 px-3">Exams</th>
                <th className="py-3 px-3">Family Supp.</th>
                <th className="py-3 px-3">Stress Score</th>
                <th className="py-3 px-3">Band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r: DatasetRecord, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {r.Age}y · {r.Gender}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{r.University_Type}</td>
                  <td className="py-2.5 px-3 tabular-nums">{r.Study_Hours}h</td>
                  <td className="py-2.5 px-3 tabular-nums">{r.Screen_Time}h</td>
                  <td className="py-2.5 px-3 tabular-nums">{r.Sleep_Hours}h</td>
                  <td className="py-2.5 px-3 tabular-nums">{r.Exam_Frequency}/9</td>
                  <td className="py-2.5 px-3 tabular-nums">{r.Family_Support}/9</td>
                  <td className="py-2.5 px-3 font-semibold tabular-nums">{r.Stress_Score}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.Stress_Level === 'High'
                          ? 'bg-rose-50 text-rose-700'
                          : r.Stress_Level === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {r.Stress_Level}
                    </span>
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
