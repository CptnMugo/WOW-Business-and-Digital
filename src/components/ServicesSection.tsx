import React from 'react';
import { NavTab } from '../types';
import { CORE_FIVE_SERVICES, ADDITIONAL_SUPPORT } from '../data/companyData';
import { TrendingUp, Users, GraduationCap, Sparkles, Briefcase, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

interface ServicesSectionProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ activeTab, setActiveTab }) => {
  // Determine if specific sub-service is requested
  const selectedService = [...CORE_FIVE_SERVICES, ...ADDITIONAL_SUPPORT].find(s => s.tabId === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* SECTION HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-500/10 text-navy-700 text-xs font-bold border border-navy-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>WHAT WE DO</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Services shaped around the change you need to make
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          From evidence and diagnosis through redesign, delivery and adoption, WBD leads the work and brings in relevant specialists when a commission needs several disciplines.
        </p>
      </div>

      {/* SERVICE DIVISION NAV TABS */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'services'
              ? 'bg-[#0B2D5B] text-white shadow-xs'
              : 'bg-navy-50 text-slate-700 hover:bg-navy-100 border border-navy-200'
          }`}
        >
          All Services
        </button>

        {CORE_FIVE_SERVICES.map((s) => {
          const isActive = activeTab === s.tabId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.tabId as NavTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#0B2D5B] text-white font-black shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {s.id === 'business-consultancy' && <TrendingUp className="w-3.5 h-3.5" />}
              {s.id === 'staffing' && <Users className="w-3.5 h-3.5" />}
              {s.id === 'training' && <GraduationCap className="w-3.5 h-3.5" />}
              {s.id === 'ai-solutions' && <Sparkles className="w-3.5 h-3.5" />}
              {s.id === 'programme-delivery' && <Layers className="w-3.5 h-3.5" />}
              <span>{s.shortNavTitle}</span>
            </button>
          );
        })}
      </div>

      {/* FOCUSED SINGLE SERVICE VIEW (IF SUB-TAB SELECTED) */}
      {selectedService ? (
        <div className="space-y-12 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#F8F4ED] via-white to-[#E9F5F5] text-slate-900 rounded-3xl p-8 lg:p-12 border border-navy-200 shadow-sm space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 text-navy-700 text-xs font-bold border border-navy-300">
              <span>Service Focus</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">{selectedService.title}</h2>
            <p className="text-slate-600 text-base max-w-3xl leading-relaxed">{selectedService.description}</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {selectedService.subOfferings.map((offering, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-navy-100 flex items-start gap-3 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-navy-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-slate-800">{offering}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-navy-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-900">Who we help:</span> {selectedService.audience}
              </div>
              
              <button
                onClick={() => setActiveTab('contact')}
                className="bg-[#0B2D5B] hover:bg-[#173B63] text-white font-black text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Discuss this service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* CORE SERVICES GRID */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CORE_FIVE_SERVICES.map((service, index) => (
            <div 
              key={service.id}
              className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-navy-700" aria-hidden="true">0{index + 1}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-navy-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {service.description}
                  </p>
                  {service.id === 'training' && (
                    <p className="text-sm sm:text-base font-black text-emerald-600 tracking-tight pt-1">
                      Explore the Career Accelerator separately
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Typical support:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {service.subOfferings.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-navy-500 shrink-0"></span>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab(service.tabId as NavTab)}
                  className="text-xs font-extrabold text-slate-900 hover:text-navy-600 flex items-center gap-1 transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveTab('contact')}
                  className="text-xs font-bold bg-navy-100 text-navy-700 hover:bg-[#173B63] hover:text-white px-3.5 py-1.5 rounded-lg border border-navy-200 transition-colors cursor-pointer"
                >
                  Enquire
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'staffing' || activeTab === 'services') && <section className="rounded-2xl bg-white border border-navy-200 p-7 space-y-3">
        <h2 className="text-2xl font-bold">Bring your expertise to the WBD associate network</h2>
        <p>We welcome expressions of interest from experienced specialists who can contribute to multidisciplinary delivery.</p>
        <a href="?page=associates" className="inline-block bg-navy-600 hover:bg-navy-700 text-white rounded-xl px-5 py-3 font-bold">Become an Associate</a>
      </section>}
      {/* BOTTOM CONSULTATION CTA */}
      <div className="bg-gradient-to-r from-[#F8F4ED] via-white to-[#E9F5F5] text-slate-900 rounded-3xl p-8 sm:p-10 border border-navy-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-black text-slate-900">Need support across several disciplines?</h3>
          <p className="text-xs text-slate-600 max-w-xl">
            WBD leads the commission and agrees the right team, scope, responsibilities and outcomes with you.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('contact')}
          className="bg-[#0B2D5B] hover:bg-[#173B63] text-white font-black text-xs px-6 py-3.5 rounded-xl shadow-md shrink-0 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Discuss your project</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
