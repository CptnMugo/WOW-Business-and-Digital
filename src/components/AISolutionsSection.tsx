import React from 'react';
import { NavTab } from '../types';
import { AI_PRODUCTS } from '../data/companyData';
import { Cpu, Sparkles, CheckCircle2, ArrowRight, MessageSquare, Wheat, HeartHandshake, GraduationCap, Church, Briefcase, Globe, PieChart } from 'lucide-react';

interface AISolutionsProps {
  setActiveTab: (tab: NavTab) => void;
}

export const AISolutionsSection: React.FC<AISolutionsProps> = ({ setActiveTab }) => {
  const currentProducts = AI_PRODUCTS.filter(p => p.type === 'current');
  const futureProducts = AI_PRODUCTS.filter(p => p.type === 'future');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-navy-600" />;
      case 'Wheat': return <Wheat className="w-6 h-6 text-navy-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-navy-600" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-navy-600" />;
      case 'Church': return <Church className="w-6 h-6 text-navy-600" />;
      case 'Globe': return <Globe className="w-6 h-6 text-navy-600" />;
      case 'PieChart': return <PieChart className="w-6 h-6 text-navy-600" />;
      default: return <Cpu className="w-6 h-6 text-navy-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-100 border border-navy-300 text-navy-700 text-xs font-bold">
          <Cpu className="w-3.5 h-3.5" />
          <span>DIGITAL ADOPTION & PRACTICAL AI</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Start with the workflow. Choose technology that helps.
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          We help organisations understand where digital tools and carefully governed AI can improve work, then support the people and processes needed to use them well. The examples below are demonstrations to explore, not deployed client products.
        </p>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setActiveTab('wow-assistant')}
            className="bg-navy-600 hover:bg-navy-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Explore the AI demonstration</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* CURRENT PRODUCTS GRID */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Illustrative AI assistant concepts</h2>
            <p className="text-xs text-slate-500">Examples for discussion and testing; scope and suitability depend on your organisation.</p>
          </div>
          <span className="bg-emerald-500/10 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pilot demonstration
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col justify-between group hover:border-navy-300 hover:shadow-lg transition-all relative overflow-hidden"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center font-bold">
                    {getIcon(prod.iconName)}
                  </div>
                  <span className="text-[10px] uppercase font-mono bg-navy-100 text-navy-700 border border-navy-200 px-2.5 py-0.5 rounded-full font-bold">
                    {prod.targetSector.split(',')[0]}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-navy-600 transition-colors">
                    {prod.name}
                  </h3>
                  <div className="text-xs font-semibold text-navy-700 mt-0.5">
                    {prod.tagline}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {prod.description}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Potential uses to explore:</div>
                  {prod.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-navy-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('wow-assistant')}
                className="mt-6 w-full bg-navy-50 hover:bg-navy-600 hover:text-white text-navy-700 font-bold text-xs py-2.5 rounded-xl border border-navy-200 transition-colors flex items-center justify-center gap-2 relative z-10 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Explore demonstration</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FUTURE INNOVATIONS ROADMAP FROM BRIEF */}
      <div className="bg-navy-50/60 rounded-3xl p-8 sm:p-12 border border-navy-100 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-navy-600">Product Pipeline</div>
          <h2 className="text-3xl font-black text-slate-900">Further ideas for exploration</h2>
          <p className="text-xs text-slate-600">
            Other sector ideas can be explored with clients and partners when there is a clear need.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {futureProducts.map((fut) => (
            <div key={fut.id} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-100 text-navy-600 flex items-center justify-center font-bold">
                {getIcon(fut.iconName)}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{fut.name}</h3>
              <p className="text-xs text-slate-600">{fut.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] font-bold uppercase text-navy-600">
                <Sparkles className="w-3 h-3" /> Concept
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
