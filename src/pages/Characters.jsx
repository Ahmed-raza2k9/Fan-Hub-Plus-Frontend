import React, { useState, useMemo } from 'react';
import { Users, Search, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import CharacterCard from '../components/CharacterCard';
import EmptyState from '../components/EmptyState';

export default function Characters() {
  const { characters, categories } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCharacters = useMemo(() => {
    return characters.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (c.bio || c.shortBio || c.description || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (c.fandom && c.fandom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        c.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      const catName = typeof c.category === 'object' ? c.category?.name : c.category;
      const catStr = String(catName || '');

      const matchesCat =
        selectedCategory === 'all' ||
        c.categorySlug === selectedCategory ||
        catStr.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [characters, searchTerm, selectedCategory]);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden border border-red-900/40 bg-gradient-to-r from-[#150508] via-[#0a0b12] to-[#0e0609] p-6 sm:p-12 shadow-[0_0_60px_rgba(220,38,38,0.15)]">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-red-900/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Fandom Lore Codex</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            Characters <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-red-300">Archive</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Explore legendary heroes, mysterious sorcerers, shinobi, and comic champions. Access character backstories, voice actors, and signature techniques.
          </p>

          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search characters by name, series, or abilities..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 sm:opacity-40 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80"
            alt="Character codex background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#150508] via-transparent to-transparent" />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 w-full">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500/50'
              : 'bg-[#0c101d] text-zinc-400 hover:text-white border border-white/[0.08] hover:border-red-500/40'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              selectedCategory === cat.slug
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500/50'
                : 'bg-[#0c101d] text-zinc-400 hover:text-white border border-white/[0.08] hover:border-red-500/40'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredCharacters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Characters Found"
          description="We couldn't find any characters matching your query."
          actionText="Clear Filters"
          actionLink="#"
          onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
          }}
        />
      )}
    </div>
  );
}
