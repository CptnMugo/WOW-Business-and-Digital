import React from 'react';
import { NavTab } from '../types';
import { Logo } from './Logo';
import { BRAND_INFO } from '../data/companyData';
import { Globe, Mail, Phone, Sparkles } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="wbd-site-footer bg-[#0b2d5b] border-t-4 border-[#d4a24c] text-white transition-all duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand overview */}
          <div className="lg:col-span-2 space-y-6">
            <button 
              onClick={() => handleNav('home')} 
              className="text-left focus:outline-none group shrink-0 transition-opacity hover:opacity-90 flex items-center bg-white rounded-xl p-2 w-fit"
              aria-label="WOW Business and Digital Homepage"
            >
              <Logo 
                variant="vertical" 
                lightMode={false} 
                className="w-[220px] h-auto" 
              />
            </button>
            <p className="text-sm leading-relaxed max-w-md text-slate-700">
              {BRAND_INFO.positioning} {BRAND_INFO.vision}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {BRAND_INFO.personality.map((val, idx) => (
                <span key={idx} className="bg-white/80 border border-navy-200 text-slate-700 px-2.5 py-1 rounded-md font-semibold backdrop-blur-xs shadow-2xs">
                  • {val}
                </span>
              ))}
            </div>
            <div className="pt-2 text-xs flex flex-col gap-2 text-slate-700">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 shrink-0 text-navy-600" />
                <span>Internationally connected, with developing work in Zimbabwe</span>
              </div>
              <p className="text-xs text-slate-600">For programmes or partnerships in Zimbabwe, use the partnership or general enquiry form and tell us about your location and requirement.</p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-navy-600" />
                <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-navy-700 hover:underline transition-all">
                  {BRAND_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-emerald-600" />
                <a href="tel:+441212969549" className="hover:text-emerald-700 hover:underline transition-all font-bold">
                  +44 121 296 9549
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Core Service Offerings */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Core Services
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li><a href="?page=associates" className="hover:underline">Become an Associate</a></li>
              <li>
                <button onClick={() => handleNav('business-consultancy')} className="hover:text-navy-600 hover:underline transition-all text-left">
                  Transformation & Service Redesign
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('staffing')} className="hover:text-navy-600 hover:underline transition-all text-left">
                  Multidisciplinary Specialist Delivery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('training')} className="hover:text-navy-600 hover:underline transition-all text-left">
                  People & Capability Development
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ai-solutions')} className="hover:text-navy-600 hover:underline transition-all text-left">
                  Digital Adoption & Practical AI
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('career-coaching')} className="hover:text-navy-600 hover:underline transition-all text-left">
                  Career Coaching & CV Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: AI Assistants */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-navy-600" /> WOW AI Suite
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button onClick={() => handleNav('wow-assistant')} className="hover:text-navy-600 hover:underline transition-all">
                  WOW Business Assistant
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('wow-assistant')} className="hover:text-navy-600 hover:underline transition-all">
                  WOW Farm Assistant
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('wow-assistant')} className="hover:text-navy-600 hover:underline transition-all">
                  WOW NGO Assistant
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('wow-assistant')} className="hover:text-navy-600 hover:underline transition-all">
                  WOW School Assistant
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('wow-assistant')} className="hover:text-navy-600 hover:underline transition-all">
                  WOW Church Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Quick Links & Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-navy-600 hover:underline transition-all">
                  About &amp; Experience
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('case-studies')} className="hover:text-navy-600 hover:underline transition-all">
                  Experience Examples
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('insights')} className="hover:text-navy-600 hover:underline transition-all">
                  Insights & Articles
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('payments')} className="hover:text-navy-600 hover:underline transition-all font-semibold flex items-center gap-1">
                  <span>💳 Payments & Invoicing</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-navy-600 hover:underline transition-all">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-navy-200 text-slate-500 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} WOW Business and Digital Ltd. All rights reserved.</p>
          <div className="flex gap-6 font-medium text-slate-600">
            <span>Evidence</span>
            <span>•</span>
            <span>Transformation</span>
            <span>•</span>
            <span>Impact</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
