import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  Maximize2,
  Star,
  Eye,
  Bookmark,
  Share2,
  Download,
  Flag,
  Check,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  Flame
} from 'lucide-react';
import { useData } from '../context/DataContext';
import EmptyState from '../components/EmptyState';
import ContentCard from '../components/ContentCard';
import BookmarkButton from '../components/BookmarkButton';
import ShareButton from '../components/ShareButton';

export default function ContentDetails() {
  const { slug } = useParams();
  const {
    contentList = [],
    isBookmarked: checkBookmarked,
    toggleBookmark,
    getUserRating,
    hasUserRated,
    setContentRating
  } = useData();

  const content = (contentList || []).find((c) => c.slug === slug || c._id === slug || c.id === slug);

  const [isPlaying, setIsPlaying] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState('');

  if (!content) {
    return (
      <EmptyState
        title="Content Not Found"
        description="The content or video media you requested could not be found or has been removed."
        actionText="Browse Explore"
        actionLink="/explore"
      />
    );
  }

  const contentIdentifier = content.slug || content._id || content.id;
  const isBookmarked = typeof checkBookmarked === 'function' ? checkBookmarked(contentIdentifier) : false;
  const userHasRated = typeof hasUserRated === 'function' ? hasUserRated(contentIdentifier) : false;
  const userRatingVal = typeof getUserRating === 'function' ? getUserRating(contentIdentifier) : null;
  const categoryName = typeof content?.category === 'object' ? content?.category?.name || 'Category' : content?.category || 'Category';

  const relatedContent = (contentList || []).filter(
    (c) => c.slug !== content.slug && c._id !== content._id && c.id !== content.id
  ).slice(0, 4);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const handleRate = async (star) => {
    if (userHasRated || ratingSubmitting) return;
    setRatingSubmitting(true);
    setRatingError('');
    const res = await setContentRating(contentIdentifier, star);
    setRatingSubmitting(false);
    if (res && !res.success) {
      setRatingError(res.message || 'Failed to submit rating.');
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-4 sm:pb-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
        <span>&gt;</span>
        <Link to="/media" className="hover:text-red-400 transition-colors">Media</Link>
        <span>&gt;</span>
        <span className="text-white truncate font-bold">{content.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl group">
            {isPlaying ? (
              <video
                src={content.mediaUrl || content.videoUrl || content.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={content.thumbnail || content.image}
                  alt={content.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-all">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 hover:scale-110 transition-transform"
                    aria-label="Play media"
                  >
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-white font-display">About This Media</h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
              {content.description}
            </p>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#0c101d] border border-white/[0.08] text-center text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Duration</span>
                <span className="font-mono font-bold text-white">{content.duration || 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Released</span>
                <span className="font-mono font-bold text-white">{content.releaseDate || content.createdAt?.split('T')[0] || 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Type</span>
                <span className="font-mono font-bold text-white uppercase">{content.contentType || 'Media'}</span>
              </div>
            </div>

            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {content.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 uppercase">
                {categoryName}
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                {content.genres?.join(' • ')}
              </span>
            </div>

            <h1 className="text-2xl font-black text-zinc-900 dark:text-white font-display">
              {content.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{content.ratingsAverage || content.rating || 5}</span>
              </div>
              <div className="flex items-center gap-1 font-medium">
                <Eye className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                <span>{content.views || content.viewCount || 0} views</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch / View Now</span>
            </button>

            <div className="w-full flex flex-col gap-2">
              <BookmarkButton item={content} itemType="Content" showLabel={true} size="md" className="w-full justify-center py-3.5" />
            </div>

            <div className="flex items-center justify-around pt-2 border-t border-zinc-200 dark:border-white/[0.08] text-xs text-zinc-600 dark:text-zinc-400">
              <ShareButton item={content} itemType="Content" showLabel={true} size="md" variant="pill" />

              {(content.mediaUrl || content.videoUrl) && (
                <a
                  href={content.mediaUrl || content.videoUrl}
                  download
                  className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => alert('Content report ticket submitted.')}
                className="flex items-center gap-1.5 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0c101d] border border-zinc-200 dark:border-white/[0.08] space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-white block font-display">Your Community Rating</span>
              {userHasRated && (
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                  Submitted
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={userHasRated || ratingSubmitting}
                  onClick={() => handleRate(star)}
                  className={`p-1 transition-transform ${
                    userHasRated ? 'cursor-not-allowed opacity-90' : 'hover:scale-125 cursor-pointer'
                  }`}
                  title={userHasRated ? 'You have already rated this item' : `Rate ${star} stars`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= (userHasRated ? userRatingVal : 0)
                        ? 'text-amber-500 fill-current'
                        : 'text-zinc-300 dark:text-zinc-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 ml-2">
                {userHasRated ? `Score: ${userRatingVal}/5` : ratingSubmitting ? 'Submitting...' : 'Click to rate'}
              </span>
            </div>
            {ratingError && (
              <p className="text-xs text-red-500 dark:text-red-400 font-semibold mt-1">{ratingError}</p>
            )}
          </div>
        </div>
      </div>

      {relatedContent.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-white/[0.08]">
          <h3 className="text-xl font-black text-zinc-900 dark:text-white font-display">Related Media</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedContent.map((item) => (
              <ContentCard key={item._id || item.id} content={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
