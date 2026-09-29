import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, CheckCircle2, ArrowRight, X, Clock, Award, ShieldAlert, Users, Zap } from 'lucide-react';
import { EnquiryCategory } from './ContactSection';
import welcomeImg from '../assets/images/welcome_training_accelerator_1787352922245.jpg';

interface WelcomeMatProps {
  onClaimOffer: (category: EnquiryCategory) => void;
}

export const WelcomeMat: React.FC<WelcomeMatProps> = ({ onClaimOffer }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClaim = () => {
    setIsOpen(false);
    // Form 4 is Training & Professional Development (category 'training')
    onClaimOffer('training');
  };

  if (!isOpen) {
    return (
      <button
        id="welcome-mat-trigger-floating"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-navy-500 via-navy-600 to-navy-600 text-white px-4 py-2.5 rounded-full shadow-2xl hover:shadow-navy-500/30 transition-all flex items-center gap-2 text-xs font-black tracking-wide hover:scale-105 active:scale-95 border border-white/20 animate-bounce cursor-pointer"
        aria-label="View Special Sign-up Incentive"
      >
        <Gift className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>Special Offer: £50 Deposit • Up to 10% Off (£900)</span>
      </button>
    );
  }

  return (
    <div 
      id="welcome-mat-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-300"
    >
      <div 
        id="welcome-mat-modal-card"
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-navy-100 my-auto flex flex-col lg:flex-row transform transition-all max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="welcome-mat-close-btn"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 shadow-md border border-slate-200 transition-all cursor-pointer"
          aria-label="Close welcome offer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Visual Banner with Relatable Human Imagery & Career Accelerator Story */}
        <div className="lg:w-1/2 relative bg-gradient-to-br from-navy-700 via-navy-700 to-navy-600 overflow-hidden flex flex-col justify-between p-6 sm:p-7 text-white">
          <img
            src={welcomeImg}
            alt="Diverse professionals learning and collaborating in a modern workshop"
            className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 transform hover:scale-100 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-800/80 via-navy-800/60 to-navy-700/50" />
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-navy-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm tracking-wider border border-navy-300/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Career Accelerator Programme</span>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                Qualified in Project Management but struggling to get the job?
              </h4>
              <p className="text-xs sm:text-[13px] text-navy-200 font-semibold leading-relaxed">
                You may not need another qualification. You may need the experience, workplace skills and confidence to prove that you can do the job.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-2 text-xs text-slate-200 leading-relaxed">
              <p className="text-white font-medium">
                The <strong className="text-navy-300 font-bold">WOW Business & Digital Project Management Career Accelerator</strong> is a six-month programme combining practical project management development, real work experience, one-to-one coaching and career support.
              </p>
              <p className="text-slate-300 text-[11.5px] border-t border-white/10 pt-2">
                Participants learn by doing: working on real projects, producing genuine project deliverables and developing the communication, judgement and professional behaviours employers expect in the workplace.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-4 flex items-center gap-2 text-[11px] text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-navy-300 shrink-0" />
            <span>Real project deliverables • 1-on-1 coaching • 6-month duration</span>
          </div>
        </div>

        {/* Right Offer & Call to Action (Links to Form 4) */}
        <div className="lg:w-1/2 p-6 sm:p-7 flex flex-col justify-between space-y-4 bg-white">
          <div className="space-y-3.5">
            {/* Header with Incentive Tag */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-navy-500 animate-ping" />
                <span className="text-[11px] font-extrabold text-navy-700 uppercase tracking-widest">
                  Special Enrollment Offer
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Reserve with £50</span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-tight">
                Flexible Payment Options & <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-600 via-navy-600 to-navy-700">10% Early Discount</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Choose between early-bird full payment savings or convenient scheduled installments:
              </p>
            </div>

            {/* Structured Payment Details */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {/* Option A: Full Payment Discount */}
              <div className="bg-navy-50/80 border border-navy-200 p-2.5 rounded-xl flex items-start gap-2.5">
                <div className="p-1 rounded-full bg-navy-600 text-white shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-navy-950">Full Payment by 31 October</span>
                    <span className="text-[11px] font-black text-navy-800 bg-white px-2 py-0.5 rounded border border-navy-300">
                      10% Off • £900
                    </span>
                  </div>
                  <p className="text-[11px] text-navy-800 mt-0.5">Pay in full by 31 Oct and save £100 with instant 10% discount.</p>
                </div>
              </div>

              {/* Option B: Installment Plan */}
              <div className="bg-white border border-slate-200 p-2.5 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-navy-600" />
                    Flexible 2-Stage Payment Plan:
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    Total £1,000
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-0.5">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                    <span className="text-slate-500 text-[10px] block font-semibold">1st Payment</span>
                    <strong className="text-slate-900 font-extrabold text-xs">£500</strong> by <span className="text-navy-700 font-bold">31 October</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                    <span className="text-slate-500 text-[10px] block font-semibold">2nd Payment</span>
                    <strong className="text-slate-900 font-extrabold text-xs">£500</strong> by <span className="text-navy-700 font-bold">30 November</span>
                  </div>
                </div>
              </div>

              {/* Deposit and Full Payment terms */}
              <div className="flex items-center justify-between text-[11px] text-slate-600 px-1 pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy-500"></span>
                  <strong>£50 deposit</strong> secures reservation
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Full payment before <strong>Dec 31</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-0.5">
            <button
              id="welcome-mat-claim-offer-btn"
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-navy-500 via-navy-600 to-navy-600 hover:from-navy-400 hover:to-navy-500 text-white font-extrabold text-sm py-3 px-6 rounded-2xl shadow-lg hover:shadow-navy-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Apply Offer & Complete Registration</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>* Special pricing applied to registration</span>
              <button 
                onClick={handleClose} 
                className="hover:text-slate-600 underline font-medium cursor-pointer"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
