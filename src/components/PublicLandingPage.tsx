import React from 'react';
import { UniWellLogo } from './UniWellLogo.tsx';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Heart,
  Calendar,
  BookOpen,
  PhoneCall,
  Activity,
  Users,
  Compass,
} from 'lucide-react';

interface PublicLandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onOpenScreening: () => void;
  onOpenPrivacy?: () => void;
  onOpenMLInfo?: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onOpenScreening,
  onOpenPrivacy,
  onOpenMLInfo,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const journeySteps = [
    { number: '1', title: 'Registration', desc: 'Secure student profile' },
    { number: '2', title: 'Well-being check', desc: '3–5 min private screening' },
    { number: '3', title: 'Support', desc: 'Personalized wellness options' },
    { number: '4', title: 'Counselling', desc: 'Confidential 1-on-1 sessions' },
    { number: '5', title: 'Follow-up', desc: 'Ongoing care & check-ins' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] font-body selection:bg-[#2563EB]/15 selection:text-[#173B57]">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center text-left"
          >
            <UniWellLogo size="md" showSubtitle={true} />
          </button>

          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#64748B]">
            <button
              type="button"
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-[#173B57] transition-colors"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => scrollTo('support-options')}
              className="hover:text-[#173B57] transition-colors"
            >
              Support
            </button>
            <button
              type="button"
              onClick={() => scrollTo('why-uniwell')}
              className="hover:text-[#173B57] transition-colors"
            >
              Why UniWell
            </button>
            <button
              type="button"
              onClick={onOpenPrivacy ? onOpenPrivacy : () => scrollTo('privacy')}
              className="hover:text-[#173B57] transition-colors cursor-pointer"
            >
              Privacy & Safety
            </button>
            {onOpenMLInfo && (
              <button
                type="button"
                onClick={onOpenMLInfo}
                className="hover:text-[#173B57] transition-colors cursor-pointer text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200"
              >
                ML Validation
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSignIn}
              className="px-4 py-2 text-sm font-medium text-[#173B57] hover:bg-slate-100/80 rounded-xl transition-colors"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-12 pb-16 lg:pt-20 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-[#2563EB] border border-blue-200/60">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span>Official University Student Support Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-[#172033] tracking-tight leading-[1.12]">
            Your well-being <br className="hidden sm:inline" />
            <span className="text-[#173B57]">matters.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed font-normal">
            Get connected to the right university support when you need it.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-[#2563EB] text-white text-base font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Get started</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="text-sm text-[#64748B] flex items-center gap-1.5">
              <span>Already registered?</span>
              <button
                type="button"
                onClick={onSignIn}
                className="font-semibold text-[#173B57] hover:underline"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>

        {/* 3. Under-Hero Visual Journey Illustration */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="text-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Your Student Well-being Journey
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
              {journeySteps.map((step, idx) => (
                <div
                  key={step.title}
                  className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-8 h-8 rounded-full bg-[#173B57] text-white flex items-center justify-center text-xs font-bold font-heading mb-2">
                    {step.number}
                  </div>
                  <div className="text-sm font-semibold text-[#172033]">
                    {step.title}
                  </div>
                  <div className="text-xs text-[#64748B] mt-0.5 leading-snug">
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Never affects course registration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#16A34A]" />
                <span>Not a medical diagnosis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <h2 className="text-3xl font-bold font-heading text-[#172033]">
              How it works
            </h2>
            <p className="text-base text-[#64748B]">
              Four simple, stress-free steps designed to support your academic and personal life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide">
                Step 01
              </div>
              <h3 className="text-lg font-bold font-heading text-[#172033]">
                Check in
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Take a brief 3–5 minute check-in during or after registration. It asks simple questions about your sleep, workload, and campus life.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-[#16A34A] uppercase tracking-wide">
                Step 02
              </div>
              <h3 className="text-lg font-bold font-heading text-[#172033]">
                Understand
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Get an easy-to-read summary of your current well-being patterns with zero medical jargon or labels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#173B57] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-[#173B57] uppercase tracking-wide">
                Step 03
              </div>
              <h3 className="text-lg font-bold font-heading text-[#172033]">
                Get support
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Connect directly with university counsellors, explore study pacing guides, or join supportive campus peer circles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#F59E0B] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wide">
                Step 04
              </div>
              <h3 className="text-lg font-bold font-heading text-[#172033]">
                Follow up
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Stay supported throughout the academic term with gentle check-ins and straightforward progress reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why UniWell Section */}
      <section id="why-uniwell" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Built for Students
            </span>
            <h2 className="text-3xl font-bold font-heading text-[#172033]">
              Why universities choose UniWell
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed">
              Traditional university counselling services are often hard to find, intimidate students, or are only discovered during severe crises. UniWell integrates well-being directly into normal campus life.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#172033]">Proactive early connection</h4>
                  <p className="text-xs text-[#64748B]">Catch academic burnout and sleep deficits weeks before exams.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#172033]">Zero administrative friction</h4>
                  <p className="text-xs text-[#64748B]">Book, reschedule, or manage counselling in four simple taps.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#172033]">Caring, human professionals</h4>
                  <p className="text-xs text-[#64748B]">Technology coordinates the journey; licensed university counsellors provide the care.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="text-lg font-bold font-heading text-[#172033]">
              Student Well-being Snapshot
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B]">Screening completion time</div>
                  <div className="text-lg font-bold text-[#173B57] font-heading">3–5 minutes</div>
                </div>
                <div className="text-xs font-semibold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Quick & Simple
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B]">Average time to first support session</div>
                  <div className="text-lg font-bold text-[#173B57] font-heading">1.8 days</div>
                </div>
                <div className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Rapid Access
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B]">Confidentiality standard</div>
                  <div className="text-lg font-bold text-[#173B57] font-heading">Strict Institutional Privacy</div>
                </div>
                <div className="text-xs font-semibold text-slate-700 bg-slate-200/70 px-2.5 py-1 rounded-md">
                  Encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Support Options Section */}
      <section id="support-options" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <h2 className="text-3xl font-bold font-heading text-[#172033]">
              University support options
            </h2>
            <p className="text-base text-[#64748B]">
              Every student is different. Choose what feels most comfortable for your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-heading text-[#172033]">
                1-on-1 Counselling
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Meet with licensed university clinical and counselling psychologists via confidential video or in-person sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#173B57] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-heading text-[#172033]">
                Academic Pacing & Toolkit
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Self-paced somatic exercises, sleep optimization checklists, and study interval strategies tailored to your faculty.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-heading text-[#172033]">
                24/7 Crisis Support
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Instant access to toll-free crisis hotlines (SADAG 0800 567 567) and campus emergency protection services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Privacy Section */}
      <section id="privacy" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#173B57] text-white rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
              <Lock className="w-3.5 h-3.5" />
              <span>Institutional Privacy Commitment</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              Private. Safe. Protected.
            </h2>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Your responses help guide support options. They are strictly confidential, protected under university health privacy policies, and will never affect or block your academic registration.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Zero registration impact</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Encrypted records</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>No psychiatric diagnosis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call To Action Section */}
      <section className="py-16 bg-white border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-bold font-heading text-[#172033]">
            Take 3 minutes for yourself today
          </h2>
          <p className="text-base text-[#64748B]">
            Start your confidential check-in and explore the support your university has waiting for you.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
            >
              Get started now
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 text-[#173B57] text-sm font-semibold rounded-xl hover:bg-slate-200/80 transition-colors"
            >
              Sign in to your account
            </button>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-[#F8FAFC] border-t border-slate-200 py-10 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UniWellLogo size="sm" showSubtitle={false} />
            <span>© 2026 UniWell Student Support Portal.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onOpenPrivacy ? onOpenPrivacy : () => scrollTo('privacy')}
              className="hover:text-[#173B57] cursor-pointer"
            >
              Privacy & Clinical Limits
            </button>
            {onOpenMLInfo && (
              <button
                type="button"
                onClick={onOpenMLInfo}
                className="hover:text-[#173B57] cursor-pointer"
              >
                ML Validation Metrics
              </button>
            )}
            <button type="button" onClick={() => scrollTo('support-options')} className="hover:text-[#173B57] cursor-pointer">
              Support Services
            </button>
            <button type="button" onClick={onSignIn} className="hover:text-[#173B57] cursor-pointer">
              Counsellor Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
