import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/Modal';

export default function AdminContent() {
  const { contentList, categories, addContent, updateContent, deleteContent, toggleFeatureContent } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [contentType, setContentType] = useState('video');
  const [genres, setGenres] = useState('Action, Sci-Fi');
  const [tags, setTags] = useState('cyberpunk, anime');
  const [popularityScore, setPopularityScore] = useState(80);
  const [isFeatured, setIsFeatured] = useState(false);
  const [releaseDate, setReleaseDate] = useState('');

  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredContent = contentList.filter((c) => {
    const titleMatch = c.title?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const catName = typeof c.category === 'object' ? c.category?.name : c.category;
    const catMatch = catName?.toLowerCase().includes(searchTerm.toLowerCase().trim());

    const matchesSearch = titleMatch || catMatch;

    const catIdOrSlug = typeof c.category === 'object' ? c.category?._id || c.category?.slug : c.category;
    const matchesCat = selectedCategory === 'all' || catIdOrSlug === selectedCategory || catName === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setCategoryId(categories[0]?.id || categories[0]?._id || '');
    setContentType('video');
    setGenres('Action, Fantasy');
    setTags('lore, premiere');
    setPopularityScore(80);
    setIsFeatured(false);
    setReleaseDate(new Date().toISOString().split('T')[0]);
    setThumbnailUrl('');
    setMediaUrl('');
    setThumbnailFile(null);
    setMediaFile(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    const id = item.id || item._id;
    setEditingId(id);
    setTitle(item.title || '');
    setSlug(item.slug || '');
    setDescription(item.description || '');
    const cId = typeof item.category === 'object' ? item.category?._id : item.category;
    setCategoryId(cId || categories[0]?.id || '');
    setContentType(item.contentType || 'video');
    setGenres(Array.isArray(item.genre) ? item.genre.join(', ') : item.genres?.join(', ') || '');
    setTags(Array.isArray(item.tags) ? item.tags.join(', ') : '');
    setPopularityScore(item.popularityScore ?? item.popularity ?? 80);
    setIsFeatured(!!(item.isFeatured || item.featured));
    setReleaseDate(item.releaseDate ? new Date(item.releaseDate).toISOString().split('T')[0] : '');
    setThumbnailUrl(item.thumbnail || '');
    setMediaUrl(item.mediaUrl || '');
    setThumbnailFile(null);
    setMediaFile(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const targetCatId = categoryId || categories[0]?.id || categories[0]?._id;

    let payload;
    if (thumbnailFile || mediaFile) {
      payload = new FormData();
      payload.append('title', title.trim());
      payload.append('slug', cleanSlug);
      payload.append('description', description.trim());
      payload.append('category', targetCatId);
      payload.append('contentType', contentType);
      payload.append('genre', genres);
      payload.append('tags', tags);
      payload.append('popularityScore', popularityScore);
      payload.append('isFeatured', isFeatured);
      if (releaseDate) payload.append('releaseDate', releaseDate);

      if (thumbnailFile) payload.append('thumbnail', thumbnailFile);
      else if (thumbnailUrl) payload.append('thumbnail', thumbnailUrl);

      if (mediaFile) payload.append('media', mediaFile);
      else if (mediaUrl) payload.append('mediaUrl', mediaUrl);
    } else {
      payload = {
        title: title.trim(),
        slug: cleanSlug,
        description: description.trim(),
        category: targetCatId,
        contentType,
        genre: genres.split(',').map((g) => g.trim()).filter(Boolean),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        popularityScore: Number(popularityScore),
        isFeatured,
        releaseDate: releaseDate || undefined,
        thumbnail: thumbnailUrl,
        mediaUrl: mediaUrl
      };
    }

    setIsSubmitting(true);
    let res;
    if (editingId) {
      res = await updateContent(editingId, payload);
    } else {
      res = await addContent(payload);
    }
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
    } else {
      setErrorMsg(res.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return;
    setErrorMsg('');
    const res = await deleteContent(id);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to delete media item');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-display">
            Manage Catalog Content
          </h1>
          <p className="text-xs text-zinc-400">
            Publish, edit metadata, update popularity metrics, or toggle featured showcases.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-950"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Item</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-zinc-950/80 border border-zinc-850 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => {
            const cId = c.id || c._id;
            return (
              <option key={cId} value={cId}>
                {c.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-850 bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/60 border-b border-zinc-850 text-zinc-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Popularity</th>
              <th className="py-3.5 px-4">Featured</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {filteredContent.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-zinc-500 font-medium">
                  No Media Found
                </td>
              </tr>
            ) : (
              filteredContent.map((item) => {
                const id = item.id || item._id;
                const catName = typeof item.category === 'object' ? item.category?.name : item.category;
                return (
                  <tr key={id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      {item.thumbnail && (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-8 rounded-lg object-cover bg-zinc-900 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate max-w-xs">{item.title}</span>
                        <span className="text-[11px] text-zinc-500 truncate block">{item.slug}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-rose-400">{catName}</td>
                    <td className="py-3.5 px-4 uppercase font-mono text-[11px] text-zinc-400">{item.contentType}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      {item.popularityScore ?? item.popularity ?? 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => toggleFeatureContent(id)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-colors ${
                          item.isFeatured || item.featured
                            ? 'bg-rose-600 text-white'
                            : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                        }`}
                      >
                        {item.isFeatured || item.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
                          title="Edit content"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900"
                          title="Delete content"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Content Item' : 'Add Content Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editingId) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              >
                {categories.map((c) => {
                  const cId = c.id || c._id;
                  return (
                    <option key={cId} value={cId}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Content Type *
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              >
                <option value="video">Video</option>
                <option value="trailer">Trailer</option>
                <option value="article">Article</option>
                <option value="audio">Audio</option>
                <option value="image">Image Gallery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Description *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Thumbnail upload/URL */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Thumbnail (Upload File or URL)
            </label>
            <label className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-zinc-300 cursor-pointer">
              <Upload className="w-4 h-4 text-rose-400" />
              <span className="truncate">{thumbnailFile ? thumbnailFile.name : 'Choose local thumbnail file'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0] || null)}
                className="hidden"
              />
            </label>
            <input
              type="text"
              placeholder="Or paste external thumbnail URL"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Media upload/URL */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Media File (Upload File or URL)
            </label>
            <label className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-zinc-300 cursor-pointer">
              <Upload className="w-4 h-4 text-rose-400" />
              <span className="truncate">{mediaFile ? mediaFile.name : 'Choose local media file'}</span>
              <input
                type="file"
                accept="video/*,audio/*,image/*"
                onChange={(e) => setMediaFile(e.target.files[0] || null)}
                className="hidden"
              />
            </label>
            <input
              type="text"
              placeholder="Or paste external media URL"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Genres (comma-separated)
              </label>
              <input
                type="text"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Popularity Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={popularityScore}
                onChange={(e) => setPopularityScore(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-rose-600 rounded"
            />
            <label htmlFor="featured" className="text-xs text-zinc-200 cursor-pointer">
              Pin as Featured Showcase item on Homepage
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingId ? 'Save Changes' : 'Publish Entry'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
