import React, { useState, useRef } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Award, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck, 
  FileText, 
  Check, 
  CreditCard,
  Building2,
  HelpCircle,
  Percent,
  Download
} from 'lucide-react';
import { NavTab } from '../types';
import { BRAND_INFO } from '../data/companyData';

interface ProjectManagementCareerAcceleratorSectionProps {
  setActiveTab: (tab: NavTab) => void;
  onNavigateToContact?: (category?: any) => void;
}

export const ProjectManagementCareerAcceleratorSection: React.FC<ProjectManagementCareerAcceleratorSectionProps> = ({
  setActiveTab,
  onNavigateToContact
}) => {
  const applicationFormRef = useRef<HTMLDivElement>(null);

  const navigateToRegistration = () => {
    setActiveTab('pm-registration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-300">
      
      {/* ======================================================== */}
      {/* HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F9FF] via-[#E0F2FE] to-white text-slate-900 pt-12 pb-20 border-b border-sky-200">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          {/* Breadcrumb / Category Tag */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>WOW Academy • Professional Programs</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-black border border-amber-300/80 shadow-2xs">
              <Percent className="w-3.5 h-3.5" />
              <span>10% Early Settlement Offer Active</span>
            </span>
          </div>

          {/* Title & Core Positioning */}
          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Project Management <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 bg-clip-text text-transparent">
                Career Accelerator
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 font-medium leading-relaxed max-w-3xl">
              Practical training, supervised project work and career support over six months. Develop real deliverables, build communication skills and receive one-to-one coaching. References depend on genuine participation and performance.
            </p>
          </div>

          {/* Quick Spec Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl pt-2">
            <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-sky-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
                <Clock className="w-4 h-4" />
                <span>Duration</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">6 Months</div>
              <div className="text-[11px] text-slate-600">Weekly sessions + live labs</div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-sky-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
                <MapPin className="w-4 h-4" />
                <span>Delivery Mode</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">Hybrid / Virtual</div>
              <div className="text-[11px] text-slate-600">Live Virtual + Birmingham Labs</div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-sky-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
                <Briefcase className="w-4 h-4" />
                <span>Real Experience</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">Live Deliverables</div>
              <div className="text-[11px] text-slate-600">Genuine PM artefacts produced</div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-sky-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
                <Award className="w-4 h-4" />
                <span>Special Tuition</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">£900 Early Bird</div>
              <div className="text-[11px] text-emerald-700 font-bold">Save £100 by 31 Oct</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={navigateToRegistration}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-blue-500/20 flex items-center gap-2 cursor-pointer group"
            >
              <span>Apply for Next Intake</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('fees-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white hover:bg-sky-50 text-blue-700 font-bold text-sm px-5 py-3.5 rounded-xl border border-sky-200 shadow-2xs transition-colors flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>View Fees & Payment Plans</span>
            </button>

            <a
              href={`tel:${BRAND_INFO.phone}`}
              className="text-xs font-bold text-slate-600 hover:text-blue-700 flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-sky-50 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>Questions? Call: {BRAND_INFO.phone}</span>
            </a>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION: LEARN, WORK, EARN PILLARS */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider">
            <span>The Accelerator Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Learn, Work, Earn!
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Most training gives you theory and certificates. The WOW Career Accelerator bridges the gap to real-world employment with actual delivery experience and executive polish.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Pillar 1: LEARN */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                01
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                1. Learn
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Master industry-standard governance, frameworks and digital tooling. Move beyond textbook definitions into practical application.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Agile, Scrum & Waterfall hybrid delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Project Initiation Documentation (PID)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Business Case creation & justification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Budget forecasting & cost control</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Methodology &amp; Standards
            </div>
          </div>

          {/* Pillar 2: WORK */}
          <div className="bg-white rounded-3xl p-8 border border-blue-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
              Core Differentiator
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-lg group-hover:bg-sky-600 group-hover:text-white transition-colors">
                02
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                2. Work
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Work as a project manager on real client case studies and digital transformation initiatives. Produce artefacts you can discuss in interviews.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Active RAID log management & mitigation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Steering committee presentation decks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Change request impact assessments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Stakeholder communication under pressure</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-sky-700 uppercase tracking-wider">
              Real Workplace Immersion
            </div>
          </div>

          {/* Pillar 3: EARN */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                03
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                3. Earn
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Build confidence in interviews through practical experience, STAR preparation and coaching. References can reflect work you actually complete.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Evidence-backed CV & LinkedIn overhaul</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>STAR competency interview coaching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verifiable UK project manager reference</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct recruitment network exposure</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Career Transformation
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION: WHO THE PROGRAMME IS FOR */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 text-slate-900 rounded-3xl p-8 sm:p-12 border border-sky-200 space-y-8 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-black uppercase tracking-wider text-blue-700">Target Candidates</div>
            <h2 className="text-3xl font-black text-slate-900">Who This Accelerator Is Designed For</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We focus on candidates who have the drive, aptitude, and qualifications, but need workplace validation to break through the hiring barrier.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-sky-100 p-6 rounded-2xl space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <h3 className="font-bold text-slate-900 text-base">Qualified but Lacking Experience</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Individuals holding PRINCE2, Agile, APM, or PMP certificates who cannot get hired because job specifications demand 2-3 years of proven workplace experience.
              </p>
            </div>

            <div className="bg-white border border-sky-100 p-6 rounded-2xl space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                B
              </div>
              <h3 className="font-bold text-slate-900 text-base">First-Time PM &amp; PMO Seekers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Graduates, project co-ordinators, and junior business analysts aiming to make a definitive leap into full Project Manager or PMO Lead roles.
              </p>
            </div>

            <div className="bg-white border border-sky-100 p-6 rounded-2xl space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                C
              </div>
              <h3 className="font-bold text-slate-900 text-base">Interview Conversion Difficulties</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Candidates getting preliminary screenings and interviews, but falling short in competency rounds when asked for detailed real-world examples.
              </p>
            </div>

            <div className="bg-white border border-sky-100 p-6 rounded-2xl space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                D
              </div>
              <h3 className="font-bold text-slate-900 text-base">International PMs Entering UK</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Experienced professionals with overseas experience who want UK workplace culture orientation, local governance vocabulary, and a credible UK reference.
              </p>
            </div>

            <div className="bg-white border border-sky-100 p-6 rounded-2xl space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                E
              </div>
              <h3 className="font-bold text-slate-900 text-base">Career Changers &amp; Pivoters</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Professionals in retail, education, healthcare, banking or administration who want to move into project management.
              </p>
            </div>

            <div className="bg-white border border-sky-100 p-6 rounded-2xl space-y-2 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs">
                  F
                </div>
                <h3 className="font-bold text-slate-900 text-base">Corporate PMO Upskilling</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Employers wishing to upskill promising internal staff into robust delivery leads capable of managing cross-functional initiatives.
                </p>
              </div>
              <button
                onClick={navigateToRegistration}
                className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Check Your Eligibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION: 6-MONTH CURRICULUM TIMELINE */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider">
            <span>Structure &amp; Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The 6-Month Accelerator Journey
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Designed to fit around work and family commitments, with weekend masterclasses, weekday evening support, and real project deliverables.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Phase 1 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs">
              Months 1 &amp; 2
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Phase 1: Foundations, Governance &amp; PID
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deconstruct project charters, establish governance frameworks, and build initial project artefacts from live briefs.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <span>Project Initiation Documentation (PID) creation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <span>Work Breakdown Structures (WBS) &amp; critical path</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <span>Stakeholder mapping &amp; engagement matrices</span>
              </li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-extrabold text-xs">
              Months 3 &amp; 4
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Phase 2: Live Project Delivery &amp; RAID Mastery
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Step into active delivery mode. Manage scope changes, resolve project friction, facilitate standups, and deliver weekly flash reports.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                <span>Live dynamic RAID log facilitation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                <span>Change requests &amp; financial impact notes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                <span>Simulated steering committee defense sessions</span>
              </li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs">
              Months 5 &amp; 6
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Phase 3: Portfolio, Closure &amp; Interview Conversion
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete project closure, compile your evidence-backed project portfolio, and undergo intensive STAR interview coaching.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Lessons learned &amp; formal closure reporting</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Senior Director 1-on-1 mock interview panels</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Official WOW Business &amp; Digital reference</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION: TRANSPARENT FEES & 10% DISCOUNT CARD */}
      {/* ======================================================== */}
      <section id="fees-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#F8F4ED] via-white to-[#E9F5F5] text-slate-900 rounded-3xl p-8 sm:p-12 border border-sky-200 shadow-xl relative overflow-hidden">
          
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Offer Explanation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-black border border-amber-300 shadow-2xs">
                <Percent className="w-3.5 h-3.5" />
                <span>Early settlement option</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Transparent Investment &amp; <br />
                  Flexible Payment Pathways
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We believe in fair, accessible tuition for high-impact professional transformation. The £50 registration deposit is credited against tuition if your application is accepted and you continue. An early settlement rate is also available.
                </p>
              </div>

              {/* 3 Clear Options List */}
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-xs flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>10% Early Settlement Discount Rate</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Pay £900 in full by 31 October and save £100 off standard £1,000 tuition.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-emerald-600">£900</div>
                    <div className="text-[10px] line-through text-slate-400">£1,000</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-xs flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      <span>2-Stage Installment Plan</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      £500 paid by 31 October + £500 paid by 30 November. No interest.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-blue-600">2 × £500</div>
                    <div className="text-[10px] text-slate-500">Split payment</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-xs flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Reservation Holding Deposit</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      £50 registration deposit. Secures your place once your application is accepted. Non-refundable, but credited in full against your tuition fee when you continue onto the programme.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-amber-600">£50</div>
                    <div className="text-[10px] text-slate-500">Hold seat</div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                * Note: Full balance for all payment routes must be settled by 31 December.
              </div>
            </div>

            {/* Right: Instant Action Box */}
            <div className="lg:col-span-5 bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-sky-100">
              <div className="space-y-2 text-center">
                <span className="text-xs font-black uppercase tracking-wider text-blue-600">Programme Enrolment</span>
                <h3 className="text-2xl font-black text-slate-900">Ready to Accelerate?</h3>
                <p className="text-xs text-slate-600">
                  Fill out the 5-step registration form to secure your place in the upcoming intake.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-blue-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Application review</span>
                </div>
                <p>
                  We will review your application and contact you about the next steps, programme schedule and payment options.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={navigateToRegistration}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Complete Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Go to Payment Portal (Cards &amp; BACS)</span>
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-500">
                Direct bank transfer (UK Standard BACS) available with zero card processing fees.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION: REGISTRATION PORTAL CALL-TO-ACTION (FORM 4) */}
      {/* ======================================================== */}
      <section ref={applicationFormRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white via-sky-50/40 to-blue-50/70 rounded-3xl p-8 sm:p-12 border-2 border-blue-200 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider border border-blue-200">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Dedicated Registration Page</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Ready to Apply? Complete Registration
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Complete the dedicated application form to tell us about your goals and preferred payment route. Your place is subject to review and confirmation.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Apply for the programme</span>
                </div>
                <p className="text-slate-600">
                  Submit your details for review. No payment is taken when you complete the application form.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Choose a payment preference</span>
                </div>
                <p className="text-slate-600">
                  Tell us whether you prefer full payment, instalments or the £50 registration deposit after acceptance.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={navigateToRegistration}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 group"
              >
                <span>Open Registration Page</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('payments');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-sm px-6 py-4 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Go to Payments Portal</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION: FREQUENTLY ASKED QUESTIONS */}
      {/* ======================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about the Career Accelerator</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Can I participate while working full time?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes. The programme is specifically designed for working professionals. Core masterclasses and collaborative deliverable reviews occur on weekends and weekday evenings.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Do I get real work experience to put on my CV?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              You will create practical project deliverables such as plans, RAID logs and presentations. Client work depends on suitable opportunities and supervision; any reference will describe the work you actually complete.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>How does the 10% Early Settlement Discount work?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The early settlement price is £900 if paid in full by 31 October 2026. You can also discuss a £500 + £500 instalment plan.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>What if I live outside Birmingham?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All masterclasses and live lab sessions are delivered virtually with interactive breakout rooms. In-person workshops in Birmingham are optional or hybrid-streamed.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
