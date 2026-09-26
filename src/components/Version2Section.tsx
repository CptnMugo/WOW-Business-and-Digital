import React, { useState, useEffect } from 'react';
import { NavTab } from '../types';
import { EnquiryCategory } from './ContactSection';
import { BANNER_OPTIONS, BannerShade } from './Header';
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Sparkles, 
  Briefcase, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  X, 
  Send, 
  Building2, 
  ShieldCheck, 
  Bot, 
  HelpCircle,
  Eye,
  ChevronRight,
  Target,
  Compass,
  Award
} from 'lucide-react';

interface Version2Props {
  setActiveTab: (tab: NavTab) => void;
  switchToV1?: () => void;
  onNavigateToContact?: (category: EnquiryCategory) => void;
}

export const Version2Section: React.FC<Version2Props> = ({ setActiveTab, onNavigateToContact }) => {
  const [selectedModal, setSelectedModal] = useState<'consulting' | 'staffing' | 'training' | 'ai-solutions' | 'career' | 'about' | null>(null);
  const [activeTab, setActiveV2Tab] = useState<'home' | 'about' | 'ai-solutions'>('home');

  const handleContactNav = (category: EnquiryCategory) => {
    if (onNavigateToContact) {
      onNavigateToContact(category);
    } else {
      setActiveTab('contact');
    }
  };

  // Track the current banner shade to match the top banner
  const [bannerShade, setBannerShade] = useState<BannerShade>(() => {
    const saved = localStorage.getItem('wow_banner_shade') as BannerShade | null;
    return saved && BANNER_OPTIONS.some(o => o.id === saved) ? saved : 'growth-emerald';
  });

  useEffect(() => {
    const handleShadeChange = (e: Event) => {
      const customEvent = e as CustomEvent<BannerShade>;
      if (customEvent.detail && BANNER_OPTIONS.some(o => o.id === customEvent.detail)) {
        setBannerShade(customEvent.detail);
      }
    };
    window.addEventListener('wow_banner_shade_change', handleShadeChange);
    return () => window.removeEventListener('wow_banner_shade_change', handleShadeChange);
  }, []);

  const currentBannerOption = BANNER_OPTIONS.find(o => o.id === bannerShade) || BANNER_OPTIONS[0];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      
      {/* BACKGROUND WAVE GRAPHICS MATCHING IMAGE 2 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl"></div>
        <svg className="absolute top-0 left-0 w-full h-full text-slate-200/40" viewBox="0 0 1440 900" fill="none">
          <path d="M-100 200 C300 400 600 100 1000 300 C1300 450 1500 200 1600 100 V900 H-100 Z" fill="url(#bg-wave-grad)" opacity="0.6" />
          <defs>
            <linearGradient id="bg-wave-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">

        {/* HERO HEADER AREA (MATCHING MOCKUP & BRAND STYLE GUIDE BR-002) */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-4xl mx-auto space-y-3 pt-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                Transformation, service redesign and programme delivery
              </h1>
              <p className="text-lg sm:text-xl font-bold text-slate-800 max-w-2xl mx-auto leading-snug">
                Senior-led delivery, supported by specialist associates across business and digital disciplines.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto leading-relaxed pt-1">
                Transforming Organisations. Empowering People. Building Intelligent Solutions.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto leading-relaxed">
                From programme leadership and digital adoption to finance, procurement, people and communications, we shape the team around your programme.
              </p>
            </div>

            {/* 4-COLUMN CORE SERVICES CARDS (BLENDED BOTTOM-LEFT TO TOP-RIGHT GRADIENT WITH GLOSSY FINISH) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
              
              {/* CARD 1: Business Consultancy & Growth / Improve My Business (Vivid Royal Blue Glossy Gradient) */}
              <div className="bg-gradient-to-tr from-[#0284C7] via-[#0070F3] to-[#38BDF8] text-white p-4 sm:p-4.5 rounded-2xl shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_12px_24px_-4px_rgba(2,132,199,0.3)] border border-white/25 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 min-h-[275px]">
                {/* Diagonal Specular Glossy Facet Reflection */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl" 
                  style={{ 
                    background: 'linear-gradient(55deg, transparent 48%, rgba(255,255,255,0.1) 48.5%, rgba(255,255,255,0.22) 100%)' 
                  }} 
                />
                {/* Top-Right Ambient Sheen */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/20 via-sky-200/5 to-transparent rounded-tr-2xl pointer-events-none"></div>

                <div className="space-y-2.5 relative z-10">
                  {/* Category Eyebrow Tag */}
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-sky-100 bg-black/20 px-2.5 py-0.5 rounded-full border border-white/15 backdrop-blur-xs">
                    BUSINESS CONSULTANCY & GROWTH
                  </span>

                  {/* Header: Glowing Icon Badge + Title */}
                  <div className="flex items-center gap-2.5">
                    {/* Glowing Cyan/Blue Circular Badge matching reference */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#38B6FF] via-[#0084FF] to-[#0052FF] p-2 shadow-md shadow-blue-500/30 flex items-center justify-center shrink-0 border border-white/35">
                      <svg className="w-6 h-6 text-white drop-shadow-xs" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 16L13 10L17 14L22 7M22 7H17M22 7V12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="5" y="18" width="3" height="6" rx="1.5" fill="white" />
                        <rect x="10" y="15" width="3" height="9" rx="1.5" fill="white" />
                        <rect x="15" y="12" width="3" height="12" rx="1.5" fill="white" />
                        <rect x="20" y="9" width="3" height="15" rx="1.5" fill="white" />
                      </svg>
                    </div>
                    <h2 className="text-base sm:text-[18px] font-black text-white tracking-tight leading-snug">
                      Improve My Business
                    </h2>
                  </div>

                  {/* Exact Original Wording */}
                  <p className="text-xs sm:text-[12.5px] text-white/95 leading-relaxed font-medium">
                    Practical consultancy and coaching to grow and strengthen your organisation.
                  </p>
                </div>

                {/* Resized and Rearranged Action Buttons - Responsive 2-column grid fitting cleanly */}
                <div className="grid grid-cols-2 gap-2 pt-3 relative z-10 w-full">
                  <button
                    onClick={() => setSelectedModal('consulting')}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2 px-1.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 text-center"
                  >
                    <span className="truncate">View support</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                  <button
                    onClick={() => handleContactNav('business-consultancy')}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-2 px-1.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 text-center"
                  >
                    <span className="truncate">Contact us</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>

              {/* CARD 2: People and Talent / Find The Right People (Vivid Emerald Green Glossy Gradient) */}
              <div className="bg-gradient-to-tr from-[#004D20] via-[#007F37] to-[#00B853] text-white p-4 sm:p-4.5 rounded-2xl shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_12px_24px_-4px_rgba(0,40,15,0.35)] border border-white/25 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 min-h-[275px]">
                {/* Diagonal Specular Glossy Facet Reflection */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl" 
                  style={{ 
                    background: 'linear-gradient(55deg, transparent 48%, rgba(255,255,255,0.1) 48.5%, rgba(255,255,255,0.22) 100%)' 
                  }} 
                />
                {/* Top-Right Ambient Sheen */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/20 via-emerald-200/5 to-transparent rounded-tr-2xl pointer-events-none"></div>

                <div className="space-y-2.5 relative z-10">
                  {/* Category Eyebrow Tag */}
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-emerald-200 bg-black/25 px-2.5 py-0.5 rounded-full border border-white/15 backdrop-blur-xs">
                    PEOPLE AND TALENT
                  </span>

                  {/* Header: Glowing Icon Badge + Title */}
                  <div className="flex items-center gap-2.5">
                    {/* Glowing Lime/Emerald Circular Badge matching reference */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4EE376] via-[#00C853] to-[#00A859] p-2 shadow-md shadow-emerald-900/40 flex items-center justify-center shrink-0 border border-white/35">
                      <svg className="w-6 h-6 text-white drop-shadow-xs" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="14" cy="9" r="3.5" fill="white" />
                        <path d="M8.5 22C8.5 18.5 11 16 14 16C17 16 19.5 18.5 19.5 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="7" cy="11" r="2.5" fill="white" fillOpacity="0.9" />
                        <path d="M3.5 21C3.5 18.5 5 17 7.5 17" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                        <circle cx="21" cy="11" r="2.5" fill="white" fillOpacity="0.9" />
                        <path d="M20.5 17C23 17 24.5 18.5 24.5 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h2 className="text-base sm:text-[18px] font-black text-white tracking-tight leading-snug">
                      Find the Right People
                    </h2>
                  </div>

                  {/* Exact Original Wording */}
                  <p className="text-xs sm:text-[12.5px] text-white/95 leading-relaxed font-medium">
                    Experienced professionals supplied flexibly, from one to five days a week.
                  </p>
                </div>

                {/* Resized and Rearranged Action Buttons - Responsive 2-column grid fitting cleanly */}
                <div className="grid grid-cols-2 gap-2 pt-3 relative z-10 w-full">
                  <button
                    onClick={() => setSelectedModal('staffing')}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-1.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 text-center cursor-pointer"
                  >
                    <span className="truncate">View staffing</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                  <button
                    onClick={() => handleContactNav('staffing')}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-2 px-1.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 text-center cursor-pointer"
                  >
                    <span className="truncate">Request support</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>

              {/* CARD 3: Skills and Career Development / Learn, Work, Earn! (Vivid Royal Blue Glossy Gradient) */}
              <div className="bg-gradient-to-tr from-[#0284C7] via-[#0070F3] to-[#38BDF8] text-white p-4 sm:p-4.5 rounded-2xl shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_12px_24px_-4px_rgba(2,132,199,0.3)] border border-white/25 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 min-h-[275px]">
                {/* Diagonal Specular Glossy Facet Reflection */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl" 
                  style={{ 
                    background: 'linear-gradient(55deg, transparent 48%, rgba(255,255,255,0.1) 48.5%, rgba(255,255,255,0.22) 100%)' 
                  }} 
                />
                {/* Top-Right Ambient Sheen */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/20 via-sky-200/5 to-transparent rounded-tr-2xl pointer-events-none"></div>

                <div className="space-y-2.5 relative z-10">
                  {/* Category Eyebrow Tag */}
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-sky-100 bg-black/20 px-2.5 py-0.5 rounded-full border border-white/15 backdrop-blur-xs">
                    SKILLS AND CAREER DEVELOPMENT
                  </span>

                  {/* Header: Glowing Icon Badge + Title */}
                  <div className="flex items-center gap-2.5">
                    {/* Glowing Cyan/Blue Circular Badge matching reference */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#38B6FF] via-[#0084FF] to-[#0052FF] p-2 shadow-md shadow-blue-500/30 flex items-center justify-center shrink-0 border border-white/35">
                      <svg className="w-6 h-6 text-white drop-shadow-xs" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 4L2 10L14 16L26 10L14 4Z" fill="white" />
                        <path d="M6 12.5V18.5C6 21 9.5 23 14 23C18.5 23 22 21 22 18.5V12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M24 11V18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="24" cy="18.5" r="1.5" fill="white" />
                      </svg>
                    </div>
                    <h2 className="text-base sm:text-[18px] font-black text-white tracking-tight leading-snug">
                      Learn, Work, Earn!
                    </h2>
                  </div>

                  {/* Strapline & Supporting Line */}
                  <div className="space-y-1">
                    <p className="text-xs sm:text-[13px] text-white font-bold leading-snug">
                      From qualification to real-world capability.
                    </p>
                    <p className="text-[11px] sm:text-xs text-sky-100/90 font-medium leading-relaxed">
                      Practical training. Real projects. Career-ready skills.
                    </p>
                  </div>
                </div>

                {/* Resized and Rearranged Action Buttons - Responsive 2-column grid fitting cleanly */}
                <div className="grid grid-cols-2 gap-2 pt-3 relative z-10 w-full">
                  <button
                    onClick={() => {
                      setActiveTab('pm-career-accelerator');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2 px-1.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 text-center cursor-pointer"
                  >
                    <span className="truncate">View program</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                  <button
                    onClick={() => handleContactNav('training')}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-2 px-1.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 text-center cursor-pointer"
                  >
                    <span className="truncate">Enquire</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>

              {/* CARD 4: AI Solutions / Use AI Practically (Vivid Emerald Green Glossy Gradient) */}
              <div className="bg-gradient-to-tr from-[#004D20] via-[#007F37] to-[#00B853] text-white p-4 sm:p-4.5 rounded-2xl shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_12px_24px_-4px_rgba(0,40,15,0.35)] border border-white/25 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 min-h-[275px]">
                {/* Diagonal Specular Glossy Facet Reflection */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl" 
                  style={{ 
                    background: 'linear-gradient(55deg, transparent 48%, rgba(255,255,255,0.1) 48.5%, rgba(255,255,255,0.22) 100%)' 
                  }} 
                />
                {/* Top-Right Ambient Sheen */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/20 via-emerald-200/5 to-transparent rounded-tr-2xl pointer-events-none"></div>

                <div className="space-y-2.5 relative z-10">
                  {/* Category Eyebrow Tag */}
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-emerald-200 bg-black/25 px-2.5 py-0.5 rounded-full border border-white/15 backdrop-blur-xs">
                    AI SOLUTIONS
                  </span>

                  {/* Header: Glowing Icon Badge + Title */}
                  <div className="flex items-center gap-2.5">
                    {/* Glowing Lime/Emerald Circular Badge matching reference */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4EE376] via-[#00C853] to-[#00A859] p-2 shadow-md shadow-emerald-900/40 flex items-center justify-center shrink-0 border border-white/35">
                      <svg className="w-6 h-6 text-white drop-shadow-xs" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3C11 7.5 7.5 11 3 11C7.5 11 11 14.5 11 19C11 14.5 14.5 11 19 11C14.5 11 11 7.5 11 3Z" fill="white" />
                        <path d="M22 4C22 6 20.5 7.5 18.5 7.5C20.5 7.5 22 9 22 11C22 9 23.5 7.5 25.5 7.5C23.5 7.5 22 6 22 4Z" fill="white" />
                        <path d="M20 18C20 19.5 19 20.5 17.5 20.5C19 20.5 20 21.5 20 23C20 21.5 21 20.5 22.5 20.5C21 20.5 20 19.5 20 18Z" fill="white" />
                      </svg>
                    </div>
                    <h2 className="text-base sm:text-[18px] font-black text-white tracking-tight leading-snug">
                      Use AI Practically
                    </h2>
                  </div>

                  {/* Exact Original Wording */}
                  <p className="text-xs sm:text-[12.5px] text-white/95 leading-relaxed font-medium">
                    Practical, guided AI tools grounded in real business knowledge.
                  </p>
                </div>

                {/* Resized and Rearranged Action Buttons - Responsive 2-column grid fitting cleanly */}
                <div className="grid grid-cols-2 gap-2 pt-3 relative z-10 w-full">
                  <button
                    onClick={() => setSelectedModal('ai-solutions')}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-1.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 text-center cursor-pointer"
                  >
                    <span className="truncate">Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                  <button
                    onClick={() => handleContactNav('ai-solutions')}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-2 px-1.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 text-center cursor-pointer"
                  >
                    <span className="truncate">Discuss</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>

            </div>

            {/* BOTTOM FULL-WIDTH BANNER: PROJECT MANAGEMENT CAREER ACCELERATOR */}
            <div className="bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100 rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              {/* Mountain Climbing Silhouette Decorative Background Accent */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-25 pointer-events-none hidden lg:block bg-contain bg-no-repeat bg-right" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80")' }}></div>

              <div className="flex items-center gap-5 relative z-10">
                {/* WHITE CIRCLE BADGE WITH ICON */}
                <div className="w-16 h-16 rounded-full bg-white text-blue-700 shadow-md flex items-center justify-center shrink-0 border border-sky-200">
                  <GraduationCap className="w-8 h-8 text-blue-700" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-700">
                    Project Management Career Accelerator
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Build practical project management experience
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
                    Six months of practical training, work experience and one-to-one coaching. Next intake planned for 2 November 2026.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
                <button
                  onClick={() => {
                    setActiveTab('pm-career-accelerator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Explore the Programme</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* DIRECT ENQUIRY LINK FOOTNOTE */}
            <div className="text-center text-xs text-slate-500 font-medium pt-2">
              Every service area links to its own tailored enquiry form. We also work with partners on opportunities in Zimbabwe and internationally.
            </div>

          </div>
        )}

        {/* ABOUT PAGE OVERVIEW (PAGE 2 CONTENT) */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-10 animate-in fade-in duration-300">
            <div className="space-y-4 border-b border-slate-100 pb-8">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">ABOUT WOW BUSINESS & DIGITAL</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                Digital First, AI-Focused Company
              </h1>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
                WOW Business & Digital Limited provides digital solutions, business consultancy, staffing, training and professional development.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                Our digital and technical solutions draw on practical experience in business management, transformation, programme and project delivery, governance, organisational change and professional development. This helps us create solutions that are technically capable, commercially relevant and practical for the people who use them.
              </p>
            </div>

            {/* VISION & PURPOSE */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-sky-50/70 p-6 rounded-2xl border border-sky-100 space-y-2">
                <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                  <Target className="w-5 h-5 text-sky-600" />
                  <span>Our Vision</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  To advance people and organisations through artificial intelligence, digital innovation and practical business expertise.
                </p>
              </div>

              <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <Compass className="w-5 h-5 text-blue-600" />
                  <span>Our Purpose</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  To use AI, digital technology and business knowledge to help people and organisations solve problems, improve performance and achieve sustainable growth.
                </p>
              </div>
            </div>

            {/* WHAT MAKES WOW DIFFERENT? */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">What makes WOW different?</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200">
                Many technology companies begin with the technology and then look for a problem it can solve. WOW begins by understanding the business need, the people involved, the information available and the outcome required. We then apply the right combination of AI, digital tools and business expertise.
              </p>
            </div>

            {/* WHY WORK WITH WOW? 4 PILLARS */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">Why work with WOW?</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold text-sky-600 uppercase">DIGITAL FIRST</span>
                  <p className="text-xs text-slate-600">We use AI and digital innovation to create efficient, scalable and future-ready solutions.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold text-blue-600 uppercase">BUSINESS-INFORMED</span>
                  <p className="text-xs text-slate-600">Our technology is shaped by practical experience in business, transformation and delivery.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-600 uppercase">PEOPLE-CENTRED</span>
                  <p className="text-xs text-slate-600">We design solutions that people can understand, adopt and use with confidence.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold text-indigo-600 uppercase">OUTCOME-FOCUSED</span>
                  <p className="text-xs text-slate-600">Every engagement starts with the problem to solve and the value to be created.</p>
                </div>
              </div>
            </div>

            {/* WHO WE SUPPORT */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-blue-100 text-slate-900 space-y-2">
              <h3 className="font-bold text-base text-blue-800">Who We Support</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Healthcare, public sector, private sector, education, not-for-profit, small and growing businesses, international organisations, agriculture and agribusiness.
              </p>
            </div>
          </div>
        )}

        {/* AI SOLUTIONS OVERVIEW (PAGE 3 CONTENT) */}
        {activeTab === 'ai-solutions' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-10 animate-in fade-in duration-300">
            <div className="space-y-4 border-b border-slate-100 pb-8">
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">AI AND DIGITAL SOLUTIONS</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                Intelligent technology built around real business needs
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                WOW develops guided AI assistants, automation tools and digital solutions that help organisations manage information, improve reporting, support decision-making and work more efficiently.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-600" />
                  <span>WOW Assistant</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A guided platform that helps users provide structured information, follow relevant workflows and create consistent outputs rather than relying only on an open chat box.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>WOW Project Assistant</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Supports project, programme, PMO, governance, operational and small-business activities such as status reports, RAID logs, action tracking, business updates and management summaries.
                </p>
              </div>
            </div>

            {/* 5-STEP APPROACH */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">How we approach a solution</h2>
              <div className="grid sm:grid-cols-5 gap-3">
                {[
                  "1. Understand problem & outcome",
                  "2. Review current process & data",
                  "3. Select AI & digital tools",
                  "4. Design guided usable solution",
                  "5. Test & support adoption"
                ].map((step, idx) => (
                  <div key={idx} className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-center space-y-1">
                    <span className="text-xs font-extrabold text-sky-800">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <h3 className="font-bold text-base text-white">Discuss an AI or digital requirement</h3>
                <p className="text-xs text-blue-100">Tell us about the problem, current process, and desired outcome.</p>
              </div>
              <button
                onClick={() => handleContactNav('ai-solutions')}
                className="bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs px-5 py-2.5 rounded-xl shrink-0 shadow-md transition-colors cursor-pointer"
              >
                Discuss your requirement
              </button>
            </div>
          </div>
        )}

      </div>

      {/* SERVICE DETAIL MODAL / DRAWER */}
      {selectedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedModal === 'consulting' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">SERVICE DETAIL</span>
                <h2 className="text-2xl font-black text-slate-900">Business Consultancy & Growth</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Practical support to review challenges, clarify priorities, improve operations and create realistic growth plans. Areas may include business consultancy, coaching, operational improvement, transformation, governance, programme delivery and benefits realisation.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We lead the programme and bring in relevant associates across technology and AI, finance and commercial strategy, procurement, people and HR, and communications according to the scope.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900">Key Offerings:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>PMO & Governance Setup</li>
                    <li>Digital Transformation Strategy</li>
                    <li>Operational Efficiency Reviews</li>
                    <li>Change Management & Stakeholder Alignment</li>
                  </ul>
                </div>
                <button
                  onClick={() => { setSelectedModal(null); handleContactNav('business-consultancy'); }}
                  className="w-full bg-blue-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-500 transition-all cursor-pointer shadow-md"
                >
                  Request Business Consultancy Support
                </button>
              </div>
            )}

            {selectedModal === 'staffing' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">SERVICE DETAIL</span>
                <h2 className="text-2xl font-black text-slate-900">Staffing & Delivery Talent</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Flexible access to programme managers, project managers, PMO professionals, business analysts, coordinators and related delivery roles. Support may be part-time, full-time, interim, fixed-term or focused on a defined output.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900">Available Delivery Roles:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Interim Programme & Project Managers</li>
                    <li>PMO Leads & Analysts</li>
                    <li>Business Analysis Specialists</li>
                    <li>Change & Adoption Coordinators</li>
                  </ul>
                </div>
                <button
                  onClick={() => { setSelectedModal(null); handleContactNav('staffing'); }}
                  className="w-full bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-emerald-500 transition-all cursor-pointer shadow-md"
                >
                  Request Staffing Support
                </button>
              </div>
            )}

            {selectedModal === 'training' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">SERVICE DETAIL</span>
                <h2 className="text-2xl font-black text-slate-900">Training & Capability Building</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Practical learning for individuals, teams and organisations. Areas may include project and programme management, change management, AI for business, PMO and project support, work experience and graduate development.
                </p>
                <button
                  onClick={() => { setSelectedModal(null); handleContactNav('training'); }}
                  className="w-full bg-blue-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-500 transition-all cursor-pointer shadow-md"
                >
                  Enquire About Training Courses
                </button>
              </div>
            )}

            {selectedModal === 'ai-solutions' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">SERVICE DETAIL</span>
                <h2 className="text-2xl font-black text-slate-900">AI & Digital Solutions</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Guided AI assistants, digital tools, automation and reporting solutions shaped by real business requirements. Includes WOW Assistant and WOW Project Assistant frameworks.
                </p>
                <button
                  onClick={() => { setSelectedModal(null); handleContactNav('ai-solutions'); }}
                  className="w-full bg-cyan-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-cyan-500 transition-all cursor-pointer shadow-md"
                >
                  Discuss Your AI Requirement
                </button>
              </div>
            )}

            {selectedModal === 'career' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">SERVICE DETAIL</span>
                <h2 className="text-2xl font-black text-slate-900">Career Coaching & Development</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  One-to-one support for career planning, CVs, LinkedIn profiles, interview preparation and professional development. The focus is on clear goals, stronger presentation and practical next steps.
                </p>
                <button
                  onClick={() => { setSelectedModal(null); handleContactNav('career-coaching'); }}
                  className="w-full bg-blue-700 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-600 transition-all cursor-pointer shadow-md"
                >
                  Contact a Career Coach
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
