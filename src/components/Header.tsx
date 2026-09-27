import React, { useState, useRef, useEffect } from 'react';
import { NavTab } from '../types';
import { Menu, X, PhoneCall, ChevronDown, ChevronRight, Layers, Sparkles, Users, GraduationCap, TrendingUp, Mail, Phone, Award } from 'lucide-react';
import { CORE_FIVE_SERVICES } from '../data/companyData';
import { Logo } from './Logo';

export type BannerShade = 
  | 'crisp-ice'
  | 'growth-emerald'
  | 'mint-teal'
  | 'cyan-sky'
  | 'electric-royal';

export interface BannerOption {
  id: BannerShade;
  name: string;
  category: 'green' | 'blue';
  desc: string;
  briefSource: string;
  badgeHex: string;
  headerClass: string;
  isLight: boolean;
  navActiveBg: string;
  navInactive: string;
  buttonClass: string;
}

export const BANNER_OPTIONS: BannerOption[] = [
  {
    id: 'crisp-ice',
    name: 'WOW Ivory and Navy',
    category: 'blue',
    desc: 'Warm ivory canvas with deep navy typography and royal blue accents',
    briefSource: 'WOW Transformation that works banner',
    badgeHex: '#FFF9F0',
    headerClass: 'bg-[#FFF9F0]/95 border-b border-[#DED7CB] text-[#081D3D] shadow-sm',
    isLight: true,
    navActiveBg: 'bg-[#081D3D] text-white shadow-sm font-bold',
    navInactive: 'text-[#081D3D] hover:text-[#0755C9] hover:bg-[#EAF1F5]',
    buttonClass: 'bg-[#0755C9] hover:bg-[#0646AA] text-white shadow-sm'
  },
  {
    id: 'growth-emerald',
    name: 'Growth Emerald Green',
    category: 'green',
    desc: 'Rich emerald gradient representing sustainable growth',
    briefSource: 'Sustainable Growth & People Empowerment Pillar',
    badgeHex: '#10B981',
    headerClass: 'bg-gradient-to-r from-[#059669] via-[#10B981] to-[#047857] border-b border-emerald-300/40 text-white shadow-xl',
    isLight: false,
    navActiveBg: 'bg-white/20 text-white border border-white/30 backdrop-blur-sm',
    navInactive: 'text-emerald-50 hover:text-white hover:bg-white/15',
    buttonClass: 'bg-white hover:bg-emerald-50 text-emerald-900 border border-white/40 shadow-md'
  },
  {
    id: 'mint-teal',
    name: 'Fresh Mint & Digital Teal',
    category: 'green',
    desc: 'Luminous mint-teal gradient for intelligent AI solutions',
    briefSource: 'Digital Innovation & Intelligent Solutions',
    badgeHex: '#14B8A6',
    headerClass: 'bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#0F766E] border-b border-teal-300/40 text-white shadow-xl',
    isLight: false,
    navActiveBg: 'bg-white/20 text-white border border-white/30 backdrop-blur-sm',
    navInactive: 'text-teal-50 hover:text-white hover:bg-white/15',
    buttonClass: 'bg-white hover:bg-teal-50 text-teal-900 border border-white/40 shadow-md'
  },
  {
    id: 'cyan-sky',
    name: 'Cyan Sky Light Blue',
    category: 'blue',
    desc: 'Lighter cyan to royal blue gradient with bright clarity',
    briefSource: 'Badge Outer Ring & Speech Bubble Perimeter',
    badgeHex: '#00C8FF',
    headerClass: 'bg-gradient-to-r from-[#00B8FF] via-[#0077FF] to-[#0055FF] border-b border-cyan-300/40 text-white shadow-xl',
    isLight: false,
    navActiveBg: 'bg-white/20 text-white border border-white/30 backdrop-blur-sm',
    navInactive: 'text-cyan-50 hover:text-white hover:bg-white/15',
    buttonClass: 'bg-white hover:bg-cyan-50 text-blue-700 border border-white/40 shadow-md'
  },
  {
    id: 'electric-royal',
    name: 'Electric Royal Blue (Primary)',
    category: 'blue',
    desc: 'Core brand primary blue with luminous energy',
    briefSource: 'Primary WOW Brand Signature Blue',
    badgeHex: '#0066FF',
    headerClass: 'bg-gradient-to-r from-[#0077FF] via-[#0057E8] to-[#003EDB] border-b border-blue-400/40 text-white shadow-xl',
    isLight: false,
    navActiveBg: 'bg-white/20 text-white border border-white/30 backdrop-blur-sm',
    navInactive: 'text-blue-100 hover:text-white hover:bg-white/10',
    buttonClass: 'bg-white hover:bg-blue-50 text-blue-700 border border-white/40 shadow-md'
  }
];

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(true);

  // Locked to Crisp Ice Light Blue Theme
  const currentOption = BANNER_OPTIONS[0];

  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const programsCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenServices = () => {
    if (servicesCloseTimerRef.current) {
      clearTimeout(servicesCloseTimerRef.current);
      servicesCloseTimerRef.current = null;
    }
    if (programsCloseTimerRef.current) {
      clearTimeout(programsCloseTimerRef.current);
      programsCloseTimerRef.current = null;
    }
    setProgramsDropdownOpen(false);
    setServicesDropdownOpen(true);
  };

  const handleCloseServices = () => {
    if (servicesCloseTimerRef.current) {
      clearTimeout(servicesCloseTimerRef.current);
    }
    servicesCloseTimerRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 280);
  };

  const handleOpenPrograms = () => {
    if (programsCloseTimerRef.current) {
      clearTimeout(programsCloseTimerRef.current);
      programsCloseTimerRef.current = null;
    }
    if (servicesCloseTimerRef.current) {
      clearTimeout(servicesCloseTimerRef.current);
      servicesCloseTimerRef.current = null;
    }
    setServicesDropdownOpen(false);
    setProgramsDropdownOpen(true);
  };

  const handleClosePrograms = () => {
    if (programsCloseTimerRef.current) {
      clearTimeout(programsCloseTimerRef.current);
    }
    programsCloseTimerRef.current = setTimeout(() => {
      setProgramsDropdownOpen(false);
    }, 280);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (servicesCloseTimerRef.current) clearTimeout(servicesCloseTimerRef.current);
        if (programsCloseTimerRef.current) clearTimeout(programsCloseTimerRef.current);
        setServicesDropdownOpen(false);
        setProgramsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (servicesCloseTimerRef.current) clearTimeout(servicesCloseTimerRef.current);
      if (programsCloseTimerRef.current) clearTimeout(programsCloseTimerRef.current);
    };
  }, []);

  const handleNavClick = (tab: NavTab) => {
    if (servicesCloseTimerRef.current) clearTimeout(servicesCloseTimerRef.current);
    if (programsCloseTimerRef.current) clearTimeout(programsCloseTimerRef.current);
    setActiveTab(tab);
    setServicesDropdownOpen(false);
    setProgramsDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isServicesActive = [
    'services',
    'business-consultancy',
    'staffing',
    'training',
    'ai-solutions',
    'career-coaching',
    'consulting',
    'wow-assistant',
    'products'
  ].includes(activeTab);

  const isProgramsActive = [
    'pm-career-accelerator',
    'academy'
  ].includes(activeTab);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${currentOption.headerClass}`} ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Top Banner Brand Link with Official Main Logo */}
          <div className="flex items-center gap-3 sm:gap-4 relative z-30">
            <button 
              onClick={() => handleNavClick('home')} 
              className="text-left focus:outline-none group shrink-0 transition-transform duration-200 hover:scale-[1.02] flex items-center relative py-1"
              aria-label="WOW Business and Digital Limited Homepage"
            >
              <Logo 
                variant="horizontal" 
                lightMode={false} 
                className="h-10 sm:h-12 w-auto max-w-[210px] sm:max-w-[280px] md:max-w-none shrink-0" 
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 font-medium text-xs">
            
            {/* 1. SERVICES DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={handleOpenServices}
              onMouseLeave={handleCloseServices}
            >
              <button
                onClick={() => {
                  if (servicesDropdownOpen) {
                    if (servicesCloseTimerRef.current) clearTimeout(servicesCloseTimerRef.current);
                    setServicesDropdownOpen(false);
                  } else {
                    handleOpenServices();
                  }
                }}
                onMouseEnter={handleOpenServices}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold ${
                  isServicesActive
                    ? currentOption.navActiveBg
                    : currentOption.navInactive
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown for Services - Light, modern styling with bridge buffer */}
              {servicesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 pt-1.5 w-[480px] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleOpenServices}
                  onMouseLeave={handleCloseServices}
                >
                  <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-4 space-y-2 text-slate-800">
                    <div className="px-2 py-1 text-[11px] font-black uppercase text-blue-600 tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                      <span>Core Service Divisions</span>
                      <button 
                        onClick={() => handleNavClick('services')}
                        className="text-[10px] text-slate-500 hover:text-blue-600 flex items-center gap-0.5 underline font-bold"
                      >
                        <span>Full Directory</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {CORE_FIVE_SERVICES.map((service) => {
                        const IconComponent = {
                          Layers,
                          Users,
                          GraduationCap,
                          Sparkles,
                          TrendingUp
                        }[service.iconName] || Layers;

                        return (
                          <button
                            key={service.id}
                            onClick={() => handleNavClick(service.tabId as NavTab)}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/60 border border-transparent hover:border-blue-200 transition-all flex items-start gap-3 group"
                          >
                            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0 mt-0.5 shadow-xs">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 flex items-center gap-1.5">
                                <span>{service.title}</span>
                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {service.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. PROGRAMS DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={handleOpenPrograms}
              onMouseLeave={handleClosePrograms}
            >
              <button
                onClick={() => {
                  if (programsDropdownOpen) {
                    if (programsCloseTimerRef.current) clearTimeout(programsCloseTimerRef.current);
                    setProgramsDropdownOpen(false);
                  } else {
                    handleOpenPrograms();
                  }
                }}
                onMouseEnter={handleOpenPrograms}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold ${
                  isProgramsActive
                    ? currentOption.navActiveBg
                    : currentOption.navInactive
                }`}
              >
                <span>Career Accelerator Programme</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${programsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown for Programs - Direct bridge and comfortable hit area */}
              {programsDropdownOpen && (
                <div 
                  className="absolute top-full left-0 pt-1.5 w-[420px] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleOpenPrograms}
                  onMouseLeave={handleClosePrograms}
                >
                  <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-4 space-y-2 text-slate-800">
                    <div className="px-2 py-1 text-[11px] font-black uppercase text-blue-600 tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                      <span>Academy &amp; Career Programs</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                        Programme Enrolment Open
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {/* 1. Project Management Career accelerator */}
                      <button
                        onClick={() => handleNavClick('pm-career-accelerator')}
                        className="w-full text-left p-3 rounded-xl hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-all flex items-start gap-3.5 group bg-slate-50/50"
                      >
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                            <span>Project Management Career Accelerator</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 shrink-0 ml-1" />
                          </div>
                          <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                              Six months • Practical training • Work experience • Coaching
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                              6-Month Accelerator
                            </span>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              10% Early Offer
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Secondary Link: All Academy Programs */}
                      <button
                        onClick={() => handleNavClick('academy')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100/80 border border-transparent transition-all flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 font-bold mt-1"
                      >
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span>All Academy Courses &amp; Placements</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. PAYMENTS */}
            <button
              onClick={() => handleNavClick('payments')}
              onMouseEnter={() => {
                handleCloseServices();
                handleClosePrograms();
              }}
              className={`px-4 py-2 rounded-xl transition-all font-bold ${
                activeTab === 'payments'
                  ? currentOption.navActiveBg
                  : currentOption.navInactive
              }`}
            >
              Payments
            </button>

            {/* 4. CONTACT */}
            <button
              onClick={() => handleNavClick('contact')}
              onMouseEnter={() => {
                handleCloseServices();
                handleClosePrograms();
              }}
              className={`px-4 py-2 rounded-xl transition-all font-bold ${
                activeTab === 'contact'
                  ? currentOption.navActiveBg
                  : currentOption.navInactive
              }`}
            >
              Contact Us
            </button>

            {/* 5. ABOUT */}
            <button
              onClick={() => handleNavClick('about')}
              onMouseEnter={() => {
                handleCloseServices();
                handleClosePrograms();
              }}
              className={`px-4 py-2 rounded-xl transition-all font-bold ${
                activeTab === 'about'
                  ? currentOption.navActiveBg
                  : currentOption.navInactive
              }`}
            >
              About &amp; Experience
            </button>

          </nav>

          {/* Action CTA & Mobile Menu Button */}
          <div className="flex items-center gap-2.5">
            {/* Desktop Action CTA */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => handleNavClick('contact')}
                className={`font-black text-xs px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 ${currentOption.buttonClass}`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg transition-colors text-slate-800 hover:bg-sky-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in fade-in duration-200 text-slate-900">

          {/* Mobile Logo Brand Preview */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <Logo variant="horizontal" className="h-9 w-auto max-w-[220px]" />
          </div>

          <div className="space-y-2">
            
            {/* Mobile Services Accordion */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full p-3 text-left font-extrabold text-sm text-blue-700 flex items-center justify-between bg-slate-100/80"
              >
                <span>1. Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileServicesOpen && (
                <div className="p-2 space-y-1 bg-white border-t border-slate-200">
                  {CORE_FIVE_SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleNavClick(s.tabId as NavTab)}
                      className="w-full text-left p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between"
                    >
                      <span>{s.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                  <button
                    onClick={() => handleNavClick('services')}
                    className="w-full text-center p-2 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 mt-2 block border border-blue-200"
                  >
                    View All Services Overview
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Programs Accordion */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setMobileProgramsOpen(!mobileProgramsOpen)}
                className="w-full p-3 text-left font-extrabold text-sm text-blue-700 flex items-center justify-between bg-slate-100/80"
              >
                <div className="flex items-center gap-2">
                  <span>2. Career Accelerator Programme</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">New</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileProgramsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileProgramsOpen && (
                <div className="p-2 space-y-1 bg-white border-t border-slate-200">
                  <button
                    onClick={() => handleNavClick('pm-career-accelerator')}
                    className="w-full text-left p-2.5 rounded-xl text-xs font-bold text-slate-900 bg-blue-50/70 border border-blue-200 hover:bg-blue-100 flex items-start justify-between group"
                  >
                    <div>
                      <div className="text-blue-800 font-extrabold flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                        <span>Project Management Career Accelerator</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                        Six months • Practical training • Work experience • Coaching
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-blue-600 mt-1 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleNavClick('academy')}
                    className="w-full text-left p-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-between mt-1"
                  >
                    <span>View All Academy Programs</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Payments */}
            <button
              onClick={() => handleNavClick('payments')}
              className="w-full text-left p-3 rounded-2xl text-sm font-extrabold flex items-center justify-between border bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100"
            >
              <span>3. Payments &amp; Retainers</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Mobile Contact */}
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left p-3 rounded-2xl text-sm font-extrabold flex items-center justify-between border bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100"
            >
              <span>4. Contact Us</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Mobile About */}
            <button
              onClick={() => handleNavClick('about')}
              className="w-full text-left p-3 rounded-2xl text-sm font-extrabold flex items-center justify-between border bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100"
            >
              <span>5. About &amp; Experience</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm p-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Get In Touch</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
