import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/Modal';

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

    if (res.success) {
      setIsModalOpen(false);
    } else {
      setErrorMsg(res.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this character?')) return;
    setErrorMsg('');
    const res = await deleteCharacter(id);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to delete character');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-display">
            Manage Fandom Characters
          </h1>
          <p className="text-xs text-zinc-400">
            Codex entries, role details, origin lore, and character portrait management.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-950"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Character</span>
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
            placeholder="Search characters by name..."
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
              <th className="py-3.5 px-4">Character</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Bio Overview</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {filteredCharacters.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-zinc-500 font-medium">
                  No Characters Found
                </td>
              </tr>
            ) : (
              filteredCharacters.map((item) => {
                const id = item.id || item._id;
                const catName = typeof item.category === 'object' ? item.category?.name : item.category;
                return (
                  <tr key={id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover bg-zinc-900 shrink-0"
                        />
                      )}
                      <span className="font-bold text-white block">{item.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">{item.slug}</td>
                    <td className="py-3.5 px-4 font-semibold text-rose-400">{catName || 'Fandom'}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-zinc-400">{item.bio}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
                          title="Edit character"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900"
                          title="Delete character"
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
        title={editingId ? 'Edit Character Entry' : 'Create Character Entry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Character Name *
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

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Fandom Category *
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
              Character Bio / Lore *
            </label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Portrait Image upload/URL */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Character Portrait (Upload File or URL)
            </label>
            <label className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-zinc-300 cursor-pointer">
              <Upload className="w-4 h-4 text-rose-400" />
              <span className="truncate">{imageFile ? imageFile.name : 'Choose local image file'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0] || null)}
                className="hidden"
              />
            </label>
            <input
              type="text"
              placeholder="Or paste external image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
            />
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
              <span>{editingId ? 'Save Changes' : 'Create Character'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
