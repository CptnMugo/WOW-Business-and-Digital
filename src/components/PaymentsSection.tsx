import React from 'react';
import { NavTab } from '../types';
import { CAREER_ACCELERATOR as programme } from '../data/careerAccelerator';

export const PaymentsSection = ({ setActiveTab }: { setActiveTab: (tab: NavTab) => void }) => <section className="max-w-5xl mx-auto px-5 py-12 space-y-7 text-slate-800">
  <h1 className="text-3xl font-bold">Programme fees and invoice payments</h1>
  <p>Apply first. We review your application and confirm your place before issuing an invoice and payment instructions. No payment is required to submit an application.</p>
  <div className="grid md:grid-cols-2 gap-5">
    {[
      ['Standard programme', '£1,000', 'Six months of practical learning, live WOW project work and programme coaching.'],
      ['Early settlement', '£900', `Standard programme paid in full by ${programme.earlyDeadline}, saving £100.`],
      ['Two instalments', '£500 + £500', `Standard programme: first payment by ${programme.earlyDeadline} and second by ${programme.instalmentDeadline}. A £50 deposit already paid is deducted from the first instalment.`],
      ['Registration deposit after acceptance', '£50', 'Reserves an accepted place. Credited in full against tuition when you continue, so it is not an additional fee. Deposit conditions are explained in the programme terms.'],
      ['Programme with executive mentorship', '£1,250', programme.mentorshipScope + ' The £900 early settlement offer applies to the standard programme. Mentorship payment arrangements are confirmed in your invoice.'],
      ['Employer sponsorship', 'By agreement', 'Select sponsorship on your application. We will discuss the arrangement and invoice details after review.'],
    ].map(([title,price,description]) => <article key={title} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"><h2 className="font-bold text-xl">{title}</h2><p className="text-2xl font-bold text-[#0b2d5b]">{price}</p><p>{description}</p></article>)}
  </div>
  <p>Where an accepted place is reserved with a deposit, the remaining balance and due dates will be stated on the invoice. All programme balances are due by {programme.finalDeadline} unless a sponsorship arrangement has been agreed in writing. Prices are the total advertised fees; WOW is not VAT registered.</p>
  <div className="bg-[#f8f4ed] border border-[#d4a24c] rounded-2xl p-6 space-y-3">
    <h2 className="text-xl font-bold">Pay against your confirmed invoice</h2>
    <p>Bank details and the correct payment reference are supplied on your invoice. Please use those instructions. Card checkout is not currently offered on this page.</p>
    <p>For an accepted application or an existing business invoice, contact <a className="underline font-semibold" href={`mailto:${programme.email}`}>{programme.email}</a> with your application or invoice reference.</p>
  </div>
  <button className="bg-[#0b2d5b] text-white px-6 py-3 rounded-lg font-semibold" onClick={() => setActiveTab('pm-registration')}>Apply for the programme</button>
  <p><a className="underline" href="/?page=programme-terms">Programme information and terms</a></p>
</section>;
