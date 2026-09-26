import React, { useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Search, Loader2, AlertCircle, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/Modal';

export default function AdminEvents() {
  const { events, categories, addEvent, updateEvent, deleteEvent } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [city, setCity] = useState('Tokyo');
  const [venue, setVenue] = useState('Tokyo Big Sight');
  const [address, setAddress] = useState('3 Chome-11-1 Ariake, Koto City, Tokyo');
  const [startDate, setStartDate] = useState('2026-08-14');
  const [endDate, setEndDate] = useState('2026-08-16');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [ticketUrl, setTicketUrl] = useState('https://tickets.fanhub.io');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredEvents = events.filter((e) => {
    const titleMatch = e.title?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const cityMatch = e.city?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const catName = typeof e.category === 'object' ? e.category?.name : e.category;
    const catMatch = catName?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return titleMatch || cityMatch || catMatch;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setCategoryId(categories[0]?.id || categories[0]?._id || '');
    setCity('Tokyo');
    setVenue('Tokyo Big Sight');
    setAddress('3 Chome-11-1 Ariake, Koto City, Tokyo');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setImage('');
    setImageFile(null);
    setIsFeatured(false);
    setTicketUrl('https://tickets.fanhub.io');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    const id = evt.id || evt._id;
    setEditingId(id);
    setTitle(evt.title || '');
    setSlug(evt.slug || '');
    const cId = typeof evt.category === 'object' ? evt.category?._id : evt.category;
    setCategoryId(cId || categories[0]?.id || '');
    setCity(evt.city || '');
    setVenue(evt.venue || '');
    setAddress(evt.address || '');
    setStartDate(evt.startDate ? new Date(evt.startDate).toISOString().split('T')[0] : '');
    setEndDate(evt.endDate ? new Date(evt.endDate).toISOString().split('T')[0] : '');
    setDescription(evt.description || '');
    setImage(evt.image || '');
    setImageFile(null);
    setIsFeatured(!!(evt.isFeatured || evt.featured));
    setTicketUrl(evt.ticketUrl || 'https://tickets.fanhub.io');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const targetCatId = categoryId || categories[0]?.id || categories[0]?._id;

    let payload;
    if (imageFile) {
      payload = new FormData();
      payload.append('title', title.trim());
      payload.append('slug', cleanSlug);
      payload.append('category', targetCatId);
      payload.append('city', city.trim());
      payload.append('venue', venue.trim());
      payload.append('address', address.trim());
      payload.append('startDate', startDate);
      payload.append('endDate', endDate);
      payload.append('description', description.trim());
      payload.append('isFeatured', isFeatured);
      payload.append('ticketUrl', ticketUrl);
      payload.append('image', imageFile);
    } else {
      payload = {
        title: title.trim(),
        slug: cleanSlug,
        category: targetCatId,
        city: city.trim(),
        venue: venue.trim(),
        address: address.trim(),
        startDate,
        endDate,
        description: description.trim(),
        image: image || '',
        isFeatured,
        ticketUrl
      };
    }

    setIsSubmitting(true);
    let res;
    if (editingId) {
      res = await updateEvent(editingId, payload);
    } else {
      res = await addEvent(payload);
    }
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
    } else {
      setErrorMsg(res.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setErrorMsg('');
    const res = await deleteEvent(id);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to delete event');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-display">
            Manage Fandom Conventions & Events
          </h1>
          <p className="text-xs text-zinc-400">
            Publish event dates, venue addresses, featured flags, and ticket reservation links.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-950"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by event, city, or category..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-850 bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/60 border-b border-zinc-850 text-zinc-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">Event</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">City / Venue</th>
              <th className="py-3.5 px-4">Dates</th>
              <th className="py-3.5 px-4">Featured</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-zinc-500 font-medium">
                  No Events Found
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => {
                const id = evt.id || evt._id;
                const catName = typeof evt.category === 'object' ? evt.category?.name : evt.category;
                return (
                  <tr key={id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      {evt.image && (
                        <img
                          src={evt.image}
                          alt={evt.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-8 rounded-lg object-cover bg-zinc-900 shrink-0"
                        />
                      )}
                      <div>
                        <span className="font-bold text-white block">{evt.title}</span>
                        <span className="text-[11px] text-zinc-500">{evt.slug}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-rose-400">{catName || 'Fandom'}</td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      <span className="font-semibold text-white block">{evt.city}</span>
                      <span className="text-[11px] text-zinc-500">{evt.venue}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                      {evt.startDate ? new Date(evt.startDate).toLocaleDateString() : ''} to{' '}
                      {evt.endDate ? new Date(evt.endDate).toLocaleDateString() : ''}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          evt.isFeatured || evt.featured
                            ? 'bg-rose-600 text-white'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                        }`}
                      >
                        {evt.isFeatured || evt.featured ? 'Featured' : 'Regular'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(evt)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
                          title="Edit event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900"
                          title="Delete event"
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
        title={editingId ? 'Edit Event' : 'Add Event'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Event Title *
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
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Full Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              />
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

          {/* Banner image upload or URL */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Banner Image (Upload File or URL)
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

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featuredEvent"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-rose-600 rounded"
            />
            <label htmlFor="featuredEvent" className="text-xs text-zinc-200 cursor-pointer">
              Mark as Featured Tier-1 Convention
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
              <span>{editingId ? 'Save Changes' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
