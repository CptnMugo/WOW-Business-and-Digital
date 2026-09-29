/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AssociateRegistration } from './components/AssociateRegistration';
import { NavTab } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ConsultingSection } from './components/ConsultingSection';
import { AISolutionsSection } from './components/AISolutionsSection';
import { AssistantPlayground } from './components/AssistantPlayground';
import { AcademySection } from './components/AcademySection';
import { ProductsSection } from './components/ProductsSection';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { InsightsSection } from './components/InsightsSection';
import { ContactSection, EnquiryCategory } from './components/ContactSection';
import { PaymentsSection } from './components/PaymentsSection';
import { Version2Section } from './components/Version2Section';
import { ProjectManagementCareerAcceleratorSection } from './components/ProjectManagementCareerAcceleratorSection';
import { ProjectManagementRegistrationPage } from './components/ProjectManagementRegistrationPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('payment=')) {
      return 'payments';
    }
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('page') === 'associates') return 'associates';
    return 'home';
  });
  const [contactCategory, setContactCategory] = useState<EnquiryCategory | undefined>(undefined);

  const handleNavigateToContact = (category?: EnquiryCategory) => {
    setContactCategory(category);
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isServicesTab = [
    'services',
    'business-consultancy',
    'staffing',
    'training',
    'career-coaching'
  ].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#f8f4ed] text-[#0b2d5b] font-sans antialiased flex flex-col justify-between selection:bg-[#0B2D5B] selection:text-white">
      {/* Global Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'contact') {
            handleNavigateToContact(undefined);
          } else {
            setActiveTab(tab);
          }
        }} 
      />

      {/* Main View Area */}
      <main className={`flex-1 ${activeTab === 'home' ? '' : 'wbd-interior'}`}>
        {activeTab === 'home' ? (
          <Version2Section 
            setActiveTab={setActiveTab} 
            onNavigateToContact={handleNavigateToContact}
          />
        ) : (
          <>
            {isServicesTab && <ServicesSection activeTab={activeTab} setActiveTab={setActiveTab} />}
            {activeTab === 'associates' && <AssociateRegistration />}
            {activeTab === 'about' && <AboutSection setActiveTab={setActiveTab} />}
            {activeTab === 'contact' && <ContactSection initialCategory={contactCategory} />}
            {activeTab === 'payments' && <PaymentsSection setActiveTab={setActiveTab} />}
            {activeTab === 'pm-career-accelerator' && (
              <ProjectManagementCareerAcceleratorSection 
                setActiveTab={setActiveTab} 
                onNavigateToContact={handleNavigateToContact} 
              />
            )}
            {activeTab === 'pm-registration' && (
              <ProjectManagementRegistrationPage 
                setActiveTab={setActiveTab} 
              />
            )}
            
            {/* Extended Interactive Tool & Section Views */}
            {activeTab === 'ai-solutions' && <AISolutionsSection setActiveTab={setActiveTab} />}
            {activeTab === 'consulting' && <ConsultingSection setActiveTab={setActiveTab} />}
            {activeTab === 'wow-assistant' && <AssistantPlayground />}
            {activeTab === 'academy' && <AcademySection setActiveTab={setActiveTab} />}
            {activeTab === 'products' && <ProductsSection setActiveTab={setActiveTab} />}
            {activeTab === 'case-studies' && <CaseStudiesSection setActiveTab={setActiveTab} />}
            {activeTab === 'insights' && <InsightsSection />}
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer 
        setActiveTab={setActiveTab} 
      />

    </div>
  );
}
