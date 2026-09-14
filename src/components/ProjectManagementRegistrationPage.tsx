import React, { useState, useEffect, useRef } from 'react';
import { NavTab } from '../types';
import { BRAND_INFO } from '../data/companyData';
import { TrainingRegistrationForm, TrainingFormData } from './TrainingRegistrationForm';
import { 
  ArrowLeft, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Send, 
  Award, 
  Clock, 
  PhoneCall, 
  AlertCircle,
  X,
  FileCheck,
  FileText
} from 'lucide-react';

interface ProjectManagementRegistrationPageProps {
  setActiveTab: (tab: NavTab) => void;
}

const INITIAL_FORM_DATA: TrainingFormData = {
  fullName: '',
  email: '',
  mobileWhatsapp: '',
  townCity: '',
  workStatus: 'Employed full-time',
  workStatusOther: '',
  rightToWorkUK: 'Yes',
  highestQualification: 'Undergraduate Degree',
  highestQualificationOther: '',
  pmQualifications: [],
  previousExperience: 'Yes, 1-3 years',
  ukWorkExperience: 'Yes, more than 2 years',
  englishFirstLanguage: 'Yes',
  careerObjective: 'Career transition into formal project management and agile delivery.',
  currentChallenge: 'Lack of verified UK project work portfolio and practical hands-on governance experience.',
  developmentNeeds: ['Practical PM experience', 'Stakeholder management', 'Planning/reporting'],
  developmentNeedsOther: '',
  successMeasure: 'Securing a recognized PM / PMO role with high commercial credibility.',
  weeklyAvailability: '10-15 hours/week (Evenings & Weekends)',
  birminghamAttendance: 'Yes, fully flexible',
  inPersonProjectAttendance: 'Hybrid (Attend key in-person sessions & remote)',
  packageSelection: 'WOW Career Accelerator 6-Month Programme (£1,000)',
  paymentPreference: 'Pay in full (£900 - 10% Early Settlement Discount by 31 Oct)',
  howDidYouHear: 'Website',
  promoCode: 'WOW-EARLY-OFFER',
  declaration1: true,
  declaration2: true,
  declaration3: true,
  declaration4: true,
  declaration5: true,
  declaration6: true,
  declaration7: true,
  privacyAcknowledged: true,
  marketingConsent: false,
};

