import React from 'react';
import type { UserRole, UserAccount } from '../types/index.ts';
import { ThriveLogo } from './ThriveLogo.tsx';
import { Bell, User, LogOut, ShieldCheck, Home } from 'lucide-react';

interface PortalHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser: UserAccount | null;
  onOpenSignIn: () => void;
  onSignOut: () => void;
  onGoToLanding: () => void;
  pendingApprovalsCount: number;
}

export const Header: React.FC<PortalHeaderProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  onOpenSignIn,
  onSignOut,
  onGoToLanding,
  pendingApprovalsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand title & Tagline */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onGoToLanding}
              className="flex items-center gap-2 text-left"
              title="Return to Public Home"
            >
              <ThriveLogo size="md" />
            </button>

            <span className="hidden sm:inline text-xs text-slate-300">|</span>
            <span className="hidden sm:inline text-xs font-medium text-slate-500">
              University wellbeing platform
            </span>
          </div>

          {/* Zone 2 & 3: Role Switcher & User Account */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Landing page link */}
            <button
              type="button"
              onClick={onGoToLanding}
              className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
              title="View Public Pitch Landing Page"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Public Page</span>
            </button>

            {/* Role Switcher Pills (matching Screenshot 5) */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => onRoleChange('student')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  currentRole === 'student'
                    ? 'bg-[#09392b] text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('counsellor')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  currentRole === 'counsellor'
                    ? 'bg-[#09392b] text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Counsellor
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('dean')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  currentRole === 'dean'
                    ? 'bg-[#09392b] text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                University
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('admin')}
                className={`px-3 py-1 rounded-md font-medium transition-colors relative ${
                  currentRole === 'admin'
                    ? 'bg-[#09392b] text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Admin</span>
                {pendingApprovalsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </button>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* User Account / Sign In */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                  <div className="w-5 h-5 rounded-full bg-[#09392b] text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                    {currentUser.fullName}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenSignIn}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
