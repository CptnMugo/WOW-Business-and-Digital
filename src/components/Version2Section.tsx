import React from 'react';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, GraduationCap, Globe2, Sparkles } from 'lucide-react';
import { NavTab } from '../types';
import { EnquiryCategory } from './ContactSection';

interface Version2Props {
  setActiveTab: (tab: NavTab) => void;
  onNavigateToContact?: (category: EnquiryCategory) => void;
}

const pillars = [
  { number: '01', title: 'Strategy & Planning', summary: 'Turn ambitions into a deliverable plan, with clear priorities, ownership and governance.', className: 'wbd-pillar-navy', tab: 'consulting' as NavTab },
  { number: '02', title: 'Service Redesign & Change', summary: 'Improve how services and workflows work for the people who use them.', className: 'wbd-pillar-blue', tab: 'business-consultancy' as NavTab },
  { number: '03', title: 'Programme Delivery', summary: 'Lead complex change from mobilisation through implementation and assurance.', className: 'wbd-pillar-gold', tab: 'consulting' as NavTab },
  { number: '04', title: 'Digital & AI Enablement', summary: 'Connect people, data and technology through practical digital adoption.', className: 'wbd-pillar-teal', tab: 'ai-solutions' as NavTab },
  { number: '05', title: 'People & Capability', summary: 'Build skills, confidence and the capacity to sustain change.', className: 'wbd-pillar-ink', tab: 'training' as NavTab },
];

export const Version2Section: React.FC<Version2Props> = ({ setActiveTab, onNavigateToContact }) => {
  const navigate = (tab: NavTab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const contact = (category: EnquiryCategory) => onNavigateToContact ? onNavigateToContact(category) : navigate('contact');

  return (
    <div className="wbd-home">
      <section className="wbd-hero" aria-labelledby="wbd-home-title">
        <div className="wbd-hero-glow" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="wbd-hero-copy">
            <p className="wbd-eyebrow">WOW BUSINESS & DIGITAL</p>
            <h1 id="wbd-home-title">Evidence. Transformation. <span>Impact.</span></h1>
            <p className="wbd-hero-subtitle">Understand the need. Deliver practical change. <strong>Show what improves.</strong></p>
            <p className="wbd-hero-description">We use evidence, insight and engagement to define the challenge, then lead service redesign and programme delivery across people, systems and technology. Senior leadership and specialist associates help turn change into measurable, sustainable outcomes.</p>
            <div className="wbd-hero-actions">
              <button onClick={() => navigate('consulting')} className="wbd-button wbd-button-primary">Explore our approach <ArrowRight size={18} /></button>
              <button onClick={() => contact('business-consultancy')} className="wbd-button wbd-button-secondary">Discuss a project</button>
            </div>
          </div>
        </div>
      </section>

      <section className="wbd-pillars max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="wbd-pillars-title">
        <div className="wbd-section-intro">
          <div><p className="wbd-eyebrow">OUR APPROACH</p><h2 id="wbd-pillars-title">Five connected ways we make change work</h2></div>
          <p>Each engagement is shaped around the challenge. Explore the support you need, from early strategy to the capabilities that make it stick.</p>
        </div>
        <div className="wbd-pillar-grid">
          {pillars.map(pillar => (
            <button key={pillar.number} onClick={() => navigate(pillar.tab)} className={`wbd-pillar ${pillar.className}`}>
              <span className="wbd-pillar-number">{pillar.number} / 05</span>
              <span className="wbd-pillar-body"><strong>{pillar.title}</strong><span>{pillar.summary}</span></span>
              <span className="wbd-pillar-link">Explore this service <ArrowRight size={18} aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="wbd-delivery max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="wbd-delivery-title">
        <div className="wbd-delivery-panel">
          <div>
            <p className="wbd-eyebrow">SENIOR-LED · MULTIDISCIPLINARY</p>
            <h2 id="wbd-delivery-title">One accountable lead. The right expertise around the work.</h2>
            <p>Programme leadership connects the moving parts. Depending on your brief, we bring together associates in technology and AI, finance and commercial strategy, procurement, people and HR, communications and other business functions.</p>
            <button onClick={() => navigate('about')} className="wbd-text-link">About our experience <ArrowRight size={18} /></button>
          </div>
          <div className="wbd-delivery-list">
            {['A clear scope and joined-up plan', 'Specialists matched to each commission', 'Practical workflows and digital adoption', 'Governance, learning and sustainable outcomes'].map(item => <div key={item}><CheckCircle2 size={20} /><span>{item}</span></div>)}
          </div>
        </div>
      </section>

      <section className="wbd-next max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="wbd-next-title">
        <div className="wbd-section-intro"><div><p className="wbd-eyebrow">FIND YOUR ROUTE</p><h2 id="wbd-next-title">What can we help you move forward?</h2></div></div>
        <div className="wbd-next-grid">
          <button onClick={() => navigate('consulting')}><BriefcaseBusiness /><strong>Consulting & delivery</strong><span>Transform services, deliver programmes and strengthen governance.</span><span className="wbd-card-link">Explore services <ArrowRight size={16} /></span></button>
          <button onClick={() => contact('staffing')}><Globe2 /><strong>Flexible specialist support</strong><span>Build a team with relevant capacity for your defined scope.</span><span className="wbd-card-link">Discuss your requirement <ArrowRight size={16} /></span></button>
          <button onClick={() => navigate('ai-solutions')}><Sparkles /><strong>Digital & AI solutions</strong><span>Design practical workflows and apply technology where it helps.</span><span className="wbd-card-link">See the approach <ArrowRight size={16} /></span></button>
          <button onClick={() => navigate('pm-career-accelerator')}><GraduationCap /><strong>Career Accelerator</strong><span>Build project delivery skills through learning, practical experience and coaching.</span><span className="wbd-card-link">Explore the programme <ArrowRight size={16} /></span></button>
        </div>
      </section>

      <section className="wbd-international max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>Internationally connected, with developing partnerships and programmes in Zimbabwe.</p>
        <button onClick={() => contact('partnership')}>Discuss a partnership <ArrowRight size={17} /></button>
      </section>
    </div>
  );
};
