import React, { useState } from 'react';
import { Bookmark, Edit3 } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from './Modal';

export default function BookmarkButton({
  item,
  contentSlug,
  slug,
  itemType = 'Content',
  title = '',
  className = '',
  showLabel = false,
  size = 'sm',
  variant = 'default' // 'default' | 'cardIcon'
}) {
  const { isBookmarked, toggleBookmark, bookmarks, updateBookmarkNote } = useData();

  const identifier = item?.slug || item?._id || item?.id || contentSlug || slug;
  const itemTitle = title || item?.title || item?.name || identifier || 'Item';
  const inferredType = itemType || (item?.role !== undefined ? 'Character' : item?.price !== undefined ? 'Merchandise' : 'Content');

  const bookmarked = isBookmarked(identifier);

  const currentBookmark = (bookmarks || []).find(
    (b) =>
      b &&
      (b.contentSlug === identifier ||
        b.contentId === identifier ||
        b.characterSlug === identifier ||
        b.characterId === identifier ||
        b.merchandiseSlug === identifier ||
        b.merchandiseId === identifier ||
        b.id === identifier ||
        b.raw?._id === identifier ||
        b.raw?.item === identifier)
  );

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState(currentBookmark?.note || '');

  const handleClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleBookmark(identifier, '', inferredType);
  };

  const handleOpenNote = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setNoteText(currentBookmark?.note || '');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updateBookmarkNote(currentBookmark?.id || identifier, noteText);
    setIsNoteModalOpen(false);
  };

  if (variant === 'cardIcon') {
    return (
      <>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClick}
            className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              bookmarked
                ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/50 scale-105'
                : 'bg-black/60 border-white/20 text-zinc-300 hover:bg-red-600 hover:border-red-400 hover:text-white hover:scale-105'
            } ${className}`}
            title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current text-white' : ''}`} />
          </button>

          {bookmarked && (
            <button
              type="button"
              onClick={handleOpenNote}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/20 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
              title="Add/edit note"
              aria-label="Add/edit note"
            >
              <Edit3 className="w-3 h-3 text-red-300" />
            </button>
          )}
        </div>

        <Modal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          title="Bookmark Note"
        >
          <form onSubmit={handleSaveNote} className="space-y-4">
            <p className="text-xs text-zinc-400">
              Personal note for <strong className="text-zinc-200">{itemTitle}</strong>:
            </p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add your personal notes or watch plans..."
              rows={3}
              className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-sm"
              >
                Save Note
              </button>
            </div>
          </form>
        </Modal>
      </>
    );
  }

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center justify-center rounded-xl transition-all ${
            size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          } ${
            bookmarked
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30 hover:bg-red-700'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 dark:border-zinc-700/60'
          } ${className}`}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark this item'}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this item'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
          {showLabel && <span className="ml-1.5 font-semibold">{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>}
        </button>

        {bookmarked && (
          <button
            type="button"
            onClick={handleOpenNote}
            className={`rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 border border-zinc-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:border-zinc-700/60 dark:text-zinc-400 dark:hover:text-white transition-colors ${
              size === 'sm' ? 'p-1.5' : 'p-2'
            }`}
            title="Add or edit bookmark note"
            aria-label="Add or edit bookmark note"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Bookmark Note"
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <p className="text-xs text-zinc-400">
            Save a personal note for <strong className="text-zinc-200">{itemTitle}</strong>:
          </p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="e.g. Plan to watch with discord squad at 8 PM..."
            rows={3}
            className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-sm"
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
