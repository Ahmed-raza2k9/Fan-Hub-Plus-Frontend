import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Clock, Check, Search, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AdminFeedback() {
  const { feedbackList, updateFeedbackStatus, deleteFeedback } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback message?')) return;
    await deleteFeedback(id);
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight font-display">
          Manage Member Feedback Tickets
        </h1>
        <p className="text-xs text-zinc-400">
          Triage bug reports, feature suggestions, and general inquiries from community fans.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-zinc-950/80 border border-zinc-850 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by subject, user, or message..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-850 bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/60 border-b border-zinc-850 text-zinc-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">Subject & Message</th>
              <th className="py-3.5 px-4">Sender</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {filteredFeedback.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-zinc-500 font-medium">
                  No Feedback Tickets Found
                </td>
              </tr>
            ) : (
              filteredFeedback.map((fb) => {
                const id = fb.id || fb._id;
                const senderName = fb.userName || fb.user?.name || 'Anonymous';
                const senderEmail = fb.userEmail || fb.user?.email || 'N/A';
                const formattedDate = fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : fb.date || 'Recent';

                return (
                  <tr key={id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <span className="font-bold text-white block">{fb.subject || fb.type || 'Feedback'}</span>
                      <span className="text-[11px] text-zinc-400 line-clamp-2">{fb.message}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{senderName}</span>
                      <span className="text-[11px] font-mono text-zinc-500">{senderEmail}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-zinc-900 text-rose-400 border border-zinc-800">
                        {fb.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">{formattedDate}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          fb.status === 'resolved'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : fb.status === 'reviewed'
                            ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                        }`}
                      >
                        {fb.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <select
                          value={fb.status}
                          onChange={(e) => updateFeedbackStatus(id, e.target.value)}
                          className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                          title="Delete feedback"
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
    </div>
  );
}
