import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Download,
  Image as ImageIcon,
  Headphones,
  Radio,
  Search,
  Share2,
  Bookmark,
  Star,
  Eye,
  Calendar,
  Clock,
  Sparkles,
  Film,
  Volume2,
  Flame,
  ArrowRight
} from 'lucide-react';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import EmptyState from '../components/EmptyState';

export default function Media() {
  const { contentList = [] } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filterTabs = [
    { id: 'all', label: 'All Media', icon: Sparkles },
    { id: 'videos', label: 'Videos & AMVs', icon: Film },
    { id: 'wallpapers', label: '4K Wallpapers', icon: ImageIcon },
    { id: 'music', label: 'Soundtracks & OSTs', icon: Headphones },
    { id: 'podcasts', label: 'Fandom Podcasts', icon: Radio }
  ];

  const videoCollection = (contentList || [])
    .filter((c) => c.contentType === 'video' || c.contentType === 'trailer')
    .map((vid) => ({
      ...vid,
      id: vid.id || vid._id,
      title: vid.title,
      category: vid.category,
      duration: vid.duration || '24:15',
      views: vid.views || (vid.viewCount ? `${(vid.viewCount / 1000).toFixed(1)}K views` : '0 views'),
      releaseDate: vid.releaseDate ? new Date(vid.releaseDate).toLocaleDateString() : '2026',
      rating: vid.rating || vid.popularityScore || 9.5,
      votes: vid.votes || '10K',
      thumbnail: vid.thumbnail || vid.image || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      videoUrl: vid.mediaUrl || vid.videoUrl || '',
      mediaUrl: vid.mediaUrl || vid.videoUrl || '',
      description: vid.description || ''
    }));

  const wallpapers = (contentList || [])
    .filter((c) => c.contentType === 'image')
    .map((wp) => ({
      id: wp.id || wp._id,
      title: wp.title,
      category: wp.category,
      resolution: '3840 × 2160 (4K)',
      downloads: `${wp.viewCount || 0} Downloads`,
      image: wp.thumbnail || wp.image || ''
    }));

  const audioTracks = (contentList || [])
    .filter((c) => c.contentType === 'audio')
    .map((tr) => ({
      id: tr.id || tr._id,
      title: tr.title,
      artist: tr.author || 'Fandom Artist',
      duration: tr.duration || '3:30',
      category: typeof tr.category === 'object' ? tr.category?.name : tr.category || 'Soundtrack',
      mediaUrl: tr.mediaUrl || tr.videoUrl || ''
    }));

  return (
    <div className="space-y-12 pb-6 sm:pb-12 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-red-950/60 bg-gradient-to-r from-[#18060a] via-[#090b12] to-[#120508] p-6 sm:p-12 shadow-[0_0_60px_rgba(220,38,38,0.18)]">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-red-900/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>Official Vault</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            Multimedia <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">Center</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
            Stream high-bitrate trailers, download 4K UHD desktop & mobile wallpapers, and listen to orchestral fandom soundtracks.
          </p>

          <div className="flex items-center gap-2 pt-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 w-full">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 border border-red-400/40 scale-105'
                    : 'bg-[#0e1018] text-zinc-300 hover:text-white border border-white/[0.08] hover:border-red-500/40'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 sm:opacity-40 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80"
            alt="Anime Media"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#18060a] via-transparent to-transparent" />
        </div>
      </div>

      {/* =========================================================
          VIDEOS & EPISODES SECTION
      ========================================================= */}
      {(activeTab === 'all' || activeTab === 'videos') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight font-display flex items-center gap-2">
                <Film className="w-5 h-5 text-red-500" />
                <span>Latest Videos & Episodes</span>
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Stream anime trailers, gameplay showcases, and community AMVs</p>
            </div>
          </div>
          {videoCollection.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {videoCollection.map((vid) => (
                <article
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-white/[0.08] hover:border-red-500/70 bg-white dark:bg-gradient-to-b dark:from-[#13080c] dark:via-[#090b10] dark:to-[#06070a] transition-all duration-400 hover:-translate-y-2 shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_36px_rgba(220,38,38,0.18)] dark:hover:shadow-[0_12px_36px_rgba(220,38,38,0.25)] flex flex-col justify-between select-none"
                >
                  {/* Poster / Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10 group-hover:ring-red-500/40 transition-all">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Category Pill Top-Left */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-red-600 text-white text-[9.5px] font-black uppercase tracking-wider shadow-md shadow-red-950/60 border border-red-400/40">
                      {typeof vid.category === 'object' ? vid.category?.name : vid.category}
                    </span>

                    {/* Duration Badge Top-Right */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono font-black text-white border border-white/20">
                      {vid.duration}
                    </span>

                    {/* Centered Glowing Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-red-500/40 scale-125 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md" />
                        <div className="w-12 h-12 rounded-full bg-white/15 sm:bg-white/10 group-hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/30 group-hover:border-red-400/60 shadow-2xl group-hover:scale-110 transition-all duration-300">
                          <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200 line-clamp-2 font-display leading-snug">
                        {vid.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 dark:border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06]">
                        <Eye className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300">{vid.views}</span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-red-600 group-hover:text-red-700 dark:text-red-400 dark:group-hover:text-red-300 transition-colors">
                        <span>Watch</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>

                    {/* Bottom Red Accent Sweep */}
                    <div className="h-[1.5px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full" />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No Videos Found" description="No video content is currently available." />
          )}
        </section>
      )}

      {/* =========================================================
          WALLPAPERS SECTION (4K UHD)
      ========================================================= */}
      {(activeTab === 'all' || activeTab === 'wallpapers') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight font-display flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-red-500" />
                <span>Popular Wallpapers (4K Ultra HD)</span>
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Desktop and mobile high-resolution fan downloads</p>
            </div>
          </div>

          {wallpapers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {wallpapers.map((wp) => (
                <article
                  key={wp.id}
                  className="group rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-white/[0.08] hover:border-red-500/70 bg-white dark:bg-gradient-to-b dark:from-[#13080c] dark:via-[#090b10] dark:to-[#06070a] transition-all duration-400 hover:-translate-y-2 shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_36px_rgba(220,38,38,0.18)] dark:hover:shadow-[0_12px_36px_rgba(220,38,38,0.22)] flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10 group-hover:ring-red-500/30 transition-all">
                    <img
                      src={wp.image}
                      alt={wp.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* Resolution Tag Top-Left */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white text-zinc-950 text-[9px] font-mono font-black shadow-md">
                      4K UHD
                    </span>

                    {/* Category Pill Top-Right */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black uppercase shadow-md">
                      {typeof wp.category === 'object' ? wp.category?.name : wp.category}
                    </span>

                    {/* Download Floating Action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                      <a
                        href={wp.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-xl shadow-red-600/50 scale-95 group-hover:scale-100 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download 4K</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate font-display">
                      {wp.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-white/[0.08]">
                      <span>{wp.resolution}</span>
                      <span className="text-red-600 dark:text-red-400 font-bold">{wp.downloads}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No Wallpapers Found" description="No wallpaper images uploaded yet." />
          )}
        </section>
      )}

      {/* =========================================================
          AUDIO & SOUNDTRACKS SECTION
      ========================================================= */}
      {(activeTab === 'all' || activeTab === 'music' || activeTab === 'podcasts') && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight font-display flex items-center gap-2">
              <Headphones className="w-5 h-5 text-red-500" />
              <span>Fandom Audio & Soundtracks</span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Epic orchestral themes, remixed tracks, and community podcasts</p>
          </div>

          {audioTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {audioTracks.map((track) => (
                <article
                  key={track.id}
                  className="group p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] hover:border-red-500/70 bg-white dark:bg-gradient-to-b dark:from-[#13080c] dark:via-[#090b10] dark:to-[#06070a] shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_30px_rgba(220,38,38,0.18)] dark:hover:shadow-[0_10px_30px_rgba(220,38,38,0.22)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-red-50 dark:bg-red-600/20 border border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300 shadow-sm">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <span className="px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-600/30">
                        {typeof track.category === 'object' ? track.category?.name : track.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate font-display">
                        {track.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate font-medium">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">{track.duration}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedVideo({
                          title: track.title,
                          mediaUrl: track.mediaUrl,
                          videoUrl: track.mediaUrl,
                          description: `Playing ${track.title} by ${track.artist}`
                        })
                      }
                      className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 hover:scale-110 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No Audio Tracks Found" description="No soundtracks or audio files uploaded." />
          )}
        </section>
      )}

      {/* Player Modal */}
      <Modal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        title={selectedVideo?.title || 'Player'}
      >
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-red-950/60 shadow-2xl">
            <video
              src={selectedVideo?.mediaUrl || selectedVideo?.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-bold text-white text-sm">{selectedVideo?.title}</span>
              {selectedVideo?.rating && (
                <div className="flex items-center gap-1 text-amber-400 font-bold px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{selectedVideo?.rating}</span>
                </div>
              )}
            </div>

            <p className="text-zinc-300 leading-relaxed font-normal">{selectedVideo?.description}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="px-5 py-2 text-xs font-black bg-red-600 text-white rounded-xl hover:bg-red-500 shadow-md shadow-red-600/30 transition-all"
            >
              Close Player
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
