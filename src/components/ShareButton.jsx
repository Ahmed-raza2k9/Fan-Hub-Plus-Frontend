import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({
  item,
  itemType = 'Content',
  className = '',
  showLabel = false,
  size = 'sm',
  variant = 'icon'
}) {
  const [copied, setCopied] = useState(false);

  const getCanonicalUrl = () => {
    if (!item) return window.location.href;

    // Use backend shareUrl if available and absolute/valid
    if (item.shareUrl && typeof item.shareUrl === 'string' && item.shareUrl.startsWith('http')) {
      return item.shareUrl;
    }

    const origin = window.location.origin;
    const identifier = item.slug || item._id || item.id;

    if (itemType === 'Character' || item.role !== undefined || item.avatar !== undefined) {
      return `${origin}/characters/${identifier}`;
    }
    if (itemType === 'Merchandise' || item.price !== undefined) {
      return `${origin}/merchandise/${identifier}`;
    }
    // Default to Content (Articles / Videos / Content)
    return `${origin}/content/${identifier}`;
  };

  const handleShare = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const url = getCanonicalUrl();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers / restricted contexts
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Even on error fallback silently copy or prompt
      prompt('Copy this link:', url);
    }
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all backdrop-blur-md border ${
          copied
            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
            : 'bg-black/60 hover:bg-red-600 text-zinc-200 hover:text-white border-white/15 hover:border-red-400'
        } ${className}`}
        title={copied ? 'Link Copied!' : 'Share item link'}
        aria-label="Share item link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-white" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center justify-center rounded-full backdrop-blur-md transition-all border ${
          size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'
        } ${
          copied
            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/50 scale-105'
            : 'bg-black/60 border-white/20 text-zinc-300 hover:bg-red-600 hover:border-red-400 hover:text-white hover:scale-105'
        } ${className}`}
        title={copied ? 'Link Copied!' : 'Share link'}
        aria-label={copied ? 'Link Copied' : 'Share link'}
      >
        {copied ? (
          <Check className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white`} />
        ) : (
          <Share2 className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
        )}
        {showLabel && (
          <span className="ml-1.5 text-xs font-semibold">
            {copied ? 'Copied!' : 'Share'}
          </span>
        )}
      </button>

      {/* Floating Copy Confirmation Toast */}
      {copied && (
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded bg-black/90 text-emerald-400 text-[10px] font-bold whitespace-nowrap shadow-lg border border-emerald-500/30 animate-fade-in">
          Link copied!
        </span>
      )}
    </div>
  );
}
