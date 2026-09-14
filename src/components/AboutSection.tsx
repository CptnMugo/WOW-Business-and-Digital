import React from 'react';
import { NavTab } from '../types';
import { BRAND_INFO } from '../data/companyData';
import { Sparkles, Globe, Shield, Award, Users, Target, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  setActiveTab: (tab: NavTab) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About WOW Business and Digital Ltd</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Empowering Organisations & Communities Through Intelligent Leadership
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          {BRAND_INFO.positioning}
        </p>
      </div>

      {/* VISION & PURPOSE CARDS */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white text-slate-900 rounded-3xl p-8 border-2 border-emerald-200/80 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-emerald-950">Our Vision</h2>
          <p className="text-slate-700 text-sm leading-relaxed font-medium">
            "{BRAND_INFO.vision}"
          </p>
          <div className="pt-4 border-t border-emerald-200/60 flex items-center gap-2 text-xs text-emerald-800 font-bold">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Global reach</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-blue-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Our Strategic Purpose</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {BRAND_INFO.purpose}
          </p>
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-700 font-semibold">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Evidence-Based & Audit-Proof Delivery</span>
          </div>
        </div>
      </div>

      {/* BRAND PERSONALITY VALUES */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600">Guiding Ethos</div>
          <h2 className="text-3xl font-black text-slate-900">Brand Personality & Core Values</h2>
          <p className="text-slate-600 text-xs max-w-xl mx-auto">
            Our values guide every consulting engagement, AI model training pipeline, and academy programme.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BRAND_INFO.personality.map((val, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 hover:border-blue-400 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 font-bold flex items-center justify-center text-sm">
                0{idx + 1}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{val}</h3>
              <p className="text-xs text-slate-500">
                Upholding strict standard of excellence in every deliverable and client interaction.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* REGIONAL FOOTPRINT */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 rounded-3xl p-8 sm:p-12 border border-sky-200 space-y-6 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">Serving African & International Markets</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            From London to Harare, Nairobi, and Johannesburg, WOW Business and Digital Ltd partners with local and international stakeholders to build scalable infrastructure, upskill workforce talent, and launch localized AI solutions.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('contact')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
