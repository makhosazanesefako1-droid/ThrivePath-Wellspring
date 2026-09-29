import React from 'react';
import { ThriveLogo } from './ThriveLogo.tsx';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Heart,
  Calendar,
  Activity,
  User,
  Clock,
  Brain,
  ChevronRight,
  BarChart3,
} from 'lucide-react';

interface PublicLandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onOpenScreening: () => void;
  onOpenPrivacy?: () => void;
  onOpenMLInfo?: () => void;
  onViewEvidenceDashboard?: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onOpenScreening,
  onOpenPrivacy,
  onOpenMLInfo,
  onViewEvidenceDashboard,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F9F5] text-[#132E24] font-body selection:bg-emerald-100 selection:text-[#0B3B2C]">
      {/* 1. TOP HEADER (matching Screenshot 1) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center text-left"
          >
            <ThriveLogo size="md" textColor="text-[#0B3B2C]" />
          </button>

          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
            <button
              type="button"
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-[#0B3B2C] transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => {
                if (onViewEvidenceDashboard) {
                  onViewEvidenceDashboard();
                } else {
                  scrollTo('evidence');
                }
              }}
              className="hover:text-[#0B3B2C] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Evidence</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">3k records</span>
            </button>
            <button
              type="button"
              onClick={onOpenPrivacy ? onOpenPrivacy : () => scrollTo('privacy')}
              className="hover:text-[#0B3B2C] transition-colors cursor-pointer"
            >
              Privacy
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSignIn}
              className="px-4 py-2 text-sm font-medium text-[#0B3B2C] bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 shadow-2xs"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Student sign in</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (matching Screenshot 1) */}
      <section className="pt-12 pb-16 lg:pt-16 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DEF7EC] text-[#084E34]">
              <span className="w-2 h-2 rounded-full bg-[#084E34]" />
              <span>BUILT FOR SOUTH AFRICAN CAMPUSES</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-[#0A2E23] tracking-tight leading-[1.05]">
              Support <br />
              students before <br />
              crisis.
            </h1>

            <p className="text-lg text-[#2C4A3E] max-w-xl leading-relaxed">
              A private wellbeing check embedded in registration—turning early stress indicators into timely, human support.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onOpenScreening}
                className="px-6 py-3.5 bg-[#0B3B2C] hover:bg-[#07291F] text-white font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start private check-in</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('how-it-works')}
                className="px-6 py-3.5 bg-white border border-slate-200 text-[#0B3B2C] font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
              >
                Explore the journey
              </button>
            </div>

            {/* Trust Row */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#2C4A3E]">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#0B3B2C]" />
                <span>Confidential by design</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B3B2C]" />
                <span>Never blocks registration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#0B3B2C]" />
                <span>Human care stays central</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Mockup of Student Home (matching Screenshot 1) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-lg relative">
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  STUDENT HOME
                </span>
                <div className="w-9 h-9 rounded-full bg-[#D1F2E2] text-[#0A5737] font-semibold text-sm flex items-center justify-center">
                  LM
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#0A2E23] mb-4">
                Good evening, Lethabo
              </h2>

              {/* Wellbeing Pulse Card */}
              <div className="bg-[#0B3B2C] text-white p-5 rounded-xl mb-3 shadow-xs">
                <div className="flex items-center justify-between text-emerald-200 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    YOUR WELLBEING PULSE
                  </span>
                  <Activity className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="text-4xl font-extrabold text-white mb-1.5 tracking-tight tabular-nums">
                  72<span className="text-xl font-normal text-emerald-200">/100</span>
                </div>
                <div className="text-xs text-emerald-100/90">
                  A little stretched. Your next check-in is ready.
                </div>
              </div>

              {/* Two Info Cards Row */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-[#DEF5F8] p-3.5 rounded-xl text-[#0E4B56]">
                  <Clock className="w-4 h-4 text-[#0E4B56] mb-1.5" />
                  <div className="text-[11px] text-[#387680]">Sleep pattern</div>
                  <div className="text-sm font-bold text-[#0E4B56] mt-0.5">6h average</div>
                </div>

                <div className="bg-[#FEEBE8] p-3.5 rounded-xl text-[#78281F]">
                  <Brain className="w-4 h-4 text-[#78281F] mb-1.5" />
                  <div className="text-[11px] text-[#9E4B41]">Primary indicator</div>
                  <div className="text-sm font-bold text-[#78281F] mt-0.5">Academic load</div>
                </div>
              </div>

              {/* Next support session */}
              <div className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E2F7EC] text-[#0A5737] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Next support session</div>
                    <div className="text-sm font-bold text-[#0A2E23]">Wed, 14:00 · Video</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DARK GREEN CONNECTED CARE JOURNEY (matching Screenshot 2) */}
      <section id="how-it-works" className="py-20 bg-[#08281D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-2">
                ONE CONNECTED CARE JOURNEY
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white max-w-xl">
                From a quiet signal to the right support.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-emerald-100/80 max-w-md">
              The system detects patterns and guides action. Qualified professionals remain responsible for care.
            </p>
          </div>

          {/* 4 Connected Process Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="bg-[#0E3527]/90 border border-emerald-800/60 p-6 rounded-xl relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#07241A] text-emerald-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-emerald-600/40">01</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">Check in</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                A short, private screening
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0E3527]/90 border border-emerald-800/60 p-6 rounded-xl relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#07241A] text-emerald-400 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-emerald-600/40">02</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">Understand</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Patterns, not a diagnosis
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0E3527]/90 border border-emerald-800/60 p-6 rounded-xl relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#07241A] text-emerald-400 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-emerald-600/40">03</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">Get support</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Matched university resources
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#0E3527]/90 border border-emerald-800/60 p-6 rounded-xl relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#07241A] text-emerald-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-emerald-600/40">04</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">Follow up</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                A check-in that closes the loop
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BUILT ON EVIDENCE SECTION (matching Screenshot 3) */}
      <section id="evidence" className="py-20 bg-[#F2F9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
                BUILT ON EVIDENCE
              </div>
              <h2 className="text-3xl font-bold font-heading text-[#0A2E23] leading-tight">
                The gap is not awareness. <br />
                It is early connection.
              </h2>
              <p className="text-sm text-[#355246] leading-relaxed">
                South African students face substantial wellbeing pressure, yet support often begins only after they ask for help. ThrivePath meets students inside a process they already complete.
              </p>

              {onViewEvidenceDashboard && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onViewEvidenceDashboard}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0B3B2C] bg-white border border-emerald-200 px-4 py-2.5 rounded-lg shadow-2xs hover:bg-emerald-50 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <span>View Interactive Dataset Dashboard & Graphs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 3 Metric Cards with dark green top border */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-b-xl border-t-4 border-[#0B3B2C] shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-[#0B3B2C] tabular-nums">37.1%</div>
                  <div className="text-xs font-semibold text-[#0A2E23] mt-2 mb-6">
                    reported anxiety disorders
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">National survey</div>
              </div>

              <div className="bg-white p-6 rounded-b-xl border-t-4 border-[#0B3B2C] shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-[#0B3B2C] tabular-nums">24.4%</div>
                  <div className="text-xs font-semibold text-[#0A2E23] mt-2 mb-6">
                    reported recent suicidal ideation
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">National survey</div>
              </div>

              <div className="bg-white p-6 rounded-b-xl border-t-4 border-[#0B3B2C] shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-[#0B3B2C] tabular-nums">3,000</div>
                  <div className="text-xs font-semibold text-[#0A2E23] mt-2 mb-6">
                    student records analysed
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">Project dataset</div>
              </div>
            </div>
          </div>

          {/* Dataset 4-Statistic Association Row */}
          <div className="pt-8 border-t border-slate-200/80">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs font-medium text-slate-700">Screen time</div>
                <div className="text-2xl font-extrabold text-[#0D6E57] mt-0.5 tabular-nums">+0.49</div>
                <div className="text-[11px] text-slate-500 mt-0.5">strongest positive association</div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-700">Family support</div>
                <div className="text-2xl font-extrabold text-[#0D6E57] mt-0.5 tabular-nums">-0.40</div>
                <div className="text-[11px] text-slate-500 mt-0.5">strong protective association</div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-700">Exam frequency</div>
                <div className="text-2xl font-extrabold text-[#0D6E57] mt-0.5 tabular-nums">+0.38</div>
                <div className="text-[11px] text-slate-500 mt-0.5">academic pressure signal</div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-700">Sleep hours</div>
                <div className="text-2xl font-extrabold text-[#0D6E57] mt-0.5 tabular-nums">-0.24</div>
                <div className="text-[11px] text-slate-500 mt-0.5">lower sleep, higher stress</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 mt-6">
              Dataset associations are descriptive and do not establish causation.
            </div>
          </div>
        </div>
      </section>

      {/* 5. SAFETY IS A SYSTEM REQUIREMENT (matching Screenshot 4) */}
      <section id="privacy" className="py-20 bg-[#F2F9F5] border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <ShieldCheck className="w-10 h-10 text-[#0B3B2C]" />
              <h2 className="text-3xl font-bold font-heading text-[#0A2E23] leading-tight">
                Safety is a system requirement.
              </h2>
            </div>

            {/* 2x2 Grid of White Rounded Cards with checkmarks */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#0B3B2C] shrink-0" />
                <span className="text-xs font-semibold text-slate-800">
                  Results never prevent registration
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#0B3B2C] shrink-0" />
                <span className="text-xs font-semibold text-slate-800">
                  No diagnosis or suicide prediction
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#0B3B2C] shrink-0" />
                <span className="text-xs font-semibold text-slate-800">
                  Sensitive records are access-controlled
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#0B3B2C] shrink-0" />
                <span className="text-xs font-semibold text-slate-800">
                  High concern opens a human support pathway
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER (matching Screenshot 4) */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 pb-10 border-b border-slate-100">
            <div className="max-w-sm space-y-2">
              <ThriveLogo size="md" textColor="text-[#0B3B2C]" />
              <p className="text-xs text-slate-500 leading-relaxed pt-2">
                Connected university wellbeing, from early screening to human support and follow-up.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs">
              <div>
                <div className="font-bold text-slate-900 mb-3">Explore</div>
                <ul className="space-y-2 text-slate-500">
                  <li>
                    <button type="button" onClick={() => scrollTo('how-it-works')} className="hover:text-[#0B3B2C] cursor-pointer">
                      How it works
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        if (onViewEvidenceDashboard) onViewEvidenceDashboard();
                        else scrollTo('evidence');
                      }}
                      className="hover:text-[#0B3B2C] cursor-pointer"
                    >
                      Evidence
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={onOpenScreening} className="hover:text-[#0B3B2C] cursor-pointer">
                      Live student portal
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-3">Principles</div>
                <ul className="space-y-2 text-slate-500">
                  <li>
                    <button type="button" onClick={onOpenPrivacy ? onOpenPrivacy : () => scrollTo('privacy')} className="hover:text-[#0B3B2C] cursor-pointer">
                      Privacy and safety
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={onSignIn} className="hover:text-[#0B3B2C] cursor-pointer">
                      Student sign in
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>© 2026 ThrivePath</div>
            <div>Screening supports care. It does not replace a qualified professional.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
