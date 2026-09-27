import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Star,
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Calendar,
  Eye,
  Sparkles,
  Ticket,
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import CategoryCard from '../components/CategoryCard';
import ContentCard from '../components/ContentCard';
import CharacterCard from '../components/CharacterCard';
import UpcomingReleaseCard from '../components/UpcomingReleaseCard';
import AutoSlider from '../components/AutoSlider';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import HeroSidebar from '../components/HeroSidebar';

export default function Home() {
  const { categories, contentList, characters, events, loading, error } = useData();

  const [trendingCategoryFilter, setTrendingCategoryFilter] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Dynamic calculation of Hero Slides using real MongoDB content data
  const heroSlides = useMemo(() => {
    if (!contentList || contentList.length === 0) return [];

    // Filter featured items if available, or fallback to top content items
    const featured = contentList.filter((c) => c.featured || c.isFeatured);
    const sourceItems = featured.length > 0 ? featured : contentList;

    return sourceItems.slice(0, 6).map((item) => {
      const catName = typeof item.category === 'object' ? item.category?.name : item.category || 'Fandom';
      const genreStr = Array.isArray(item.genre)
        ? item.genre.join(' • ')
        : item.genre || item.contentType?.toUpperCase() || 'Explore Fandom';

      return {
        id: item._id || item.id,
        slug: item.slug || item._id || item.id,
        badge: catName.toUpperCase(),
        title: item.title,
        subtitle: item.description || item.synopsis || item.excerpt || 'Dive into epic stories, legendary characters and endless adventures.',
        ctaText: `Explore ${item.title}`,
        ctaLink: `/content/${item.slug || item._id || item.id}`,
        bgImage: item.banner || item.image || item.thumbnail || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=85',
        logoText: item.title,
        genreText: genreStr,
        rating: item.rating || item.averageRating
      };
    });
  }, [contentList]);

  // Adjust active slide index safely when slides length changes
  useEffect(() => {
    if (currentSlide >= heroSlides.length && heroSlides.length > 0) {
      setCurrentSlide(0);
    }
  }, [heroSlides.length, currentSlide]);

  // Automatic slideshow progression
  useEffect(() => {
    if (!isAutoPlaying || heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const activeSlide = heroSlides[currentSlide] || heroSlides[0];

  const trendingCategories = ['All', 'Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics'];

  const filteredTrendingContent = contentList.filter((item) => {
    if (trendingCategoryFilter === 'All') return true;
    const catName = typeof item.category === 'object' ? item.category?.name : item.category;
    return String(catName || '').toLowerCase() === trendingCategoryFilter.toLowerCase();
  });

  const latestVideos = contentList
    .filter((c) => c.contentType === 'video' || c.contentType === 'trailer')
    .slice(0, 4)
    .map((vid) => ({
      ...vid,
      title: vid.title,
      category: typeof vid.category === 'object' ? vid.category?.name : vid.category || 'Video',
      views: vid.views || (vid.viewCount ? `${(vid.viewCount / 1000).toFixed(1)}K views` : '1K views'),
      duration: vid.duration || '24:15',
      thumbnail: vid.thumbnail || vid.image || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      mediaUrl: vid.mediaUrl || vid.videoUrl || ''
    }));

  const [upcomingCategoryFilter, setUpcomingCategoryFilter] = useState('All');
  const upcomingCategories = ['All', 'Anime', 'Movies', 'TV Shows', 'Games'];

  const upcomingReleases = events.map((evt) => ({
    id: evt.id || evt._id,
    title: evt.title,
    date: evt.startDate || 'COMING SOON',
    type: 'EVENT',
    category: typeof evt.category === 'object' ? evt.category?.name : evt.category || 'Convention',
    image: evt.image || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=85'
  }));

  const filteredUpcomingReleases = upcomingReleases.filter((item) => {
    if (upcomingCategoryFilter === 'All') return true;
    const catName = typeof item.category === 'object' ? item.category?.name : item.category;
    return String(catName || '').toLowerCase() === upcomingCategoryFilter.toLowerCase();
  });

  return (
    <div className="space-y-14 sm:space-y-20 pb-6 sm:pb-12 w-full">
      {/* HERO SECTION WITH DYNAMIC SLIDER & HERO SIDEBAR */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Main Hero Slider Banner */}
        <div className="lg:col-span-8 min-h-[440px] xs:min-h-[480px] sm:min-h-[520px] lg:min-h-[540px]">
          {/* Loading Skeleton State */}
          {loading && (
            <div className="w-full h-full min-h-[440px] rounded-3xl animate-pulse bg-[#060a14] border border-white/10 p-6 sm:p-10 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4 max-w-lg">
                <div className="w-24 h-6 bg-zinc-800/60 rounded-full" />
                <div className="w-3/4 h-10 bg-zinc-800/80 rounded-2xl" />
                <div className="w-full h-4 bg-zinc-800/50 rounded" />
                <div className="w-2/3 h-4 bg-zinc-800/50 rounded" />
                <div className="w-36 h-10 bg-zinc-800/70 rounded-full pt-2" />
              </div>
              <div className="flex gap-2 justify-center">
                <div className="w-6 h-2 bg-zinc-800/60 rounded-full" />
                <div className="w-2 h-2 bg-zinc-800/40 rounded-full" />
                <div className="w-2 h-2 bg-zinc-800/40 rounded-full" />
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && heroSlides.length === 0 && (
            <div className="w-full h-full min-h-[440px] rounded-3xl bg-[#060a14] border border-red-500/30 p-8 flex flex-col items-center justify-center text-center space-y-3 shadow-2xl">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Unable to load hero slider</h3>
              <p className="text-xs text-zinc-400 max-w-md">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && heroSlides.length === 0 && (
            <div className="w-full h-full min-h-[440px] rounded-3xl bg-[#060a14] border border-white/10 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl">
              <Sparkles className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No featured content available</h3>
              <p className="text-xs text-zinc-400 max-w-md">Discover latest content across our fandom universe.</p>
              <Link
                to="/explore"
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg"
              >
                Explore Fandoms
              </Link>
            </div>
          )}

          {/* Real Dynamic MongoDB Hero Slide Banner */}
          {!loading && activeSlide && (
            <div
              className="relative w-full h-full rounded-3xl overflow-hidden min-h-[440px] xs:min-h-[480px] sm:min-h-[520px] lg:min-h-[540px] border border-white/10 bg-[#060a14] shadow-2xl flex items-center transition-all duration-700 group/hero"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Background Image with Ambient Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={activeSlide.bgImage}
                  alt={activeSlide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center sm:object-right transition-all duration-1000 scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/90 sm:via-[#060a14]/75 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-transparent to-black/40" />
              </div>

              {/* Prev Slide Navigation Arrow */}
              {heroSlides.length > 1 && (
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/15 flex items-center justify-center backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-90"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Next Slide Navigation Arrow */}
              {heroSlides.length > 1 && (
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/15 flex items-center justify-center backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-90"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Active Slide Information */}
              <div className="relative z-10 p-5 sm:p-8 lg:p-12 max-w-xl space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2e63]/20 text-[#ff3366] border border-[#ff2e63]/40 text-[11px] sm:text-xs font-black tracking-wider uppercase backdrop-blur-md shadow-lg">
                  <Flame className="w-3.5 h-3.5 fill-current text-[#ff2e63]" />
                  <span>{activeSlide.badge}</span>
                </div>

                <h1 className="text-3xl xs:text-4xl sm:text-5xl font-black text-white tracking-tight font-display leading-[1.08] line-clamp-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-600 drop-shadow-[0_0_35px_rgba(255,46,99,0.4)]">
                    {activeSlide.title}
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed max-w-md line-clamp-3">
                  {activeSlide.subtitle}
                </p>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 pt-1">
                  <Link
                    to={activeSlide.ctaLink}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff2e63] to-[#d6004c] hover:from-[#ff1751] hover:to-[#b80041] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-[#ff2e63]/40 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{activeSlide.ctaText}</span>
                  </Link>
                </div>

                {/* Footer Metadata Badge on lower left */}
                <div className="flex items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                  <div className="w-8 h-8 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-lg">
                    <Flame className="w-3.5 h-3.5 text-[#ff2e63]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white font-display leading-tight truncate">
                      {activeSlide.logoText}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate">
                      {activeSlide.genreText} {activeSlide.rating ? `• ★ ${activeSlide.rating}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dots Indicators */}
              {heroSlides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentSlide(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentSlide === idx
                          ? 'w-7 bg-[#ff2e63] shadow-md shadow-[#ff2e63]/60'
                          : 'w-2.5 bg-white/20 hover:bg-white/50'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Hero Sidebar Panel */}
        <div className="lg:col-span-4 h-full min-h-[420px]">
          <HeroSidebar />
        </div>
      </section>

      <section className="relative space-y-4">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500 shadow-md shadow-red-500/10 shrink-0">
              <Sparkles className="w-4 h-4 text-red-500 fill-red-500/20" />
            </div>
            <h2 className="text-base sm:text-lg lg:text-xl font-black text-zinc-900 dark:text-white tracking-tight font-display">
              Explore <span className="text-red-500">Fandom Categories</span>
            </h2>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <div
              key={cat._id || cat.id}
              className="snap-start shrink-0 w-[140px] xs:w-[160px] sm:w-[185px] lg:w-[calc(20%-13px)]"
            >
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {/* Responsive Header Row: Title on top/left, Filter pills with full-width smooth scroll on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Flame + Label */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 shrink-0">
                <Flame className="w-4 h-4 fill-current text-red-500" />
              </div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-300 font-display flex items-baseline gap-1.5">
                <span>Trending /</span>
                <span className="text-red-600 dark:text-red-500">Popular Content</span>
              </h2>
            </div>
            
            <Link
              to="/explore"
              className="sm:hidden inline-flex items-center gap-1 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 shrink-0 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right: Category filter pills - smooth full width horizontal scroll on mobile, flex-wrap on desktop */}
          <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0">
            {trendingCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setTrendingCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                  trendingCategoryFilter === cat
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/30 border border-red-400/40'
                    : 'bg-white dark:bg-[#0e1424] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-[#151f38]'
                }`}
              >
                {cat}
              </button>
            ))}

            <Link
              to="/explore"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white shrink-0 ml-1 whitespace-nowrap"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Scroll Slider */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {filteredTrendingContent.slice(0, 8).map((item, idx) => (
            <div key={item._id || item.id} className="snap-start shrink-0 w-[160px] sm:w-[185px] lg:w-[calc(20%-13px)]">
              <ContentCard content={item} rank={idx + 1} />
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          FEATURED CHARACTERS (AUTO SLIDER, NO ARROWS, GLOWING CARDS)
      ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500 shadow-md shadow-red-500/10 shrink-0">
              <Star className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
            <h2 className="text-base sm:text-lg lg:text-xl font-black text-zinc-900 dark:text-white tracking-tight font-display">
              Featured <span className="text-red-500">Characters</span>
            </h2>
          </div>
          <Link to="/characters" className="inline-flex items-center gap-1 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Auto Slider - Wider classical cards */}
        <AutoSlider itemClassName="w-[270px] sm:w-[300px] md:w-[320px] shrink-0" autoPlayInterval={3400}>
          {characters.map((char) => (
            <CharacterCard
              key={char._id || char.id}
              character={char}
            />
          ))}
        </AutoSlider>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500 shadow-md shadow-red-500/10 shrink-0">
              <Play className="w-4 h-4 text-red-500 fill-current" />
            </div>
            <h2 className="text-base sm:text-lg lg:text-xl font-black text-zinc-900 dark:text-white tracking-tight font-display">
              Latest <span className="text-red-500">Videos & Trailers</span>
            </h2>
          </div>

          <Link
            to="/media"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {latestVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {latestVideos.map((vid, i) => (
              <div
                key={i}
                onClick={() =>
                  setActiveVideoModal({
                    title: vid.title,
                    url: vid.mediaUrl || vid.videoUrl || ''
                  })
                }
                className="group cursor-pointer rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-gradient-to-b dark:from-[#0e1220] dark:to-[#090d18] hover:border-red-500/60 dark:hover:border-red-500/40 transition-all duration-300 shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_40px_rgba(239,68,68,0.25)] dark:hover:shadow-[0_8px_40px_rgba(239,68,68,0.18)]"
              >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-black ring-1 ring-black/5 dark:ring-transparent">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Category badge - top left */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-red-600/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-white shadow-md shadow-red-900/40 border border-red-400/30">
                  {typeof vid.category === 'object' ? vid.category?.name : vid.category}
                </span>

                {/* Duration badge - top right */}
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10">
                  {vid.duration}
                </span>

                {/* Centered animated play button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full bg-red-500/30 scale-125 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
                    <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:border-red-400/50 shadow-xl group-hover:shadow-red-500/40 group-hover:scale-110 transition-all duration-300">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Info bar */}
              <div className="p-4 space-y-2.5">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200 line-clamp-1 font-display leading-snug">
                  {vid.title}
                </h4>

                <div className="flex items-center justify-between">
                  {/* Views pill */}
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/10">
                    <svg className="w-3 h-3 text-zinc-500 dark:text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">{vid.views}</span>
                  </div>

                  {/* Watch button */}
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
                    Watch
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

                {/* Bottom accent line */}
                <div className="h-[1px] bg-gradient-to-r from-red-500/0 via-red-500/30 to-red-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </div>
          ))}
        </div>
        ) : (
          <EmptyState title="No Videos Found" description="No video content available at the moment." />
        )}
      </section>

      {/* =========================================================
          UPCOMING RELEASES (AUTO SLIDER, NO ARROWS, GLOWING CARDS)
      ========================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500 shadow-md shadow-red-500/10 shrink-0">
                <Calendar className="w-4 h-4 text-red-500" />
              </div>
              <h2 className="text-base sm:text-lg lg:text-xl font-black text-zinc-900 dark:text-white tracking-tight font-display flex items-baseline gap-1.5">
                <span>Upcoming</span>
                <span className="text-red-500">Releases</span>
              </h2>
            </div>

            <Link
              to="/explore"
              className="sm:hidden inline-flex items-center gap-1 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 shrink-0 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0">
            {upcomingCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setUpcomingCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                  upcomingCategoryFilter === cat
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md shadow-red-600/30 border border-red-400/40'
                    : 'bg-white dark:bg-[#0a0f1d] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-[#121a30]'
                }`}
              >
                {cat}
              </button>
            ))}

            <Link
              to="/explore"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-red-400 shrink-0 ml-1 transition-colors whitespace-nowrap"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Auto Slider - No arrows */}
        <AutoSlider itemClassName="w-[260px] xs:w-[280px] sm:w-[300px] shrink-0" autoPlayInterval={3200}>
          {filteredUpcomingReleases.map((item) => (
            <UpcomingReleaseCard key={item._id || item.id} item={item} />
          ))}
        </AutoSlider>
      </section>

      {/* =========================================================
          EVENTS SECTION (BLACK & CRIMSON RED NEON THEME)
      ========================================================= */}
      {/* =========================================================
          FANDOM EVENTS (RED & WHITE HIGH-CONTRAST THEME)
      ========================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] shrink-0 border border-red-400/40">
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                <Flame className="w-3 h-3 text-red-500" />
                <span>Live Fandom Summits</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight font-display flex items-baseline gap-2">
                <span>Fandom</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-500 dark:from-red-500 dark:via-rose-400 dark:to-white drop-shadow-[0_0_10px_rgba(239,68,68,0.3)] dark:drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]">
                  Events
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                Meet legendary creators, participate in cosplay championships & experience live fandom summits!
              </p>
            </div>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-black text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all shrink-0 border border-red-400/40 hover:scale-105"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Event Showcase Grid — real data from API */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <Ticket className="w-10 h-10 text-red-500/40" />
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold">No Events Found</p>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs">Check back soon for upcoming fandom events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Main Featured Big Event Banner — first event */}
            {(() => {
              const featured = events[0];
              const featuredSlug = featured.slug || featured._id || featured.id;
              const featuredCat = typeof featured.category === 'object' ? featured.category?.name : featured.category || 'Event';
              const formatEventLocation = (evt) => {
                if (!evt) return '';
                if (typeof evt.location === 'string' && evt.location.trim()) return evt.location;
                if (evt.location && typeof evt.location === 'object' && evt.location.name) return evt.location.name;
                const parts = [evt.venue, evt.address, evt.city].filter(Boolean);
                if (parts.length > 0) return parts.join(', ');
                if (evt.location && typeof evt.location === 'object' && Array.isArray(evt.location.coordinates) && evt.location.coordinates.length === 2) {
                  return `Lat: ${evt.location.coordinates[1]}, Lng: ${evt.location.coordinates[0]}`;
                }
                return '';
              };
              const featuredLoc = formatEventLocation(featured);
              return (
                <Link
                  to={`/events/${featuredSlug}`}
                  className="lg:col-span-7 xl:col-span-8 rounded-[28px] overflow-hidden border border-red-500/40 bg-gradient-to-b from-[#13080c] via-[#090b10] to-[#050608] hover:border-red-400 transition-all duration-500 shadow-[0_0_35px_rgba(220,38,38,0.25)] hover:shadow-[0_0_55px_rgba(239,68,68,0.45)] flex flex-col md:flex-row group relative block"
                >
                  <div className="md:w-1/2 relative min-h-[260px] sm:min-h-[300px] bg-black overflow-hidden">
                    <img
                      src={featured.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=85'}
                      alt={featured.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-black/50" />
                    <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-lg shadow-red-600/60 border border-red-400/40">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        Featured Event
                      </span>
                    </div>
                    {featured.ticketPrice && (
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-black bg-black/85 backdrop-blur-md text-white border border-red-500/40 shadow-lg">
                          <span className="text-red-400">Tickets:</span> {featured.ticketPrice}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2 p-6 sm:p-7 flex flex-col justify-between space-y-5 bg-gradient-to-b from-[#14080c] to-[#07080d]">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-400 text-[11px] font-mono font-bold uppercase tracking-wider">
                        <Flame className="w-4 h-4 fill-current animate-pulse text-red-500" />
                        <span>{featuredCat}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white font-display leading-tight group-hover:text-red-400 transition-colors">
                        {featured.title}
                      </h3>
                      {featured.description && (
                        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">{featured.description}</p>
                      )}
                      <div className="space-y-2 pt-1">
                        {featured.startDate && (
                          <div className="flex items-center gap-2 text-xs text-white">
                            <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                            <span className="font-bold text-white">{new Date(featured.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                        {featuredLoc && (
                          <div className="flex items-center gap-2 text-xs text-zinc-300">
                            <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                            <span className="text-zinc-200">{featuredLoc}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-2">
                      <span
                        className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-black text-center shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_35px_rgba(239,68,68,0.8)] flex items-center justify-center gap-2 transition-all group/btn border border-red-400/40"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>View Event Details</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* Stacked Side Event Cards — remaining events */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-4">
              {events.slice(1, 4).map((evt) => {
                const evtSlug = evt.slug || evt._id || evt.id;
                const evtCat = typeof evt.category === 'object' ? evt.category?.name : evt.category || 'Event';
                const evtDate = evt.startDate ? new Date(evt.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : '';
                const formatEventLocation = (e) => {
                  if (!e) return '';
                  if (typeof e.location === 'string' && e.location.trim()) return e.location;
                  if (e.location && typeof e.location === 'object' && e.location.name) return e.location.name;
                  const parts = [e.venue, e.address, e.city].filter(Boolean);
                  if (parts.length > 0) return parts.join(', ');
                  if (e.location && typeof e.location === 'object' && Array.isArray(e.location.coordinates) && e.location.coordinates.length === 2) {
                    return `Lat: ${e.location.coordinates[1]}, Lng: ${e.location.coordinates[0]}`;
                  }
                  return '';
                };
                const evtLoc = formatEventLocation(evt);
                return (
                  <Link
                    key={evt._id || evt.id}
                    to={`/events/${evtSlug}`}
                    className="p-4 rounded-2xl border border-white/[0.08] hover:border-red-500/70 bg-[#090b10] hover:bg-[#12080c] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] flex items-center gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-black shrink-0 relative ring-1 ring-white/10 group-hover:ring-red-500/40 transition-all">
                      <img
                        src={evt.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80'}
                        alt={evt.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {evtDate && (
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-black bg-white text-red-600 shadow-md">
                          {evtDate}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                          {evtCat}
                        </span>
                        {evt.ticketPrice && (
                          <span className="text-[10px] font-mono font-bold text-white bg-white/[0.08] px-2 py-0.5 rounded">{evt.ticketPrice}</span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-white group-hover:text-red-400 transition-colors truncate font-display">
                        {evt.title}
                      </h4>
                      {evtLoc && (
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                          <span className="truncate">{evtLoc}</span>
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {activeVideoModal && (
        <Modal
          isOpen={true}
          onClose={() => setActiveVideoModal(null)}
          title={activeVideoModal.title}
          size="lg"
        >
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10">
            <video
              src={activeVideoModal.url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
