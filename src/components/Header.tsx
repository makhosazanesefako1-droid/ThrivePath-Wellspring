import React from 'react';
import type { UserRole, UserAccount } from '../types/index.ts';
import { ThriveLogo } from './ThriveLogo.tsx';
import { Bell, User, LogOut } from 'lucide-react';

interface PortalHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser: UserAccount | null;
  onOpenSignIn: () => void;
  onSignOut: () => void;
  onGoToLanding: () => void;
  pendingApprovalsCount?: number;
}

export const Header: React.FC<PortalHeaderProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  onOpenSignIn,
  onSignOut,
  onGoToLanding,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Zone: Brand Title & University Tagline (matching Screenshot 5) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onGoToLanding}
              className="flex items-center gap-2 text-left cursor-pointer"
              title="Return to Public Landing Page"
            >
              <ThriveLogo size="md" textColor="text-[#0B3B2C]" />
            </button>

            <span className="hidden sm:inline text-xs text-slate-300">|</span>
            <span className="hidden sm:inline text-xs font-medium text-slate-500">
              University wellbeing platform
            </span>
          </div>

          {/* Right Zone: Role Switcher Pills + Notifications + Sign In / User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Role Switcher Pills (matching Screenshot 5) */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => onRoleChange('student')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  currentRole === 'student'
                    ? 'bg-[#0B3B2C] text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('counsellor')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  currentRole === 'counsellor'
                    ? 'bg-[#0B3B2C] text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Counsellor
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('admin')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  currentRole === 'admin' || (currentRole as string) === 'dean'
                    ? 'bg-[#0B3B2C] text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                University
              </button>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => {}}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            {/* Sign in / Profile button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Sign out</span>
                  <LogOut className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenSignIn}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0B3B2C] hover:bg-[#07291F] rounded-lg shadow-2xs transition-colors cursor-pointer"
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
