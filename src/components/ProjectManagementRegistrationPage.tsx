import React, { useRef, useState } from 'react';
import { NavTab } from '../types';
import { TrainingRegistrationForm, TrainingFormData } from './TrainingRegistrationForm';
import { CAREER_ACCELERATOR as programme } from '../data/careerAccelerator';

export const initialApplication = (): TrainingFormData => ({
  fullName: '', email: '', mobileWhatsapp: '', townCity: '', workStatus: '', workStatusOther: '',
  rightToWorkUK: '', highestQualification: '', highestQualificationOther: '', pmQualifications: [],
  previousExperience: '', ukWorkExperience: '', englishFirstLanguage: '', careerObjective: '', currentChallenge: '',
  developmentNeeds: [], developmentNeedsOther: '', successMeasure: '', weeklyAvailability: '',
  birminghamAttendance: '', inPersonProjectAttendance: '', packageSelection: '', paymentPreference: '',
  howDidYouHear: '', promoCode: '', declaration1: false, declaration2: false, declaration3: false,
  declaration4: false, declaration5: false, declaration6: false, declaration7: false,
  privacyAcknowledged: false, marketingConsent: false,
});

export const ProjectManagementRegistrationPage = ({ setActiveTab }: { setActiveTab: (tab: NavTab) => void }) => {
  const [formData, setFormData] = useState(initialApplication);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmation, setConfirmation] = useState<{ reference: string; preference: string } | null>(null);
  const pending = useRef(false);
  const submissionId = useRef(crypto.randomUUID());

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending.current) return;
    if (!formData.pmQualifications.length || !formData.developmentNeeds.length) {
      setError('Please select your project management qualifications (or None) and at least one development need.'); return;
    }
    pending.current = true; setSaving(true); setError('');
    try {
      const response = await fetch('/api/registrations/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, submissionId: submissionId.current, submissionType: 'APPLICATION', cohortDate: programme.startDate }),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.referenceNumber) throw new Error(result.error || 'Your application could not be saved. Please try again.');
      setConfirmation({ reference: result.referenceNumber, preference: formData.paymentPreference });
      setFormData(initialApplication());
      // Remove only old registration/payment draft keys, never unrelated site data.
      try { ['wow_pm_registration_draft', 'wow_pm_registration_submitted', 'wow_selected_payment_item', 'wow_payment_client_name', 'wow_payment_client_email'].forEach(key => localStorage.removeItem(key)); } catch { /* storage may be unavailable */ }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) { setError(err instanceof Error ? err.message : 'Your application could not be saved. Please try again.'); }
    finally { pending.current = false; setSaving(false); }
  };

  return <section className="max-w-4xl mx-auto px-5 py-10 space-y-6 text-slate-800">
    <button onClick={() => setActiveTab('pm-career-accelerator')} className="font-semibold text-navy-700">← Back to programme information</button>
    <p className="text-sm font-semibold">Starts {programme.startDate} · Six months</p>
    <h1 className="text-3xl font-bold">Career Accelerator application</h1>
    <p>Apply for review. No payment is taken with this form. If your application is accepted, we will confirm your place, schedule and invoice arrangements.</p>
    {confirmation ? <div role="status" className="bg-emerald-50 border border-emerald-300 rounded-2xl p-7 space-y-4">
      <h2 className="text-2xl font-bold">Thank you. Your application has been received.</h2>
      <p>Your reference is <strong>{confirmation.reference}</strong>.</p>
      <p>Payment preference: {confirmation.preference}.</p>
      <p>We will review your application and contact you about next steps. No payment has been taken and your place is subject to confirmation.</p>
      <p>Please keep your reference. If you need to update your application, email <a className="underline" href={`mailto:${programme.email}`}>{programme.email}</a> and quote it.</p>
      <button className="bg-[#0b2d5b] text-white px-5 py-3 rounded-lg" onClick={() => setActiveTab('pm-career-accelerator')}>Return to programme information</button>
    </div> : <div className="bg-white rounded-2xl p-6 border border-slate-200">
      {error && <p role="alert" className="text-red-800 mb-5">{error}</p>}
      <TrainingRegistrationForm formData={formData} setFormData={setFormData} onSubmit={submit} submitting={saving} />
    </div>}
    <p className="text-sm">Read our <a className="underline" href="/?page=privacy">privacy notice</a> and <a className="underline" href="/?page=programme-terms">programme information and terms</a>.</p>
  </section>;
};
