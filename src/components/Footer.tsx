import React from 'react';
import { NavTab } from '../types';
import { BRAND_INFO } from '../data/companyData';

interface FooterProps { setActiveTab: (tab: NavTab) => void; }

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, tab: NavTab) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const linkClass = 'inline-block py-1 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4a24c]';
  const links = (items: [NavTab, string][]) => items.map(([tab, label]) => (
    <li key={tab}><a href={`?page=${tab}`} onClick={e => navigate(e, tab)} className={linkClass}>{label}</a></li>
  ));
  return (
    <footer className="wbd-site-footer bg-[#0b2d5b] border-t-2 border-[#d4a24c] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid gap-9 md:grid-cols-[2fr_1fr_1fr]">
          <div className="space-y-4 min-w-0">
            <a href="?page=home" onClick={e => navigate(e, 'home')} className={`flex items-center gap-3 w-fit ${linkClass}`} aria-label="WOW Business and Digital home">
              <img src="/wbd-favicon.png" alt="" className="w-16 h-16 object-contain" />
              <span><strong className="block text-3xl tracking-wide">WBD</strong><span className="block text-sm">WOW Business &amp; Digital Ltd</span></span>
            </a>
            <p className="text-sm leading-relaxed text-[#dbe4ec] max-w-sm">Evidence-led transformation.<br />Practical delivery. Lasting impact.</p>
            <address className="not-italic text-sm text-[#dbe4ec] space-y-1">
              <a href={`mailto:${BRAND_INFO.email}`} className={`${linkClass} break-all`}>{BRAND_INFO.email}</a><br />
              <a href="tel:+441212969549" className={linkClass}>+44 121 296 9549</a>
            </address>
          </div>
          <nav aria-label="Footer explore">
            <h2 className="text-sm font-bold text-[#f0c474] mb-3">Explore</h2>
            <ul className="text-sm text-[#dbe4ec] space-y-1">{links([
              ['about', 'About & Experience'], ['services', 'Our services'],
              ['pm-career-accelerator', 'Career Accelerator'], ['case-studies', 'Experience examples'],
            ])}</ul>
          </nav>
          <nav aria-label="Footer connect">
            <h2 className="text-sm font-bold text-[#f0c474] mb-3">Connect</h2>
            <ul className="text-sm text-[#dbe4ec] space-y-1">{links([
              ['contact', 'Contact us'], ['associates', 'Become an associate'],
              ['payments', 'Fees and invoice payments'],
            ])}</ul>
            <p className="text-xs text-[#dbe4ec] mt-4 leading-relaxed max-w-xs">UK and international enquiries welcome.</p>
          </nav>
        </div>
        <div className="mt-8 pt-5 border-t border-white/20 text-xs text-[#dbe4ec] space-y-3">
          <nav aria-label="Policies" className="flex flex-wrap gap-5">
            <a href="?page=privacy" onClick={e => navigate(e, 'privacy')} className={linkClass}>Privacy notice</a>
            <a href="?page=programme-terms" onClick={e => navigate(e, 'programme-terms')} className={linkClass}>Programme terms</a>
          </nav>
          &copy; {new Date().getFullYear()} WOW Business &amp; Digital Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
