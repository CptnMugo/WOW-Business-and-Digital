import React from 'react';
import {
  Send,
  ShieldCheck,
  Check,
  Upload,
  CheckCircle2,
  CreditCard,
  ArrowRight
} from 'lucide-react';

export interface TrainingFormData {
  fullName: string;
  email: string;
  mobileWhatsapp: string;
  townCity: string;
  workStatus: string;
  workStatusOther: string;
  rightToWorkUK: string;
  highestQualification: string;
  highestQualificationOther: string;
  pmQualifications: string[];
  previousExperience: string;
  ukWorkExperience: string;
  englishFirstLanguage: string;
  careerObjective: string;
  currentChallenge: string;
  developmentNeeds: string[];
  developmentNeedsOther: string;
  successMeasure: string;
  weeklyAvailability: string;
  birminghamAttendance: string;
  inPersonProjectAttendance: string;
  packageSelection: string;
  paymentPreference: string;
  howDidYouHear: string;
  promoCode: string;
  declaration1: boolean;
  declaration2: boolean;
  declaration3: boolean;
  declaration4: boolean;
  declaration5: boolean;
  declaration6: boolean;
  declaration7: boolean;
  privacyAcknowledged: boolean;
  marketingConsent: boolean;
}

interface TrainingRegistrationFormProps {
  formData: TrainingFormData;
  setFormData: React.Dispatch<React.SetStateAction<TrainingFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  submitting?: boolean;
  dualActionButtons?: boolean;
  onFreeTester?: () => void;
  onSubmitAndPay?: () => void;
}

const PM_QUALIFICATIONS_OPTIONS = [
  'PRINCE2 (Foundation / Practitioner)',
  'Agile / Scrum (CSM, PSM, AgilePM)',
  'APM (PFQ / PMQ)',
  'PMP / CAPM (PMI)',
  'Other project / business qualification',
  'Currently studying towards one',
  'None'
];

const DEVELOPMENT_NEEDS_OPTIONS = [
  'Practical PM experience',
  'Stakeholder management',
  'Workplace communication',
  'Business writing',
  'Presentations',
  'Meeting confidence',
  'UK workplace culture',
  'Difficult conversations',
  'Planning/reporting',
  'Digital tools',
  'CV',
  'Applications',
  'Interviews',
  'Leadership/professional confidence',
  'Other'
];

