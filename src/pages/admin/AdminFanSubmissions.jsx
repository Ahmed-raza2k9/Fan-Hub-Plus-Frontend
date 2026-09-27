import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/Modal';
import {
  AdminPageHeader,
  AdminToolbar,
  AdminSearch,
  AdminTableWrap,
  AdminDeleteBtn,
  AdminStatus,
  AdminFormActions,
  AdminConfirm,
  AdminField
} from '../../components/admin/AdminUi';

export default function AdminFanSubmissions() {
  const { fanSubmissions, updateFanSubmissionStatus, deleteFanSubmission } = useData();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSub, setEditingSub] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const filteredSubmissions = fanSubmissions.filter((s) => {
    const creatorName = s.creator || s.user?.name || s.author || '';
    const catName = typeof s.category === 'object' ? s.category?.name : s.category || '';
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesSearch =
      s.title?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      creatorName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      catName.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesStatus && matchesSearch;
  });

  const handleOpenNoteModal = (sub) => {
    setEditingSub(sub);
    setAdminNote(sub.adminNote || '');
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (editingSub) {
      const id = editingSub.id || editingSub._id;
      await updateFanSubmissionStatus(id, editingSub.status, adminNote);
      setEditingSub(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteFanSubmission(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <div className="space-y-6 max-w-[1180px]">
      <AdminPageHeader
        kicker="Community"
        title="Fan submissions"
        description="Review community artwork, cosplay photos, and essays before public approval."
      />

      <AdminToolbar>
        <AdminSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search by title, creator, or category…" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 text-xs sm:w-52">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </AdminToolbar>

      <AdminTableWrap>
        <table className="text-left">
          <thead>
            <tr>
              <th>Submission</th>
              <th>Category</th>
              <th>Creator</th>
              <th>Status</th>
              <th>Admin note</th>
              <th className="text-right">Moderation</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-stone-500">
                  No submissions found
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((s) => {
                const id = s.id || s._id;
                const creatorName = s.creator || s.user?.name || s.author || 'Member';
                const catName = typeof s.category === 'object' ? s.category?.name : s.category || 'General';
                return (
                  <tr key={id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {s.image && (
                          <img src={s.image} alt="" referrerPolicy="no-referrer" className="w-12 h-9 rounded-lg object-cover bg-black/40 shrink-0" />
                        )}
                        <div>
                          <span className="font-medium text-white block">{s.title}</span>
                          <span className="text-[11px] text-stone-500 line-clamp-1">{s.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-stone-300">{catName}</td>
                    <td className="text-stone-200">{creatorName}</td>
                    <td>
                      <AdminStatus value={s.status} />
                    </td>
                    <td className="max-w-xs text-stone-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{s.adminNote || 'No notes'}</span>
                        <button type="button" onClick={() => handleOpenNoteModal(s)} className="text-stone-500 hover:text-white shrink-0" title="Edit note">
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateFanSubmissionStatus(id, 'approved')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                            s.status === 'approved' ? 'admin-btn-primary' : 'admin-btn-ghost'
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFanSubmissionStatus(id, 'rejected')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                            s.status === 'rejected' ? 'admin-btn-primary' : 'admin-btn-ghost'
                          }`}
                        >
                          Reject
                        </button>
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

      <Modal isOpen={!!editingSub} onClose={() => setEditingSub(null)} title="Moderation note">
        <form onSubmit={handleSaveNote} className="space-y-4">
          <p className="text-xs text-stone-400">
            Feedback for <span className="text-white font-medium">{editingSub?.title}</span>
          </p>
          <AdminField>
            <textarea rows={3} value={adminNote} onChange={(e) => setAdminNote(e.target.value)} className="w-full px-3 py-2 text-sm" />
          </AdminField>
          <AdminFormActions onCancel={() => setEditingSub(null)} submitting={false} submitLabel="Save note" />
        </form>
      </Modal>

      <AdminConfirm
        open={!!pendingDelete}
        title="Delete submission"
        message="This will permanently remove this fan submission."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
