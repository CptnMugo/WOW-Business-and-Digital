import React, { useState } from 'react';
import { NavTab } from '../types';
import { BRAND_INFO, AI_PRODUCTS, CONSULTING_SERVICES } from '../data/companyData';
import { Sparkles, ArrowRight, CheckCircle2, Briefcase, Cpu, GraduationCap, Box, Users, Shield, TrendingUp, ChevronRight, Award, MessageSquare } from 'lucide-react';

interface HomeSectionProps {
  setActiveTab: (tab: NavTab) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ setActiveTab }) => {
  const [selectedSector, setSelectedSector] = useState<string>('Healthcare');
  const [quickPrompt, setQuickPrompt] = useState('');

  const handleRunAssistantDemo = (promptText: string) => {
    setActiveTab('wow-assistant');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION - Crisp Ice Light Blue */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F4ED] via-[#E9F5F5] to-white text-slate-900 pt-16 pb-24 border-b border-sky-200">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-300/40 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-200/50 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-blue-700 text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>WOW Business and Digital Ltd</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none font-sans">
              Transforming Organisations. <br />
              <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
                Empowering People.
              </span> <br />
              Building Intelligent Solutions.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Your strategic partner for <strong className="text-blue-700">Business Transformation</strong>, <strong className="text-blue-700">Digital Innovation</strong>, and specialised <strong className="text-blue-700">AI Solutions</strong> across Africa and international markets.
            </p>

            {/* Quick CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab('wow-assistant')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-7 py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore WOW AI Assistants</span>
              </button>

              <button
                onClick={() => setActiveTab('consulting')}
                className="w-full sm:w-auto bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>WOW Consulting Services</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>

            {/* Sub-tagline pills */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700">
              <span className="bg-white/90 px-3 py-1.5 rounded-lg border border-sky-200 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Programme & PMO Governance
              </span>
              <span className="bg-white/90 px-3 py-1.5 rounded-lg border border-sky-200 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Domain AI Assistants
              </span>
              <span className="bg-white/90 px-3 py-1.5 rounded-lg border border-sky-200 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> WOW Academy Leadership
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">50+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enterprise Transformations</div>
          </div>
          <div className="space-y-1 border-l border-slate-200 pl-4">
            <div className="text-3xl sm:text-4xl font-black text-blue-600">80%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin Time Saved via AI</div>
          </div>
          <div className="space-y-1 border-l sm:border-l-0 lg:border-l border-slate-200 pl-4">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">6 Weeks</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average PMO Setup</div>
          </div>
          <div className="space-y-1 border-l border-slate-200 pl-4">
            <div className="text-3xl sm:text-4xl font-black text-blue-600">Global</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Africa & International Scope</div>
          </div>
        </div>
      </section>

      {/* FOUR DIVISIONS OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600">Core Capabilities</div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Our Business Divisions</h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            Combining deep management consulting expertise, practical domain AI models, and workforce training.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Division 1: WOW Consulting */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-blue-600 flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">WOW Consulting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Programme & Project Management, PMO Setup, Operational Readiness, Digital Transformation, and Governance Assurance.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> PMO & Portfolio Setup
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Change Management
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Benefits Realisation
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('consulting')}
              className="mt-6 font-bold text-xs text-slate-900 hover:text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              <span>Explore Consulting</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Division 2: WOW AI Solutions */}
          <div className="bg-gradient-to-tr from-sky-50 via-blue-50 to-indigo-50 text-slate-900 border border-sky-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-200/40 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">WOW AI Solutions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialised AI Assistants for Business, Agribusiness (Farm), NGOs & Grants, Schools, and Faith Organisations.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-sky-200">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> WOW Business Assistant
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> WOW Farm Assistant
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> WOW NGO Assistant
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('ai-solutions')}
              className="mt-6 font-bold text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform relative z-10 cursor-pointer"
            >
              <span>View AI Suite</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Division 3: WOW Academy */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-blue-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">WOW Academy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Professional training in PMO, AI for Business, Graduate Work Experience, Leadership & Career Coaching.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> PM & PMO Masterclasses
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Graduate Placement
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Executive Coaching
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('academy')}
              className="mt-6 font-bold text-xs text-slate-900 hover:text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              <span>Explore Courses</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Division 4: Products & Toolkits */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-blue-600 flex items-center justify-center font-bold">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Products & Toolkits</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ready-to-deploy RAID Toolkits, Benefits Trackers, Readiness Packs, and Business & Farm Management Templates.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> RAID Toolkit Pro
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Benefits Tracker
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Governance Pack
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="mt-6 font-bold text-xs text-slate-900 hover:text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              <span>Browse Toolkits</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* TARGET SECTORS STRIP */}
      <section className="bg-slate-100 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600">Tailored Solutions</div>
            <h2 className="text-2xl font-bold text-slate-900">Serving Diverse Sectors Across Africa & Globally</h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {BRAND_INFO.sectors.map((sector) => {
              const isSelected = selectedSector === sector;
              return (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {sector}
                </button>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-3xl mx-auto shadow-sm text-center">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Customised Consulting & AI Frameworks for {selectedSector}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We design specialised PMO governance, operational readiness assessments, and vertical AI models tailored specifically to compliance, stakeholder expectations, and operational realities in <strong>{selectedSector}</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE AI SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 text-slate-900 rounded-3xl p-8 sm:p-12 border border-sky-200 shadow-xl relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Interactive Live AI Demo</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Experience WOW AI Assistants in Action
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select your industry assistant and test real-time AI reasoning powered by Google Gemini. From PMO RAID logs to NGO grant reporting and agribusiness yield advice.
              </p>
              <div className="flex flex-wrap gap-2 text-xs pt-2">
                <span className="bg-white text-blue-700 font-semibold px-3 py-1 rounded-lg border border-sky-200 shadow-xs">WOW Business Assistant</span>
                <span className="bg-white text-blue-700 font-semibold px-3 py-1 rounded-lg border border-sky-200 shadow-xs">WOW Farm Assistant</span>
                <span className="bg-white text-blue-700 font-semibold px-3 py-1 rounded-lg border border-sky-200 shadow-xs">WOW NGO Assistant</span>
              </div>
            </div>

            {/* Interactive Widget Box */}
            <div className="bg-white border border-sky-200 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-xs font-bold text-slate-900">WOW Assistant Sandbox</span>
                </div>
                <span className="text-[10px] uppercase font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">
                  Gemini Server AI
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Click a prompt below to launch the dedicated Assistant Sandbox:
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => handleRunAssistantDemo("Draft a RAID log for a Healthcare digital transformation project")}
                  className="w-full text-left bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200 p-3 rounded-xl text-xs text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span>"Draft a RAID log for a Healthcare project"</span>
                  <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleRunAssistantDemo("Create an NGO Grant Impact Reporting metric framework")}
                  className="w-full text-left bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200 p-3 rounded-xl text-xs text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span>"Create an NGO Grant Impact Reporting metric framework"</span>
                  <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleRunAssistantDemo("Give agribusiness advice for maize crop yield optimization in Zimbabwe")}
                  className="w-full text-left bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200 p-3 rounded-xl text-xs text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span>"Agribusiness advice for maize yield optimization"</span>
                  <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <button
                onClick={() => setActiveTab('wow-assistant')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Full WOW AI Playground</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 text-slate-900 rounded-3xl p-10 sm:p-14 border border-sky-200 shadow-sm space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Ready to Transform Your Organisation?
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Schedule a Digital & AI Readiness Assessment with WOW Consulting or explore custom enterprise deployment of WOW Assistants.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setActiveTab('contact')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Book Strategy Call
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-8 py-3.5 rounded-xl border border-slate-300 transition-colors shadow-xs cursor-pointer"
            >
              Explore Toolkits & Packs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
