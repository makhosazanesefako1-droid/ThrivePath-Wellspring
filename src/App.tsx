import React, { useState, useEffect } from 'react';
import type {
  UserRole,
  UserAccount,
  StudentProfile,
  ScreeningRecord,
  DatasetScreeningInput,
  Appointment,
  SupportResource,
  UniversityAnalytics,
  AppointmentStatus,
  AppointmentModality,
} from './types/index.ts';
import {
  fetchCurrentSession,
  loginUser,
  registerUser,
  switchDemoPersona,
  fetchCounsellors,
  approveCounsellor,
  rejectCounsellor,
  fetchStudent,
  fetchScreenings,
  submitDatasetScreening,
  fetchAppointments,
  bookAppointment,
  updateAppointment,
  sendAppointmentReminder,
  fetchResources,
  fetchAnalytics,
  resetDemo,
} from './lib/api.ts';

// Core Views
import { PublicLandingPage } from './components/PublicLandingPage.tsx';
import { Navigation } from './components/Navigation.tsx';
import { Header } from './components/Header.tsx';
import { StudentDashboard } from './components/StudentDashboard.tsx';
import { AppointmentsPage } from './components/AppointmentsPage.tsx';
import { CounsellorDashboard } from './components/CounsellorDashboard.tsx';
import { HistoryTimelineView } from './components/HistoryTimelineView.tsx';
import { ResourcesCenterView } from './components/ResourcesCenterView.tsx';
import { AdminOverviewDashboard } from './components/AdminOverviewDashboard.tsx';
import { DatasetDashboardView } from './components/DatasetDashboardView.tsx';
import { StudentRegistrationView } from './components/StudentRegistrationView.tsx';

// Modals
import { AuthModal } from './components/AuthModal.tsx';
import { WellbeingScreeningModal } from './components/WellbeingScreeningModal.tsx';
import { CounsellingBookingModal } from './components/CounsellingBookingModal.tsx';
import { RescheduleModal } from './components/RescheduleModal.tsx';
import { BreathingModal } from './components/BreathingModal.tsx';
import { CognitiveReframeModal } from './components/CognitiveReframeModal.tsx';
import { CrisisModal } from './components/CrisisModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { HelpModal } from './components/HelpModal.tsx';
import { PrivacyAndClinicalSafetyModal } from './components/PrivacyAndClinicalSafetyModal.tsx';
import { MLTransparencyModal } from './components/MLTransparencyModal.tsx';
import { ClinicalSafetyTestSuiteModal } from './components/ClinicalSafetyTestSuiteModal.tsx';
import { DemoController } from './components/DemoController.tsx';
import { UniWellLogo } from './components/UniWellLogo.tsx';
import { useToast } from './components/ToastNotification.tsx';

import { Loader2, Menu } from 'lucide-react';

