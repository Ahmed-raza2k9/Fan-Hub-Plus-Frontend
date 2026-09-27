import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  AdminPageHeader,
  AdminToolbar,
  AdminSearch,
  AdminTableWrap,
  AdminDeleteBtn,
  AdminStatus,
  AdminConfirm
} from '../../components/admin/AdminUi';

export default function AdminFeedback() {
  const { feedbackList, updateFeedbackStatus, deleteFeedback } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingDelete, setPendingDelete] = useState(null);

  const filteredFeedback = feedbackList.filter((fb) => {
    const senderName = fb.userName || fb.user?.name || 'Anonymous';
    const senderEmail = fb.userEmail || fb.user?.email || '';
    const matchesStatus = statusFilter === 'all' || fb.status === statusFilter;
    const matchesSearch =
      fb.subject?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      fb.message?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      senderName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      senderEmail.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesStatus && matchesSearch;
  });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteFeedback(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <div className="space-y-6 max-w-[1180px]">
      <AdminPageHeader
        kicker="Community"
        title="Feedback"
        description="Triage bug reports, feature suggestions, and inquiries from members."
      />

      <AdminToolbar>
        <AdminSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search by subject, user, or message…" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 text-xs sm:w-48">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </AdminToolbar>

      <AdminTableWrap>
        <table className="text-left">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Sender</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedback.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-stone-500">
                  No feedback found
                </td>
              </tr>
            ) : (
              filteredFeedback.map((fb) => {
                const id = fb.id || fb._id;
                const senderName = fb.userName || fb.user?.name || 'Anonymous';
                const senderEmail = fb.userEmail || fb.user?.email || 'N/A';
                const formattedDate = fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : fb.date || 'Recent';

                return (
                  <tr key={id}>
                    <td className="max-w-sm">
                      <span className="font-medium text-white block">{fb.subject || fb.type || 'Feedback'}</span>
                      <span className="text-[11px] text-stone-400 line-clamp-2">{fb.message}</span>
                    </td>
                    <td>
                      <span className="font-medium text-white block">{senderName}</span>
                      <span className="text-[11px] font-mono text-stone-500">{senderEmail}</span>
                    </td>
                    <td>
                      <AdminStatus value={fb.type} />
                    </td>
                    <td className="tabular-nums text-stone-500 text-xs">{formattedDate}</td>
                    <td>
                      <AdminStatus value={fb.status} />
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <select
                          value={fb.status}
                          onChange={(e) => updateFeedbackStatus(id, e.target.value)}
                          className="px-2.5 py-1 text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                        </select>
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

      <AdminConfirm
        open={!!pendingDelete}
        title="Delete feedback"
        message="This will permanently remove this feedback message."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
