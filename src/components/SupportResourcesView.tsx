import React, { useState } from 'react';
import { useToast } from './ToastNotification.tsx';
import type { SupportResource, StressBand } from '../types/index.ts';
import {
  HeartHandshake,
  Activity,
  Brain,
  Moon,
  Users,
  BookOpen,
  PhoneCall,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface SupportResourcesViewProps {
  resources: SupportResource[];
  studentStressBand?: StressBand;
  onOpenBreathing: () => void;
  onOpenReframe: () => void;
  onOpenCrisis: () => void;
  onNavigateToBooking: () => void;
}

export const SupportResourcesView: React.FC<SupportResourcesViewProps> = ({
  resources,
  studentStressBand = 'moderate',
  onOpenBreathing,
  onOpenReframe,
  onOpenCrisis,
  onNavigateToBooking,
}) => {
  const { showToast } = useToast();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredResources = resources.filter((res) => {
    if (filterCategory === 'all') return true;
    return res.category === filterCategory;
  });

  const handleAction = (resource: SupportResource) => {
    if (resource.id === 'res_breath_478') {
      onOpenBreathing();
    } else if (resource.id === 'res_cbt_reframe') {
      onOpenReframe();
    } else if (resource.id === 'res_crisis_support') {
      onOpenCrisis();
    } else {
      showToast(`Accessing module: "${resource.title}". Integrated with University Student Wellness Services.`, 'info');
    }
  };

  const getCategoryIcon = (category: SupportResource['category']) => {
    switch (category) {
      case 'mindfulness':
        return Activity;
      case 'psychoeducation':
        return Brain;
      case 'sleep':
        return Moon;
      case 'peer_circle':
        return Users;
      case 'academic':
        return BookOpen;
      case 'crisis':
        return PhoneCall;
      default:
        return HeartHandshake;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Proactive Clinical Interventions
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">
              Personalized for {studentStressBand.toUpperCase()} stress presentation
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-1">
            Targeted Digital Support & Resilience Toolkit
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Evidence-based tools designed to reverse autonomic hyper-arousal, reframe acute exam catastrophizing, and establish sustainable circadian sleep habits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCrisis}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>24/7 Crisis Safety Net</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToBooking}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-teal-800 text-white rounded-lg hover:bg-teal-900 transition-colors"
          >
            <span>Book 1-on-1 Counselling</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'all', label: 'All Resources' },
          { key: 'mindfulness', label: 'Somatic & Vagal' },
          { key: 'psychoeducation', label: 'CBT & Reframing' },
          { key: 'sleep', label: 'Circadian Sleep' },
          { key: 'academic', label: 'Academic Skills' },
          { key: 'peer_circle', label: 'Peer Circles' },
          { key: 'crisis', label: 'Crisis Support' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterCategory(tab.key)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterCategory === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const Icon = getCategoryIcon(resource.category);
          const isCrisis = resource.category === 'crisis';

          return (
            <div
              key={resource.id}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all bg-white shadow-xs ${
                isCrisis
                  ? 'border-rose-300 hover:border-rose-400 ring-1 ring-rose-500/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isCrisis
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-teal-50 text-teal-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{resource.estimatedMinutes} min</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-display mb-1.5">
                  {resource.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {resource.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleAction(resource)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                    isCrisis
                      ? 'bg-rose-700 text-white hover:bg-rose-800'
                      : 'bg-slate-100 text-slate-900 hover:bg-teal-800 hover:text-white'
                  }`}
                >
                  <span>{resource.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
