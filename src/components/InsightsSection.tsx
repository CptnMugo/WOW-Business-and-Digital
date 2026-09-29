import React, { useState } from 'react';
import { InsightArticle } from '../types';
import { INSIGHTS_ARTICLES } from '../data/companyData';
import { BookOpen, Search, Clock, Calendar, ArrowRight, User } from 'lucide-react';

export const InsightsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);

  const categories = [
    'All',
    'Project Management',
    'Digital Transformation',
    'AI & Innovation',
    'Leadership',
    'Client Success Stories',
    'Business Tips',
    'WOW Assistant Updates'
  ];

  const filteredArticles = INSIGHTS_ARTICLES.filter(art => {
    if (selectedCategory !== 'All' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return art.title.toLowerCase().includes(q) || art.summary.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-100 border border-navy-300 text-navy-700 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-navy-600" />
          <span>Insights & Thought Leadership</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Executive Perspectives on PMO, Digital Transformation & AI
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Articles, guides, and practical updates from our senior consulting directors and AI engineering leads.
        </p>
      </div>

      {/* SEARCH AND CATEGORY BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles on PMO, AI, Governance, Digital Transformation..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-navy-600 text-white shadow-xs'
                  : 'bg-navy-50/70 text-slate-700 hover:bg-navy-100 border border-navy-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((art) => (
          <article
            key={art.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group hover:border-navy-400"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-extrabold uppercase text-[10px] tracking-wider text-navy-700 bg-navy-100 border border-navy-200 px-2.5 py-0.5 rounded-full">
                  {art.category}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-navy-500" /> {art.readTime}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 group-hover:text-navy-600 transition-colors">
                {art.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {art.summary}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {art.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {art.date}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveArticle(art)}
              className="w-full bg-navy-50 hover:bg-navy-600 hover:text-white text-navy-700 font-bold text-xs py-2.5 rounded-xl border border-navy-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </article>
        ))}
      </div>

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-navy-700 bg-navy-500/10 border border-navy-200 px-2.5 py-0.5 rounded-full">
                  {activeArticle.category}
                </span>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-4">
                  <span>{activeArticle.date}</span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                  <span>•</span>
                  <span>{activeArticle.author}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveArticle(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              {activeArticle.title}
            </h2>

            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
              {activeArticle.content}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
