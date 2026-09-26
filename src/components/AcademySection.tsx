import React, { useState } from 'react';
import { NavTab } from '../types';
import { ACADEMY_PROGRAMS } from '../data/companyData';
import { GraduationCap, CheckCircle2, Clock, Users, BookOpen, Send, Sparkles, Award } from 'lucide-react';

interface AcademySectionProps {
  setActiveTab: (tab: NavTab) => void;
}

export const AcademySection: React.FC<AcademySectionProps> = ({ setActiveTab }) => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-blue-700 text-xs font-bold">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          <span>WOW Academy Division</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Workforce Upskilling, PMO Leadership & Graduate Placement
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Empowering the next generation of project managers, AI leaders, and corporate directors through hands-on masterclasses, work experience placements, and executive coaching.
        </p>
      </div>

      {/* TRAINING OFFERINGS GRID */}
      <div className="grid md:grid-cols-2 gap-8">
        {ACADEMY_PROGRAMS.map((prog) => (
          <div
            key={prog.id}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group hover:border-blue-400"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 border border-blue-200">
                  {prog.type === 'training' ? 'Masterclass' : prog.type === 'coaching' ? '1-on-1 Coaching' : 'Work Experience Placement'}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> {prog.duration}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {prog.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {prog.description}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Key Curriculum Modules:
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {prog.keyModules.map((mod, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-2">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Target: <strong>{prog.targetAudience}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setSelectedProgram(prog.title)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Enroll / Inquire About Course</span>
            </button>
          </div>
        ))}
      </div>

      {/* ADDITIONAL COACHING SERVICES FROM BRIEF */}
      <div className="bg-gradient-to-tr from-sky-50 via-blue-50 to-indigo-50 text-slate-900 rounded-3xl p-8 sm:p-12 border border-sky-200 space-y-8 shadow-sm">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600">Career & Leadership Suite</div>
          <h2 className="text-3xl font-black text-slate-900">Full Spectrum Academy Services</h2>
          <p className="text-xs text-slate-600">
            Tailored programs for individuals and corporate teams looking to accelerate their digital capability.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h3 className="font-bold text-blue-700 text-sm">PMO & Project Officer Track</h3>
            <p className="text-xs text-slate-600">Hands-on PMO tools, RAID logs, status decks, and governance.</p>
          </div>
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h3 className="font-bold text-blue-700 text-sm">AI for Business Leaders</h3>
            <p className="text-xs text-slate-600">GenAI workflows, prompt engineering, and AI policy frameworks.</p>
          </div>
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h3 className="font-bold text-blue-700 text-sm">Graduate Placement Scheme</h3>
            <p className="text-xs text-slate-600">12-week real project experience with live client deliverables.</p>
          </div>
          <div className="bg-white border border-sky-100 p-5 rounded-2xl space-y-2 shadow-xs">
            <h3 className="font-bold text-blue-700 text-sm">CV & Interview Coaching</h3>
            <p className="text-xs text-slate-600">STAR method prep and executive CV positioning for senior roles.</p>
          </div>
        </div>
      </div>

      {/* ENROLLMENT MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Inquire: {selectedProgram}</h3>
              <button 
                onClick={() => setSelectedProgram(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Use the training enquiry form to ask about the programme, syllabus and dates.
            </p>

            <button type="button" onClick={() => { setSelectedProgram(null); setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl">Continue to Contact Us</button>
          </div>
        </div>
      )}

    </div>
  );
};
