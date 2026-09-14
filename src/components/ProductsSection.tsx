import React, { useState } from 'react';
import { NavTab, ToolkitProduct } from '../types';
import { TOOLKITS } from '../data/companyData';
import { Box, CheckCircle2, Download, FileSpreadsheet, Sparkles, Send } from 'lucide-react';

interface ProductsSectionProps {
  setActiveTab: (tab: NavTab) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ setActiveTab }) => {
  const [selectedToolkit, setSelectedToolkit] = useState<ToolkitProduct | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-blue-700 text-xs font-bold">
          <Box className="w-3.5 h-3.5 text-blue-600" />
          <span>Products & Digital Toolkits</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Practical PMO Frameworks, RAID Logs & Agribusiness Templates
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Standardise project governance, benefits realisation, and farm operational tracking with our ready-to-use digital toolkits.
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLKITS.map((toolkit) => (
          <div
            key={toolkit.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group hover:border-blue-400"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {toolkit.category}
                </span>
                {toolkit.badge && (
                  <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    {toolkit.badge}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {toolkit.name}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {toolkit.description}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Includes:</div>
                {toolkit.includes.map((inc, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-1">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Format: <strong>{toolkit.format}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setSelectedToolkit(toolkit)}
              className="w-full bg-sky-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs py-3 rounded-xl border border-sky-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get Access / Download Pack</span>
            </button>
          </div>
        ))}
      </div>

      {/* DOWNLOAD / ACCESS REQUEST MODAL */}
      {selectedToolkit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{selectedToolkit.name}</h3>
                <p className="text-xs text-blue-600 font-semibold">{selectedToolkit.category} • {selectedToolkit.format}</p>
              </div>
              <button 
                onClick={() => setSelectedToolkit(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Provide your details to receive immediate download links and setup guide for this toolkit.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`Thank you! The download link for ${selectedToolkit.name} has been sent to your email.`);
              setSelectedToolkit(null);
            }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Work Email</label>
                <input required type="email" placeholder="john@organisation.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send Toolkit Download Link</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
