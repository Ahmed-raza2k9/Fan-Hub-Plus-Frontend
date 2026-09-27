import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { adminApi } from '../../services/api';
import { useData } from '../../context/DataContext';
import {
  AdminPageHeader,
  AdminStatCard,
  AdminBarList,
  AdminAreaChart,
  AdminDonut,
  AdminLoading,
  AdminError,
  AdminSection
} from '../../components/admin/AdminUi';

export default function AdminAnalytics() {
  const { usersList } = useData();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getAnalytics();
      if (res.success && res.analytics) {
        setAnalytics(res.analytics);
      } else {
        setError('Failed to load analytics from the server.');
      }
    } catch (err) {
      setError(err.message || 'Error fetching admin analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

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
      .map((key) => ({ id: key, label: key, value: buckets[key] }));
  }, [usersList]);

  if (loading) {
    return <AdminLoading label="Loading analytics…" />;
  }

  if (error || !analytics) {
    return <AdminError message={error || 'Data unavailable.'} onRetry={fetchAnalytics} />;
  }

  const { users, content, ratings, submissions, popularCategories, activity } = analytics;
  const contentTypes = content.contentTypeBreakdown || [];
  const totalRatingsCount = ratings.totalRatings || 0;

  const ratingDistMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  (ratings.ratingDistribution || []).forEach((r) => {
    if (r._id >= 1 && r._id <= 5) ratingDistMap[r._id] = r.count;
  });

  const ratingBars = [5, 4, 3, 2, 1].map((star) => ({
    id: star,
    label: `${star} star`,
    value: ratingDistMap[star],
    display: `${ratingDistMap[star]} (${totalRatingsCount ? Math.round((ratingDistMap[star] / totalRatingsCount) * 100) : 0}%)`
  }));

  const typeBars = contentTypes.map((item) => ({
    id: item._id,
    label: String(item._id || 'Unspecified'),
    value: item.count
  }));

  const catBars = (popularCategories || []).map((cat) => ({
    id: cat._id || cat.slug,
    label: cat.name,
    value: cat.totalContent,
    display: `${cat.totalContent} · ${cat.totalViews || 0} views`
  }));

  const subBars = [
    { id: 'pending', label: 'Pending', value: submissions.pendingSubmissions || 0 },
    { id: 'approved', label: 'Approved', value: submissions.approvedSubmissions || 0 },
    { id: 'rejected', label: 'Rejected', value: submissions.rejectedSubmissions || 0 }
  ];

  return (
    <div className="space-y-8 max-w-[1180px]">
      <AdminPageHeader
        kicker="Insights"
        title="Analytics"
        description="Aggregated counts from MongoDB. Charts use only fields returned by the analytics API or user created dates."
        actions={
          <button
            type="button"
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold admin-btn-ghost"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        }
      />

      <AdminSection title="Users">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AdminStatCard title="Total users" value={users.totalUsers} hint={`${users.regularUsers} members`} icon={TrendingUp} />
          <AdminStatCard title="Administrators" value={users.adminUsers} hint="Role: admin" />
          <AdminStatCard title="Members" value={users.regularUsers} hint="Role: user" />
          <AdminStatCard title="Bookmarks" value={activity.totalBookmarks} hint="Engagement saves" />
        </div>
        <div className="admin-card p-5 mt-4">
          <h3 className="text-sm font-semibold text-white mb-1">Registrations by month</h3>
          <p className="text-xs text-stone-500 mb-4">Built from loaded user records that include createdAt.</p>
          <AdminAreaChart items={registrationsByMonth} emptyLabel="No registration dates available on loaded users." />
        </div>
      </AdminSection>

      <AdminSection title="Content">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <AdminStatCard title="Total content" value={content.totalContent} hint={`${content.featuredContent} featured`} />
          <AdminStatCard title="Categories" value={activity.totalCategories} />
          <AdminStatCard title="Characters" value={activity.totalCharacters} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="admin-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">By type</h3>
            <AdminDonut items={typeBars} emptyLabel="No content type breakdown." centerLabel="items" />
          </div>
          <div className="admin-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">By category</h3>
            <AdminBarList items={catBars} emptyLabel="No category aggregation." />
          </div>
        </div>
      </AdminSection>

      <AdminSection title="Engagement">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <AdminStatCard title="Ratings" value={ratings.totalRatings} hint={`Avg ${ratings.averageRating} / 5`} />
          <AdminStatCard title="Fan works" value={submissions.totalSubmissions} hint={`${submissions.pendingSubmissions} pending`} />
          <AdminStatCard title="Merchandise" value={activity.totalMerchandise} />
          <AdminStatCard title="Events" value={activity.totalEvents} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="admin-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Rating distribution</h3>
            <AdminBarList items={ratingBars} emptyLabel="No ratings yet." />
          </div>
          <div className="admin-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Submission status</h3>
            <AdminDonut items={subBars} emptyLabel="No submissions yet." centerLabel="total" />
          </div>
        </div>
      </AdminSection>
    </div>
  );
}
