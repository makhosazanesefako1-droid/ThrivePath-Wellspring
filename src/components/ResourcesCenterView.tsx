import React, { useState } from 'react';
import { useToast } from './ToastNotification.tsx';
import {
  BookOpen,
  DollarSign,
  Heart,
  Calendar,
  Users,
  PhoneCall,
  Activity,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ResourceItem {
  id: string;
  category: 'Academic' | 'Financial' | 'Well-being' | 'Counselling' | 'Social Support' | 'Emergency Support';
  title: string;
  description: string;
  actionText: string;
  icon: any;
  actionType: 'breathing' | 'reframe' | 'crisis' | 'booking' | 'link';
  linkUrl?: string;
}

interface ResourcesCenterViewProps {
  onOpenBreathing: () => void;
  onOpenReframe: () => void;
  onOpenCrisis: () => void;
  onBookCounselling: () => void;
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'res_academic_1',
    category: 'Academic',
    title: 'Academic Support & Pacing',
    description: 'Get help managing academic pressure, assignment deadlines, and exam workload.',
    actionText: 'View resources →',
    icon: BookOpen,
    actionType: 'reframe',
  },
  {
    id: 'res_financial_1',
    category: 'Financial',
    title: 'Emergency Student Food & Book Grants',
    description: 'Access confidential university bursary relief and emergency campus meal funds.',
    actionText: 'View grants →',
    icon: DollarSign,
    actionType: 'link',
  },
  {
    id: 'res_wellbeing_1',
    category: 'Well-being',
    title: '4-7-8 Somatic Breathing Exercise',
    description: 'Evidence-based paced respiration to calm physiological tension within 2 minutes.',
    actionText: 'Launch exercise →',
    icon: Activity,
    actionType: 'breathing',
  },
  {
    id: 'res_counselling_1',
    category: 'Counselling',
    title: 'Confidential 1-on-1 Consultations',
    description: 'Book private sessions with university psychologists via video or in-person.',
    actionText: 'Book session →',
    icon: Calendar,
    actionType: 'booking',
  },
  {
    id: 'res_social_1',
    category: 'Social Support',
    title: 'Weekly Campus Peer Circles',
    description: 'Join student-led discussion groups in campus residence halls for supportive connection.',
    actionText: 'Find a circle →',
    icon: Users,
    actionType: 'link',
  },
  {
    id: 'res_emergency_1',
    category: 'Emergency Support',
    title: '24/7 Crisis & Trauma Helpline',
    description: 'Immediate, confidential crisis support with licensed trauma specialists (SADAG 0800 567 567).',
    actionText: 'View helplines →',
    icon: PhoneCall,
    actionType: 'crisis',
  },
  {
    id: 'res_academic_2',
    category: 'Academic',
    title: 'Distributed Study Intervals Guide',
    description: 'Learn faculty-approved study blocks that prevent last-minute cramming and sleep deprivation.',
    actionText: 'Read guide →',
    icon: BookOpen,
    actionType: 'link',
  },
  {
    id: 'res_wellbeing_2',
    category: 'Well-being',
    title: 'Evening Sleep Optimization Protocol',
    description: 'Simple checklist for students to recover natural circadian rhythm during heavy semesters.',
    actionText: 'View checklist →',
    icon: Heart,
    actionType: 'link',
  },
];

const CATEGORIES = [
  'All',
  'Academic',
  'Financial',
  'Well-being',
  'Counselling',
  'Social Support',
  'Emergency Support',
] as const;

export const ResourcesCenterView: React.FC<ResourcesCenterViewProps> = ({
  onOpenBreathing,
  onOpenReframe,
  onOpenCrisis,
  onBookCounselling,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredResources =
    selectedCategory === 'All'
      ? RESOURCES
      : RESOURCES.filter((r) => r.category === selectedCategory);

  const { showToast } = useToast();

  const handleAction = (item: ResourceItem) => {
    switch (item.actionType) {
      case 'breathing':
        onOpenBreathing();
        break;
      case 'reframe':
        onOpenReframe();
        break;
      case 'crisis':
        onOpenCrisis();
        break;
      case 'booking':
        onBookCounselling();
        break;
      case 'link':
      default:
        showToast(`Accessing "${item.title}". University wellness module opened.`, 'info');
        break;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-[#172033]">
          Student Wellness Resources
        </h1>
        <p className="text-sm text-[#64748B] mt-1 font-normal">
          Explore tools, academic guides, and supportive services available at your university.
        </p>
      </div>

      {/* Category Pills (Section 27: Academic, Financial, Well-being, Counselling, Social Support, Emergency Support) */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#173B57] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-[#64748B] hover:text-[#172033] hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Resource Cards (Section 27 format: icon, title, one-sentence description, action) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          const Icon = res.icon;
          return (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#173B57] border border-slate-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#2563EB]" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    {res.category}
                  </span>
                  <h3 className="text-base font-bold font-heading text-[#172033] mt-0.5">
                    {res.title}
                  </h3>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleAction(res)}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-50 hover:text-[#2563EB] text-[#172033] text-xs font-semibold rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span>{res.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
