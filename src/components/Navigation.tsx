import React from 'react';
import { UniWellLogo } from './UniWellLogo.tsx';
import type { UserRole, UserAccount } from '../types/index.ts';
import {
  Home,
  CheckCircle,
  Calendar,
  Heart,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Shield,
  ShieldCheck,
  Cpu,
  FileCheck,
  Layers,
  ChevronRight,
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
  unreadCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  currentRole,
  onRoleChange,
  onSignOut,
  onOpenSettings,
  onOpenHelp,
  onOpenPrivacy,
  onOpenMLInfo,
  onOpenSafetyTests,
  onGoToLanding,
}) => {
  // Student items (5-6 items as per Section 5)
  const studentNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'wellbeing', label: 'Well-being', icon: CheckCircle },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: Heart },
    { id: 'history', label: 'My History', icon: ClipboardList },
  ];

  // Counsellor items
  const counsellorNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: Heart },
  ];

  // Admin items
  const adminNavItems = [
    { id: 'dashboard', label: 'Overview', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: Layers },
    { id: 'counsellors', label: 'Counsellors', icon: Shield },
    { id: 'resources', label: 'Resources', icon: Heart },
  ];

  const navItems =
    currentRole === 'counsellor'
      ? counsellorNavItems
      : currentRole === 'admin'
      ? adminNavItems
      : studentNavItems;

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR (Visible on md and up) */}
      {/* ========================================================= */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 h-screen sticky top-0 z-30 selection:bg-blue-100">
        {/* Top Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <UniWellLogo size="md" showSubtitle={true} />
        </div>

        {/* Primary Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-3 mb-2">
            Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-[#2563EB] font-semibold shadow-2xs'
                    : 'text-[#172033] hover:bg-slate-50 hover:text-[#173B57]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-[#2563EB]' : 'text-[#64748B]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Section Divider */}
          <div className="pt-4 pb-2">
            <hr className="border-slate-100" />
          </div>

          {/* Secondary Items: Settings & Help & Privacy */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium text-[#64748B] hover:bg-slate-50 hover:text-[#172033] transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 shrink-0 text-[#64748B]" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={onOpenHelp}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium text-[#64748B] hover:bg-slate-50 hover:text-[#172033] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-[#64748B]" />
            <span>Help</span>
          </button>

          {onOpenPrivacy && (
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium text-[#64748B] hover:bg-slate-50 hover:text-[#172033] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#16A34A]" />
              <span>Privacy & Safety</span>
            </button>
          )}

          {onOpenMLInfo && (
            <button
              type="button"
              onClick={onOpenMLInfo}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium text-[#64748B] hover:bg-slate-50 hover:text-[#172033] transition-colors cursor-pointer"
            >
              <Cpu className="w-4 h-4 shrink-0 text-[#2563EB]" />
              <span>ML Model Info</span>
            </button>
          )}

          {onOpenSafetyTests && (
            <button
              type="button"
              onClick={onOpenSafetyTests}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium text-[#64748B] hover:bg-slate-50 hover:text-[#172033] transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 shrink-0 text-[#16A34A]" />
              <div className="flex items-center justify-between w-full">
                <span>Clinical Safety Tests</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-[#16A34A]">
                  Auto
                </span>
              </div>
            </button>
          )}

          {onGoToLanding && (
            <button
              type="button"
              onClick={onGoToLanding}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium text-[#64748B] hover:bg-slate-50 hover:text-[#172033] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 shrink-0 text-[#64748B]" />
              <span>Public Overview</span>
            </button>
          )}
        </nav>

        {/* Role & Persona Switcher (For seamless presentation & multi-role testing) */}
        <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
            <span>VIEWING AS</span>
            <span className="capitalize px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#173B57] text-[10px] font-bold">
              {currentRole}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => onRoleChange('student')}
              className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors ${
                currentRole === 'student'
                  ? 'bg-[#173B57] text-white font-semibold'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('counsellor')}
              className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors ${
                currentRole === 'counsellor'
                  ? 'bg-[#173B57] text-white font-semibold'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              Counsellor
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('admin')}
              className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors ${
                currentRole === 'admin'
                  ? 'bg-[#173B57] text-white font-semibold'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              Admin
            </button>
          </div>

          {/* User profile / Logout */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#173B57] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#172033] truncate">
                  {currentUser?.fullName || 'Siqiniseko Nqobile'}
                </div>
                <div className="text-[11px] text-[#64748B] truncate">
                  {currentRole === 'student' ? 'Student' : currentRole === 'counsellor' ? 'Counsellor' : 'Admin'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="p-1.5 text-[#64748B] hover:text-[#DC2626] rounded-lg hover:bg-white transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Visible on mobile only) */}
      {/* Section 6 requirement: Home | Well-being | Book | Resources */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl text-xs font-medium transition-colors ${
            currentTab === 'dashboard'
              ? 'text-[#2563EB] font-semibold'
              : 'text-[#64748B] hover:text-[#172033]'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('wellbeing')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl text-xs font-medium transition-colors ${
            currentTab === 'wellbeing'
              ? 'text-[#2563EB] font-semibold'
              : 'text-[#64748B] hover:text-[#172033]'
          }`}
        >
          <CheckCircle className="w-5 h-5 mb-1" />
          <span>Well-being</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('appointments')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl text-xs font-medium transition-colors ${
            currentTab === 'appointments'
              ? 'text-[#2563EB] font-semibold'
              : 'text-[#64748B] hover:text-[#172033]'
          }`}
        >
          <Calendar className="w-5 h-5 mb-1" />
          <span>Book</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('resources')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl text-xs font-medium transition-colors ${
            currentTab === 'resources'
              ? 'text-[#2563EB] font-semibold'
              : 'text-[#64748B] hover:text-[#172033]'
          }`}
        >
          <Heart className="w-5 h-5 mb-1" />
          <span>Resources</span>
        </button>
      </nav>
    </>
  );
};
