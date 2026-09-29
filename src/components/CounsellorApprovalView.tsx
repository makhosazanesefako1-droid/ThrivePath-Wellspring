import React, { useState } from 'react';
import { useToast } from './ToastNotification.tsx';
import type { UserAccount } from '../types/index.ts';
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Stethoscope,
  CheckCircle2,
  Clock,
  Award,
  Plus,
} from 'lucide-react';

interface CounsellorApprovalViewProps {
  counsellors: UserAccount[];
  currentUser: UserAccount;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onMakeAdmin: (email: string) => Promise<void>;
}

export const CounsellorApprovalView: React.FC<CounsellorApprovalViewProps> = ({
  counsellors,
  currentUser,
  onApprove,
  onReject,
  onMakeAdmin,
}) => {
  const { showToast } = useToast();
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingCounsellors = counsellors.filter((c) => !c.approved);
  const approvedCounsellors = counsellors.filter((c) => c.approved);

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmailInput.trim()) return;
    try {
      setIsProcessing(true);
      await onMakeAdmin(adminEmailInput.trim());
      showToast(`Successfully designated ${adminEmailInput} as Administrator.`, 'success');
      setAdminSuccessMsg(`Successfully designated ${adminEmailInput} as Administrator.`);
      setAdminEmailInput('');
      setTimeout(() => setAdminSuccessMsg(''), 4000);
    } catch (err: any) {
      showToast(err.message || 'Failed to make admin', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#09392b] text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Governance · Clinical Access Control</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Counsellor Verification & Clinical Access Approvals
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            Ensure only certified university clinical psychologists and HPCSA-registered counsellors can access confidential student appointment records.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-xs text-center shrink-0">
          <div>
            <div className="text-emerald-200 text-[10px] uppercase font-bold">Pending Review</div>
            <div className="text-xl font-mono font-bold text-amber-300">
              {pendingCounsellors.length}
            </div>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <div>
            <div className="text-emerald-200 text-[10px] uppercase font-bold">Approved Active</div>
            <div className="text-xl font-mono font-bold text-emerald-300">
              {approvedCounsellors.length}
            </div>
          </div>
        </div>
      </div>

      {/* 1. Pending Approvals Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Pending Counsellor Applications ({pendingCounsellors.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Requires Administrator Approval
          </span>
        </div>

        {pendingCounsellors.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
            All registered counsellors have been verified and approved.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingCounsellors.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{c.fullName}</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Pending Verification
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Email:</strong> {c.email} · <strong>Title:</strong> {c.title || 'Counsellor'}
                  </div>
                  {c.notes && (
                    <div className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded border border-amber-200/60 max-w-lg">
                      {c.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onApprove(c.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#09392b] text-white text-xs font-semibold rounded-lg hover:bg-[#072d22] transition-colors shadow-2xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve Counsellor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReject(c.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-medium rounded-lg transition-colors"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Active Approved Counsellors */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-800" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Approved Active Counsellors ({approvedCounsellors.length})
            </h3>
          </div>
          <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            Authorized Clinical Access
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvedCounsellors.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{c.fullName}</span>
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="text-[11px] text-slate-600 font-medium">{c.title}</div>
                <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
              </div>

              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Administrator Promotion Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900 font-display">
            Designate New Administrator
          </h3>
        </div>

        <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
          As requested: <em>"To set this up, you'll need to create your own account in the app first so I can make you the admin."</em> Enter any registered email below to grant full platform administrator privileges.
        </p>

        {adminSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{adminSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleMakeAdmin} className="flex flex-col sm:flex-row gap-2 max-w-lg">
          <input
            type="email"
            placeholder="Enter user email (e.g. siqinisekonqobile@gmail.com)"
            value={adminEmailInput}
            onChange={(e) => setAdminEmailInput(e.target.value)}
            className="flex-1 text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#09392b]"
            required
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-2.5 bg-[#09392b] text-white text-xs font-semibold rounded-lg hover:bg-[#072d22] transition-colors shrink-0"
          >
            {isProcessing ? 'Updating...' : 'Grant Admin Privileges'}
          </button>
        </form>

        <div className="text-[11px] text-slate-500 pt-1">
          Currently Recognized Super Admin: <strong className="font-mono text-slate-800">siqinisekonqobile@gmail.com</strong>
        </div>
      </div>
    </div>
  );
};
