import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import BookmarkButton from './BookmarkButton';
import ShareButton from './ShareButton';

export default function ContentCard({ content, rank }) {
  if (!content) return null;

  const currentRank = rank || content.trendingRank;

  /* ── Rank badge gradient per position ── */
  const rankGradients = {
    1: 'from-red-600 to-rose-500',
    2: 'from-rose-700 to-red-500',
    3: 'from-red-800 to-rose-600',
    4: 'from-rose-600 to-red-400',
    5: 'from-red-500 to-rose-400',
    6: 'from-red-600 to-rose-500',
  };
  const rankGrad = rankGradients[currentRank] || 'from-red-600 to-rose-500';

  const categoryName = typeof content?.category === 'object' ? content?.category?.name || 'Anime' : content?.category || 'Anime';

  /* ── Category pill color ── */
  const getCatPill = (cat) => {
    const catStr = typeof cat === 'string' ? cat.toLowerCase() : (cat?.name ? String(cat.name).toLowerCase() : '');
    switch (catStr) {
      case 'anime':     return 'bg-red-700/90 text-white';
      case 'gaming':    return 'bg-rose-800/90 text-white';
      case 'movies':
      case 'movie':     return 'bg-red-900/90 text-rose-200';
      case 'tv shows':
      case 'tv-shows':  return 'bg-rose-700/90 text-white';
      case 'k-pop':     return 'bg-red-600/90 text-white';
      case 'comics':    return 'bg-rose-600/90 text-white';
      default:          return 'bg-red-800/90 text-white';
    }
  };

  return (
    <Link
      to={`/content/${content.slug || content._id}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0e1018] dark:to-[#080b12] border border-zinc-200 dark:border-white/[0.07] hover:border-red-500/60 dark:hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-none hover:shadow-[0_14px_40px_rgba(239,68,68,0.25)] dark:hover:shadow-[0_8px_40px_rgba(239,68,68,0.18)]"
    >
      {/* ── Poster Image (tall, 2:3 ratio) ── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '2/3' }}>
        <img
          src={content.thumbnail}
          alt={content.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Subtle bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* ── #N TRENDING badge — top left ── */}
        {currentRank && (
          <span
            className={`absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r ${rankGrad} text-white shadow-lg shadow-red-600/30`}
          >
            #{currentRank} Trending
          </span>
        )}

        {/* ── Action buttons (Bookmark & Share) — top right ── */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
          <ShareButton item={content} itemType="Content" size="sm" />
          <BookmarkButton item={content} itemType="Content" variant="cardIcon" />
        </div>

        {/* ── Category pill — bottom left over image ── */}
        <span
          className={`absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md border border-white/10 backdrop-blur-sm ${getCatPill(categoryName)}`}
        >
          {categoryName}
        </span>
      </div>

      {/* ── Info below image ── */}
      <div className="px-3 pt-3 pb-3.5 space-y-2 flex-1 flex flex-col justify-between">
        {/* Title */}
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 leading-snug font-display group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200">
          {content.title}
        </h3>

        {/* Rating row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-amber-500 dark:text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="text-xs">{content.rating ?? '9.0'}</span>
          </div>
          <div className="h-[1px] w-8 bg-gradient-to-r from-red-500/0 to-red-500/30 group-hover:to-red-500/60 transition-all duration-300 rounded-full" />
        </div>
      </div>
    </Link>
  );
}
