import React, { useState } from 'react';
import { User, Calendar, CheckCircle2, Heart, ArrowUpRight } from 'lucide-react';

export default function FanSubmissionCard({ submission }) {
  const [liked, setLiked] = useState(false);
  if (!submission) return null;

  const categoryName = typeof submission.category === 'object' ? submission.category?.name || 'General' : submission.category || 'General';
  const creatorName = typeof submission.creator === 'object' ? submission.creator?.username || submission.creator?.name || 'Fan Creator' : (submission.creator || submission.author || 'Fan Creator');

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1018] to-[#080b12] border border-white/[0.07] hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_40px_rgba(239,68,68,0.15)] flex flex-col justify-between">

      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <img
          src={submission.image}
          alt={submission.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-red-600/90 backdrop-blur-md text-white border border-red-400/30 shadow-md shadow-red-900/40">
            {categoryName}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[9px] font-bold uppercase tracking-wider bg-black/60 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified
          </span>
        </div>

        {/* Like button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
            liked
              ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-600/40 scale-110'
              : 'bg-black/50 border-white/20 text-white hover:bg-red-600 hover:border-red-400 hover:scale-110'
          }`}
          aria-label="Like"
        >
          <Heart size={13} className={liked ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-red-400 transition-colors duration-200 font-display">
            {submission.title}
          </h4>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {submission.description}
          </p>

          {submission.content && (
            <p className="text-[11px] text-zinc-500 line-clamp-2 italic bg-white/[0.03] px-3 py-2 rounded-xl border border-white/[0.05]">
              "{submission.content}"
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white border border-red-400/30 shadow-md shadow-red-600/20">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">{creatorName}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
              <Calendar className="w-3 h-3" />
              <span>{submission.submissionDate}</span>
            </div>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-400 group-hover:text-red-300 transition-colors">
              Read
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Bottom accent sweep */}
        <div className="h-[1px] bg-gradient-to-r from-red-500/0 via-red-500/40 to-red-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
      </div>
    </div>
  );
}
