import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/Modal';
import {
  AdminPageHeader,
  AdminAlert,
  AdminTableWrap,
  AdminEditBtn,
  AdminDeleteBtn,
  AdminField,
  AdminFilePick,
  AdminFormActions,
  AdminConfirm
} from '../../components/admin/AdminUi';

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setImageFile(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    const id = cat.id || cat._id;
    setEditingId(id);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setImageFile(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    let payload;
    if (imageFile) {
      payload = new FormData();
      payload.append('name', name.trim());
      payload.append('slug', cleanSlug);
      payload.append('description', description.trim());
      payload.append('image', imageFile);
    } else {
      payload = {
        name: name.trim(),
        slug: cleanSlug,
        description: description.trim(),
        image: image || ''
      };
    }

    setIsSubmitting(true);
    let res;
    if (editingId) {
      res = await updateCategory(editingId, payload);
    } else {
      res = await addCategory(payload);
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
    const res = await deleteCategory(pendingDelete);
    setPendingDelete(null);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 max-w-[1180px]">
      <AdminPageHeader
        kicker="Catalog"
        title="Categories"
        description="Create and edit fandom categories, descriptions, artwork, and slug paths."
        actions={
          <button type="button" onClick={handleOpenAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold admin-btn-primary">
            <Plus className="w-4 h-4" />
            Add category
          </button>
        }
      />

      <AdminAlert>{errorMsg}</AdminAlert>

      <AdminTableWrap>
        <table className="text-left">
          <thead>
            <tr>
              <th>Category</th>
              <th>Slug</th>
              <th>Description</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-stone-500">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((c) => {
                const id = c.id || c._id;
                return (
                  <tr key={id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {c.image && (
                          <img src={c.image} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover bg-black/40" />
                        )}
                        <span className="font-medium text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-[11px] text-stone-400">{c.slug}</td>
                    <td className="max-w-xs truncate text-stone-400">{c.description}</td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <AdminEditBtn onClick={() => handleOpenEdit(c)} />
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit category' : 'Create category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminField label="Category name *">
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
              className="w-full px-3 py-2 text-sm"
            />
          </AdminField>
          <AdminField label="URL slug *">
            <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 text-xs font-mono" />
          </AdminField>
          <AdminField label="Description *">
            <textarea rows={2} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 text-sm" />
          </AdminField>
          <AdminField label="Banner image">
            <AdminFilePick
              fileLabel={imageFile ? imageFile.name : 'Choose local image file'}
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
            />
            <input
              type="text"
              placeholder="Or paste an image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 mt-2 text-xs font-mono"
            />
          </AdminField>
          <AdminFormActions
            onCancel={() => setIsModalOpen(false)}
            submitting={isSubmitting}
            submitLabel={editingId ? 'Save changes' : 'Create category'}
          />
        </form>
      </Modal>

      <AdminConfirm
        open={!!pendingDelete}
        title="Delete category"
        message="This will permanently remove the category. This action cannot be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
