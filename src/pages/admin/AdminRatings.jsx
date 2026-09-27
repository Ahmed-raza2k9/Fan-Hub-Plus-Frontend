import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, RefreshCw } from 'lucide-react';
import { adminApi } from '../../services/api';
import RatingStars from '../../components/RatingStars';
import {
  AdminPageHeader,
  AdminStatCard,
  AdminToolbar,
  AdminSearch,
  AdminTableWrap,
  AdminDeleteBtn,
  AdminLoading,
  AdminError,
  AdminEmpty,
  AdminConfirm,
  AdminToast
} from '../../components/admin/AdminUi';

export default function AdminRatings() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getRatings();
      if (res.success && Array.isArray(res.ratings)) {
        setRatings(res.ratings);
      } else {
        setRatings([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch user ratings from backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      setDeletingId(pendingDelete);
      const res = await adminApi.deleteRating(pendingDelete);
      if (res.success) {
        setRatings((prev) => prev.filter((r) => r._id !== pendingDelete));
        setToastMessage('Rating deleted.');
        setTimeout(() => setToastMessage(''), 3000);
      } else {
        setError(res.message || 'Failed to delete rating.');
      }
    } catch (err) {
      setError(err.message || 'Error deleting rating record.');
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  const filteredRatings = useMemo(() => {
    return ratings.filter((r) => {
      const userName = (r.user?.name || '').toLowerCase();
      const userEmail = (r.user?.email || '').toLowerCase();
      const contentTitle = (r.content?.title || '').toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesQuery = !q || userName.includes(q) || userEmail.includes(q) || contentTitle.includes(q);
      const ratingScore = r.rating || r.score || 0;
      const matchesScore = scoreFilter === 'all' || String(ratingScore) === String(scoreFilter);
      return matchesQuery && matchesScore;
    });
  }, [ratings, searchQuery, scoreFilter]);

  const stats = useMemo(() => {
    const total = ratings.length;
    if (total === 0) return { total: 0, avg: '0.0', fiveStars: 0 };
    const sum = ratings.reduce((acc, r) => acc + (r.rating || r.score || 0), 0);
    const avg = (sum / total).toFixed(1);
    const fiveStars = ratings.filter((r) => (r.rating || r.score) === 5).length;
    return { total, avg, fiveStars };
  }, [ratings]);

  if (loading) {
    return <AdminLoading label="Loading ratings…" />;
  }

  if (error && ratings.length === 0) {
    return <AdminError message={error} onRetry={fetchRatings} />;
  }

  return (
    <div className="space-y-6 max-w-[1180px]">
      <AdminPageHeader
        kicker="Community"
        title="Ratings"
        description="Monitor and moderate star ratings submitted by registered members."
        actions={
          <button type="button" onClick={fetchRatings} disabled={loading} className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold admin-btn-ghost">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
      />

      <AdminToast>{toastMessage}</AdminToast>
      {error && ratings.length > 0 ? <AdminError message={error} onRetry={fetchRatings} /> : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <AdminStatCard title="Total ratings" value={stats.total} hint="From the ratings API" icon={Star} />
        <AdminStatCard title="Average score" value={stats.avg} hint="Across loaded records" />
        <AdminStatCard title="5-star ratings" value={stats.fiveStars} hint="Top scores" />
      </div>

      <AdminToolbar>
        <AdminSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search by user, email, or content title…" />
        <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} className="px-3 py-2.5 text-xs sm:w-44">
          <option value="all">All scores</option>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
      </AdminToolbar>

      {filteredRatings.length === 0 ? (
        <AdminEmpty
          title="No ratings found"
          description="No rating records match your search or filter."
          action={
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setScoreFilter('all');
              }}
              className="mt-4 px-3.5 py-2 text-xs font-semibold admin-btn-ghost"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <AdminTableWrap>
          <table className="text-left min-w-[700px]">
            <thead>
              <tr>
                <th>User</th>
                <th>Content</th>
                <th>Score</th>
                <th>Submitted</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRatings.map((r) => {
                const userObj = r.user || {};
                const contentObj = r.content || {};
                const score = r.rating || r.score || 0;
                const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—';

                return (
                  <tr key={r._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={userObj.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/10"
                        />
                        <div>
                          <span className="font-medium text-white block">{userObj.name || 'Anonymous'}</span>
                          <span className="text-[10px] text-stone-500 font-mono">{userObj.email || 'No email'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 max-w-xs">
                        {contentObj.thumbnail && (
                          <img src={contentObj.thumbnail} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        )}
                        <div className="min-w-0">
                          {contentObj.slug ? (
                            <Link to={`/content/${contentObj.slug}`} className="font-medium text-white hover:text-[#ff2e63] truncate block">
                              {contentObj.title || 'Content item'}
                            </Link>
                          ) : (
                            <span className="font-medium text-white truncate block">{contentObj.title || 'Unknown title'}</span>
                          )}
                          <span className="text-[10px] text-stone-500 uppercase">{contentObj.contentType || 'Media'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <RatingStars value={score} readOnly size="sm" tone="red" />
                        <span className="tabular-nums text-[#ff2e63] font-semibold">{score}/5</span>
                      </div>
                    </td>
                    <td className="tabular-nums text-stone-400 text-xs">{dateStr}</td>
                    <td className="text-right">
                      <AdminDeleteBtn loading={deletingId === r._id} disabled={deletingId === r._id} onClick={() => setPendingDelete(r._id)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </AdminTableWrap>
      )}

      <AdminConfirm
        open={!!pendingDelete}
        title="Delete rating"
        message="This will permanently remove this rating record."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={!!deletingId}
      />
    </div>
  );
}
