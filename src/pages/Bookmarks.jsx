import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star, Trash2, Edit3, Film, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';
import EmptyState from '../components/EmptyState';

export default function Bookmarks() {
  const { bookmarks = [], toggleBookmark, updateBookmarkNote, contentList = [], characters = [], merchandise = [], ratings = {}, setContentRating } = useData();
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [noteText, setNoteText] = useState('');

  const getItemLink = (b) => {
    const item = b.item;
    if (!item) return '/explore';
    const type = b.itemType || (item.role !== undefined ? 'Character' : item.price !== undefined ? 'Merchandise' : 'Content');
    if (type === 'Character') return `/characters/${item.slug || item._id}`;
    if (type === 'Merchandise') return `/merchandise/${item.slug || item._id}`;
    return `/content/${item.slug || item._id}`;
  };

  const bookmarkedItems = useMemo(() => {
    return (bookmarks || []).map((b) => {
      const rawObj = b.raw?.content || b.raw?.character || b.raw?.merchandise;
      let item = (typeof rawObj === 'object' && rawObj) ? rawObj : null;
      if (!item) {
        item = (contentList || []).find((c) => c.slug === b.contentSlug || c.id === b.contentId || c._id === b.contentId)
          || (characters || []).find((ch) => ch.slug === b.characterSlug || ch.id === b.characterId || ch._id === b.characterId)
          || (merchandise || []).find((m) => m.slug === b.merchandiseSlug || m.id === b.merchandiseId || m._id === b.merchandiseId);
      }
      return {
        ...b,
        item
      };
    }).filter(b => b.item);
  }, [bookmarks, contentList, characters, merchandise]);

  const ratedItems = useMemo(() => {
    const map = new Map();
    Object.values(ratings || {}).forEach((entry) => {
      if (!entry) return;
      const id = typeof entry === 'object' ? (entry.id || entry.slug || entry.contentId) : null;
      if (!id || map.has(id)) return;
      const item = (typeof entry === 'object' && entry.content) ? entry.content : (contentList || []).find((c) => c.slug === entry.slug || c._id === entry.contentId || c.id === entry.contentId);
      if (item) {
        map.set(id, {
          id,
          ratingVal: typeof entry === 'object' ? (entry.rating || entry.score || 5) : entry,
          item,
          raw: entry
        });
      }
    });
    return Array.from(map.values());
  }, [ratings, contentList]);

  const handleOpenEdit = (b) => {
    setEditingBookmark(b);
    setNoteText(b.note || '');
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (editingBookmark) {
      updateBookmarkNote(editingBookmark.id || editingBookmark.contentSlug || editingBookmark.item?.slug, noteText);
      setEditingBookmark(null);
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Personal Vault</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight font-display">
          Watchlist & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Ratings</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          Manage your saved series, custom viewing notes, and community star scores.
        </p>
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-[#0c101d] rounded-2xl border border-zinc-200 dark:border-white/[0.08] w-fit shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Bookmarks ({bookmarkedItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ratings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ratings'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>My Ratings ({ratedItems.length})</span>
        </button>
      </div>

      {activeTab === 'bookmarks' && (
        bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedItems.map((b) => {
              const { id, note, item } = b;
              const link = getItemLink(b);
              const displayTitle = item.title || item.name;
              const displayImage = item.thumbnail || item.image || item.avatar;
              const catName = typeof item.category === 'object' ? item.category?.name : (item.category || 'Fandom');
              return (
                <div
                  key={id || item._id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0c101d] border border-zinc-200 dark:border-white/[0.08] flex flex-col sm:flex-row gap-4 items-start justify-between group hover:border-blue-500/40 transition-all shadow-md hover:shadow-xl"
                >
                  <div className="flex gap-4 min-w-0 w-full flex-1">
                    <Link to={link} className="flex gap-4 min-w-0 flex-1 group/item">
                      <img
                        src={displayImage}
                        alt={displayTitle}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 bg-zinc-100 dark:bg-zinc-950 group-hover/item:opacity-90 transition-opacity"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          {catName} • {b.itemType || item.contentType || 'Entry'}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors truncate font-display">
                          {displayTitle}
                        </h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">{item.description || item.bio || item.shortBio}</p>
                      </div>
                    </Link>

                    <div className="pt-2 shrink-0">
                      {note ? (
                        <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/[0.08] text-[11px] text-zinc-700 dark:text-zinc-300 flex items-start justify-between gap-2">
                          <span className="italic truncate max-w-[120px]">"{note}"</span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleOpenEdit(b); }}
                            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white shrink-0"
                            title="Edit note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(b); }}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Add note</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleBookmark(id || item.slug || item._id)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-white/5 transition-colors shrink-0 self-end sm:self-start"
                    title="Remove bookmark"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Your Watchlist is Empty"
            description="You haven't bookmarked any fandom entries yet. Browse Explore or any category page and click the bookmark button."
            actionText="Explore Fandom Content"
            actionLink="/explore"
          />
        )
      )}

      {activeTab === 'ratings' && (
        ratedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratedItems.map(({ id, ratingVal, item }) => (
              <div
                key={id || item._id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0c101d] border border-zinc-200 dark:border-white/[0.08] flex gap-4 items-center justify-between shadow-md hover:shadow-xl"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.thumbnail || item.image}
                    alt={item.title || item.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-zinc-100 dark:bg-zinc-950"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                      {typeof item.category === 'object' ? item.category?.name : (item.category || 'Media')}
                    </span>
                    <Link to={`/content/${item.slug || item._id}`}>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate font-display">
                        {item.title || item.name}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars
                        value={ratingVal}
                        readOnly={true}
                        size="sm"
                      />
                      <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold">
                        {ratingVal} / 5
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/content/${item.slug || item._id}`}
                  className="p-2.5 rounded-xl bg-zinc-100 dark:bg-[#121829] hover:bg-blue-600 text-zinc-600 dark:text-zinc-300 hover:text-white transition-colors"
                  title="View content"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Ratings Logged"
            description="You haven't rated any titles yet. Head over to any content detail page to rate from 1 to 5 stars."
            actionText="Browse Titles"
            actionLink="/explore"
          />
        )
      )}

      <Modal
        isOpen={!!editingBookmark}
        onClose={() => setEditingBookmark(null)}
        title="Edit Watchlist Note"
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <p className="text-xs text-zinc-400">
            Update your personal reminder or watch party plan:
          </p>
          <textarea
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full px-3 py-2.5 text-xs bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingBookmark(null)}
              className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/20"
            >
              Update Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
