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
          About WOW Business &amp; Digital
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          We lead transformation, service redesign and programme delivery, drawing on specialist associates to meet each client's needs.
        </p>
      </div>

      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-2xl font-extrabold text-slate-900">Our background and experience</h2>
        <p className="text-sm leading-relaxed text-slate-700">WOW Business &amp; Digital combines consultancy and delivery experience with digital solutions, staffing and training. Our work is grounded in understanding organisations, engaging the people affected by change and turning plans into practical delivery.</p>
        <p className="text-sm leading-relaxed text-slate-700">Programme and project lead Rennie Mudzi brings experience across healthcare, health and social care and wider public service transformation. Her work has included digital care systems, electronic patient records, operational readiness, integrated planning, governance and stakeholder engagement. Previous roles inform our approach; they are not presented as contracts awarded to WOW.</p>
        <p className="text-sm leading-relaxed text-slate-700">For broader commissions, we shape a multidisciplinary team around the brief. Depending on the work, associates may contribute expertise in technology and AI, finance and commercial strategy, procurement, people and HR, communications and other business functions. WOW leads the programme and coordinates the specialists, with roles, availability and responsibilities agreed for each engagement.</p>
        <p className="text-sm leading-relaxed text-slate-700">We are developing partnerships and opportunities in Zimbabwe alongside our broader consultancy and digital work. Specific local services and forms will be added as they are ready.</p>
        <button onClick={() => setActiveTab('case-studies')} className="text-blue-700 font-bold text-sm underline cursor-pointer">Explore experience examples</button>
      </section>

      <section className="bg-sky-50 rounded-3xl p-8 sm:p-10 border border-sky-200 space-y-5">
        <h2 className="text-2xl font-extrabold text-slate-900">One coordinated team for complex change</h2>
        <p className="text-sm leading-relaxed text-slate-700">We start with the service challenge, agree the outcomes and assemble the right mix of delivery and functional expertise. Together with client teams, we redesign processes and digital workflows, introduce new ways of working, strengthen capability and track the benefits beyond implementation.</p>
        <p className="text-sm leading-relaxed text-slate-700">This approach supports a defined project, an interim leadership need or a wider tender requiring several disciplines. Each proposal sets out the people, responsibilities, deliverables and governance for that particular commission.</p>
        <button onClick={() => setActiveTab('contact')} className="text-blue-700 font-bold text-sm underline cursor-pointer">Discuss a programme or tender</button>
      </section>

      {/* VISION & PURPOSE CARDS */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-[#E8F3F4] via-[#F3F9F8] to-white text-[#081D3D] rounded-3xl p-8 border-2 border-[#B9D9DF] shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#081D3D]">Our Vision</h2>
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
      <div className="bg-gradient-to-r from-[#FFF4DE] via-[#FFF9F0] to-[#EAF3F6] rounded-3xl p-8 sm:p-12 border border-[#E8CF9F] space-y-6 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">International connections</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our developing Zimbabwe work creates opportunities for relevant partnerships, local programmes and practical digital solutions. Contact us to discuss a specific opportunity.
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
