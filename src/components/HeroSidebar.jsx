import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, Sparkles, ChevronRight, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import BookmarkButton from './BookmarkButton';

export default function HeroSidebar() {
  const { contentList, characters, events, loading, error } = useData();
  const [activeTab, setActiveTab] = useState('trending'); // 'trending' | 'characters' | 'events'

  // Extract and calculate dynamic real backend MongoDB data
  const displayItems = useMemo(() => {
    if (activeTab === 'characters') {
      return (characters || [])
        .slice(0, 5)
        .map((char) => ({
          id: char._id || char.id,
          slug: char.slug || char._id || char.id,
          title: char.name,
          category: char.anime || char.series || (typeof char.category === 'object' ? char.category?.name : char.category) || 'Character',
          image: char.image || char.avatar || (char.images && char.images[0]) || '',
          meta: char.role || char.fandom || 'Featured Hero',
          type: 'character',
          path: `/characters/${char.slug || char._id || char.id}`
        }));
    }

    if (activeTab === 'events') {
      return (events || [])
        .slice(0, 5)
        .map((evt) => ({
          id: evt._id || evt.id,
          slug: evt.slug || evt._id || evt.id,
          title: evt.title,
          category: (typeof evt.category === 'object' ? evt.category?.name : evt.category) || evt.location || 'Event',
          image: evt.image || (evt.images && evt.images[0]) || '',
          meta: evt.startDate ? new Date(evt.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Upcoming',
          type: 'event',
          path: `/events/${evt.slug || evt._id || evt.id}`
        }));
    }

    // Default 'trending' - top content items sorted by rating / popularity / views
    return (contentList || [])
      .slice()
      .sort((a, b) => (b.rating || b.averageRating || b.viewCount || 0) - (a.rating || a.averageRating || a.viewCount || 0))
      .slice(0, 5)
      .map((item) => {
        const catName = typeof item.category === 'object' ? item.category?.name : item.category || 'Content';
        const ratingVal = item.rating || item.averageRating;
        return {
          id: item._id || item.id,
          slug: item.slug || item._id || item.id,
          title: item.title,
          category: catName,
          image: item.thumbnail || item.image || (item.images && item.images[0]) || '',
          meta: ratingVal ? `★ ${ratingVal}` : (item.contentType ? item.contentType.toUpperCase() : 'TRENDING'),
          type: 'content',
          path: `/content/${item.slug || item._id || item.id}`
        };
      });
  }, [activeTab, contentList, characters, events]);

  return (
    <aside
      className="w-full h-full bg-[#0a0204] dark:bg-[#080204] border border-red-950/60 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-2xl backdrop-blur-xl transition-all duration-300 relative overflow-hidden group/heroside text-white"
      aria-label="Hero Trending Content"
    >
      {/* Decorative ambient red glow behind card */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with Tabs */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-red-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-red-600/30 to-rose-900/40 text-red-500 border border-red-500/30 shadow-sm">
              <Flame className="w-4 h-4 fill-current text-red-500 animate-pulse" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-display flex items-center gap-1.5">
              <span>Featured</span>
              <span className="text-red-500">Hub</span>
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 uppercase tracking-widest">
            LIVE API
          </span>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-red-950/60">
          <button
            type="button"
            onClick={() => setActiveTab('trending')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
              activeTab === 'trending'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>Trending</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('characters')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
              activeTab === 'characters'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Heroes</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Events</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-3 space-y-2.5 relative z-10 flex-1 overflow-y-auto overflow-x-hidden max-h-[380px] lg:max-h-[330px] scrollbar-none">
        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-red-950/20 border border-red-900/20 rounded-2xl p-2.5 flex items-center gap-3 h-20"
              >
                <div className="w-14 h-14 bg-zinc-800/60 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-3 bg-zinc-800/60 rounded" />
                  <div className="w-1/2 h-2.5 bg-zinc-800/40 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto" />
            <p className="text-xs text-red-200 font-medium">Unable to load hero content</p>
            <p className="text-[10px] text-zinc-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && displayItems.length === 0 && (
          <div className="py-8 text-center space-y-2 border border-dashed border-red-900/30 rounded-2xl bg-black/20">
            <Sparkles className="w-6 h-6 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 font-semibold">No featured content available.</p>
          </div>
        )}

        {/* Real Content Item Cards */}
        {!loading &&
          !error &&
          displayItems.map((item) => (
            <div
              key={item.id}
              className="group/card relative bg-[#15060a] hover:bg-[#20090e] border border-red-950/60 hover:border-red-500/50 rounded-2xl p-2 sm:p-2.5 flex items-center justify-between gap-3 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-red-950/40"
            >
              <Link
                to={item.path}
                className="flex items-center gap-3 min-w-0 flex-1 group-hover/card:translate-x-0.5 transition-transform"
              >
                {/* Thumbnail Image */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-inner bg-black">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-950 to-black flex items-center justify-center text-red-400">
                      <Flame className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                </div>

                {/* Title & Metadata */}
                <div className="min-w-0 space-y-0.5 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold tracking-wider uppercase text-red-400 truncate">
                      {item.category}
                    </span>
                    <span className="text-[9px] text-zinc-500">•</span>
                    <span className="text-[9px] font-medium text-zinc-300 truncate">
                      {item.meta}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-xs font-bold text-white group-hover/card:text-red-400 transition-colors truncate leading-snug">
                    {item.title}
                  </h4>
                </div>
              </Link>

              {/* Independent Bookmark Button */}
              {item.type === 'content' && (
                <div className="shrink-0 relative z-20">
                  <BookmarkButton contentSlug={item.slug} title={item.title} size="sm" />
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Footer link to Explore */}
      <div className="pt-2 border-t border-red-950/60 relative z-10 flex items-center justify-between">
        <span className="text-[11px] text-zinc-300 font-medium">Curated from API</span>
        <Link
          to="/explore"
          className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
        >
          <span>Explore All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
