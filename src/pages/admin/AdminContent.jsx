import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/Modal';
import {
  AdminPageHeader,
  AdminAlert,
  AdminToolbar,
  AdminSearch,
  AdminTableWrap,
  AdminEditBtn,
  AdminDeleteBtn,
  AdminField,
  AdminFilePick,
  AdminFormActions,
  AdminConfirm,
  AdminStatus
} from '../../components/admin/AdminUi';

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
  const [pendingDelete, setPendingDelete] = useState(null);

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

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setErrorMsg('');
    const res = await deleteContent(pendingDelete);
    setPendingDelete(null);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to delete media item');
    }
  };

  return (
    <div className="space-y-6 max-w-[1180px]">
      <AdminPageHeader
        kicker="Catalog"
        title="Content"
        description="Publish, edit metadata, update popularity, or toggle featured showcases."
        actions={
          <button type="button" onClick={handleOpenAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold admin-btn-primary">
            <Plus className="w-4 h-4" />
            Add media
          </button>
        }
      />

      <AdminAlert>{errorMsg}</AdminAlert>

      <AdminToolbar>
        <AdminSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search by title or category…" />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2.5 text-xs sm:w-48">
          <option value="all">All categories</option>
          {categories.map((c) => {
            const cId = c.id || c._id;
            return (
              <option key={cId} value={cId}>
                {c.name}
              </option>
            );
          })}
        </select>
      </AdminToolbar>

      <AdminTableWrap>
        <table className="text-left">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Popularity</th>
              <th>Featured</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContent.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-stone-500">
                  No content found
                </td>
              </tr>
            ) : (
              filteredContent.map((item) => {
                const id = item.id || item._id;
                const catName = typeof item.category === 'object' ? item.category?.name : item.category;
                return (
                  <tr key={id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {item.thumbnail && (
                          <img src={item.thumbnail} alt="" referrerPolicy="no-referrer" className="w-12 h-8 rounded-lg object-cover bg-black/40 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="font-medium text-white block truncate max-w-xs">{item.title}</span>
                          <span className="text-[11px] text-stone-500 truncate block">{item.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-stone-300">{catName}</td>
                    <td className="uppercase font-mono text-[11px] text-stone-400">{item.contentType}</td>
                    <td className="tabular-nums text-white">{item.popularityScore ?? item.popularity ?? 0}</td>
                    <td>
                      <button type="button" onClick={() => toggleFeatureContent(id)}>
                        <AdminStatus value={item.isFeatured || item.featured ? 'featured' : 'standard'} />
                      </button>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <AdminEditBtn onClick={() => handleOpenEdit(item)} />
                        <AdminDeleteBtn onClick={() => setPendingDelete(id)} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </AdminTableWrap>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit content' : 'Add content'} maxWidth="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminField label="Title *">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
              className="w-full px-3 py-2 text-sm"
            />
          </AdminField>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="URL slug *">
              <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 text-xs font-mono" />
            </AdminField>
            <AdminField label="Release date">
              <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className="w-full px-3 py-2 text-xs" />
            </AdminField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Category *">
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 text-xs">
                {categories.map((c) => {
                  const cId = c.id || c._id;
                  return (
                    <option key={cId} value={cId}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
            </AdminField>
            <AdminField label="Content type *">
              <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full px-3 py-2 text-xs">
                <option value="video">Video</option>
                <option value="trailer">Trailer</option>
                <option value="article">Article</option>
                <option value="audio">Audio</option>
                <option value="image">Image Gallery</option>
              </select>
            </AdminField>
          </div>
          <AdminField label="Description *">
            <textarea rows={2} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 text-sm" />
          </AdminField>
          <AdminField label="Thumbnail">
            <AdminFilePick
              fileLabel={thumbnailFile ? thumbnailFile.name : 'Choose local thumbnail'}
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0] || null)}
            />
            <input type="text" placeholder="Or paste thumbnail URL" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full px-3 py-2 mt-2 text-xs font-mono" />
          </AdminField>
          <AdminField label="Media file">
            <AdminFilePick
              fileLabel={mediaFile ? mediaFile.name : 'Choose local media file'}
              accept="video/*,audio/*,image/*"
              onChange={(e) => setMediaFile(e.target.files[0] || null)}
            />
            <input type="text" placeholder="Or paste media URL" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="w-full px-3 py-2 mt-2 text-xs font-mono" />
          </AdminField>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Genres (comma-separated)">
              <input type="text" value={genres} onChange={(e) => setGenres(e.target.value)} className="w-full px-3 py-2 text-xs" />
            </AdminField>
            <AdminField label="Popularity (0–100)">
              <input type="number" min="0" max="100" value={popularityScore} onChange={(e) => setPopularityScore(e.target.value)} className="w-full px-3 py-2 text-xs" />
            </AdminField>
          </div>
          <AdminField label="Tags (comma-separated)">
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 text-xs" />
          </AdminField>
          <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Pin as featured on homepage
          </label>
          <AdminFormActions onCancel={() => setIsModalOpen(false)} submitting={isSubmitting} submitLabel={editingId ? 'Save changes' : 'Publish'} />
        </form>
      </Modal>

      <AdminConfirm
        open={!!pendingDelete}
        title="Delete content"
        message="This will permanently remove this media item."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
