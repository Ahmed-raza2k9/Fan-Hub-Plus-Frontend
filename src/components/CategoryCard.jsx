import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Sparkles,
  Cat,
  Gamepad2,
  Film,
  Tv,
  Music,
  BookOpen,
  Book
} from 'lucide-react';

export default function CategoryCard({ category }) {
  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'anime':
        return <Cat className="w-4 h-4 text-red-400 shrink-0" />;
      case 'gaming':
        return <Gamepad2 className="w-4 h-4 text-red-400 shrink-0" />;
      case 'movies':
        return <Film className="w-4 h-4 text-red-400 shrink-0" />;
      case 'tv-shows':
        return <Tv className="w-4 h-4 text-red-400 shrink-0" />;
      case 'k-pop':
        return <Music className="w-4 h-4 text-red-400 shrink-0" />;
      case 'comics':
        return <BookOpen className="w-4 h-4 text-red-400 shrink-0" />;
      case 'manga':
        return <Book className="w-4 h-4 text-red-400 shrink-0" />;
      case 'cosplay':
        return <Sparkles className="w-4 h-4 text-red-400 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-red-400 shrink-0" />;
    }
  };

  const icon = getCategoryIcon(category.slug);

  return (
    <Link
      to={`/category/${category.slug}`}
      className="
        group relative flex flex-col justify-end aspect-[3/4] min-h-[175px] xs:min-h-[190px]
        rounded-2xl overflow-hidden bg-[#090e1c]
        border border-white/10 hover:border-red-500
        transition-all duration-300 hover:-translate-y-1.5 active:scale-95
        shadow-xl hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]
      "
    >
      {/* Background Cover Image */}
      <img
        src={category.image}
        alt={category.name}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* Dark Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/30 to-black/20" />

      {/* Bottom Translucent Floating Pill Bar */}
      <div className="relative z-10 m-2 sm:m-2.5 p-1.5 sm:p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 group-hover:border-red-500/50 flex items-center justify-between shadow-lg transition-all">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-1">
          {icon}
          <span className="text-[11px] xs:text-xs sm:text-sm font-black text-white font-display tracking-tight truncate group-hover:text-red-400 transition-colors">
            {category.name}
          </span>
        </div>

        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/10 group-hover:bg-red-600 flex items-center justify-center text-white/80 group-hover:text-white transition-all shrink-0">
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>
      </div>
    </Link>
  );
}
