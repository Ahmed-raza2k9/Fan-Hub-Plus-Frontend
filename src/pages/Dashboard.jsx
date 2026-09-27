import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Sparkles,
  Heart,
  Star,
  User,
  ArrowRight,
  MessageSquare,
  Shield,
  Layers,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ContentCard from '../components/ContentCard';
import CharacterCard from '../components/CharacterCard';
import MerchandiseCard from '../components/MerchandiseCard';
import CategoryCard from '../components/CategoryCard';

export default function Dashboard() {
  const { currentUser, isAdmin } = useAuth();
  const {
    bookmarks = [],
    ratings = {},
    categories = [],
    contentList = [],
    fanSubmissions = []
  } = useData();

  const userSubmissions = (fanSubmissions || []).filter(
    (s) => (s.creator || s.user?.name || '').toLowerCase() === (currentUser?.name || '').toLowerCase()
  );

  const bookmarkedItems = (contentList || []).concat(characters || []).concat(merchandise || []).filter((c) =>
    (bookmarks || []).some((b) => b && (b.contentSlug === c.slug || b.contentId === c.id || b.contentId === c._id || b.characterSlug === c.slug || b.characterId === c.id || b.characterId === c._id || b.merchandiseSlug === c.slug || b.merchandiseId === c.id || b.merchandiseId === c._id || b.item === c._id || b.item === c.id))
  );

  const ratingsCount = Object.keys(ratings || {}).length;

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0c101d] border border-zinc-200 dark:border-white/[0.08] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-blue-500/50 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight font-display">
                {currentUser?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {currentUser?.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-medium">{currentUser?.bio || 'Fan Hub Plus Member'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/profile"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-[#121829] hover:bg-zinc-200 dark:hover:bg-[#182138] rounded-xl border border-zinc-200 dark:border-white/[0.08] transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </Link>
          <Link
            to="/submit"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-blue-500/30"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Work</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0c101d] border border-zinc-200 dark:border-white/[0.08] space-y-1 shadow-md">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Bookmarks</span>
            <Bookmark className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">{bookmarks.length}</p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Saved media in watchlist</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0c101d] border border-zinc-200 dark:border-white/[0.08] space-y-1 shadow-md">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fan Works</span>
            <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">{userSubmissions.length}</p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Submissions created</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0c101d] border border-zinc-200 dark:border-white/[0.08] space-y-1 shadow-md">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ratings</span>
            <Star className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">{ratingsCount}</p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Titles reviewed</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">Watchlist & Bookmarks</h2>
          <Link to="/bookmarks" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
            <span>View All ({bookmarkedItems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {bookmarkedItems.slice(0, 6).map((item) => {
              if (item.role !== undefined || item.avatar !== undefined) {
                return <CharacterCard key={item._id || item.id} character={item} />;
              }
              if (item.price !== undefined) {
                return <MerchandiseCard key={item._id || item.id} item={item} />;
              }
              return <ContentCard key={item._id || item.id} content={item} />;
            })}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0c101d] border border-zinc-200 dark:border-white/[0.08] text-center space-y-3 shadow-md">
            <Bookmark className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">Your Watchlist is Empty</p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Browse anime, gaming walkthroughs, and trailers to bookmark titles for later viewing.
            </p>
            <Link
              to="/explore"
              className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
            >
              Explore Media
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
