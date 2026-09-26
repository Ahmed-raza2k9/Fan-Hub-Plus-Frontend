import React, { useState } from 'react';
import { Layers, Sparkles, Search, Flame, Compass, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import CategoryCard from '../components/CategoryCard';
import EmptyState from '../components/EmptyState';

export default function Categories() {
  const { categories } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTabs = [
    { label: 'All Universes', value: 'All' },
    { label: 'Anime & Manga', value: 'Anime' },
    { label: 'Gaming', value: 'Gaming' },
    { label: 'Movies & TV', value: 'Movies' },
    { label: 'Cosplay & Pop', value: 'Cosplay' }
  ];

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (cat.tagline && cat.tagline.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase().trim());

    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Anime') return cat.slug === 'anime' || cat.slug === 'manga';
    if (activeFilter === 'Gaming') return cat.slug === 'gaming';
    if (activeFilter === 'Movies') return cat.slug === 'movies' || cat.slug === 'tv-shows';
    if (activeFilter === 'Cosplay') return cat.slug === 'cosplay' || cat.slug === 'k-pop' || cat.slug === 'comics';
    return true;
  });

  return (
    <div className="space-y-8 sm:space-y-10 pb-6 sm:pb-12 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden border border-red-500/20 bg-gradient-to-r from-[#170509] via-[#090b12] to-[#1b070d] p-6 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>Fandom Multiverse Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-display">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">Fandom Categories</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
            Dive into tailored realms for Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay. Explore interconnected characters, lore, and global events.
          </p>

          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories (e.g. Anime, Gaming, Comics)..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 sm:opacity-35 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80"
            alt="Anime universe"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#170509] via-transparent to-transparent" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab.value
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-[#0c101d] text-zinc-400 hover:text-white border border-white/[0.08] hover:bg-[#181120]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-zinc-400 font-bold">
          Showing <span className="text-red-400">{filteredCategories.length}</span> of {categories.length} Categories
        </div>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Categories Found"
          description="No fandom categories found matching your search criteria."
        />
      )}
    </div>
  );
}
