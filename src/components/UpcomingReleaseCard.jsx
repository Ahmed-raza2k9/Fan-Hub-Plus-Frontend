import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

export default function UpcomingReleaseCard({ item }) {
  if (!item) return null;
  const categoryName = typeof item?.category === 'object' ? item?.category?.name || 'Anime' : item?.category || 'Anime';
  const targetLink = item.slug ? `/events/${item.slug}` : (item.id ? `/events/${item.id}` : `/events`);

  return (
    <Link
      to={targetLink}
      className="
        group relative flex flex-col justify-between
        rounded-[24px] p-3.5 sm:p-4
        bg-white dark:bg-[#070b16]/95
        border border-zinc-200 dark:border-white/10 hover:border-red-500/60 dark:hover:border-red-500
        transition-all duration-500 ease-out
        hover:-translate-y-1.5
        shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]
        hover:shadow-[0_14px_40px_rgba(239,68,68,0.25)] dark:hover:shadow-[0_0_35px_rgba(239,68,68,0.45)]
        h-full select-none cursor-pointer block
      "
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/3.8] w-full overflow-hidden rounded-2xl bg-black mb-3.5 ring-1 ring-black/5 dark:ring-white/10">
        <img
          src={item.image}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Top-Left Date Badge with Calendar Icon (Red Glow) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-black tracking-wider uppercase backdrop-blur-md bg-red-600 text-white shadow-lg shadow-red-600/40">
            <Calendar className="w-3 h-3" />
            <span>{item.date}</span>
          </span>
        </div>

        {/* Bottom-Right Media Format / Season Badge */}
        {item.type && (
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider border backdrop-blur-md bg-black/75 border-red-500/40 text-red-300">
              {item.type}
            </span>
          </div>
        )}

        {/* Subtle dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Info Section (Clean without description, with red category pill) */}
      <div className="space-y-2.5">
        {/* Title with Red hover */}
        <h4
          className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-tight line-clamp-1 font-display transition-colors duration-300 group-hover:text-red-600 dark:group-hover:text-red-400"
          title={item.title}
        >
          {item.title}
        </h4>

        {/* Category Pill Badge in Red */}
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30">
            {categoryName}
          </span>
        </div>

        {/* Date & Coming Soon Row */}
        <div className="flex items-center gap-2 pt-1 border-t border-zinc-200 dark:border-white/10 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-red-500 dark:text-red-400" />
            <span className="font-mono text-[10px] sm:text-[11px] text-zinc-700 dark:text-zinc-300 font-semibold">{item.date}</span>
          </div>
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-red-500 dark:text-red-400" />
            <span className="text-[10px] sm:text-[11px] text-zinc-700 dark:text-zinc-300">Coming Soon</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
