import React from 'react';
import type { UserRole, UserAccount } from '../types/index.ts';
import {
  LayoutGrid,
  FileText,
  Activity,
  Calendar,
  RotateCcw,
  Heart,
  BarChart3,
  Shield,
  Lock,
} from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: UserAccount | null;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onSignOut: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenPrivacy?: () => void;
  onOpenMLInfo?: () => void;
  onOpenSafetyTests?: () => void;
  onGoToLanding?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
}) => {
  // Student items (Screenshot 5: Dashboard, Registration, Wellbeing, Appointments, History)
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'registration', label: 'Registration', icon: FileText },
    { id: 'wellbeing', label: 'Wellbeing', icon: Activity },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'history', label: 'History', icon: RotateCcw },
    { id: 'evidence', label: 'Dataset & Graphs', icon: BarChart3 },
  ];

  // Counsellor items
  const counsellorNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: Heart },
    { id: 'evidence', label: 'Dataset & Graphs', icon: BarChart3 },
  ];

  // University / Admin items
  const adminNavItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutGrid },
    { id: 'evidence', label: 'Dataset & Graphs', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'counsellors', label: 'Counsellors', icon: Shield },
  ];

  const navItems =
    currentRole === 'counsellor'
      ? counsellorNavItems
      : currentRole === 'admin'
      ? adminNavItems
      : studentNavItems;

  return (
    <>
      {/* DESKTOP LEFT SIDEBAR (matching Screenshot 5) */}
      <aside className="hidden md:flex flex-col w-60 bg-[#F4FAF7] border-r border-emerald-100 shrink-0 min-h-screen py-6 px-4 justify-between">
        <div className="space-y-6">
          {/* Section Label: VIEWING AS */}
          <div className="px-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              VIEWING AS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#D1F2E2] text-[#0A5737] font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-[#E8F6EF] hover:text-[#0A5737]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#0A5737]' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card: Private by design (matching Screenshot 5) */}
        <div className="bg-[#DDF4E8] rounded-xl p-3.5 border border-[#C5EBDA] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A5737]">
            <Lock className="w-3.5 h-3.5" />
            <span>Private by design</span>
          </div>
          <p className="text-[11px] text-[#2C6A50] leading-snug">
            Demo records are anonymous. University insights are aggregated.
          </p>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#0A5737] font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
