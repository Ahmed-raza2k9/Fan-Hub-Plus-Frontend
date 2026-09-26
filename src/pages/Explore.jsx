import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Layers, Flame } from 'lucide-react';
import { useData } from '../context/DataContext';
import ContentCard from '../components/ContentCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { contentList, categories } = useData();

  const queryParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const typeParam = searchParams.get('type') || 'all';
  const genreParam = searchParams.get('genre') || 'all';
  const sortParam = searchParams.get('sort') || 'popularity';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedType, setSelectedType] = useState(typeParam);
  const [selectedGenre, setSelectedGenre] = useState(genreParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setSearchTerm(queryParam);
    setSelectedCategory(categoryParam);
    setSelectedType(typeParam);
    setSelectedGenre(genreParam);
    setSortBy(sortParam);
  }, [queryParam, categoryParam, typeParam, genreParam, sortParam]);

  const allGenres = useMemo(() => {
    const set = new Set();
    contentList.forEach(c => c.genres?.forEach(g => set.add(g)));
    return Array.from(set);
  }, [contentList]);

  const filteredItems = useMemo(() => {
    let result = [...contentList];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags?.some(t => t.toLowerCase().includes(q)) ||
          c.genres?.some(g => g.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(
        c =>
          c.categorySlug === selectedCategory ||
          (typeof c.category === 'object'
            ? c.category?.slug === selectedCategory || c.category?.name === selectedCategory || c.category?._id === selectedCategory
            : c.category === selectedCategory)
      );
    }

    if (selectedType !== 'all') {
      result = result.filter(c => c.contentType === selectedType);
    }

    if (selectedGenre !== 'all') {
      result = result.filter(c => c.genres?.includes(selectedGenre));
    }

    result.sort((a, b) => {
      if (sortBy === 'popularity') {
        return (b.popularity || 0) - (a.popularity || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [contentList, searchTerm, selectedCategory, selectedType, selectedGenre, sortBy]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedGenre('all');
    setSortBy('popularity');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    selectedGenre !== 'all' ||
    sortBy !== 'popularity';

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Fandom Explorer</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight font-display">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">Content & Media</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          Discover videos, episodes, convention trailers, wallpapers, and soundtrack releases across all 8 fandom categories.
        </p>
      </div>

      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#0c101d] border border-rose-100/80 dark:border-white/[0.08] space-y-4 shadow-[0_8px_30px_rgba(225,29,72,0.06)] dark:shadow-2xl">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-3.5 sm:left-4 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, character, tag, or lore topic..."
            className="w-full pl-10 sm:pl-11 pr-24 sm:pr-28 py-2.5 sm:py-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:bg-white dark:focus:bg-black/80 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 sm:right-2 px-3.5 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 transition-all"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-red-500 focus:bg-white dark:focus:bg-black/80 transition-colors"
            >
              <option value="all" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Content Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-red-500 focus:bg-white dark:focus:bg-black/80 transition-colors"
            >
              <option value="all" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">All Media Formats</option>
              <option value="video" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Video</option>
              <option value="trailer" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Trailer</option>
              <option value="article" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Article</option>
              <option value="audio" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Audio</option>
              <option value="image" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Image Gallery</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-red-500 focus:bg-white dark:focus:bg-black/80 transition-colors"
            >
              <option value="all" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">All Genres</option>
              {allGenres.map((g) => (
                <option key={g} value={g} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-red-500 focus:bg-white dark:focus:bg-black/80 transition-colors"
            >
              <option value="popularity" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Popularity (High to Low)</option>
              <option value="newest" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Newest Released</option>
              <option value="oldest" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Oldest Released</option>
              <option value="title" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 dark:border-white/[0.08]">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              Showing <strong className="text-zinc-900 dark:text-white font-mono">{filteredItems.length}</strong> matching results
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {filteredItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginatedItems.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      ) : (
        <EmptyState
          title="No fandom content found"
          description="We couldn't find any entries matching your active filters. Try clearing your search term or switching categories."
          actionText="Reset Filters"
          actionLink="#"
          onClick={handleResetFilters}
        />
      )}
    </div>
  );
}