export const ProjectManagementRegistrationPage: React.FC<ProjectManagementRegistrationPageProps> = ({ 
  setActiveTab 
}) => {
  const [formData, setFormData] = useState<TrainingFormData>(() => {
    try {
      const saved = localStorage.getItem('wow_pm_registration_draft');
      if (saved) {
        return { ...INITIAL_FORM_DATA, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return INITIAL_FORM_DATA;
  });

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [freeTesterSubmitted, setFreeTesterSubmitted] = useState(false);
  const [testerReference, setTesterReference] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  // Auto-save draft
  useEffect(() => {
    try {
      localStorage.setItem('wow_pm_registration_draft', JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setValidationError('Please enter your full legal name.');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    if (!formData.mobileWhatsapp.trim()) {
      setValidationError('Please provide a mobile or WhatsApp contact number.');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    if (!formData.privacyAcknowledged) {
      setValidationError('Please acknowledge the Privacy Notice declaration before submitting.');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    setValidationError(null);
    return true;
  };

  // 1. FREE TESTER: Save details, submit with no payment
  const handleFreeTester = () => {
    if (!validateForm()) return;

    const ref = `TESTER-${Math.floor(100000 + Math.random() * 900000)}`;
    setTesterReference(ref);

    const submission = {
      ...formData,
      submissionType: 'FREE_TESTER',
      submittedAt: new Date().toISOString(),
      referenceNumber: ref,
      status: 'FREE_TESTER_CONFIRMED'
    };

    try {
      localStorage.setItem('wow_pm_registration_submitted', JSON.stringify(submission));
      // Dispatch to Admissions Backend (Option 2: Email alert & Option 3: Google Sheets Sync)
      fetch('/api/registrations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      }).catch(err => console.warn('Admissions sync notification warning:', err));
    } catch {
      // ignore
    }

    setFreeTesterSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. SUBMIT AND PAY: Save details, go to payment page
  const handleSubmitAndPay = () => {
    if (!validateForm()) return;

    const ref = `WOW-PM-${Math.floor(100000 + Math.random() * 900000)}`;

    const submission = {
      ...formData,
      submissionType: 'SUBMIT_AND_PAY',
      submittedAt: new Date().toISOString(),
      referenceNumber: ref,
      status: 'AWAITING_PAYMENT'
    };

    try {
      localStorage.setItem('wow_pm_registration_submitted', JSON.stringify(submission));
      
      // Determine appropriate accelerator tier based on registration choice
      let targetTier = 'pm-early-offer';
      const pref = (formData.paymentPreference || '').toLowerCase();
      if (pref.includes('instalment') || pref.includes('500') || pref.includes('two')) {
        targetTier = 'pm-installment';
      } else if (pref.includes('deposit') || pref.includes('50')) {
        targetTier = 'pm-deposit';
      }

      localStorage.setItem('wow_selected_payment_item', targetTier);
      localStorage.setItem('wow_payment_client_name', formData.fullName.trim() || 'Delegate');
      localStorage.setItem('wow_payment_client_email', formData.email || '');

      // Dispatch to Admissions Backend (Option 2: Email alert & Option 3: Google Sheets Sync)
      fetch('/api/registrations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      }).catch(err => console.warn('Admissions sync notification warning:', err));
    } catch {
      // ignore
    }

    // Navigate to payments page
    setActiveTab('payments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 pt-6 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* TOP BREADCRUMB & NAVIGATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-200">
          <button
            onClick={() => {
              setActiveTab('pm-career-accelerator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-800 bg-white hover:bg-sky-50 px-3.5 py-2 rounded-xl border border-sky-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Course Information</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              October 2026 Intake
            </span>
          </div>
        </div>

        {/* HEADER HERO BANNER */}
        <div className="bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]/40 text-slate-900 border border-sky-200 p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Official Application &amp; Registration</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Project Management Career Accelerator Registration
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Please complete the registration fields below. All course structure and curriculum details are detailed on the Course Information page. Choose <strong>Free Tester</strong> to test submission without fee, or <strong>Submit and Pay</strong> to complete your enrolment via our secure payments portal.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs text-slate-700">
            <div className="flex items-center gap-1 bg-white/90 border border-sky-200 px-2.5 py-1 rounded-lg shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Takes ~3 minutes</span>
            </div>
            <div className="flex items-center gap-1 bg-white/90 border border-sky-200 px-2.5 py-1 rounded-lg shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>GDPR &amp; DPA 2018 Compliant</span>
            </div>
            <div className="flex items-center gap-1 bg-white/90 border border-sky-200 px-2.5 py-1 rounded-lg shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>10% Early Discount Code: WOW-EARLY-OFFER</span>
            </div>
          </div>
        </div>

        {/* VALIDATION ERROR BANNER */}
        {validationError && (
          <div 
            ref={errorRef}
            className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 animate-in fade-in"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
            <button 
              onClick={() => setValidationError(null)} 
              className="p-1 text-rose-500 hover:text-rose-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SUCCESS CONFIRMATION MODAL / BANNER (WHEN FREE TESTER SUBMITTED) */}
        {freeTesterSubmitted && (
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-300 shadow-lg space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Free Tester Submission Successful
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
                  Application Details Saved — No Payment Required
                </h2>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  Thank you! Your registration details have been securely recorded under Free Tester status. No payment or fee has been charged.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-xs text-slate-700 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Tester Reference:</span>
                <span className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-0.5 rounded">
                  {testerReference}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Applicant Name:</span>
                <span className="font-bold text-slate-900">{formData.fullName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Email Address:</span>
                <span className="font-bold text-slate-900">{formData.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Waived / Free Tester Mode (£0.00)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveTab('pm-career-accelerator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Return to Course Overview
              </button>

              <button
                onClick={() => {
                  setActiveTab('payments');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                View Payment Options Anytime
              </button>

              <button
                onClick={() => setFreeTesterSubmitted(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium ml-auto cursor-pointer"
              >
                Edit or resubmit form
              </button>
            </div>
          </div>
        )}

        {/* MAIN REGISTRATION FORM CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Applicant Information &amp; Preferences
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">All fields with * are required</span>
          </div>

          <TrainingRegistrationForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitAndPay();
            }}
            uploadedFileName={uploadedFileName}
            onFileUpload={handleFileUpload}
            dualActionButtons={true}
            onFreeTester={handleFreeTester}
            onSubmitAndPay={handleSubmitAndPay}
          />
        </div>

        {/* FOOTER HELPLINE */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>
            Questions regarding enrolment or special terms? Call our team on{' '}
            <a href={`tel:${BRAND_INFO.phone}`} className="font-bold text-blue-700 underline">
              {BRAND_INFO.phone}
            </a>{' '}
            or email{' '}
            <a href={`mailto:${BRAND_INFO.email}`} className="font-bold text-blue-700 underline">
              {BRAND_INFO.email}
            </a>
          </p>
          <p className="text-[11px] text-slate-400">
            WOW Business &amp; Digital Limited • Registered in England &amp; Wales
          </p>
        </div>

      </div>
    </div>
  );
};