export const TrainingRegistrationForm: React.FC<TrainingRegistrationFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  submitting = false,
  dualActionButtons,
  onFreeTester,
  onSubmitAndPay
}) => {
  const toggleItem = (list: string[], key: 'pmQualifications' | 'developmentNeeds', item: string) => {
    if (item === 'None' && key === 'pmQualifications') {
      setFormData(prev => ({ ...prev, pmQualifications: prev.pmQualifications.includes('None') ? [] : ['None'] }));
      return;
    }

    let updated: string[];
    if (list.includes(item)) {
      updated = list.filter(i => i !== item);
    } else {
      if (key === 'pmQualifications') {
        updated = [...list.filter(i => i !== 'None'), item];
      } else {
        updated = [...list, item];
      }
    }
    setFormData(prev => ({ ...prev, [key]: updated }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* ======================================================== */}
      {/* SECTION 1: PERSONAL DETAILS */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-2">
          1. Personal Details
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-fullName">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input id="training-fullName"
              required
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Tendai Moyo"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-email">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input id="training-email"
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-mobileWhatsapp">
              Mobile / WhatsApp Number <span className="text-rose-500">*</span>
            </label>
            <input id="training-mobileWhatsapp"
              required
              type="tel"
              value={formData.mobileWhatsapp}
              onChange={(e) => setFormData({ ...formData, mobileWhatsapp: e.target.value })}
              placeholder="e.g. +44 121 296 9549"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-townCity">
              Town / City <span className="text-rose-500">*</span>
            </label>
            <input id="training-townCity"
              required
              type="text"
              value={formData.townCity}
              onChange={(e) => setFormData({ ...formData, townCity: e.target.value })}
              placeholder="e.g. Birmingham, London, Manchester..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: WORK STATUS & UK ELIGIBILITY */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-2">
          2. Work Status & UK Eligibility
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-workStatus">
              Current Work Status <span className="text-rose-500">*</span>
            </label>
            <select id="training-workStatus" required
              value={formData.workStatus}
              onChange={(e) =>  setFormData({ ...formData, workStatus: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="" disabled>Please select</option>
              <option value="Employed">Employed</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Student">Student</option>
              <option value="Career break">Career break</option>
              <option value="Other">Other</option>
            </select>
            {formData.workStatus === 'Other' && (
              <input
                type="text"
                value={formData.workStatusOther}
                onChange={(e) => setFormData({ ...formData, workStatusOther: e.target.value })}
                placeholder="Please specify work status..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 mt-2 focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-rightToWorkUK">
              Right to Work in the UK <span className="text-rose-500">*</span>
            </label>
            <select id="training-rightToWorkUK" required
              value={formData.rightToWorkUK}
              onChange={(e) =>  setFormData({ ...formData, rightToWorkUK: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="" disabled>Please select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Not sure">Not sure</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-ukWorkExperience">
              UK Work Experience <span className="text-rose-500">*</span>
            </label>
            <select id="training-ukWorkExperience" required
              value={formData.ukWorkExperience}
              onChange={(e) =>  setFormData({ ...formData, ukWorkExperience: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="" disabled>Please select</option>
              <option value="Yes">Yes - Have UK workplace experience</option>
              <option value="No">No - Previous experience is outside UK or entering UK workplace</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-englishFirstLanguage">
              Is English your first language? <span className="text-rose-500">*</span>
            </label>
            <select id="training-englishFirstLanguage" required
              value={formData.englishFirstLanguage}
              onChange={(e) =>  setFormData({ ...formData, englishFirstLanguage: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="" disabled>Please select</option>
              <option value="Yes">Yes</option>
              <option value="No">No (English as an additional language)</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: QUALIFICATIONS & BACKGROUND EXPERIENCE */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-2">
          3. Qualifications & Experience
        </h3>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-highestQualification">
            Highest Qualification <span className="text-rose-500">*</span>
          </label>
          <select id="training-highestQualification" required
            value={formData.highestQualification}
            onChange={(e) =>  setFormData({ ...formData, highestQualification: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
          >
            <option value="" disabled>Please select</option>
            <option value="Master's Degree / Postgraduate">Master's Degree / Postgraduate Diploma (Level 7)</option>
            <option value="Undergraduate Degree">Undergraduate Degree / Bachelor's (Level 6)</option>
            <option value="Higher National Diploma / Foundation Degree">Higher National Diploma (HND) / Foundation Degree (Level 4/5)</option>
            <option value="A-Levels / Level 3">A-Levels / BTEC / Level 3</option>
            <option value="Professional Qualification">Professional Qualification / Diploma</option>
            <option value="Secondary / GCSE">Secondary / GCSE</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Project Management Qualifications (Multi-select) <span className="text-rose-500">*</span>
          </label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PM_QUALIFICATIONS_OPTIONS.map((item) => {
              const isChecked = formData.pmQualifications.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  aria-pressed={isChecked}
                  onClick={() => toggleItem(formData.pmQualifications, 'pmQualifications', item)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                    isChecked
                      ? 'bg-navy-600 text-white border-navy-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="pr-1">{item}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-previousExperience">
            Previous Experience <span className="text-rose-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-1.5">
            Brief description of previous project, administrative, coordination, management or related experience.
          </p>
          <textarea id="training-previousExperience"
            required
            rows={3}
            value={formData.previousExperience}
            onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
            placeholder="Outline your background, previous responsibilities, sectors worked in, or relevant administrative/coordination roles..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: CAREER OBJECTIVE & CURRENT CHALLENGE */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-2">
          4. Career Objectives & Challenges
        </h3>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-careerObjective">
            Career Objective <span className="text-rose-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-1.5">
            What type of role would you ideally like to secure after the programme?
          </p>
          <input id="training-careerObjective"
            required
            type="text"
            value={formData.careerObjective}
            onChange={(e) => setFormData({ ...formData, careerObjective: e.target.value })}
            placeholder="e.g. Project Manager, Junior PM, Project Coordinator, PMO Analyst, Change Lead..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-currentChallenge">
            Current Challenge <span className="text-rose-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-1.5">
            What is currently your biggest challenge in securing the type of role you want?
          </p>
          <textarea id="training-currentChallenge"
            required
            rows={3}
            value={formData.currentChallenge}
            onChange={(e) => setFormData({ ...formData, currentChallenge: e.target.value })}
            placeholder="e.g. Lack of UK workplace experience, passing initial screening but struggling in interviews, lack of live project deliverables to showcase..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 5: DEVELOPMENT NEEDS */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            5. Development Needs (Multi-select)
          </h3>
          <span className="text-[10px] text-navy-700 font-bold bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
            Select all that apply
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DEVELOPMENT_NEEDS_OPTIONS.map((item) => {
            const isChecked = formData.developmentNeeds.includes(item);
            return (
              <button
                type="button"
                key={item}
                  aria-pressed={isChecked}
                onClick={() => toggleItem(formData.developmentNeeds, 'developmentNeeds', item)}
                className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                  isChecked
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="pr-1">{item}</span>
                {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>

        {formData.developmentNeeds.includes('Other') && (
          <input
            type="text"
            value={formData.developmentNeedsOther}
            onChange={(e) => setFormData({ ...formData, developmentNeedsOther: e.target.value })}
            placeholder="Specify any other key development needs..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 mt-2 focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 6: SUCCESS MEASURE & AVAILABILITY */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-2">
          6. Success Measure & Availability
        </h3>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-successMeasure">
            Success Measure <span className="text-rose-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-1.5">
            What would make this six-month programme successful for you?
          </p>
          <textarea id="training-successMeasure"
            required
            rows={2}
            value={formData.successMeasure}
            onChange={(e) => setFormData({ ...formData, successMeasure: e.target.value })}
            placeholder="e.g. Build confidence in planning and delivering projects..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-weeklyAvailability">
              Weekly Time Commitment <span className="text-rose-500">*</span>
            </label>
            <select id="training-weeklyAvailability" required
              value={formData.weeklyAvailability}
              onChange={(e) =>  setFormData({ ...formData, weeklyAvailability: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="" disabled>Please select</option>
              <option value="Yes - can commit weekly time">Yes - can commit weekly time</option>
              <option value="Yes - flexible schedule">Yes - flexible schedule</option>
              <option value="Part-time availability">Part-time / evenings only</option>
              <option value="Need to discuss schedule">Need to discuss schedule</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-birminghamAttendance">
              Birmingham workshops <span className="text-rose-500">*</span>
            </label>
            <select id="training-birminghamAttendance" required
              value={formData.birminghamAttendance}
              onChange={(e) =>  setFormData({ ...formData, birminghamAttendance: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="" disabled>Please select</option>
              <option value="Yes">Yes - can attend in Birmingham</option>
              <option value="No">No - remote alternative required</option>
              <option value="Need more info">Need more information on dates</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-inPersonProjectAttendance">
              Occasional Project In-Person Work <span className="text-rose-500">*</span>
            </label>
            <select id="training-inPersonProjectAttendance" required
              value={formData.inPersonProjectAttendance}
              onChange={(e) =>  setFormData({ ...formData, inPersonProjectAttendance: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="" disabled>Please select</option>
              <option value="Yes">Yes</option>
              <option value="No">No - fully remote only</option>
              <option value="Hybrid / Depends on location">Hybrid / Depends on location</option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 7: PACKAGE SELECTION & PAYMENT PREFERENCE */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-2">
          7. Package Selection & Payment Preference
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-packageSelection">
              Package Selection <span className="text-rose-500">*</span>
            </label>
            <select id="training-packageSelection" required
              value={formData.packageSelection}
              onChange={(e) =>  setFormData({ ...formData, packageSelection: e.target.value, paymentPreference: '' })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="" disabled>Please select</option>
              <option value="WOW Career Accelerator 6-Month Programme (£1,000)">
                WOW Career Accelerator 6-Month Programme (£1,000)
              </option>
              <option value="Career Accelerator + 1-to-1 Executive Mentorship (£1,250)">
                Career Accelerator + 1-to-1 Executive Mentorship (£1,250)
              </option>
              <option value="Not sure - I would like advice">
                Not sure - I would like advice
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1" htmlFor="training-paymentPreference">
              Payment Preference <span className="text-rose-500">*</span>
            </label>
            <select id="training-paymentPreference" required
              value={formData.paymentPreference}
              onChange={(e) =>  setFormData({ ...formData, paymentPreference: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="" disabled>Please select</option>
              {formData.packageSelection.includes('£1,250') ? <>
                <option value="Executive mentorship package £1,250">Executive mentorship package £1,250</option>
                <option value="Discuss instalments for executive mentorship">Discuss instalments for executive mentorship</option>
              </> : <>
                <option value="Pay in full £900 by 31 October 2026">Pay in full £900 by 31 October 2026</option>
                <option value="Two instalments £500 by 31 October 2026 and £500 by 30 November 2026">Two instalments £500 by 31 October 2026 and £500 by 30 November 2026</option>
              </>}
              <option value="£50 registration deposit to reserve your place">
                £50 registration deposit to reserve your place (credited against tuition)
              </option>
              <option value="Discuss employer sponsorship / bespoke arrangement">
                Discuss employer sponsorship / bespoke arrangement
              </option>
            </select>
          </div>
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4">
          If we need your CV or portfolio, we will request it after reviewing your application. Files are not submitted with this form.
        </p>
      </div>

      {/* ======================================================== */}
      {/* SECTION 8: MANDATORY FORM DECLARATIONS */}
      {/* ======================================================== */}
      <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <ShieldCheck className="w-4 h-4 text-navy-700" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            8. Form Declarations <span className="text-rose-500">*</span>
          </h3>
        </div>
        <p className="text-[11px] text-slate-600">
          Read the programme information and terms, then confirm the declarations below. Continue to Stripe after submitting. At least £50 is required to reserve a place, unless sponsorship is agreed in writing.
        </p>

        <div className="space-y-3 pt-1 text-xs">
          {/* Declaration 1 */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={formData.declaration1}
              onChange={(e) => setFormData({ ...formData, declaration1: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-navy-600 focus:ring-navy-500 border-slate-300"
            />
            <span className="text-slate-800 font-medium">
              I understand that this is a six-month training and work experience programme requiring active participation.
            </span>
          </label>

          {/* Declaration 2 */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={formData.declaration2}
              onChange={(e) => setFormData({ ...formData, declaration2: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-navy-600 focus:ring-navy-500 border-slate-300"
            />
            <span className="text-slate-800 font-medium">
              I understand that some project opportunities may require in-person attendance.
            </span>
          </label>

          {/* Declaration 3 */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={formData.declaration3}
              onChange={(e) => setFormData({ ...formData, declaration3: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-navy-600 focus:ring-navy-500 border-slate-300"
            />
            <span className="text-slate-800 font-medium">
              I understand that the £50 registration deposit is subject to statutory cancellation and refund rights, and that it will be credited in full against my tuition fee if I continue onto the programme.
            </span>
          </label>

          {/* Declaration 4 */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={formData.declaration4}
              onChange={(e) => setFormData({ ...formData, declaration4: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-navy-600 focus:ring-navy-500 border-slate-300"
            />
            <span className="text-slate-800 font-medium">
              I understand the programme payment arrangements and final payment deadline.
            </span>
          </label>

          {/* Declaration 5 */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={formData.declaration5}
              onChange={(e) => setFormData({ ...formData, declaration5: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-navy-600 focus:ring-navy-500 border-slate-300"
            />
            <span className="text-slate-800 font-medium">
              I understand that I will contribute to supervised live WOW projects and that allocations depend on suitability and programme requirements.
            </span>
          </label>

          {/* Declaration 6 */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={formData.declaration6}
              onChange={(e) => setFormData({ ...formData, declaration6: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-navy-600 focus:ring-navy-500 border-slate-300"
            />
            <span className="text-slate-800 font-medium">
              I understand that any professional reference will reflect my actual participation, work and performance during the programme.
            </span>
          </label>

          {/* Declaration 7 */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={formData.declaration7}
              onChange={(e) => setFormData({ ...formData, declaration7: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-navy-600 focus:ring-navy-500 border-slate-300"
            />
            <span className="text-slate-800 font-bold text-slate-900">
              I confirm that the information I have provided is accurate.
            </span>
          </label>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PRIVACY ACKNOWLEDGEMENT & MARKETING CONSENT */}
      {/* ======================================================== */}
      <div className="pt-6 border-t border-slate-200 space-y-4 bg-slate-50 p-5 rounded-2xl">
        <div className="text-[11px] text-slate-600 leading-relaxed space-y-2">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-navy-600 shrink-0" />
            <span>Privacy Note:</span>
          </p>
          <p>
            We will use the information you provide to review your application and manage any agreed next steps. Please do not include sensitive personal, health, or financial information that is not required. For questions about how your information is handled, email <a href="mailto:wowdigital@wowbusinessanddigital.com" className="text-navy-700 font-bold underline">wowdigital@wowbusinessanddigital.com</a>.
          </p>
        </div>

        <div className="flex items-start gap-2.5 pt-2">
          <input
            required
            type="checkbox"

            checked={formData.privacyAcknowledged}
            onChange={(e) => setFormData({ ...formData, privacyAcknowledged: e.target.checked })}
            className="mt-0.5 rounded text-navy-600 focus:ring-navy-500 h-4 w-4 border-slate-300"
          />
          <label className="text-xs font-bold text-slate-900 cursor-pointer">
            I understand that my information will be used to review my application and contact me about the programme. <span className="text-rose-500">*</span>
          </label>
        </div>

        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"

            checked={formData.marketingConsent}
            onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
            className="mt-0.5 rounded text-navy-600 focus:ring-navy-500 h-4 w-4 border-slate-300"
          />
          <label className="text-xs font-semibold text-slate-700 cursor-pointer">
            Optional marketing consent: I would like to receive relevant news, course information and programme updates from WOW Business & Digital Limited.
          </label>
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <button type="submit" id="btn-submit-application" disabled={submitting} className="w-full bg-[#0b2d5b] text-white rounded-xl py-4 font-bold disabled:opacity-60">
          {submitting ? 'Saving application…' : 'Submit application'}
        </button>
        <p className="text-center text-sm text-slate-600">Your application will be saved for review. Continue to payment to reserve your place.</p>
      </div>
    </form>
  );
};
