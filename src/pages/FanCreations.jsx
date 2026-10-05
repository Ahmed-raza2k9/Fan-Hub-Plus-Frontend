import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Search, Layers, FileText, LogIn, Info } from 'lucide-react';
import { useData } from '../context/DataContext';
import FanSubmissionCard from '../components/FanSubmissionCard';
import EmptyState from '../components/EmptyState';

export default function FanCreations() {
  const { fanSubmissions, categories } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  // Check if user is logged in
  const isLoggedIn = Boolean(localStorage.getItem('fanhub_token'));

  const approvedSubmissions = useMemo(() => {
    return fanSubmissions
      .filter((s) => s.status === 'approved')
      .filter((s) => {
        const creatorName = String(s.creator || s.user?.name || s.author || '');
        const catName = typeof s.category === 'object' ? s.category?.name : s.category;
        const catStr = String(catName || '');

        const matchesSearch =
          (s.title || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          creatorName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          (s.description || '').toLowerCase().includes(searchTerm.toLowerCase().trim());

        const matchesCat =
          selectedCategory === 'all' ||
          s.categorySlug === selectedCategory ||
          catStr.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCat;
      });
  }, [fanSubmissions, searchTerm, selectedCategory]);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      {/* Logged in check banner for guest users */}
      {!isLoggedIn && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 border border-amber-500/20 text-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold">
                You are currently viewing as a Guest!
              </p>
              <p className="text-[11px] sm:text-xs text-amber-200/80">
                Log in to submit your own creations, bookmark articles, rate fan submissions, and unlock full community features.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>Log In Now</span>
          </button>
        </div>
      )}

      <div className="relative rounded-3xl overflow-hidden border border-red-900/40 bg-gradient-to-r from-[#150508] via-[#0a0b12] to-[#0e0609] p-6 sm:p-12 shadow-[0_0_60px_rgba(220,38,38,0.15)]">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-red-900/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>Community Articles & Works</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
              Fan Articles & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-red-300">Creations</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Explore authentic illustrations, cosplay photoshoots, orchestral covers, and lore analysis submitted by passionate fans worldwide.
            </p>
          </div>

          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-600/35 transition-all hover:scale-105 active:scale-95 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Your Creation</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gradient-to-b from-[#0e1018] to-[#080b12] border border-white/[0.07] rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search creations by title, character, or creator..."
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-red-500 transition-colors"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c._id || c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {approvedSubmissions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {approvedSubmissions.map((sub) => (
            <FanSubmissionCard key={sub._id || sub.id} submission={sub} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Approved Works Found"
          description="There are currently no approved submissions matching your active query."
          actionText="Submit Something New"
          actionLink="/submit"
        />
      )}
    </div>
  );
}