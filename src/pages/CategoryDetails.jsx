import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, ArrowLeft, Users, ShoppingBag, Calendar, Film, Filter, Sparkles, Flame } from 'lucide-react';
import { useData } from '../context/DataContext';
import ContentCard from '../components/ContentCard';
import CharacterCard from '../components/CharacterCard';
import MerchandiseCard from '../components/MerchandiseCard';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';

export default function CategoryDetails() {
  const { slug } = useParams();
  const { categories, contentList, characters, merchandise, events } = useData();

  const category = categories.find((c) => c.slug === slug);
  const [activeTab, setActiveTab] = useState('content');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const getCatName = (catField) => typeof catField === 'object' ? catField?.name : catField;
  const getCatSlug = (catField) => typeof catField === 'object' ? catField?.slug : undefined;

  const relatedContent = useMemo(() => {
    let list = contentList.filter(
      (c) =>
        getCatSlug(c.category) === slug ||
        c.categorySlug === slug ||
        String(getCatName(c.category) || '').toLowerCase() === category?.name?.toLowerCase()
    );

    if (contentTypeFilter !== 'all') {
      list = list.filter((c) => c.contentType === contentTypeFilter);
    }

    list.sort((a, b) => {
      if (sortBy === 'popularity') return (b.popularity || b.popularityScore || 0) - (a.popularity || a.popularityScore || 0);
      if (sortBy === 'newest') return new Date(b.releaseDate || b.createdAt).getTime() - new Date(a.releaseDate || a.createdAt).getTime();
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });

    return list;
  }, [contentList, slug, category, contentTypeFilter, sortBy]);

  const relatedCharacters = useMemo(() => {
    return characters.filter(
      (ch) =>
        getCatSlug(ch.category) === slug ||
        ch.categorySlug === slug ||
        String(getCatName(ch.category) || '').toLowerCase() === category?.name?.toLowerCase()
    );
  }, [characters, slug, category]);

  const relatedMerchandise = useMemo(() => {
    return merchandise.filter(
      (m) =>
        getCatSlug(m.category) === slug ||
        m.categorySlug === slug ||
        String(getCatName(m.category) || '').toLowerCase() === category?.name?.toLowerCase()
    );
  }, [merchandise, slug, category]);

  const relatedEvents = useMemo(() => {
    return events.filter(
      (e) =>
        getCatSlug(e.category) === slug ||
        e.categorySlug === slug ||
        String(getCatName(e.category) || '').toLowerCase() === category?.name?.toLowerCase()
    );
  }, [events, slug, category]);

  if (!category) {
    return (
      <EmptyState
        title="Category Not Found"
        description="The category you requested does not exist or has been relocated."
        actionText="Browse Categories"
        actionLink="/categories"
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 pb-6 sm:pb-12 max-w-7xl mx-auto">
      <div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-red-400 mb-3 sm:mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </Link>

        <div className="relative rounded-3xl overflow-hidden border border-red-500/20 bg-gradient-to-r from-[#170509] via-[#090b12] to-[#120508] p-4 xs:p-6 sm:p-10 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img
              src={category.image}
              alt={category.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-20 filter blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#170509] via-[#170509]/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Fandom Realm</span>
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-zinc-400 font-bold">
                {category.contentCount ? `${category.contentCount}+ Catalog Entries` : 'Featured Hub'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
              {category.name}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl font-medium">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-white/[0.08] pb-4">
        {/* Horizontal Scroll Tabs with sleek red badges that never line-wrap */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-[#0b0407]/80 rounded-2xl border border-zinc-200 dark:border-red-500/20 overflow-x-auto scrollbar-none w-full sm:w-auto -mx-1 px-1 sm:mx-0 sm:px-0 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md shadow-red-600/40 font-black'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/[0.04]'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-current shrink-0" />
            <span>Content</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full font-bold ${
              activeTab === 'content' ? 'bg-white/25 text-white' : 'bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-400'
            }`}>
              {relatedContent.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('characters')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'characters'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md shadow-red-600/40 font-black'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/[0.04]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-current shrink-0" />
            <span>Characters</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full font-bold ${
              activeTab === 'characters' ? 'bg-white/25 text-white' : 'bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-400'
            }`}>
              {relatedCharacters.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('merchandise')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'merchandise'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md shadow-red-600/40 font-black'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/[0.04]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-current shrink-0" />
            <span>Merchandise</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full font-bold ${
              activeTab === 'merchandise' ? 'bg-white/25 text-white' : 'bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-400'
            }`}>
              {relatedMerchandise.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md shadow-red-600/40 font-black'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/[0.04]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-current shrink-0" />
            <span>Events</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full font-bold ${
              activeTab === 'events' ? 'bg-white/25 text-white' : 'bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-400'
            }`}>
              {relatedEvents.length}
            </span>
          </button>
        </div>

        {activeTab === 'content' && (
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={contentTypeFilter}
                onChange={(e) => setContentTypeFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-white dark:bg-[#0e0710] border border-zinc-200 dark:border-red-500/30 hover:border-red-500/60 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm transition-colors cursor-pointer"
              >
                <option value="all">All Media</option>
                <option value="video">Videos</option>
                <option value="trailer">Trailers</option>
                <option value="article">Articles</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-white dark:bg-[#0e0710] border border-zinc-200 dark:border-red-500/30 hover:border-red-500/60 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm transition-colors cursor-pointer"
              >
                <option value="popularity">Sort: Popularity</option>
                <option value="newest">Sort: Newest</option>
                <option value="title">Sort: Title</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <div>
        {activeTab === 'content' && (
          relatedContent.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {relatedContent.map((item) => (
                <ContentCard key={item._id || item.id} content={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={`No ${category.name} content matches filters`}
              description="Try adjusting your media format filter or sort criteria."
              actionText="Reset Filter"
              actionLink="#"
              onClick={() => setContentTypeFilter('all')}
            />
          )
        )}

        {activeTab === 'characters' && (
          relatedCharacters.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {relatedCharacters.map((char) => (
                <CharacterCard key={char._id || char.id} character={char} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Characters Registered"
              description={`There are currently no characters indexed under ${category.name}.`}
              actionText="View All Characters"
              actionLink="/characters"
            />
          )
        )}

        {activeTab === 'merchandise' && (
          relatedMerchandise.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {relatedMerchandise.map((item) => (
                <MerchandiseCard key={item._id || item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Showcase Merchandise"
              description={`There is currently no merchandise listed for ${category.name}.`}
              actionText="View All Merchandise"
              actionLink="/merchandise"
            />
          )
        )}

        {activeTab === 'events' && (
          relatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedEvents.map((evt) => (
                <EventCard key={evt._id || evt.id} event={evt} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Upcoming Events"
              description={`There are no scheduled conventions or watch parties for ${category.name}.`}
              actionText="View All Events"
              actionLink="/events"
            />
          )
        )}
      </div>
    </div>
  );
}
