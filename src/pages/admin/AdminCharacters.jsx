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
  AdminConfirm
} from '../../components/admin/AdminUi';

export default function AdminCharacters() {
  const { characters, categories, addCharacter, updateCharacter, deleteCharacter } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [bio, setBio] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('hero, legend');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const filteredCharacters = characters.filter((c) => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const cCat = typeof c.category === 'object' ? c.category?._id || c.category?.name : c.category;
    const matchesCat = selectedCategory === 'all' || cCat === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setBio('');
    setCategoryId(categories[0]?.id || categories[0]?._id || '');
    setTags('hero, protagonist');
    setImage('');
    setImageFile(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    const id = item.id || item._id;
    setEditingId(id);
    setName(item.name || '');
    setSlug(item.slug || '');
    setBio(item.bio || '');
    const catVal = typeof item.category === 'object' ? item.category?._id : item.category;
    setCategoryId(catVal || categories[0]?.id || '');
    setTags(Array.isArray(item.tags) ? item.tags.join(', ') : '');
    setImage(item.image || '');
    setImageFile(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const targetCatId = categoryId || categories[0]?.id || categories[0]?._id;

    let payload;
    if (imageFile) {
      payload = new FormData();
      payload.append('name', name.trim());
      payload.append('slug', cleanSlug);
      payload.append('bio', bio.trim());
      payload.append('category', targetCatId);
      payload.append('tags', tags);
      payload.append('image', imageFile);
    } else {
      payload = {
        name: name.trim(),
        slug: cleanSlug,
        bio: bio.trim(),
        category: targetCatId,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        image: image || ''
      };
    }

    setIsSubmitting(true);
    let res;
    if (editingId) {
      res = await updateCharacter(editingId, payload);
    } else {
      res = await addCharacter(payload);
    }
    setIsSubmitting(false);
    if (res.success) setIsModalOpen(false);
    else setErrorMsg(res.error || 'Operation failed');
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setErrorMsg('');
    const res = await deleteCharacter(pendingDelete);
    setPendingDelete(null);
    if (!res.success) setErrorMsg(res.error || 'Failed to delete character');
  };

  return (
    <div className="space-y-6 max-w-[1180px]">
      <AdminPageHeader
        kicker="Catalog"
        title="Characters"
        description="Codex entries, lore, and character portrait management."
        actions={
          <button type="button" onClick={handleOpenAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold admin-btn-primary">
            <Plus className="w-4 h-4" />
            Add character
          </button>
        }
      />
      <AdminAlert>{errorMsg}</AdminAlert>
      <AdminToolbar>
        <AdminSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search characters by name…" />
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
              <th>Character</th>
              <th>Slug</th>
              <th>Category</th>
              <th>Bio</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCharacters.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-stone-500">
                  No characters found
                </td>
              </tr>
            ) : (
              filteredCharacters.map((item) => {
                const id = item.id || item._id;
                const catName = typeof item.category === 'object' ? item.category?.name : item.category;
                return (
                  <tr key={id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover bg-black/40 shrink-0" />
                        )}
                        <span className="font-medium text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-[11px] text-stone-400">{item.slug}</td>
                    <td className="text-stone-300">{catName || 'Fandom'}</td>
                    <td className="max-w-xs truncate text-stone-400">{item.bio}</td>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit character' : 'Create character'} maxWidth="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminField label="Character name *">
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
          <AdminField label="URL slug *">
            <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 text-xs font-mono" />
          </AdminField>
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
          <AdminField label="Bio *">
            <textarea rows={3} required value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-2 text-sm" />
          </AdminField>
          <AdminField label="Portrait">
            <AdminFilePick fileLabel={imageFile ? imageFile.name : 'Choose local image'} accept="image/*" onChange={(e) => setImageFile(e.target.files[0] || null)} />
            <input type="text" placeholder="Or paste image URL" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-3 py-2 mt-2 text-xs font-mono" />
          </AdminField>
          <AdminField label="Tags (comma-separated)">
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 text-xs" />
          </AdminField>
          <AdminFormActions onCancel={() => setIsModalOpen(false)} submitting={isSubmitting} submitLabel={editingId ? 'Save changes' : 'Create character'} />
        </form>
      </Modal>
      <AdminConfirm
        open={!!pendingDelete}
        title="Delete character"
        message="This will permanently remove this character entry."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
