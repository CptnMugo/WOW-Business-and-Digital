import React, { useState } from 'react';
import { NavTab } from '../types';
import { CONSULTING_SERVICES, BRAND_INFO } from '../data/companyData';
import { Briefcase, CheckCircle2, ShieldCheck, ArrowRight, Filter, Search, Sliders, RefreshCw, BarChart2, Zap, Layout, FileText, Send } from 'lucide-react';

interface ConsultingSectionProps {
  setActiveTab: (tab: NavTab) => void;
}

export const ConsultingSection: React.FC<ConsultingSectionProps> = ({ setActiveTab }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'additional'>('all');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<string | null>(null);

  const filteredServices = CONSULTING_SERVICES.filter(service => {
    if (activeCategory !== 'all' && service.category !== activeCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-blue-700 text-xs font-bold">
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>WOW Consulting Division</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Enterprise Transformation, PMO Governance & Advisory
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          We help complex organisations de-risk major digital investments, institute audit-proof PMO controls, and drive high-adoption operational change.
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-sky-50 text-slate-700 hover:bg-sky-100 border border-sky-100'
            }`}
          >
            All Services ({CONSULTING_SERVICES.length})
          </button>
          <button
            onClick={() => setActiveCategory('core')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'core'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-sky-50 text-slate-700 hover:bg-sky-100 border border-sky-100'
            }`}
          >
            Core Consulting
          </button>
          <button
            onClick={() => setActiveCategory('additional')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'additional'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-sky-50 text-slate-700 hover:bg-sky-100 border border-sky-100'
            }`}
          >
            Strategic Advisory & Audits
          </button>
        </div>

        {/* Sector dropdown filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Target Sector:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Sectors</option>
            {BRAND_INFO.sectors.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-blue-400/80"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  service.category === 'core'
                    ? 'bg-blue-500/10 text-blue-700 border border-blue-200'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {service.category === 'core' ? 'Core Service' : 'Advisory / Audit'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {service.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedServiceForInquiry(service.title)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Inquire About {service.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        ))}
      </div>

      {/* ADDITIONAL SERVICES LIST FROM BRIEF */}
      <div className="bg-gradient-to-tr from-sky-50 via-blue-50 to-indigo-50 text-slate-900 rounded-3xl p-8 sm:p-12 border border-sky-200 space-y-8 shadow-sm">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600">Targeted Advisory</div>
          <h2 className="text-3xl font-black text-slate-900">Additional Specialised Consulting Services</h2>
          <p className="text-xs text-slate-600">
            Providing tailored point-solutions for executive leadership, governance reviews, and project rescue.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h4 className="font-bold text-blue-700 text-sm">Business Process Improvement</h4>
            <p className="text-xs text-slate-600">Eliminating operational bottlenecks via Lean Six Sigma workflows.</p>
          </div>
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h4 className="font-bold text-blue-700 text-sm">Digital & AI Readiness Audits</h4>
            <p className="text-xs text-slate-600">Evaluating organisational capability before embarking on AI integration.</p>
          </div>
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h4 className="font-bold text-blue-700 text-sm">PMO Setup & Turnaround</h4>
            <p className="text-xs text-slate-600">Deploying structured PMOs in under 30 days with standardized RAID logs.</p>
          </div>
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h4 className="font-bold text-blue-700 text-sm">Project Recovery & Rescue</h4>
            <p className="text-xs text-slate-600">Rapid diagnostic and recovery plans for high-risk delayed initiatives.</p>
          </div>
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h4 className="font-bold text-blue-700 text-sm">Governance Reviews</h4>
            <p className="text-xs text-slate-600">Assurance audits ensuring regulatory and internal compliance.</p>
          </div>
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h4 className="font-bold text-blue-700 text-sm">Executive Dashboards</h4>
            <p className="text-xs text-slate-600">PowerBI and Tableau command centers for real-time portfolio metrics.</p>
          </div>
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h4 className="font-bold text-blue-700 text-sm">Grant & Impact Reporting</h4>
            <p className="text-xs text-slate-600">Rigorous donor M&E tracking and audit-ready impact briefs.</p>
          </div>
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h4 className="font-bold text-blue-700 text-sm">Strategy Development</h4>
            <p className="text-xs text-slate-600">3-year digital transformation blueprints for board-level approval.</p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => setActiveTab('contact')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-8 py-3.5 rounded-xl transition-colors shadow-md cursor-pointer"
          >
            Book Consulting Engagement
          </button>
        </div>
      </div>

      {/* SERVICE INQUIRY MODAL */}
      {selectedServiceForInquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Inquire: {selectedServiceForInquiry}</h3>
              <button 
                onClick={() => setSelectedServiceForInquiry(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Submit your project details to schedule a strategy call with a WOW Consulting Senior Director.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`Thank you! Your inquiry for ${selectedServiceForInquiry} has been received. Our team will contact you within 24 hours.`);
              setSelectedServiceForInquiry(null);
            }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Work Email</label>
                <input required type="email" placeholder="john@organisation.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Organisation & Sector</label>
                <input required type="text" placeholder="e.g. Ministry of Health / Private SME" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Brief Description of Need</label>
                <textarea rows={3} placeholder="Describe project scope, timeline, or key challenges..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Submit Consulting Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