export default function App() {
  const { showToast } = useToast();
  // Navigation State
  const [viewMode, setViewMode] = useState<'landing' | 'portal'>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Backend Data State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [screenings, setScreenings] = useState<ScreeningRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counsellors, setCounsellors] = useState<UserAccount[]>([]);
  const [resources, setResources] = useState<SupportResource[]>([]);
  const [analytics, setAnalytics] = useState<UniversityAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);
  const [isReframeModalOpen, setIsReframeModalOpen] = useState(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isMLModalOpen, setIsMLModalOpen] = useState(false);
  const [isSafetyTestsModalOpen, setIsSafetyTestsModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);

  // Load all persistent data from backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [sess, stu, scr, apt, cns, res, ana] = await Promise.all([
        fetchCurrentSession().catch(() => ({
          user: {
            id: 'usr_student_01',
            email: 'siqinisekonqobile@gmail.com',
            fullName: 'Siqiniseko Nqobile',
            role: 'student' as const,
            approved: true,
            createdAt: new Date().toISOString(),
          },
          isSuperAdmin: false,
        })),
        fetchStudent().catch(() => null),
        fetchScreenings().catch(() => []),
        fetchAppointments().catch(() => []),
        fetchCounsellors().catch(() => []),
        fetchResources().catch(() => []),
        fetchAnalytics().catch(() => null),
      ]);

      if (sess?.user) {
        setCurrentUser(sess.user);
      }
      setStudent(stu);
      setScreenings(scr);
      setAppointments(apt);
      setCounsellors(cns);
      setResources(res);
      setAnalytics(ana);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auth Handlers
  const handleLogin = async (email: string): Promise<UserAccount> => {
    const user = await loginUser(email);
    setCurrentUser(user);
    if (user.role === 'counsellor') {
      setCurrentRole('counsellor');
      setActiveTab('appointments');
    } else if (user.role === 'admin') {
      setCurrentRole('admin');
      setActiveTab('dashboard');
    } else {
      setCurrentRole('student');
      setActiveTab('dashboard');
    }
    setViewMode('portal');
    await loadData();
    return user;
  };

  const handleRegister = async (payload: {
    email: string;
    fullName: string;
    role: 'student' | 'counsellor' | 'admin';
    title?: string;
    notes?: string;
  }) => {
    const res = await registerUser(payload);
    setCurrentUser(res.user);
    setCurrentRole('student');
    setActiveTab('dashboard');
    setViewMode('portal');
    await loadData();
    return res;
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setViewMode('landing');
  };

  // Role switching
  const handleRoleChange = async (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'counsellor') {
      await switchDemoPersona('counsellor');
      setActiveTab('dashboard');
    } else if (role === 'admin') {
      await switchDemoPersona('admin');
      setActiveTab('dashboard');
    } else {
      await switchDemoPersona('student');
      setActiveTab('dashboard');
    }
    await loadData();
  };

  // Screening Submission with 3,000-record dataset ML model
  const handleSubmitScreening = async (input: DatasetScreeningInput): Promise<ScreeningRecord> => {
    const record = await submitDatasetScreening(input, 8);
    await loadData();
    return record;
  };

  // Appointment actions
  const handleBookAppointment = async (payload: {
    dateTime: string;
    modality: AppointmentModality;
    focusArea: string;
    intakeNotes?: string;
    counsellorId?: string;
    counsellorName?: string;
    counsellorRole?: string;
  }) => {
    await bookAppointment(payload);
    await loadData();
  };

  const handleReschedule = async (id: string, newDate: string, newTime: string) => {
    await updateAppointment(id, {
      formattedDate: newDate,
      formattedTime: newTime,
      status: 'rescheduled',
    });
    await loadData();
  };

  const handleCancelAppointment = async (id: string) => {
    await updateAppointment(id, { status: 'cancelled' });
    await loadData();
  };

  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    await updateAppointment(id, { status });
    await loadData();
  };

  const handleSaveSessionNotes = async (
    id: string,
    notes: string,
    followUp: string,
    status: AppointmentStatus
  ) => {
    await updateAppointment(id, {
      counsellorSessionNotes: notes,
      followUpRecommended: followUp,
      status,
    });
    await loadData();
  };

  const handleSendReminder = async (id: string) => {
    await sendAppointmentReminder(id);
    showToast('SMS reminder sent to student mobile number.', 'success');
    await loadData();
  };

  // Admin Counsellor approvals
  const handleApproveCounsellor = async (id: string) => {
    await approveCounsellor(id);
    await loadData();
  };

  const handleRejectCounsellor = async (id: string) => {
    await rejectCounsellor(id);
    await loadData();
  };

  // Demo Reset
  const handleResetDemo = async () => {
    await resetDemo();
    await loadData();
  };

  const latestScreening = screenings[screenings.length - 1] || null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] font-body flex flex-col selection:bg-[#2563EB]/15 selection:text-[#173B57]">
      {/* ========================================================= */}
      {/* 1. PUBLIC LANDING PAGE VIEW (Section 7 & 8) */}
      {/* ========================================================= */}
      {viewMode === 'landing' ? (
        <PublicLandingPage
          onGetStarted={() => {
            setAuthInitialTab('register');
            setIsAuthModalOpen(true);
          }}
          onSignIn={() => {
            setAuthInitialTab('login');
            setIsAuthModalOpen(true);
          }}
          onOpenScreening={() => {
            setViewMode('portal');
            setActiveTab('dashboard');
            setIsScreeningModalOpen(true);
          }}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          onOpenMLInfo={() => setIsMLModalOpen(true)}
          onViewEvidenceDashboard={() => {
            setViewMode('portal');
            setActiveTab('evidence');
          }}
        />
      ) : (
        /* ========================================================= */
        /* 2. AUTHENTICATED PORTAL (matching Screenshot 5) */
        /* ========================================================= */
        <div className="flex-1 flex flex-col min-h-screen bg-[#F4FAF7]">
          {/* Top Full-Width Header (matching Screenshot 5) */}
          <Header
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            currentUser={currentUser}
            onOpenSignIn={() => {
              setAuthInitialTab('login');
              setIsAuthModalOpen(true);
            }}
            onSignOut={handleSignOut}
            onGoToLanding={() => setViewMode('landing')}
          />

          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            {/* Desktop Left Sidebar + Mobile Bottom Navigation */}
            <Navigation
              currentTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab)}
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onSignOut={handleSignOut}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onOpenHelp={() => setIsHelpModalOpen(true)}
              onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
              onOpenMLInfo={() => setIsMLModalOpen(true)}
              onOpenSafetyTests={() => setIsSafetyTestsModalOpen(true)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#F4FAF7]">
              {/* Portal Tab Content */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
              {isLoading && !student ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mb-3" />
                  <div className="text-sm font-semibold text-[#172033]">
                    Loading your university portal...
                  </div>
                </div>
              ) : (
                <>
                  {/* ========================================================= */}
                  {/* STUDENT ROLE TABS */}
                  {/* ========================================================= */}
                  {currentRole === 'student' && (
                    <>
                      {/* Home / Student Dashboard (Section 10 & 11) */}
                      {activeTab === 'dashboard' && (
                        <StudentDashboard
                          student={student}
                          latestScreening={latestScreening}
                          appointments={appointments}
                          resourcesCount={resources.length || 12}
                          onStartScreening={() => setIsScreeningModalOpen(true)}
                          onBookAppointment={() => setIsBookingModalOpen(true)}
                          onNavigateTab={(tab) => setActiveTab(tab)}
                          onOpenCrisis={() => setIsCrisisModalOpen(true)}
                        />
                      )}

                      {/* Well-being Screening Tab */}
                      {activeTab === 'wellbeing' && (
                        <div className="space-y-6 max-w-4xl mx-auto">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <h1 className="text-3xl font-bold font-heading text-[#172033]">
                                Well-being Screening
                              </h1>
                              <p className="text-sm text-[#64748B] mt-1 font-normal">
                                Confidential 3–5 min check-ins embedded in your university journey.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setIsScreeningModalOpen(true)}
                              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                            >
                              Take new check-in
                            </button>
                          </div>

                          {/* Latest screening summary */}
                          {latestScreening ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-5">
                              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                                    Latest check-in
                                  </span>
                                  <h2 className="text-xl font-bold font-heading text-[#172033] mt-0.5">
                                    Completed on {new Date(latestScreening.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </h2>
                                </div>

                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                  latestScreening.stressBand === 'low'
                                    ? 'bg-emerald-100 text-[#16A34A]'
                                    : 'bg-amber-100 text-[#F59E0B]'
                                }`}>
                                  {latestScreening.stressBand === 'low' ? 'Low / Mild' : 'Moderate / High'}
                                </div>
                              </div>

                              <p className="text-sm text-[#172033] leading-relaxed">
                                {latestScreening.stressBand === 'low'
                                  ? 'Your responses do not currently indicate a high level of concern based on this screening. You can still explore our wellness resources and support services.'
                                  : 'Your responses indicate that you may benefit from speaking with someone at the university. You can choose what feels right for you.'}
                              </p>

                              <div className="pt-2 flex flex-wrap gap-3">
                                <button
                                  type="button"
                                  onClick={() => setIsBookingModalOpen(true)}
                                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                  Book counselling
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('resources')}
                                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#172033] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                  Explore resources
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
                              <h3 className="text-lg font-bold font-heading text-[#172033]">
                                No screening completed yet
                              </h3>
                              <p className="text-sm text-[#64748B] max-w-sm mx-auto">
                                Complete your first 3–5 min check-in to receive matched support guidance.
                              </p>
                              <button
                                type="button"
                                onClick={() => setIsScreeningModalOpen(true)}
                                className="px-6 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl"
                              >
                                Start screening →
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Appointments Tab (Section 22) */}
                      {activeTab === 'appointments' && (
                        <AppointmentsPage
                          appointments={appointments}
                          onOpenBooking={() => setIsBookingModalOpen(true)}
                          onReschedule={(apt) => setRescheduleTarget(apt)}
                          onCancel={handleCancelAppointment}
                          onSendReminder={handleSendReminder}
                        />
                      )}

                      {/* Resources Tab (Section 27) */}
                      {activeTab === 'resources' && (
                        <ResourcesCenterView
                          onOpenBreathing={() => setIsBreathingModalOpen(true)}
                          onOpenReframe={() => setIsReframeModalOpen(true)}
                          onOpenCrisis={() => setIsCrisisModalOpen(true)}
                          onBookCounselling={() => setIsBookingModalOpen(true)}
                        />
                      )}

                      {/* History / Timeline Tab (Section 25 & 26) */}
                      {activeTab === 'history' && (
                        <HistoryTimelineView
                          screenings={screenings}
                          appointments={appointments}
                          onStartReScreening={() => setIsScreeningModalOpen(true)}
                        />
                      )}

                      {/* Registration Tab */}
                      {activeTab === 'registration' && student && (
                        <StudentRegistrationView
                          student={student}
                          onProceedToScreening={() => setIsScreeningModalOpen(true)}
                        />
                      )}

                      {/* Dataset & Graphs Dashboard Tab */}
                      {activeTab === 'evidence' && (
                        <DatasetDashboardView
                          onStartScreening={() => setIsScreeningModalOpen(true)}
                        />
                      )}
                    </>
                  )}

                  {/* ========================================================= */}
                  {/* COUNSELLOR ROLE TABS (Section 23 & 24) */}
                  {/* ========================================================= */}
                  {currentRole === 'counsellor' && (
                    <>
                      {activeTab === 'dashboard' || activeTab === 'appointments' ? (
                        <CounsellorDashboard
                          appointments={appointments}
                          currentUser={currentUser}
                          onUpdateStatus={handleUpdateAppointmentStatus}
                          onSaveNotes={handleSaveSessionNotes}
                        />
                      ) : activeTab === 'resources' ? (
                        <ResourcesCenterView
                          onOpenBreathing={() => setIsBreathingModalOpen(true)}
                          onOpenReframe={() => setIsReframeModalOpen(true)}
                          onOpenCrisis={() => setIsCrisisModalOpen(true)}
                          onBookCounselling={() => setIsBookingModalOpen(true)}
                        />
                      ) : activeTab === 'evidence' ? (
                        <DatasetDashboardView
                          onStartScreening={() => setIsScreeningModalOpen(true)}
                        />
                      ) : null}
                    </>
                  )}

                  {/* ========================================================= */}
                  {/* ADMIN ROLE TABS (Section 28) */}
                  {/* ========================================================= */}
                  {currentRole === 'admin' && (
                    <>
                      {activeTab === 'evidence' ? (
                        <DatasetDashboardView
                          onStartScreening={() => setIsScreeningModalOpen(true)}
                        />
                      ) : activeTab === 'dashboard' || activeTab === 'analytics' || activeTab === 'counsellors' ? (
                        <AdminOverviewDashboard
                          analytics={analytics}
                          counsellors={counsellors}
                          onApproveCounsellor={handleApproveCounsellor}
                          onRejectCounsellor={handleRejectCounsellor}
                        />
                      ) : activeTab === 'resources' ? (
                        <ResourcesCenterView
                          onOpenBreathing={() => setIsBreathingModalOpen(true)}
                          onOpenReframe={() => setIsReframeModalOpen(true)}
                          onOpenCrisis={() => setIsCrisisModalOpen(true)}
                          onBookCounselling={() => setIsBookingModalOpen(true)}
                        />
                      ) : null}
                    </>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    )}

      {/* ========================================================= */}
      {/* INTERACTIVE MODALS */}
      {/* ========================================================= */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        initialTab={authInitialTab}
      />

      <WellbeingScreeningModal
        isOpen={isScreeningModalOpen}
        onClose={() => setIsScreeningModalOpen(false)}
        onSubmit={handleSubmitScreening}
        onBookCounselling={() => setIsBookingModalOpen(true)}
        onExploreResources={() => {
          setViewMode('portal');
          setActiveTab('resources');
        }}
        initialInput={latestScreening?.input}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        onOpenMLInfo={() => setIsMLModalOpen(true)}
      />

      <CounsellingBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        counsellors={counsellors}
        onConfirmBooking={handleBookAppointment}
        onViewAppointments={() => {
          setViewMode('portal');
          setActiveTab('appointments');
        }}
      />

      <RescheduleModal
        appointment={rescheduleTarget}
        isOpen={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
        onReschedule={handleReschedule}
      />

      <BreathingModal
        isOpen={isBreathingModalOpen}
        onClose={() => setIsBreathingModalOpen(false)}
      />

      <CognitiveReframeModal
        isOpen={isReframeModalOpen}
        onClose={() => setIsReframeModalOpen(false)}
      />

      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
      />

      <PrivacyAndClinicalSafetyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        onOpenSafetyTests={() => setIsSafetyTestsModalOpen(true)}
      />

      <MLTransparencyModal
        isOpen={isMLModalOpen}
        onClose={() => setIsMLModalOpen(false)}
      />

      <ClinicalSafetyTestSuiteModal
        isOpen={isSafetyTestsModalOpen}
        onClose={() => setIsSafetyTestsModalOpen(false)}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
      />

      {/* Discreet Demo Controller for seamless presentation transitions */}
      <DemoController
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onResetDemo={handleResetDemo}
        onTriggerScreening={() => {
          setViewMode('portal');
          setIsScreeningModalOpen(true);
        }}
        onTriggerBooking={() => {
          setViewMode('portal');
          setIsBookingModalOpen(true);
        }}
        onNavigateTab={(tab) => {
          setViewMode('portal');
          setActiveTab(tab);
        }}
        onTriggerSafetyTests={() => setIsSafetyTestsModalOpen(true)}
      />
    </div>
  );
}
