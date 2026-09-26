import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApi, userApi } from '../services/api';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [events, setEvents] = useState([]);
  const [fanSubmissions, setFanSubmissions] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [bookmarks, setBookmarks] = useState([]);
  const [ratings, setRatings] = useState({});
  const [favoriteCategories, setFavoriteCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to normalize backend document IDs (_id -> id)
  const normalizeItem = (item) => {
    if (!item) return item;
    const media = item.mediaUrl || item.videoUrl || item.media || '';
    return {
      ...item,
      id: item._id || item.id,
      image: item.image || item.thumbnail || (item.images && item.images[0]) || '',
      mediaUrl: media,
      videoUrl: media
    };
  };

  // Fetch all initial data from real backend APIs
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('fanhub_token');

      const [
        catsRes,
        contentRes,
        charsRes,
        merchRes,
        eventsRes
      ] = await Promise.all([
        adminApi.getCategories().catch(() => ({ categories: [] })),
        adminApi.getContent().catch(() => ({ content: [] })),
        adminApi.getCharacters().catch(() => ({ characters: [] })),
        adminApi.getMerchandise().catch(() => ({ merchandise: [] })),
        adminApi.getEvents().catch(() => ({ events: [] }))
      ]);

      setCategories(Array.isArray(catsRes?.categories) ? catsRes.categories.map(normalizeItem) : []);
      setContentList(Array.isArray(contentRes?.content) ? contentRes.content.map(normalizeItem) : []);
      setCharacters(Array.isArray(charsRes?.characters) ? charsRes.characters.map(normalizeItem) : []);
      setMerchandise(Array.isArray(merchRes?.merchandise) ? merchRes.merchandise.map(normalizeItem) : []);
      setEvents(Array.isArray(eventsRes?.events) ? eventsRes.events.map(normalizeItem) : []);

      if (token) {
        const [usersRes, subsRes, fbRes, bkmRes, ratRes] = await Promise.all([
          adminApi.getUsers().catch(() => ({ users: [] })),
          adminApi.getFanSubmissions().catch(() => ({ submissions: [] })),
          adminApi.getFeedback().catch(() => ({ feedback: [] })),
          userApi.getBookmarks().catch(() => ({ bookmarks: [] })),
          userApi.getRatings().catch(() => ({ ratings: [] }))
        ]);

        setUsersList(Array.isArray(usersRes?.users) ? usersRes.users.map(normalizeItem) : []);
        setFanSubmissions(Array.isArray(subsRes?.submissions) ? subsRes.submissions.map(normalizeItem) : []);
        setFeedbackList(Array.isArray(fbRes?.feedback) ? fbRes.feedback.map(normalizeItem) : []);

        if (Array.isArray(bkmRes?.bookmarks)) {
          setBookmarks(
            bkmRes.bookmarks.map((b) => ({
              id: b._id || b.id,
              contentId: typeof b.content === 'object' ? b.content?._id : b.content,
              contentSlug: typeof b.content === 'object' ? b.content?.slug : b.contentSlug,
              note: b.note || ''
            }))
          );
        } else {
          setBookmarks([]);
        }

        if (Array.isArray(ratRes?.ratings)) {
          const rMap = {};
          ratRes.ratings.forEach((r) => {
            const slug = typeof r.content === 'object' ? r.content?.slug : r.contentSlug;
            if (slug) rMap[slug] = r.rating;
          });
          setRatings(rMap);
        } else {
          setRatings({});
        }
      } else {
        setUsersList([]);
        setFanSubmissions([]);
        setFeedbackList([]);
        setBookmarks([]);
        setRatings({});
      }
    } catch (err) {
      console.error('Error loading API data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ================= CATEGORIES CRUD =================
  const addCategory = async (categoryData) => {
    try {
      const res = await adminApi.createCategory(categoryData);
      if (res.success && res.category) {
        const newCat = normalizeItem(res.category);
        setCategories((prev) => [newCat, ...prev]);
        return { success: true, category: newCat };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCategory = async (id, updatedFields) => {
    try {
      const res = await adminApi.updateCategory(id, updatedFields);
      if (res.success && res.category) {
        const updatedCat = normalizeItem(res.category);
        setCategories((prev) => prev.map((c) => (c.id === id || c._id === id ? updatedCat : c)));
        return { success: true, category: updatedCat };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await adminApi.deleteCategory(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ================= CONTENT CRUD =================
  const addContent = async (contentData) => {
    try {
      const res = await adminApi.createContent(contentData);
      if (res.success && res.content) {
        const newContent = normalizeItem(res.content);
        setContentList((prev) => [newContent, ...prev]);
        return { success: true, content: newContent };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateContent = async (id, updatedFields) => {
    try {
      const res = await adminApi.updateContent(id, updatedFields);
      if (res.success && res.content) {
        const updatedItem = normalizeItem(res.content);
        setContentList((prev) => prev.map((c) => (c.id === id || c._id === id ? updatedItem : c)));
        return { success: true, content: updatedItem };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteContent = async (id) => {
    try {
      const res = await adminApi.deleteContent(id);
      if (res.success) {
        setContentList((prev) => prev.filter((c) => c.id !== id && c._id !== id));
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleFeatureContent = async (id) => {
    const item = contentList.find((c) => c.id === id || c._id === id);
    if (!item) return;
    const newFeatured = !item.isFeatured && !item.featured;
    await updateContent(id, { isFeatured: newFeatured });
  };

  // ================= CHARACTERS CRUD =================
  const addCharacter = async (charData) => {
    try {
      const res = await adminApi.createCharacter(charData);
      if (res.success && res.character) {
        const newChar = normalizeItem(res.character);
        setCharacters((prev) => [newChar, ...prev]);
        return { success: true, character: newChar };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCharacter = async (id, updatedFields) => {
    try {
      const res = await adminApi.updateCharacter(id, updatedFields);
      if (res.success && res.character) {
        const updatedChar = normalizeItem(res.character);
        setCharacters((prev) => prev.map((c) => (c.id === id || c._id === id ? updatedChar : c)));
        return { success: true, character: updatedChar };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCharacter = async (id) => {
    try {
      const res = await adminApi.deleteCharacter(id);
      if (res.success) {
        setCharacters((prev) => prev.filter((c) => c.id !== id && c._id !== id));
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ================= MERCHANDISE CRUD =================
  const addMerchandise = async (merchData) => {
    try {
      const res = await adminApi.createMerchandise(merchData);
      if (res.success && res.merchandise) {
        const newMerch = normalizeItem(res.merchandise);
        setMerchandise((prev) => [newMerch, ...prev]);
        return { success: true, merchandise: newMerch };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateMerchandise = async (id, updatedFields) => {
    try {
      const res = await adminApi.updateMerchandise(id, updatedFields);
      if (res.success && res.merchandise) {
        const updatedMerch = normalizeItem(res.merchandise);
        setMerchandise((prev) => prev.map((m) => (m.id === id || m._id === id ? updatedMerch : m)));
        return { success: true, merchandise: updatedMerch };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteMerchandise = async (id) => {
    try {
      const res = await adminApi.deleteMerchandise(id);
      if (res.success) {
        setMerchandise((prev) => prev.filter((m) => m.id !== id && m._id !== id));
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ================= EVENTS CRUD =================
  const addEvent = async (eventData) => {
    try {
      const res = await adminApi.createEvent(eventData);
      if (res.success && res.event) {
        const newEvt = normalizeItem(res.event);
        setEvents((prev) => [newEvt, ...prev]);
        return { success: true, event: newEvt };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateEvent = async (id, updatedFields) => {
    try {
      const res = await adminApi.updateEvent(id, updatedFields);
      if (res.success && res.event) {
        const updatedEvt = normalizeItem(res.event);
        setEvents((prev) => prev.map((e) => (e.id === id || e._id === id ? updatedEvt : e)));
        return { success: true, event: updatedEvt };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await adminApi.deleteEvent(id);
      if (res.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id && e._id !== id));
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ================= FAN SUBMISSIONS CRUD =================
  const addFanSubmission = async (subData) => {
    try {
      const res = await userApi.createFanSubmission(subData);
      if (res.success && res.submission) {
        const newSub = normalizeItem(res.submission);
        setFanSubmissions((prev) => [newSub, ...prev]);
        return { success: true, submission: newSub };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateFanSubmissionStatus = async (id, status, adminNote = '') => {
    try {
      const res = await adminApi.updateFanSubmission(id, { status, adminNote });
      if (res.success && res.submission) {
        const updatedSub = normalizeItem(res.submission);
        setFanSubmissions((prev) => prev.map((s) => (s.id === id || s._id === id ? updatedSub : s)));
        return { success: true, submission: updatedSub };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteFanSubmission = async (id) => {
    try {
      const res = await adminApi.deleteFanSubmission(id);
      if (res.success) {
        setFanSubmissions((prev) => prev.filter((s) => s.id !== id && s._id !== id));
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ================= FEEDBACK CRUD =================
  const addFeedback = async (fbData) => {
    try {
      const res = await userApi.submitFeedback(fbData);
      if (res.success && res.feedback) {
        const newFb = normalizeItem(res.feedback);
        setFeedbackList((prev) => [newFb, ...prev]);
        return { success: true, feedback: newFb };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateFeedbackStatus = async (id, status) => {
    try {
      const res = await adminApi.updateFeedback(id, { status });
      if (res.success && res.feedback) {
        const updatedFb = normalizeItem(res.feedback);
        setFeedbackList((prev) => prev.map((f) => (f.id === id || f._id === id ? updatedFb : f)));
        return { success: true, feedback: updatedFb };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteFeedback = async (id) => {
    try {
      const res = await adminApi.deleteFeedback(id);
      if (res.success) {
        setFeedbackList((prev) => prev.filter((f) => f.id !== id && f._id !== id));
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ================= USER MANAGEMENT =================
  const updateUserRole = async (id, role, name, email, avatar) => {
    try {
      const res = await adminApi.updateUser(id, { role, name, email, avatar });
      if (res.success && res.user) {
        const updatedUser = normalizeItem(res.user);
        setUsersList((prev) => prev.map((u) => (u.id === id || u._id === id ? updatedUser : u)));
        return { success: true, user: updatedUser };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await adminApi.deleteUser(id);
      if (res.success) {
        setUsersList((prev) => prev.filter((u) => u.id !== id && u._id !== id));
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ================= BOOKMARKS & RATINGS =================
  const isBookmarked = (slugOrId) => {
    if (!bookmarks || !Array.isArray(bookmarks)) return false;
    return bookmarks.some((b) => b && (b.contentSlug === slugOrId || b.contentId === slugOrId || b.id === slugOrId));
  };

  const toggleBookmark = async (slugOrId, note = '') => {
    const targetItem = contentList.find((c) => c.slug === slugOrId || c.id === slugOrId || c._id === slugOrId);
    const targetSlug = targetItem?.slug || slugOrId;
    const targetId = targetItem?.id || targetItem?._id || slugOrId;

    const existing = bookmarks.find((b) => b.contentSlug === targetSlug || b.contentId === targetId);

    if (existing) {
      setBookmarks((prev) => prev.filter((b) => b.contentSlug !== targetSlug && b.contentId !== targetId));
      if (existing.id && !existing.id.startsWith('temp-')) {
        await userApi.deleteBookmark(existing.id).catch(() => null);
      }
    } else {
      const tempBookmark = { id: `temp-${Date.now()}`, contentId: targetId, contentSlug: targetSlug, note };
      setBookmarks((prev) => [tempBookmark, ...prev]);

      try {
        const res = await userApi.addBookmark({ content: targetId, note });
        if (res.success && res.bookmark) {
          setBookmarks((prev) =>
            prev.map((b) =>
              b.contentSlug === targetSlug || b.contentId === targetId
                ? { id: res.bookmark._id || res.bookmark.id, contentId: targetId, contentSlug: targetSlug, note }
                : b
            )
          );
        }
      } catch (err) {
        console.error('Add bookmark error:', err);
      }
    }
  };

  const updateBookmarkNote = (slugOrId, noteText) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.contentSlug === slugOrId || b.contentId === slugOrId ? { ...b, note: noteText } : b))
    );
  };

  const setContentRating = async (slugOrId, ratingVal) => {
    const targetItem = contentList.find((c) => c.slug === slugOrId || c.id === slugOrId || c._id === slugOrId);
    const targetSlug = targetItem?.slug || slugOrId;
    const targetId = targetItem?.id || targetItem?._id || slugOrId;

    setRatings((prev) => ({ ...prev, [targetSlug]: ratingVal }));

    try {
      await userApi.addRating({ content: targetId, rating: ratingVal }).catch(() => null);
    } catch (err) {
      console.error('Add rating error:', err);
    }
  };

  const isFavoriteCategory = (catNameOrId) => {
    if (!favoriteCategories || !Array.isArray(favoriteCategories)) return false;
    const nameStr = String(catNameOrId || '').toLowerCase();
    return favoriteCategories.some((c) => String(c || '').toLowerCase() === nameStr);
  };

  const toggleFavoriteCategory = (catNameOrId) => {
    if (!catNameOrId) return;
    const nameStr = String(catNameOrId);
    setFavoriteCategories((prev) => {
      const exists = prev.some((c) => String(c || '').toLowerCase() === nameStr.toLowerCase());
      if (exists) {
        return prev.filter((c) => String(c || '').toLowerCase() !== nameStr.toLowerCase());
      } else {
        return [...prev, nameStr];
      }
    });
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        contentList,
        characters,
        merchandise,
        events,
        fanSubmissions,
        feedbackList,
        usersList,
        bookmarks,
        ratings,
        favoriteCategories,
        isFavoriteCategory,
        toggleFavoriteCategory,
        loading,
        error,
        refreshData: fetchAllData,

        isBookmarked,
        toggleBookmark,
        updateBookmarkNote,
        setContentRating,
        setRating: setContentRating,

        addCategory,
        updateCategory,
        deleteCategory,

        addContent,
        updateContent,
        deleteContent,
        toggleFeatureContent,

        addCharacter,
        updateCharacter,
        deleteCharacter,

        addMerchandise,
        updateMerchandise,
        deleteMerchandise,

        addEvent,
        updateEvent,
        deleteEvent,

        addFanSubmission,
        updateFanSubmissionStatus,
        deleteFanSubmission,

        addFeedback,
        updateFeedbackStatus,
        deleteFeedback,

        updateUserRole,
        deleteUser
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
