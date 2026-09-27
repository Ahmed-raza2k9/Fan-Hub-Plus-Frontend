import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/Modal';
import LocationAutocomplete from '../../components/admin/LocationAutocomplete';
import {
  AdminPageHeader,
  AdminAlert,
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

export default function AdminEvents() {
  const { events, categories, addEvent, updateEvent, deleteEvent } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [city, setCity] = useState('');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [ticketUrl, setTicketUrl] = useState('https://tickets.fanhub.io');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

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
    setCity('');
    setVenue('');
    setAddress('');
    setLatitude(null);
    setLongitude(null);
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
    setLatitude(evt.latitude || null);
    setLongitude(evt.longitude || null);
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
    
    if (latitude === null || longitude === null) {
      setErrorMsg('Please select a valid location from the suggestions.');
      return;
    }

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
      if (latitude !== null) payload.append('latitude', latitude);
      if (longitude !== null) payload.append('longitude', longitude);
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
        latitude,
        longitude,
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
    if (editingId) res = await updateEvent(editingId, payload);
    else res = await addEvent(payload);
    setIsSubmitting(false);
    if (res.success) setIsModalOpen(false);
    else setErrorMsg(res.error || 'Operation failed');
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setErrorMsg('');
    const res = await deleteEvent(pendingDelete);
    setPendingDelete(null);
    if (!res.success) setErrorMsg(res.error || 'Failed to delete event');
  };

  return (
    <div className="space-y-6 max-w-[1180px]">
      <AdminPageHeader
        kicker="Catalog"
        title="Events"
        description="Publish dates, venues, featured flags, and ticket links."
        actions={
          <button type="button" onClick={handleOpenAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold admin-btn-primary">
            <Plus className="w-4 h-4" />
            Add event
          </button>
        }
      />
      <AdminAlert>{errorMsg}</AdminAlert>
      <div className="admin-card p-3 sm:p-4 max-w-md">
        <AdminSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search by event, city, or category…" />
      </div>
      <AdminTableWrap>
        <table className="text-left">
          <thead>
            <tr>
              <th>Event</th>
              <th>Category</th>
              <th>City / Venue</th>
              <th>Dates</th>
              <th>Featured</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-stone-500">
                  No events found
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => {
                const id = evt.id || evt._id;
                const catName = typeof evt.category === 'object' ? evt.category?.name : evt.category;
                return (
                  <tr key={id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {evt.image && (
                          <img src={evt.image} alt="" referrerPolicy="no-referrer" className="w-12 h-8 rounded-lg object-cover bg-black/40 shrink-0" />
                        )}
                        <div>
                          <span className="font-medium text-white block">{evt.title}</span>
                          <span className="text-[11px] text-stone-500">{evt.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-stone-300">{catName || 'Fandom'}</td>
                    <td>
                      <span className="font-medium text-white block">{evt.city}</span>
                      <span className="text-[11px] text-stone-500">{evt.venue}</span>
                    </td>
                    <td className="tabular-nums text-stone-400 text-xs">
                      {evt.startDate ? new Date(evt.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      {evt.endDate ? ` – ${new Date(evt.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                    </td>
                    <td>
                      <AdminStatus value={evt.isFeatured || evt.featured ? 'featured' : 'standard'} />
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <AdminEditBtn onClick={() => handleOpenEdit(evt)} />
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit event' : 'Add event'} maxWidth="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminField label="Event title *">
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
          <AdminField label="URL slug *">
            <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 text-xs font-mono" />
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
            <AdminField label="City *">
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 text-xs" />
            </AdminField>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <AdminField label="Search Location / Venue *">
              <LocationAutocomplete 
                initialValue={address || venue} 
                required 
                onSelect={(loc) => {
                  setVenue(loc.venue);
                  setAddress(loc.address);
                  if (loc.city) setCity(loc.city);
                  setLatitude(loc.latitude);
                  setLongitude(loc.longitude);
                }} 
              />
              {!latitude && <p className="text-[10px] text-yellow-500 mt-1">Select a location from suggestions to obtain coordinates.</p>}
              {latitude && <p className="text-[10px] text-green-500 mt-1">Coordinates locked: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>}
            </AdminField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Start date *">
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 text-xs" />
            </AdminField>
            <AdminField label="End date *">
              <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 text-xs" />
            </AdminField>
          </div>
          <AdminField label="Description *">
            <textarea rows={2} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 text-sm" />
          </AdminField>
          <AdminField label="Banner image">
            <AdminFilePick fileLabel={imageFile ? imageFile.name : 'Choose local image'} accept="image/*" onChange={(e) => setImageFile(e.target.files[0] || null)} />
            <input type="text" placeholder="Or paste image URL" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-3 py-2 mt-2 text-xs font-mono" />
          </AdminField>
          <AdminField label="Ticket URL">
            <input type="text" value={ticketUrl} onChange={(e) => setTicketUrl(e.target.value)} className="w-full px-3 py-2 text-xs font-mono" />
          </AdminField>
          <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Mark as featured
          </label>
          <AdminFormActions onCancel={() => setIsModalOpen(false)} submitting={isSubmitting} submitLabel={editingId ? 'Save changes' : 'Create event'} />
        </form>
      </Modal>
      <AdminConfirm
        open={!!pendingDelete}
        title="Delete event"
        message="This will permanently remove this event listing."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
