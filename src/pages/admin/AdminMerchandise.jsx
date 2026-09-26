import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle, Upload, ShoppingBag } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/Modal';

export default function AdminMerchandise() {
  const { merchandise, categories, addMerchandise, updateMerchandise, deleteMerchandise } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tag, setTag] = useState('figure, limited-edition');
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [releaseDate, setReleaseDate] = useState('');

  const [images, setImages] = useState('');
  const [imageFiles, setImageFiles] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredMerchandise = merchandise.filter((m) => {
    const nameMatch = m.name?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const mCat = typeof m.category === 'object' ? m.category?._id || m.category?.name : m.category;
    const matchesCat = selectedCategory === 'all' || mCat === selectedCategory;
    return nameMatch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setCategoryId(categories[0]?.id || categories[0]?._id || '');
    setTag('collectible, official');
    setIsUpcoming(false);
    setReleaseDate(new Date().toISOString().split('T')[0]);
    setImages('');
    setImageFiles(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    const id = item.id || item._id;
    setEditingId(id);
    setName(item.name || '');
    setSlug(item.slug || '');
    setDescription(item.description || '');
    const cId = typeof item.category === 'object' ? item.category?._id : item.category;
    setCategoryId(cId || categories[0]?.id || '');
    setTag(Array.isArray(item.tag) ? item.tag.join(', ') : '');
    setIsUpcoming(!!item.isUpcoming);
    setReleaseDate(item.releaseDate ? new Date(item.releaseDate).toISOString().split('T')[0] : '');
    setImages(Array.isArray(item.images) ? item.images.join(', ') : item.image || '');
    setImageFiles(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const targetCatId = categoryId || categories[0]?.id || categories[0]?._id;

    let payload;
    if (imageFiles && imageFiles.length > 0) {
      payload = new FormData();
      payload.append('name', name.trim());
      payload.append('slug', cleanSlug);
      payload.append('description', description.trim());
      payload.append('category', targetCatId);
      payload.append('tag', tag);
      payload.append('isUpcoming', isUpcoming);
      if (releaseDate) payload.append('releaseDate', releaseDate);

      for (let i = 0; i < imageFiles.length; i++) {
        payload.append('images', imageFiles[i]);
      }
    } else {
      const imagesArr = images.split(',').map((img) => img.trim()).filter(Boolean);
      payload = {
        name: name.trim(),
        slug: cleanSlug,
        description: description.trim(),
        category: targetCatId,
        tag: tag.split(',').map((t) => t.trim()).filter(Boolean),
        isUpcoming,
        releaseDate: releaseDate || undefined,
        images: imagesArr
      };
    }

    setIsSubmitting(true);
    let res;
    if (editingId) {
      res = await updateMerchandise(editingId, payload);
    } else {
      res = await addMerchandise(payload);
    }
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
    } else {
      setErrorMsg(res.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this merchandise showcase entry?')) return;
    setErrorMsg('');
    const res = await deleteMerchandise(id);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to delete merchandise item');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-display">
            Manage Fandom Merchandise Showcase
          </h1>
          <p className="text-xs text-zinc-400">
            Showcase official figures, collectibles, props, and upcoming merchandise drops.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-950"
        >
          <Plus className="w-4 h-4" />
          <span>Add Merchandise</span>
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
            placeholder="Search merchandise by name..."
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
              <th className="py-3.5 px-4">Product Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Tags</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {filteredMerchandise.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-zinc-500 font-medium">
                  No Merchandise Found
                </td>
              </tr>
            ) : (
              filteredMerchandise.map((item) => {
                const id = item.id || item._id;
                const catName = typeof item.category === 'object' ? item.category?.name : item.category;
                const mainImg = Array.isArray(item.images) ? item.images[0] : item.image;
                return (
                  <tr key={id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      {mainImg && (
                        <img
                          src={mainImg}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover bg-zinc-900 shrink-0"
                        />
                      )}
                      <div>
                        <span className="font-bold text-white block">{item.name}</span>
                        <span className="text-[11px] text-zinc-500">{item.slug}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-rose-400">{catName || 'Fandom'}</td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                      {Array.isArray(item.tag) ? item.tag.join(', ') : item.tag || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          item.isUpcoming
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        }`}
                      >
                        {item.isUpcoming ? 'Upcoming Release' : 'Available'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
                          title="Edit merchandise"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900"
                          title="Delete merchandise"
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
        title={editingId ? 'Edit Merchandise Entry' : 'Create Merchandise Entry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Merchandise Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
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
                Release Date
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Product Images (Upload Files or URLs) */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Product Image(s) (Upload File(s) or Comma-separated URLs)
            </label>
            <label className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-zinc-300 cursor-pointer">
              <Upload className="w-4 h-4 text-rose-400" />
              <span className="truncate">
                {imageFiles ? `${imageFiles.length} file(s) selected` : 'Choose local image file(s)'}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files && e.target.files.length > 0 ? e.target.files : null)}
                className="hidden"
              />
            </label>
            <input
              type="text"
              placeholder="Or paste comma-separated image URLs"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isUpcoming"
              checked={isUpcoming}
              onChange={(e) => setIsUpcoming(e.target.checked)}
              className="accent-rose-600 rounded"
            />
            <label htmlFor="isUpcoming" className="text-xs text-zinc-200 cursor-pointer">
              Mark as Upcoming Release / Pre-order drop
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
              <span>{editingId ? 'Save Changes' : 'Create Merchandise'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}