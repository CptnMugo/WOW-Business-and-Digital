import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Globe, Send, CheckCircle2, AlertCircle, Building2, UserCheck, GraduationCap, Briefcase, Sparkles, FileText, ArrowRight, ShieldCheck, Check, Upload, HelpCircle, Target, Layers, Compass, Award } from 'lucide-react';
import { TrainingRegistrationForm, TrainingFormData } from './TrainingRegistrationForm';

export type EnquiryCategory = 
  | 'business-consultancy'
  | 'staffing'
  | 'training'
  | 'ai-solutions'
  | 'career-coaching'
  | 'partnership'
  | 'general';

interface CategoryOption {
  id: EnquiryCategory;
  title: string;
  tagline: string;
  badge: string;
  routingQueue: string;
  icon: React.ComponentType<{ className?: string }>;
  primaryBtnText: string;
  isBusinessFacing: boolean;
  confirmationMessage: string;
  gradientClass: string;
  borderClass: string;
  iconBgClass: string;
  activeBadgeClass: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'general',
    title: 'General Enquiry',
    tagline: 'Media, supplier, feedback & general queries',
    badge: 'Form 1',
    routingQueue: 'General enquiry',
    icon: Mail,
    primaryBtnText: 'Send General Enquiry',
    isBusinessFacing: false,
    confirmationMessage: 'Thank you for contacting WOW Business & Digital. We have received your enquiry and will route it to the appropriate person. If your request relates to a specific service, we may ask you to provide additional information through the relevant service form.',
    gradientClass: 'from-blue-600 via-sky-600 to-cyan-500',
    borderClass: 'border-sky-300/40',
    iconBgClass: 'from-sky-400 to-blue-600',
    activeBadgeClass: 'bg-white/25 text-white border-white/40'
  },
  {
    id: 'business-consultancy',
    title: 'Business Consultancy & Growth',
    tagline: 'Strategy, PMO, operational improvement & transformation',
    badge: 'Form 2',
    routingQueue: 'Business consultancy',
    icon: Building2,
    primaryBtnText: 'Request Business Support',
    isBusinessFacing: true,
    confirmationMessage: 'Thank you for contacting WOW Business & Digital. We have received your Business Consultancy & Growth enquiry and will review the information provided. A member of the team will contact you to discuss the requirement and appropriate next steps. Submitting this form does not confirm acceptance of work or availability.',
    gradientClass: 'from-blue-600 via-sky-600 to-cyan-500',
    borderClass: 'border-sky-300/40',
    iconBgClass: 'from-sky-400 to-blue-600',
    activeBadgeClass: 'bg-white/25 text-white border-white/40'
  },
  {
    id: 'staffing',
    title: 'Staffing Request',
    tagline: 'Flexible PMO, project, BA & delivery professionals',
    badge: 'Form 3',
    routingQueue: 'Specialist support',
    icon: UserCheck,
    primaryBtnText: 'Request Staffing Support',
    isBusinessFacing: true,
    confirmationMessage: 'Thank you. We have received your staffing request. We will review the roles, timescale, working arrangement and expected outputs and will contact you to discuss availability and next steps. Submission does not confirm that a particular professional is available or that an engagement has been agreed.',
    gradientClass: 'from-emerald-600 via-teal-600 to-emerald-500',
    borderClass: 'border-emerald-300/40',
    iconBgClass: 'from-emerald-400 to-teal-600',
    activeBadgeClass: 'bg-white/25 text-white border-white/40'
  },
  {
    id: 'training',
    title: 'Skills, Training & Professional Development',
    tagline: 'Individual courses, team training & graduate development',
    badge: 'Form 4',
    routingQueue: 'Career Accelerator',
    icon: GraduationCap,
    primaryBtnText: 'Enquire About Training',
    isBusinessFacing: false,
    confirmationMessage: 'Thank you for your training enquiry. We have received your details and will review the course, delivery and support requirements. We will contact you with the relevant next steps. Submission does not confirm a place on a course until availability, eligibility and any payment requirements have been confirmed.',
    gradientClass: 'from-blue-600 via-sky-600 to-cyan-500',
    borderClass: 'border-sky-300/40',
    iconBgClass: 'from-sky-400 to-blue-600',
    activeBadgeClass: 'bg-white/25 text-white border-white/40'
  },
  {
    id: 'ai-solutions',
    title: 'AI & Digital Solutions',
    tagline: 'AI assistants, workflow automation & reporting tools',
    badge: 'Form 5',
    routingQueue: 'Digital and AI',
    icon: Sparkles,
    primaryBtnText: 'Discuss AI Requirement',
    isBusinessFacing: true,
    confirmationMessage: 'Thank you for sharing your AI or digital requirement. We will review the business need, users, information, desired outputs and any governance considerations. A member of the team will contact you to discuss the most appropriate next step, which may include a discovery conversation, demonstration or further requirements assessment.',
    gradientClass: 'from-emerald-600 via-teal-600 to-emerald-500',
    borderClass: 'border-emerald-300/40',
    iconBgClass: 'from-emerald-400 to-teal-600',
    activeBadgeClass: 'bg-white/25 text-white border-white/40'
  },
  {
    id: 'career-coaching',
    title: 'Career Coaching & Development',
    tagline: '1-on-1 coaching, CV review, interview prep & direction',
    badge: 'Form 6',
    routingQueue: 'Career coaching',
    icon: Briefcase,
    primaryBtnText: 'Contact a Career Coach',
    isBusinessFacing: false,
    confirmationMessage: 'Thank you for contacting WOW Business & Digital about career coaching and development. We will review your goals and the support requested, then contact you to discuss suitable options. Please do not send highly sensitive personal information that is not necessary for the enquiry.',
    gradientClass: 'from-blue-600 via-sky-600 to-cyan-500',
    borderClass: 'border-sky-300/40',
    iconBgClass: 'from-sky-400 to-blue-600',
    activeBadgeClass: 'bg-white/25 text-white border-white/40'
  },
  {
    id: 'partnership',
    title: 'Partnership Enquiry',
    tagline: 'Technology, delivery, research, funding & reseller alliances',
    badge: 'Form 7',
    routingQueue: 'Partnerships',
    icon: Globe,
    primaryBtnText: 'Discuss Partnership',
    isBusinessFacing: true,
    confirmationMessage: 'Thank you for your partnership enquiry. We will review the organisation, proposal, intended benefits and potential contributions. We will contact you if the opportunity is suitable for further discussion. Submission does not create a partnership or commercial commitment.',
    gradientClass: 'from-emerald-600 via-teal-600 to-emerald-500',
    borderClass: 'border-emerald-300/40',
    iconBgClass: 'from-emerald-400 to-teal-600',
    activeBadgeClass: 'bg-white/25 text-white border-white/40'
  }
];

