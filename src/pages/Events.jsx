import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, ArrowRight, Search, Ticket, Flame, Sparkles, CalendarX } from 'lucide-react';
import { useData } from '../context/DataContext';
import EmptyState from '../components/EmptyState';

export default function Events() {
  const { events } = useData();

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = ['All', 'Conventions', 'Meetups', 'Live Stream', 'Competitions'];

  const filteredEvents = (events || []).filter((evt) => {
    const catName = typeof evt.category === 'object' ? evt.category?.name : evt.category;
    const catStr = String(catName || '').toLowerCase();
    const matchesFilter =
      activeFilter === 'All' ||
      catStr === activeFilter.toLowerCase() ||
      (activeFilter === 'Conventions' && catStr.includes('convention'));
    const matchesSearch =
      (evt.title || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (evt.city || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (evt.venue || '').toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesFilter && matchesSearch;
  });

  const featuredEvent = events?.find((e) => e.featured) || events?.[0];

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {/* Hero Banner with Red & White Aesthetics */}
      <div className="relative rounded-3xl overflow-hidden border border-red-950/60 bg-gradient-to-r from-[#18060a] via-[#090b12] to-[#120508] p-6 sm:p-12 shadow-[0_0_60px_rgba(220,38,38,0.18)]">
        {/* Ambient Red Glows */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>Fandom Summits & Conventions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            Fandom <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">Events</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
            Meet world-class voice actors, compete in international cosplay tournaments, and celebrate fandom culture live!
          </p>

          <div className="flex items-center gap-2 pt-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 whitespace-nowrap ${
                  activeFilter === tab
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 border border-red-400/40 scale-105'
                    : 'bg-[#0e1018] text-zinc-300 hover:text-white border border-white/[0.08] hover:border-red-500/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 sm:opacity-40 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80"
            alt="Event Atmosphere"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#18060a] via-transparent to-transparent" />
        </div>
      </div>

      {/* Featured Event Card */}
      {featuredEvent && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2 font-display">
              <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white text-xs font-black uppercase shadow-md">
                Featured
              </span>
              <span>Headliner Gathering</span>
            </h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-red-500/40 bg-white dark:bg-gradient-to-b dark:from-[#14080b] dark:via-[#090b10] dark:to-[#050608] shadow-[0_8px_30px_rgba(225,29,72,0.06)] dark:shadow-[0_0_40px_rgba(220,38,38,0.18)] hover:border-red-400 transition-all duration-500 flex flex-col lg:flex-row group">
            <div className="lg:w-1/2 aspect-video lg:aspect-auto relative min-h-[240px] sm:min-h-[320px] overflow-hidden">
              <img
                src={featuredEvent.image}
                alt={featuredEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-red-600/50">
                  Featured
                </span>
                <span className="px-3 py-1 rounded-full bg-white text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  ★ Popular
                </span>
              </div>
            </div>

            <div className="lg:w-1/2 p-5 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/40 text-[10px] font-black uppercase tracking-wider">
                    {typeof featuredEvent.category === 'object' ? featuredEvent.category?.name : featuredEvent.category || 'Convention'}
                  </span>
                  <span className="text-xs text-zinc-700 dark:text-white font-mono font-bold">
                    {featuredEvent.startDate} — {featuredEvent.endDate}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-display leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {featuredEvent.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-200">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-semibold">{featuredEvent.venue}, {featuredEvent.city}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                  {featuredEvent.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {featuredEvent.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white text-zinc-800 dark:text-zinc-950 text-[10px] font-bold border border-zinc-200 dark:border-transparent shadow-sm"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to={`/events/${featuredEvent.slug}`}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 border border-red-400/40 text-center"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Get Tickets & Passes</span>
                </Link>
                <Link
                  to={`/events/${featuredEvent.slug}`}
                  className="px-6 py-3 rounded-2xl border border-zinc-300 dark:border-white/20 hover:border-red-500 hover:bg-zinc-100 dark:hover:bg-white/[0.04] text-zinc-800 dark:text-white text-xs font-bold transition-all text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Grid Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white font-display">
              Upcoming Fandom Conventions & Meetups
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Browse upcoming summits, dates, ticket prices and venue locations.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, venue or event..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black/60 border border-zinc-200 dark:border-white/15 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors shadow-sm dark:shadow-none"
            />
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <EmptyState
            title="No Events Found"
            description="No events found matching your search or active filter."
            actionText=""
            actionLink=""
            icon={CalendarX}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <article
                key={evt._id || evt.id}
                className="group rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-white/[0.08] hover:border-red-500/70 bg-white dark:bg-gradient-to-b dark:from-[#13080c] dark:via-[#090b10] dark:to-[#06070a] transition-all duration-400 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_36px_rgba(220,38,38,0.18)] dark:hover:shadow-[0_12px_36px_rgba(220,38,38,0.22)] flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* White Date Chip */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white text-red-600 text-[10px] font-mono font-black shadow-md">
                      {evt.startDate}
                    </span>

                    {/* Red Category Pill */}
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      {typeof evt.category === 'object' ? evt.category?.name : evt.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-black text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1 font-display">
                      {evt.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate font-medium">{evt.venue}, {evt.city}</span>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-normal">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/events/${evt.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-600 dark:bg-red-600/15 dark:hover:bg-red-600 border border-red-200 dark:border-red-500/30 hover:border-red-500 text-xs font-black text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white flex items-center justify-center gap-1.5 transition-all shadow-sm group/btn"
                  >
                    <span>Event Passes & Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
