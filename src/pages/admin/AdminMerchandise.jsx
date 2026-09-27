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
  const [pendingDelete, setPendingDelete] = useState(null);

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
    if (editingId) res = await updateMerchandise(editingId, payload);
    else res = await addMerchandise(payload);
    setIsSubmitting(false);
    if (res.success) setIsModalOpen(false);
    else setErrorMsg(res.error || 'Operation failed');
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setErrorMsg('');
    const res = await deleteMerchandise(pendingDelete);
    setPendingDelete(null);
    if (!res.success) setErrorMsg(res.error || 'Failed to delete merchandise item');
  };

  return (
    <div className="space-y-6 max-w-[1180px]">
      <AdminPageHeader
        kicker="Catalog"
        title="Merchandise"
        description="Showcase figures, collectibles, props, and upcoming drops."
        actions={
          <button type="button" onClick={handleOpenAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold admin-btn-primary">
            <Plus className="w-4 h-4" />
            Add merchandise
          </button>
        }
      />
      <AdminAlert>{errorMsg}</AdminAlert>
      <AdminToolbar>
        <AdminSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search merchandise by name…" />
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
              <th>Product</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMerchandise.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-stone-500">
                  No merchandise found
                </td>
              </tr>
            ) : (
              filteredMerchandise.map((item) => {
                const id = item.id || item._id;
                const catName = typeof item.category === 'object' ? item.category?.name : item.category;
                const mainImg = Array.isArray(item.images) ? item.images[0] : item.image;
                return (
                  <tr key={id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {mainImg && (
                          <img src={mainImg} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover bg-black/40 shrink-0" />
                        )}
                        <div>
                          <span className="font-medium text-white block">{item.name}</span>
                          <span className="text-[11px] text-stone-500">{item.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-stone-300">{catName || 'Fandom'}</td>
                    <td className="text-stone-400 font-mono text-[11px]">
                      {Array.isArray(item.tag) ? item.tag.join(', ') : item.tag || '—'}
                    </td>
                    <td>
                      <AdminStatus value={item.isUpcoming ? 'upcoming' : 'available'} />
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit merchandise' : 'Create merchandise'} maxWidth="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminField label="Name *">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
              className="w-full px-3 py-2 text-sm"
            />
          </AdminField>
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
            <AdminField label="Release date">
              <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className="w-full px-3 py-2 text-xs" />
            </AdminField>
          </div>
          <AdminField label="Description *">
            <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 text-sm" />
          </AdminField>
          <AdminField label="Product images">
            <AdminFilePick
              fileLabel={imageFiles ? `${imageFiles.length} file(s) selected` : 'Choose local image file(s)'}
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(e.target.files && e.target.files.length > 0 ? e.target.files : null)}
            />
            <input type="text" placeholder="Or paste comma-separated image URLs" value={images} onChange={(e) => setImages(e.target.value)} className="w-full px-3 py-2 mt-2 text-xs font-mono" />
          </AdminField>
          <AdminField label="Tags (comma-separated)">
            <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} className="w-full px-3 py-2 text-xs" />
          </AdminField>
          <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
            <input type="checkbox" checked={isUpcoming} onChange={(e) => setIsUpcoming(e.target.checked)} />
            Mark as upcoming release
          </label>
          <AdminFormActions onCancel={() => setIsModalOpen(false)} submitting={isSubmitting} submitLabel={editingId ? 'Save changes' : 'Create merchandise'} />
        </form>
      </Modal>
      <AdminConfirm
        open={!!pendingDelete}
        title="Delete merchandise"
        message="This will permanently remove this showcase entry."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
