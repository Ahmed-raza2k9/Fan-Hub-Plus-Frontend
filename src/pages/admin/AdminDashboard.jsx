import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Layers,
  Film,
  UserCheck,
  ShoppingBag,
  Calendar,
  Sparkles,
  MessageSquare,
  Star,
  Bookmark,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { adminApi } from '../../services/api';
import {
  AdminPageHeader,
  AdminStatCard,
  AdminBarList,
  AdminAreaChart,
  AdminStatus,
  AdminLoading,
  AdminError,
  AdminEmpty,
  AdminTableWrap,
  AdminSection
} from '../../components/admin/AdminUi';

export default function AdminDashboard() {
  const {
    usersList,
    categories,
    contentList,
    characters,
    merchandise,
    events,
    fanSubmissions,
    feedbackList,
    updateFanSubmissionStatus,
    loading
  } = useData();

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState('');
  const [recentRatings, setRecentRatings] = useState([]);

  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const res = await adminApi.getAnalytics();
      if (res.success && res.analytics) {
        setAnalytics(res.analytics);
        setAnalyticsError('');
      } else {
        setAnalyticsError(res.message || 'Analytics unavailable.');
      }
    } catch (err) {
      setAnalyticsError(err.message || 'Failed to load analytics.');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    adminApi
      .getRatings()
      .then((res) => {
        if (res.success && Array.isArray(res.ratings)) {
          setRecentRatings(res.ratings.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  const pendingSubmissions = fanSubmissions.filter((s) => s.status === 'pending');
  const pendingFeedback = feedbackList.filter((f) => f.status === 'pending');

  const typeBars = useMemo(() => {
    const list = analytics?.content?.contentTypeBreakdown || [];
    return list.map((item) => ({
      id: item._id || 'unknown',
      label: String(item._id || 'Unspecified'),
      value: item.count,
      display: `${item.count}`
    }));
  }, [analytics]);

  const categoryBars = useMemo(() => {
    const list = analytics?.popularCategories || [];
    return list.map((cat) => ({
      id: cat._id || cat.slug,
      label: cat.name,
      value: cat.totalContent,
      display: `${cat.totalContent} items`
    }));
  }, [analytics]);

  const registrationsByMonth = useMemo(() => {
    const buckets = {};
    usersList.forEach((u) => {
      if (!u.createdAt) return;
      const d = new Date(u.createdAt);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets[key] = (buckets[key] || 0) + 1;
    });
    return Object.keys(buckets)
      .sort()
      .slice(-8)
      .map((key) => ({ id: key, label: key.slice(5), value: buckets[key] }));
  }, [usersList]);

  const recentUsers = useMemo(() => {
    return [...usersList]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [usersList]);

  const recentContent = useMemo(() => {
    return [...contentList]
      .sort((a, b) => new Date(b.createdAt || b.releaseDate || 0) - new Date(a.createdAt || a.releaseDate || 0))
      .slice(0, 5);
  }, [contentList]);

  const n = (v, fallback) => (v === undefined || v === null ? fallback : v);

  if (loading && usersList.length === 0 && contentList.length === 0 && loadingAnalytics) {
    return <AdminLoading label="Loading dashboard…" />;
  }

  return (
    <div className="space-y-8 max-w-[1180px]">
      <AdminPageHeader
        kicker="Fan Hub Plus"
        title="Platform overview"
        description="Live counts from the Fan Hub Plus database. Open a card to manage that area."
        actions={
          <>
            <Link to="/admin/content" className="px-3.5 py-2 text-xs font-semibold admin-btn-primary">
              Manage content
            </Link>
            <Link to="/admin/fan-submissions" className="px-3.5 py-2 text-xs font-semibold admin-btn-ghost">
              Review queue
            </Link>
          </>
        }
      />

      {analyticsError && !analytics ? (
        <AdminError message={analyticsError} onRetry={loadAnalytics} />
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-white mb-3">At a glance</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AdminStatCard
            title="Users"
            value={n(analytics?.users?.totalUsers, usersList.length)}
            hint={`${n(analytics?.users?.adminUsers, usersList.filter((u) => u.role === 'admin').length)} admins`}
            icon={Users}
            to="/admin/users"
          />
          <AdminStatCard
            title="Content"
            value={n(analytics?.content?.totalContent, contentList.length)}
            hint={`${n(analytics?.content?.featuredContent, 0)} featured`}
            icon={Film}
            to="/admin/content"
          />
          <AdminStatCard
            title="Pending submissions"
            value={n(analytics?.submissions?.pendingSubmissions, pendingSubmissions.length)}
            hint={`${n(analytics?.submissions?.totalSubmissions, fanSubmissions.length)} total`}
            icon={Sparkles}
            to="/admin/fan-submissions"
            accent={n(analytics?.submissions?.pendingSubmissions, pendingSubmissions.length) > 0}
          />
          <AdminStatCard
            title="Ratings"
            value={n(analytics?.ratings?.totalRatings, 0)}
            hint={`Avg ${n(analytics?.ratings?.averageRating, 0)} / 5`}
            icon={Star}
            to="/admin/ratings"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
          <AdminStatCard dense title="Categories" value={n(analytics?.activity?.totalCategories, categories.length)} icon={Layers} to="/admin/categories" />
          <AdminStatCard dense title="Characters" value={n(analytics?.activity?.totalCharacters, characters.length)} icon={UserCheck} to="/admin/characters" />
          <AdminStatCard dense title="Merchandise" value={n(analytics?.activity?.totalMerchandise, merchandise.length)} icon={ShoppingBag} to="/admin/merchandise" />
          <AdminStatCard dense title="Events" value={n(analytics?.activity?.totalEvents, events.length)} icon={Calendar} to="/admin/events" />
          <AdminStatCard dense title="Bookmarks" value={n(analytics?.activity?.totalBookmarks, 0)} icon={Bookmark} />
          <AdminStatCard
            dense
            title="Feedback"
            value={n(analytics?.activity?.totalFeedback, feedbackList.length)}
            hint={`${pendingFeedback.length} pending`}
            icon={MessageSquare}
            to="/admin/feedback"
            accent={pendingFeedback.length > 0}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="admin-card p-5 xl:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white">User registrations</h2>
            <Link to="/admin/analytics" className="text-xs text-[#ff2e63] hover:text-[#ff6b8f]">
              Full analytics
            </Link>
          </div>
          <p className="text-[11px] text-stone-500 mb-3">From loaded user records that include a created date.</p>
          <AdminAreaChart items={registrationsByMonth} emptyLabel="No registration dates available yet." />
        </div>
        <div className="admin-card p-5 xl:col-span-2">
          <h2 className="text-sm font-semibold text-white mb-4">Content by type</h2>
          <AdminBarList items={typeBars} emptyLabel="No content type data yet." />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Content by category</h2>
            <Link to="/admin/categories" className="text-xs text-[#ff2e63] hover:text-[#ff6b8f]">
              Manage
            </Link>
          </div>
          <AdminBarList items={categoryBars} emptyLabel="No category distribution yet." />
        </div>
        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent ratings</h2>
            <Link to="/admin/ratings" className="text-xs text-[#ff2e63] hover:text-[#ff6b8f]">
              View all
            </Link>
          </div>
          {recentRatings.length === 0 ? (
            <p className="text-sm text-stone-500">No ratings yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentRatings.map((r) => (
                <li key={r._id} className="flex items-center justify-between gap-3 text-xs">
                  <p className="text-white font-medium truncate">{r.content?.title || 'Untitled'}</p>
                  <span className="tabular-nums text-[#ff2e63] shrink-0">{r.rating || r.score}/5</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <AdminSection
        title="Pending submissions"
        action={
          <Link to="/admin/fan-submissions" className="text-xs text-[#ff2e63] hover:text-[#ff6b8f] inline-flex items-center gap-1">
            All submissions <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {pendingSubmissions.length === 0 ? (
          <AdminEmpty title="Queue clear" description="No fan submissions are waiting for review." />
        ) : (
          <AdminTableWrap>
            <table className="text-left">
              <thead>
                <tr>
                  <th>Work</th>
                  <th>Category</th>
                  <th>Creator</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingSubmissions.slice(0, 5).map((sub) => (
                  <tr key={sub.id || sub._id}>
                    <td className="text-white font-medium">{sub.title}</td>
                    <td className="text-stone-400">
                      {typeof sub.category === 'object' ? sub.category?.name : sub.category}
                    </td>
                    <td className="text-stone-300">{sub.user?.name || sub.creator || sub.author || 'Member'}</td>
                    <td className="text-stone-500 tabular-nums">
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateFanSubmissionStatus(sub.id || sub._id, 'approved')}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold admin-btn-primary"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFanSubmissionStatus(sub.id || sub._id, 'rejected')}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold admin-btn-ghost"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTableWrap>
        )}
      </AdminSection>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent users</h2>
            <Link to="/admin/users" className="text-xs text-[#ff2e63] hover:text-[#ff6b8f]">
              View all
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-stone-500">No users yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentUsers.map((u) => (
                <li key={u.id || u._id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{u.name}</p>
                    <p className="text-stone-500 truncate">{u.email}</p>
                  </div>
                  <AdminStatus value={u.role} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent content</h2>
            <Link to="/admin/content" className="text-xs text-[#ff2e63] hover:text-[#ff6b8f]">
              View all
            </Link>
          </div>
          {recentContent.length === 0 ? (
            <p className="text-sm text-stone-500">No content yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentContent.map((c) => (
                <li key={c.id || c._id} className="flex items-center justify-between gap-3 text-xs">
                  <p className="text-white font-medium truncate">{c.title}</p>
                  <span className="text-stone-500 uppercase tabular-nums shrink-0">{c.contentType}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
