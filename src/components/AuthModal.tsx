import React, { useState } from 'react';
import { UniWellLogo } from './UniWellLogo.tsx';
import { useToast } from './ToastNotification.tsx';
import type { UserAccount, StudentProfile } from '../types/index.ts';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Lock,
  User,
  School,
  ShieldCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => Promise<UserAccount>;
  onRegister: (payload: {
    email: string;
    fullName: string;
    role: 'student' | 'counsellor' | 'admin';
    title?: string;
    notes?: string;
  }) => Promise<any>;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  initialTab = 'login',
}) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>(initialTab);
  const [studentNumber, setStudentNumber] = useState('ZA-2024-4192');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Guided registration steps (Section 12: 1 Personal -> 2 Academic -> 3 Well-being -> 4 Complete)
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4>(1);
  const [regData, setRegData] = useState({
    fullName: 'Siqiniseko Nqobile',
    studentNumber: 'ZA-2026-9041',
    email: 'siqinisekonqobile@gmail.com',
    faculty: 'Faculty of Engineering & the Built Environment',
    program: 'B.Sc. Electrical & Computer Engineering',
    yearOfStudy: 2,
    emergencyName: 'Thandi Nqobile',
    emergencyPhone: '+27 82 555 4192',
    consentAgreed: true,
  });

  if (!isOpen) return null;

  const handleSimpleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMsg(null);
      // Map demo student number or email to session
      const targetEmail =
        studentNumber.includes('@')
          ? studentNumber
          : studentNumber.toLowerCase().includes('admin')
          ? 'admin@campus.ac.za'
          : studentNumber.toLowerCase().includes('counsel')
          ? 'dr.khumalo@campus.ac.za'
          : 'siqinisekonqobile@gmail.com';

      await onLogin(targetEmail);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please check your student number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      await onRegister({
        fullName: regData.fullName,
        email: regData.email,
        role: 'student',
        notes: `Faculty: ${regData.faculty} · Program: ${regData.program} · Year: ${regData.yearOfStudy}`,
      });
      setRegStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <UniWellLogo size="sm" showSubtitle={false} />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* 1. SIMPLE LOGIN VIEW (Section 9) */}
        {/* ========================================================= */}
        {mode === 'login' ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold font-heading text-[#172033]">
                Welcome back
              </h2>
              <p className="text-xs text-[#64748B]">
                Enter your student credentials to access UniWell.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-[#DC2626]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSimpleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#172033] block">
                  Student number or campus email
                </label>
                <input
                  type="text"
                  required
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="e.g. ZA-2024-4192 or student@campus.ac.za"
                  className="w-full text-sm p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#172033]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#172033] block">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-sm p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#172033]"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#64748B]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => showToast('Password reset guidance sent to your institutional student email.', 'info')}
                  className="text-[#2563EB] hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-[#64748B] space-y-1">
              <div>New student?</div>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setRegStep(1);
                }}
                className="font-semibold text-[#173B57] hover:underline"
              >
                Register your account
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* 2. GUIDED REGISTRATION PROCESS (Section 12) */
          /* ========================================================= */
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-heading text-[#172033]">
                Student Registration
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Connect your academic profile with student wellness services.
              </p>
            </div>

            {/* 4-Step Progress Indicator (Section 12) */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-semibold pb-2 border-b border-slate-100">
              <div className={regStep === 1 ? 'text-[#2563EB] font-bold' : regStep > 1 ? 'text-[#16A34A]' : 'text-slate-400'}>
                1 Personal
              </div>
              <div className={regStep === 2 ? 'text-[#2563EB] font-bold' : regStep > 2 ? 'text-[#16A34A]' : 'text-slate-400'}>
                2 Academic
              </div>
              <div className={regStep === 3 ? 'text-[#2563EB] font-bold' : regStep > 3 ? 'text-[#16A34A]' : 'text-slate-400'}>
                3 Well-being
              </div>
              <div className={regStep === 4 ? 'text-[#16A34A] font-bold' : 'text-slate-400'}>
                4 Complete
              </div>
            </div>

            {/* Step 1: Personal */}
            {regStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#172033] block">Full name</label>
                  <input
                    type="text"
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#172033] block">Student number</label>
                  <input
                    type="text"
                    value={regData.studentNumber}
                    onChange={(e) => setRegData({ ...regData, studentNumber: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#172033] block">Student email</label>
                  <input
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-[#64748B] hover:text-[#172033]"
                  >
                    Back to login
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegStep(2)}
                    className="px-5 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-xl"
                  >
                    Continue to Academic →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Academic */}
            {regStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#172033] block">Faculty</label>
                  <select
                    value={regData.faculty}
                    onChange={(e) => setRegData({ ...regData, faculty: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <option>Faculty of Engineering & the Built Environment</option>
                    <option>Faculty of Health Sciences & Medicine</option>
                    <option>Faculty of Commerce, Law & Management</option>
                    <option>Faculty of Humanities & Social Sciences</option>
                    <option>Faculty of Science & Computing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#172033] block">Degree program</label>
                  <input
                    type="text"
                    value={regData.program}
                    onChange={(e) => setRegData({ ...regData, program: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#172033] block">Year of study</label>
                  <select
                    value={regData.yearOfStudy}
                    onChange={(e) => setRegData({ ...regData, yearOfStudy: Number(e.target.value) })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value={1}>1st Year (Undergraduate)</option>
                    <option value={2}>2nd Year (Undergraduate)</option>
                    <option value={3}>3rd Year (Undergraduate)</option>
                    <option value={4}>4th Year / Honours</option>
                    <option value={5}>Postgraduate / Master's</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="text-xs text-[#64748B] hover:text-[#172033]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegStep(3)}
                    className="px-5 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-xl"
                  >
                    Continue to Well-being →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Well-being Consent */}
            {regStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#64748B] space-y-2">
                  <div className="font-bold text-[#173B57]">
                    Confidentiality & Care Guarantee
                  </div>
                  <p>
                    UniWell stores screening responses securely for support coordination. Your well-being checks are strictly private and never affect exam eligibility or registration.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#172033] block">
                    Designated Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={regData.emergencyName}
                    onChange={(e) => setRegData({ ...regData, emergencyName: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#172033] block">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="text"
                    value={regData.emergencyPhone}
                    onChange={(e) => setRegData({ ...regData, emergencyPhone: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setRegStep(2)}
                    className="text-xs text-[#64748B] hover:text-[#172033]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleRegistrationSubmit}
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl"
                  >
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Complete */}
            {regStep === 4 && (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-heading text-[#172033]">
                    Registration complete!
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Your profile is ready. You can now take your first private 3–5 min well-being check.
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs"
                  >
                    Go to student dashboard →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