export interface ContactSectionProps {
  initialCategory?: EnquiryCategory;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialCategory }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<EnquiryCategory | null>(initialCategory || null);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailDeliveryWarning, setEmailDeliveryWarning] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategoryId(initialCategory);
      setSubmitted(false);
      const timer = setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [initialCategory]);

  const handleSelectCategory = (catId: EnquiryCategory) => {
    setSelectedCategoryId(catId);
    setSubmitted(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Common Fields State
  const [commonFields, setCommonFields] = useState({
    firstName: '',
    surname: '',
    organisationName: '',
    jobTitle: '',
    email: '',
    telephone: '',
    preferredContactMethod: 'Email',
    preferredContactTime: 'No preference',
    privacyAcknowledged: false,
    marketingConsent: false
  });

  // Service-Specific States
  // Form 1: Business Consultancy
  const [form1, setForm1] = useState({
    supportNeeded: [] as string[],
    organisationType: 'Private business',
    organisationSize: '11-50',
    challenge: '',
    desiredOutcome: '',
    stage: 'Exploring options',
    desiredStartDate: '',
    expectedDuration: '1-3 months',
    budgetRange: 'Prefer to discuss'
  });

  // Form 2: Staffing
  const [form2, setForm2] = useState({
    supportNeeded: [] as string[],
    numberOfPeople: '1',
    engagementType: 'Interim',
    daysPerWeek: '5',
    preferredStartDate: 'As soon as possible',
    expectedDuration: '3-6 months',
    locationPattern: 'Hybrid',
    locationDetails: '',
    sectorExperience: [] as string[],
    essentialSkills: '',
    expectedOutputs: '',
    budgetRateRange: 'Prefer to discuss',
    securityChecks: ''
  });

  // Form 3: Training & Career Accelerator Registration & Assessment (Form 4 on UI tabs)
  const [form3, setForm3] = useState({
    fullName: '',
    email: '',
    mobileWhatsapp: '',
    townCity: '',
    workStatus: 'Employed',
    workStatusOther: '',
    rightToWorkUK: 'Yes',
    highestQualification: 'Undergraduate Degree',
    highestQualificationOther: '',
    pmQualifications: [] as string[],
    previousExperience: '',
    ukWorkExperience: 'Yes',
    englishFirstLanguage: 'Yes',
    careerObjective: '',
    currentChallenge: '',
    developmentNeeds: [
      'Practical PM experience',
      'Stakeholder management',
      'Workplace communication'
    ] as string[],
    developmentNeedsOther: '',
    successMeasure: '',
    weeklyAvailability: 'Yes - fully committed to weekly project and development work',
    birminghamAttendance: 'Yes',
    inPersonProjectAttendance: 'Yes',
    packageSelection: 'WOW Career Accelerator 6-Month Programme (£1,000)',
    paymentPreference: 'Pay in full (£900 - 10% Early Settlement Discount by 31 Oct)',
    howDidYouHear: 'Search engine',
    promoCode: '',
    claimedIncentive: true,
    // Section 10: 7 Mandatory Form Declarations
    declaration1: true,
    declaration2: true,
    declaration3: true,
    declaration4: true,
    declaration5: true,
    declaration6: true,
    declaration7: true
  });

  // Form 4: AI & Digital Solutions
  const [form4, setForm4] = useState({
    interestedIn: [] as string[],
    businessProblem: '',
    currentProcess: '',
    solutionUsers: [] as string[],
    informationUsed: '',
    outputsNeeded: [] as string[],
    outputDetailsText: '',
    currentSystems: '',
    integrations: [] as string[],
    informationSensitivity: 'Internal',
    stage: 'Exploring',
    desiredTimescale: '1-3 months',
    budgetRange: 'Prefer to discuss'
  });

  // Form 5: Career Coaching
  const [form5, setForm5] = useState({
    supportNeeded: [] as string[],
    currentSituation: 'Employed',
    recentRole: '',
    targetRoleDirection: '',
    goalsToAchieve: '',
    deadline: 'No fixed deadline',
    careerLevel: 'Mid-career',
    preferredFormat: 'Coaching package',
    accessibilityNeeds: ''
  });

  // Form 6: Partnership
  const [form6, setForm6] = useState({
    partnershipType: 'Technology',
    organisationOverview: '',
    proposalDescription: '',
    problemAddressed: '',
    contributions: '',
    beneficiaries: '',
    geography: 'UK',
    proposedTimeframe: '1-3 months'
  });

  // Form 7: General
  const [form7, setForm7] = useState({
    reason: 'General information',
    subject: '',
    message: '',
    isUrgent: 'No'
  });

  const selectedCategory = CATEGORIES.find(c => c.id === selectedCategoryId);

  // Helper toggle for multi-select arrays
  const toggleArrayItem = (list: string[], setList: (newVal: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategoryId === 'training') {
      if (!form3.declaration1 || !form3.declaration2 || !form3.declaration3 || !form3.declaration4 || !form3.declaration5 || !form3.declaration6 || !form3.declaration7) {
        alert("Please confirm all required declarations in Section 10 before submitting your registration.");
        return;
      }
    }
    if (!(selectedCategoryId === 'training' ? form3.privacyAcknowledged : commonFields.privacyAcknowledged)) {
      alert("Please confirm how your information will be used before submitting.");
      return;
    }
    if (!selectedCategoryId || submitting) return;
    setSubmitting(true);
    setSubmissionError('');
    try {
      const details = selectedCategoryId === 'general' ? form7 : selectedCategoryId === 'business-consultancy' ? form1 : selectedCategoryId === 'staffing' ? form2 : selectedCategoryId === 'training' ? form3 : selectedCategoryId === 'ai-solutions' ? form4 : selectedCategoryId === 'career-coaching' ? form5 : form6;
      const contact = selectedCategoryId === 'training' ? {
        firstName: form3.fullName.trim().split(/\s+/)[0] || '',
        surname: form3.fullName.trim().split(/\s+/).slice(1).join(' '),
        email: form3.email,
        telephone: form3.mobileWhatsapp,
        privacyAcknowledged: form3.privacyAcknowledged,
      } : commonFields;
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategoryId, contact, details })
      });
      if (!response.ok) throw new Error('Your enquiry could not be saved. Please try again or email us directly.');
      const result = await response.json();
      setEmailDeliveryWarning(!result.staffEmailSent || !result.acknowledgementSent);
      setSubmitted(true);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Your enquiry could not be sent.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* BACKGROUND WAVE & LIGHT ACCENTS MATCHING HOME PAGE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl"></div>
        <svg className="absolute top-0 left-0 w-full h-full text-slate-200/40" viewBox="0 0 1440 900" fill="none">
          <path d="M-100 200 C300 400 600 100 1000 300 C1300 450 1500 200 1600 100 V900 H-100 Z" fill="url(#contact-bg-wave)" opacity="0.6" />
          <defs>
            <linearGradient id="contact-bg-wave" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E9F5F5" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        
        {/* HEADER HERO MATCHING HOME PAGE */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black border border-blue-200 shadow-xs">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>WOW Business & Digital • Contact & Enquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How Can We Help Your Organisation?
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mx-auto">
            Select the category that best describes your requirement. Our dynamic enquiry form will route your request directly to the appropriate person.
          </p>
        </div>

        {/* QUICK CONTACT HIGHLIGHT CARDS (MATCHING HOME PAGE GLOSSY THEME - NO DARK BLUE) */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38B6FF] via-[#0084FF] to-[#0052FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-0.5">Direct Email</h3>
              <a href="mailto:wowdigital@wowbusinessanddigital.com" className="text-xs font-bold text-blue-600 hover:underline break-all block">
                wowdigital@wowbusinessanddigital.com
              </a>
              <p className="text-[10px] text-slate-500 mt-0.5">We review messages and respond as soon as possible</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4EE376] via-[#00C853] to-[#00A859] text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-0.5">Telephone / WhatsApp</h3>
              <a href="tel:+441212969549" className="text-sm font-black text-emerald-600 hover:underline block">
                +44 121 296 9549
              </a>
              <p className="text-[10px] text-slate-500 mt-0.5">UK & International Assistance</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38B6FF] via-[#0084FF] to-[#0052FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-0.5">International enquiries</h3>
              <p className="text-xs font-bold text-slate-900">UK & International Operations</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Direct Advisory & Strategic Delivery</p>
            </div>
          </div>
        </div>

        {/* MAIN STEPPED FORM SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* STEP 1: CATEGORY SELECTION HEADER (CLEAN LIGHT CANVAS WITH GLOSSY TILES) */}
          <div className="bg-gradient-to-b from-slate-50 to-white p-5 sm:p-6 space-y-4 border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase text-blue-600 tracking-wider block mb-1">
                  STEP 1: SELECT YOUR ENQUIRY TYPE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  What type of support or information do you require?
                </h2>
              </div>
              {selectedCategory && (
                <div className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xs">
                  <span>Selected: {selectedCategory.title}</span>
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black">
                    {selectedCategory.badge}
                  </span>
                </div>
              )}
            </div>

            {/* 7 CATEGORY CARDS GRID - MATCHING THE HOME PAGE'S VIVID GLOSSY GRADIENTS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategoryId === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`text-left p-3.5 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between space-y-3 overflow-hidden ${
                      isSelected
                        ? `bg-gradient-to-tr ${cat.gradientClass} text-white ${cat.borderClass} shadow-xl scale-[1.02] ring-2 ring-blue-500`
                        : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:shadow-md hover:bg-blue-50/20'
                    }`}
                  >
                    {/* Top ambient sheen for selected card */}
                    {isSelected && (
                      <div 
                        className="absolute inset-0 pointer-events-none rounded-2xl" 
                        style={{ 
                          background: 'linear-gradient(55deg, transparent 48%, rgba(255,255,255,0.1) 48.5%, rgba(255,255,255,0.22) 100%)' 
                        }} 
                      />
                    )}

                    <div className="flex items-center justify-between relative z-10">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected 
                          ? `bg-gradient-to-br ${cat.iconBgClass} text-white shadow-md` 
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isSelected 
                          ? cat.activeBadgeClass 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {cat.badge}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <h3 className={`text-xs font-black leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {cat.title}
                      </h3>
                      <p className={`text-[11px] mt-1 line-clamp-2 leading-snug ${isSelected ? 'text-white/90 font-medium' : 'text-slate-500'}`}>
                        {cat.tagline}
                      </p>
                    </div>

                    <div className={`pt-2 border-t flex items-center justify-between text-[10px] font-bold relative z-10 ${
                      isSelected ? 'border-white/20' : 'border-slate-100'
                    }`}>
                      <span className={isSelected ? 'text-white font-black' : 'text-blue-600 group-hover:text-blue-700'}>
                        {isSelected ? 'Form Active ✓' : 'Select Form'}
                      </span>
                      <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-1 text-white' : 'text-blue-500 group-hover:translate-x-1'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        {/* STEP 2: DYNAMIC FORM LOADING AREA */}
        <div ref={formRef} className="p-6 sm:p-10 scroll-mt-24">
          {!selectedCategory ? (
            /* PROMPT STATE IF NO CATEGORY CHOSEN YET */
            <div className="text-center py-12 space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto border border-blue-500/20">
                <HelpCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Please Select an Enquiry Type Above</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose one of the 7 options above (Business Consultancy, Staffing, Training, AI Solutions, Career Coaching, Partnership, or General Enquiry) to load the corresponding required fields.
              </p>
            </div>
          ) : submitted ? (
            /* SUBMISSION CONFIRMATION VIEW (EXACT MATCH TO SPEC) */
            <div className="max-w-2xl mx-auto text-center space-y-6 py-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-bold border border-emerald-300 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Enquiry Submitted • {selectedCategory.routingQueue}
                </span>
                <h2 className="text-2xl font-black text-slate-900">Thank You for Contacting WOW Business & Digital</h2>
              </div>

              {/* Exact On-screen confirmation text from Specification */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed text-left space-y-2">
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Enquiry confirmation</span>
                </p>
                <p>{selectedCategory.confirmationMessage}</p>
                {emailDeliveryWarning && <p className="font-semibold">Your enquiry was recorded, but email delivery could not be confirmed. Please email wowdigital@wowbusinessanddigital.com with your enquiry reference if it is urgent.</p>}
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-[11px] text-slate-700 text-left space-y-1">
                <span className="font-bold text-blue-900 block">Routing Summary:</span>
                <p>• Primary Contact: {selectedCategoryId === 'training' ? form3.fullName : `${commonFields.firstName} ${commonFields.surname}`} ({selectedCategoryId === 'training' ? form3.email : commonFields.email})</p>
                <p>• Contact / WhatsApp: {selectedCategoryId === 'training' ? form3.mobileWhatsapp : (commonFields.telephone || 'Provided via Email')}</p>
                {selectedCategoryId === 'training' && (
                  <>
                    <p>• Location: {form3.townCity} • UK Work Eligibility: {form3.rightToWorkUK}</p>
                    <p>• Selected Package: {form3.packageSelection}</p>
                    <p>• Payment Preference: {form3.paymentPreference}</p>
                  </>
                )}
                <p>• Enquiry type: <span className="font-bold">{selectedCategory.routingQueue}</span></p>
              </div>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-blue-700 shadow-md transition-colors"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : selectedCategoryId === 'training' ? (
            /* DEDICATED TRAINING & CAREER ACCELERATOR REGISTRATION/ASSESSMENT FORM */
            <div>
              {/* FORM TITLE & ROUTING BADGE */}
              <div className="pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-emerald-300">
                      {selectedCategory.badge}
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedCategory.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedCategory.tagline}
                  </p>
                </div>

                <div className="text-right text-[11px]">
                  <span className="text-slate-400 block font-semibold">Enquiry type:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mt-0.5">
                    {selectedCategory.routingQueue}
                  </span>
                </div>
              </div>

              <TrainingRegistrationForm
                formData={form3}
                setFormData={setForm3}
                onSubmit={handleSubmit}
              />
            </div>
          ) : (
            /* ACTIVE FORM ENTRY AREA FOR ALL OTHER SERVICE ENQUIRIES */
            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
              
              {/* FORM TITLE & ROUTING BADGE */}
              <div className="pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-blue-200">
                      {selectedCategory.badge}
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedCategory.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedCategory.tagline}
                  </p>
                </div>

                <div className="text-right text-[11px]">
                  <span className="text-slate-400 block font-semibold">Enquiry type:</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block mt-0.5">
                    {selectedCategory.routingQueue}
                  </span>
                </div>
              </div>

              {/* COMMON CONTACT FIELDS */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  1. Common Contact Details
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={commonFields.firstName}
                      onChange={(e) => setCommonFields({ ...commonFields, firstName: e.target.value })}
                      placeholder="e.g. John"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Surname <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={commonFields.surname}
                      onChange={(e) => setCommonFields({ ...commonFields, surname: e.target.value })}
                      placeholder="e.g. Smith"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Organisation / Business Name {selectedCategory.isBusinessFacing && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      required={selectedCategory.isBusinessFacing}
                      type="text"
                      value={commonFields.organisationName}
                      onChange={(e) => setCommonFields({ ...commonFields, organisationName: e.target.value })}
                      placeholder="e.g. Acme Corp / Ministry of Health / Individual"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Job Title / Role {selectedCategory.isBusinessFacing && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      required={selectedCategory.isBusinessFacing}
                      type="text"
                      value={commonFields.jobTitle}
                      onChange={(e) => setCommonFields({ ...commonFields, jobTitle: e.target.value })}
                      placeholder="e.g. PMO Director / Operations Lead"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={commonFields.email}
                      onChange={(e) => setCommonFields({ ...commonFields, email: e.target.value })}
                      placeholder="john.smith@organisation.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Telephone Number <span className="text-slate-400 font-normal">(Optional - with country code)</span>
                    </label>
                    <input
                      type="tel"
                      value={commonFields.telephone}
                      onChange={(e) => setCommonFields({ ...commonFields, telephone: e.target.value })}
                      placeholder="+44 121 296 9549 / +263 ..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Preferred Contact Method <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={commonFields.preferredContactMethod}
                      onChange={(e) => setCommonFields({ ...commonFields, preferredContactMethod: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Email">Email</option>
                      <option value="Telephone">Telephone</option>
                      <option value="Video call">Video Call (MS Teams/Zoom)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Preferred Contact Time <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={commonFields.preferredContactTime}
                      onChange={(e) => setCommonFields({ ...commonFields, preferredContactTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="No preference">No preference</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. DYNAMIC SERVICE-SPECIFIC QUESTION SECTIONS */}
              <div className="space-y-6 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  {selectedCategoryId === 'training' ? '4. Enquiry & Registration Details' : `2. ${selectedCategory.title} Specific Questions`}
                </h3>

                {/* ======================================================== */}
                {/* FORM 1: BUSINESS CONSULTANCY & GROWTH */}
                {/* ======================================================== */}
                {selectedCategoryId === 'business-consultancy' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-2">
                        What support are you looking for? (Multi-select) <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          'Business consultancy',
                          'Business coaching',
                          'Growth strategy',
                          'Operational improvement',
                          'Business transformation',
                          'Programme/project management',
                          'PMO/governance',
                          'Business analysis',
                          'Benefits realisation',
                          'Other'
                        ].map((item) => {
                          const isChecked = form1.supportNeeded.includes(item);
                          return (
                            <button
                              type="button"
                              key={item}
                              onClick={() => toggleArrayItem(form1.supportNeeded, (arr) => setForm1({ ...form1, supportNeeded: arr }), item)}
                              className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                                isChecked
                                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{item}</span>
                              {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Organisation Type <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form1.organisationType}
                          onChange={(e) => setForm1({ ...form1, organisationType: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="Private business">Private business</option>
                          <option value="Public sector">Public sector</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Not-for-profit">Not-for-profit</option>
                          <option value="Agriculture">Agriculture</option>
                          <option value="Start-up">Start-up</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Organisation Size <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <select
                          value={form1.organisationSize}
                          onChange={(e) => setForm1({ ...form1, organisationSize: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="1">1 employee</option>
                          <option value="2-10">2 - 10 employees</option>
                          <option value="11-50">11 - 50 employees</option>
                          <option value="51-250">51 - 250 employees</option>
                          <option value="251-1,000">251 - 1,000 employees</option>
                          <option value="1,000+">1,000+ employees</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        What challenge are you trying to solve? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={form1.challenge}
                        onChange={(e) => setForm1({ ...form1, challenge: e.target.value })}
                        placeholder="Describe the current operational, project or strategic problem..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        What outcome would you like to achieve? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={form1.desiredOutcome}
                        onChange={(e) => setForm1({ ...form1, desiredOutcome: e.target.value })}
                        placeholder="Capture your desired result and measures of success..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          What stage are you at? <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form1.stage}
                          onChange={(e) => setForm1({ ...form1, stage: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="Exploring options">Exploring options</option>
                          <option value="Planning">Planning</option>
                          <option value="Already started">Already started</option>
                          <option value="Programme/project at risk">Programme/project at risk</option>
                          <option value="Need urgent support">Need urgent support</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Desired Start Date <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={form1.desiredStartDate}
                          onChange={(e) => setForm1({ ...form1, desiredStartDate: e.target.value })}
                          placeholder="e.g. Next month / Immediate"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Expected Duration <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <select
                          value={form1.expectedDuration}
                          onChange={(e) => setForm1({ ...form1, expectedDuration: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="One-off session">One-off session</option>
                          <option value="Under 1 month">Under 1 month</option>
                          <option value="1-3 months">1 - 3 months</option>
                          <option value="3-6 months">3 - 6 months</option>
                          <option value="6+ months">6+ months</option>
                          <option value="Not sure">Not sure</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Budget Range <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <select
                        value={form1.budgetRange}
                        onChange={(e) => setForm1({ ...form1, budgetRange: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      >
                        <option value="Prefer to discuss">Prefer to discuss</option>
                        <option value="Under £10,000 / $10k">Under £10,000 / $10k</option>
                        <option value="£10,000 - £25,000">£10,000 - £25,000</option>
                        <option value="£25,000 - £50,000">£25,000 - £50,000</option>
                        <option value="£50,000+">£50,000+</option>
                        <option value="Not yet set">Not yet set</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* FORM 2: STAFFING REQUEST FORM */}
                {/* ======================================================== */}
                {selectedCategoryId === 'staffing' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-2">
                        What support do you need? (Multi-select) <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          'Programme lead/manager',
                          'Project manager',
                          'Project coordinator',
                          'PMO manager/analyst',
                          'Business analyst',
                          'Change manager',
                          'Delivery manager',
                          'Benefits manager',
                          'Project support officer',
                          'Other'
                        ].map((role) => {
                          const isChecked = form2.supportNeeded.includes(role);
                          return (
                            <button
                              type="button"
                              key={role}
                              onClick={() => toggleArrayItem(form2.supportNeeded, (arr) => setForm2({ ...form2, supportNeeded: arr }), role)}
                              className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                                isChecked
                                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{role}</span>
                              {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Number of People Required <span className="text-rose-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={form2.numberOfPeople}
                          onChange={(e) => setForm2({ ...form2, numberOfPeople: e.target.value })}
                          placeholder="e.g. 1, 2 or 'Not sure'"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Engagement Type <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form2.engagementType}
                          onChange={(e) => setForm2({ ...form2, engagementType: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="Part-time">Part-time</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Interim">Interim</option>
                          <option value="Fixed-term">Fixed-term</option>
                          <option value="Defined output">Defined output</option>
                          <option value="Blended team">Blended team</option>
                          <option value="Not sure">Not sure</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Days per Week <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form2.daysPerWeek}
                          onChange={(e) => setForm2({ ...form2, daysPerWeek: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="1">1 day / week</option>
                          <option value="2">2 days / week</option>
                          <option value="3">3 days / week</option>
                          <option value="4">4 days / week</option>
                          <option value="5">5 days / week (Full time)</option>
                          <option value="Flexible">Flexible</option>
                          <option value="Not sure">Not sure</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Preferred Start Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={form2.preferredStartDate}
                          onChange={(e) => setForm2({ ...form2, preferredStartDate: e.target.value })}
                          placeholder="e.g. As soon as possible / 1st Sept"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Expected Duration <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form2.expectedDuration}
                          onChange={(e) => setForm2({ ...form2, expectedDuration: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="Under 1 month">Under 1 month</option>
                          <option value="1-3 months">1 - 3 months</option>
                          <option value="3-6 months">3 - 6 months</option>
                          <option value="6-12 months">6 - 12 months</option>
                          <option value="12+ months">12+ months</option>
                          <option value="Not sure">Not sure</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Location and Working Pattern <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form2.locationPattern}
                          onChange={(e) => setForm2({ ...form2, locationPattern: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="On-site">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Location Details / Travel Expectations <span className="text-rose-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={form2.locationDetails}
                          onChange={(e) => setForm2({ ...form2, locationDetails: e.target.value })}
                          placeholder="e.g. London UK office 2 days/week, or Harare"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Expected Outputs / Key Responsibilities <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={form2.expectedOutputs}
                        onChange={(e) => setForm2({ ...form2, expectedOutputs: e.target.value })}
                        placeholder="Focus on required outcomes, deliverables, or core job responsibilities..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Essential Skills or Qualifications <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={form2.essentialSkills}
                        onChange={(e) => setForm2({ ...form2, essentialSkills: e.target.value })}
                        placeholder="e.g. PRINCE2, Agile, Healthcare experience, SAP, PowerBI"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* FORM 4: AI & DIGITAL SOLUTIONS FORM */}
                {/* ======================================================== */}
                {selectedCategoryId === 'ai-solutions' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-2">
                        What solution are you interested in? (Multi-select) <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          'WOW Assistant',
                          'WOW Business Assistant',
                          'WOW Farm Assistant',
                          'Reporting automation',
                          'Workflow automation',
                          'Guided AI tool',
                          'AI-supported knowledge/learning feature',
                          'AI readiness',
                          'Bespoke solution',
                          'Other'
                        ].map((solution) => {
                          const isChecked = form4.interestedIn.includes(solution);
                          return (
                            <button
                              type="button"
                              key={solution}
                              onClick={() => toggleArrayItem(form4.interestedIn, (arr) => setForm4({ ...form4, interestedIn: arr }), solution)}
                              className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                                isChecked
                                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{solution}</span>
                              {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        What business problem are you trying to solve? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={form4.businessProblem}
                        onChange={(e) => setForm4({ ...form4, businessProblem: e.target.value })}
                        placeholder="Start with the core operational need, bottleneck or opportunity..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        How is the work currently done? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={form4.currentProcess}
                        onChange={(e) => setForm4({ ...form4, currentProcess: e.target.value })}
                        placeholder="Capture current processes, pain points, manual steps, or delays..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-2">
                        Who will use the solution? (Multi-select) <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {['Staff', 'Managers', 'Customers', 'Learners', 'Business owners', 'Farmers', 'Other'].map((userType) => {
                          const isChecked = form4.solutionUsers.includes(userType);
                          return (
                            <button
                              type="button"
                              key={userType}
                              onClick={() => toggleArrayItem(form4.solutionUsers, (arr) => setForm4({ ...form4, solutionUsers: arr }), userType)}
                              className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                                isChecked
                                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{userType}</span>
                              {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        What information will the solution use? <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={form4.informationUsed}
                        onChange={(e) => setForm4({ ...form4, informationUsed: e.target.value })}
                        placeholder="Examples: forms, reports, policies, messages, spreadsheets, voice notes, images"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Information Sensitivity <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form4.informationSensitivity}
                          onChange={(e) => setForm4({ ...form4, informationSensitivity: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="Public">Public information</option>
                          <option value="Internal">Internal business data</option>
                          <option value="Personal data">Personal data (GDPR/Data protection)</option>
                          <option value="Commercially sensitive">Commercially sensitive</option>
                          <option value="Health/social care">Health / Social care data</option>
                          <option value="Financial">Financial records</option>
                          <option value="Not sure">Not sure</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          What stage are you at? <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form4.stage}
                          onChange={(e) => setForm4({ ...form4, stage: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="Exploring">Exploring options</option>
                          <option value="Need a demonstration">Need a live demonstration</option>
                          <option value="Proof of concept">Proof of concept</option>
                          <option value="Pilot">Pilot project</option>
                          <option value="Ready to implement">Ready to implement</option>
                          <option value="Existing solution needs improvement">Existing solution needs improvement</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* FORM 5: CAREER COACHING & DEVELOPMENT */}
                {/* ======================================================== */}
                {selectedCategoryId === 'career-coaching' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-2">
                        What support are you looking for? (Multi-select) <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          'Career coaching',
                          'Career planning',
                          'CV review',
                          'LinkedIn profile',
                          'Job application',
                          'Interview preparation',
                          'Presentation preparation',
                          'Professional development',
                          'Other'
                        ].map((item) => {
                          const isChecked = form5.supportNeeded.includes(item);
                          return (
                            <button
                              type="button"
                              key={item}
                              onClick={() => toggleArrayItem(form5.supportNeeded, (arr) => setForm5({ ...form5, supportNeeded: arr }), item)}
                              className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                                isChecked
                                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{item}</span>
                              {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Current Situation <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form5.currentSituation}
                          onChange={(e) => setForm5({ ...form5, currentSituation: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="Employed">Employed</option>
                          <option value="Self-employed">Self-employed</option>
                          <option value="Returning to work">Returning to work</option>
                          <option value="Redundancy/at risk">Redundancy / at risk</option>
                          <option value="Career change">Career change</option>
                          <option value="Graduate/early career">Graduate / early career</option>
                          <option value="Not currently working">Not currently working</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Current or Most Recent Role <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={form5.recentRole}
                          onChange={(e) => setForm5({ ...form5, recentRole: e.target.value })}
                          placeholder="e.g. Senior Project Manager / NHS Nurse"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Target Role, Sector or Direction <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={form5.targetRoleDirection}
                        onChange={(e) => setForm5({ ...form5, targetRoleDirection: e.target.value })}
                        placeholder="e.g. Head of PMO in Tech, or 'Not sure - I need help clarifying this'"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        What would you like to achieve? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={form5.goalsToAchieve}
                        onChange={(e) => setForm5({ ...form5, goalsToAchieve: e.target.value })}
                        placeholder="Describe your primary career objectives, promotion goals, or application timelines..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Preferred Support Format <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form5.preferredFormat}
                          onChange={(e) => setForm5({ ...form5, preferredFormat: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="One-off review">One-off review</option>
                          <option value="One-to-one session">One-to-one session</option>
                          <option value="Coaching package">Coaching package</option>
                          <option value="Mock interview">Mock interview</option>
                          <option value="Written feedback">Written feedback</option>
                          <option value="Not sure">Not sure</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Is there a Deadline? <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={form5.deadline}
                          onChange={(e) => setForm5({ ...form5, deadline: e.target.value })}
                          placeholder="e.g. Interview on 12th Aug / No fixed deadline"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* FORM 6: PARTNERSHIP ENQUIRY FORM */}
                {/* ======================================================== */}
                {selectedCategoryId === 'partnership' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Type of Partnership <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form6.partnershipType}
                          onChange={(e) => setForm6({ ...form6, partnershipType: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="Technology">Technology alliance</option>
                          <option value="Training">Training partnership</option>
                          <option value="Delivery">Delivery / Subcontracting</option>
                          <option value="Research">Research & Academic</option>
                          <option value="Funding">Funding & Grant project</option>
                          <option value="Community">Community initiative</option>
                          <option value="Referral">Referral agreement</option>
                          <option value="Reseller/distribution">Reseller / Distribution</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Geography Covered <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form6.geography}
                          onChange={(e) => setForm6({ ...form6, geography: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="UK">United Kingdom</option>
                          <option value="Zimbabwe">Zimbabwe</option>
                          <option value="International">International</option>
                          <option value="Global / Multi-country">Global / Multi-country</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Tell us about your organisation <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={form6.organisationOverview}
                        onChange={(e) => setForm6({ ...form6, organisationOverview: e.target.value })}
                        placeholder="Brief description, location and relevant background..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        What partnership are you proposing? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={form6.proposalDescription}
                        onChange={(e) => setForm6({ ...form6, proposalDescription: e.target.value })}
                        placeholder="Describe the core concept and proposed relationship model..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        What problem or opportunity would it address? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={form6.problemAddressed}
                        onChange={(e) => setForm6({ ...form6, problemAddressed: e.target.value })}
                        placeholder="Clarify the mutual objective and market need..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        What would each party contribute? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={form6.contributions}
                        onChange={(e) => setForm6({ ...form6, contributions: e.target.value })}
                        placeholder="Include expertise, technology, funding, access or delivery capacity..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* FORM 7: GENERAL ENQUIRY FORM */}
                {/* ======================================================== */}
                {selectedCategoryId === 'general' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Reason for Contacting Us <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form7.reason}
                          onChange={(e) => setForm7({ ...form7, reason: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="Website issue">Website issue</option>
                          <option value="Media/speaking">Media / Speaking request</option>
                          <option value="Supplier">Supplier / Vendor enquiry</option>
                          <option value="Existing client">Existing client query</option>
                          <option value="Feedback">Feedback</option>
                          <option value="General information">General information</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Is this Urgent? <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <select
                          value={form7.isUrgent}
                          onChange={(e) => setForm7({ ...form7, isUrgent: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                        >
                          <option value="No">No - Standard response</option>
                          <option value="Yes">Yes - Please explain in message</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Subject <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={form7.subject}
                        onChange={(e) => setForm7({ ...form7, subject: e.target.value })}
                        placeholder="Concise summary of your enquiry"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={form7.message}
                        onChange={(e) => setForm7({ ...form7, message: e.target.value })}
                        placeholder="Please write your query. Avoid including unnecessary sensitive confidential information..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                )}

                <p className="pt-2 text-xs text-slate-600">
                  If supporting documents are needed, we will ask for them after reviewing your enquiry. Files are not submitted with this form.
                </p>

              </div>

              {/* 3. LEGAL ACKNOWLEDGEMENTS & PRIVACY (MANDATED FOOTER WORDING) */}
              <div className="pt-6 border-t border-slate-200 space-y-4 bg-slate-50 p-5 rounded-2xl">
                <div className="text-[11px] text-slate-600 leading-relaxed space-y-2">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Privacy Note:</span>
                  </p>
                  <p>
                    We will use the information you provide to respond to your enquiry and manage any agreed next steps. Please do not include sensitive personal, commercial, health, financial or confidential information unless it is necessary and you are authorised to share it. For questions about how your information is handled, email <a href="mailto:wowdigital@wowbusinessanddigital.com" className="text-blue-700 font-bold underline">wowdigital@wowbusinessanddigital.com</a>.
                  </p>
                </div>

                {/* REQUIRED PRIVACY ACKNOWLEDGEMENT CHECKBOX */}
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    required
                    type="checkbox"
                    id="privacy-ack-checkbox"
                    checked={commonFields.privacyAcknowledged}
                    onChange={(e) => setCommonFields({ ...commonFields, privacyAcknowledged: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                  />
                  <label htmlFor="privacy-ack-checkbox" className="text-xs font-bold text-slate-900 cursor-pointer">
                    I understand that my information will be used to respond to this enquiry. <span className="text-rose-500">*</span>
                  </label>
                </div>

                {/* OPTIONAL MARKETING CONSENT CHECKBOX */}
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="marketing-consent-checkbox"
                    checked={commonFields.marketingConsent}
                    onChange={(e) => setCommonFields({ ...commonFields, marketingConsent: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                  />
                  <label htmlFor="marketing-consent-checkbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Optional marketing consent: I would like to receive relevant news, course information and service updates from WOW Business & Digital Limited. I understand that I can unsubscribe at any time.
                  </label>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                {submissionError && <p role="alert" className="text-sm text-red-700 mb-3">{submissionError}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-sm py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>{submitting ? 'Sending…' : selectedCategory.primaryBtnText}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>

    </div>
  </div>
  );
};
