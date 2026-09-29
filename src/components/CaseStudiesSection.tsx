import React, { useState } from 'react';
import { NavTab } from '../types';
import { CASE_STUDIES } from '../data/companyData';
import { Award, CheckCircle2, Building, ShieldCheck, ArrowRight } from 'lucide-react';

interface CaseStudiesProps {
  setActiveTab: (tab: NavTab) => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesProps> = ({ setActiveTab }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filteredCaseStudies = CASE_STUDIES.filter(cs => {
    if (selectedFilter !== 'All' && cs.division !== selectedFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-100 border border-navy-300 text-navy-700 text-xs font-bold">
          <Award className="w-3.5 h-3.5 text-navy-600" />
          <span>Relevant Experience</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Experience behind our approach
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Anonymised examples of experience held by our team. These describe work in previous roles and do not imply that WOW contracted directly with those organisations.
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex justify-center gap-2">
        {['All', 'Consulting', 'AI Solutions'].map((divName) => (
          <button
            key={divName}
            onClick={() => setSelectedFilter(divName)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === divName
                ? 'bg-navy-600 text-white shadow-xs'
                : 'bg-navy-50 text-slate-700 hover:bg-navy-100 border border-navy-100'
            }`}
          >
            {divName === 'All' ? 'All Case Studies' : divName}
          </button>
        ))}
      </div>

      {/* CASE STUDIES CARDS */}
      <div className="grid lg:grid-cols-3 gap-8">
        {filteredCaseStudies.map((cs) => (
          <div
            key={cs.id}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 hover:border-navy-400"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-navy-100 text-navy-700 border border-navy-200">
                  {cs.clientSector}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {cs.division}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {cs.title}
              </h2>

              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">Operational Challenge:</strong>
                  <p className="text-slate-600 leading-relaxed">{cs.challenge}</p>
                </div>

                <div className="pt-2">
                  <strong className="text-slate-900 block font-bold mb-0.5">Relevant experience:</strong>
                  <p className="text-slate-600 leading-relaxed">{cs.solution}</p>
                </div>
              </div>

              {/* Impact Metrics Chip List */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Areas of experience:
                </div>
                <div className="space-y-1.5">
                  {cs.impactMetrics.map((metric, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-800 bg-emerald-50/60 border border-emerald-100 p-2 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('contact')}
              className="w-full bg-navy-50 hover:bg-navy-600 hover:text-white text-navy-700 font-bold text-xs py-3 rounded-xl border border-navy-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Request Similar Solution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
