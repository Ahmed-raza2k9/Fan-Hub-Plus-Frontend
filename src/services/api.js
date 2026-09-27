const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Centralized fetch wrapper with automatic JWT header attachment,
 * FormData detection, and error parsing.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = options.headers ? { ...options.headers } : {};

  // Attach token if present
  const token = localStorage.getItem('fanhub_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle body formatting
  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const config = {
    ...options,
    headers,
    body
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized (Expired/invalid token)
    if (response.status === 401) {
      localStorage.removeItem('fanhub_token');
      localStorage.removeItem('fanhub_user');
      window.dispatchEvent(new Event('fanhub_auth_unauthorized'));
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to the backend server.');
    }
    throw err;
  }
}

// ==================== AUTHENTICATION API ====================
export const authApi = {
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  forgotPassword: (emailData) => request('/auth/forgot-password', { method: 'POST', body: emailData }),
  resetPassword: (resetData) => request('/auth/reset-password', { method: 'POST', body: resetData })
};

// ==================== ADMIN API ====================
export const adminApi = {
  // Analytics
  getAnalytics: () => request('/admin/analytics', { method: 'GET' }),

  // Ratings
  getRatings: () => request('/admin/ratings', { method: 'GET' }),
  deleteRating: (id) => request(`/admin/ratings/${id}`, { method: 'DELETE' }),

  // Users
  getUsers: () => request('/users', { method: 'GET' }),
  getUser: (id) => request(`/users/${id}`, { method: 'GET' }),
  updateUser: (id, userData) => request(`/users/${id}`, { method: 'PUT', body: userData }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request('/categories', { method: 'GET' }),
  getCategory: (id) => request(`/categories/${id}`, { method: 'GET' }),
  createCategory: (data) => request('/categories', { method: 'POST', body: data }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: data }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Content
  getContent: (params = '') => request(`/content${params ? `?${params}` : ''}`, { method: 'GET' }),
  getContentById: (id) => request(`/content/${id}`, { method: 'GET' }),
  createContent: (data) => request('/content', { method: 'POST', body: data }),
  updateContent: (id, data) => request(`/content/${id}`, { method: 'PUT', body: data }),
  deleteContent: (id) => request(`/content/${id}`, { method: 'DELETE' }),

  // Characters
  getCharacters: () => request('/characters', { method: 'GET' }),
  getCharacterById: (id) => request(`/characters/${id}`, { method: 'GET' }),
  createCharacter: (data) => request('/characters', { method: 'POST', body: data }),
  updateCharacter: (id, data) => request(`/characters/${id}`, { method: 'PUT', body: data }),
  deleteCharacter: (id) => request(`/characters/${id}`, { method: 'DELETE' }),

  // Merchandise
  getMerchandise: () => request('/merchandise', { method: 'GET' }),
  getMerchandiseById: (id) => request(`/merchandise/${id}`, { method: 'GET' }),
  createMerchandise: (data) => request('/merchandise', { method: 'POST', body: data }),
  updateMerchandise: (id, data) => request(`/merchandise/${id}`, { method: 'PUT', body: data }),
  deleteMerchandise: (id) => request(`/merchandise/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: () => request('/events', { method: 'GET' }),
  getNearbyEvents: (lat, lng, radius) => request(`/events/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, { method: 'GET' }),
  getEventById: (id) => request(`/events/${id}`, { method: 'GET' }),
  createEvent: (data) => request('/events', { method: 'POST', body: data }),
  updateEvent: (id, data) => request(`/events/${id}`, { method: 'PUT', body: data }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // Fan Submissions
  getFanSubmissions: () => request('/admin/fan-submissions', { method: 'GET' }),
  getFanSubmissionById: (id) => request(`/admin/fan-submissions/${id}`, { method: 'GET' }),
  updateFanSubmission: (id, data) => request(`/admin/fan-submissions/${id}`, { method: 'PUT', body: data }),
  deleteFanSubmission: (id) => request(`/admin/fan-submissions/${id}`, { method: 'DELETE' }),

  // Feedback
  getFeedback: () => request('/admin/feedback', { method: 'GET' }),
  getFeedbackById: (id) => request(`/admin/feedback/${id}`, { method: 'GET' }),
  updateFeedback: (id, data) => request(`/admin/feedback/${id}`, { method: 'PUT', body: data }),
  deleteFeedback: (id) => request(`/admin/feedback/${id}`, { method: 'DELETE' }),

  // Location Geocoding
  searchLocation: (query) => request(`/location/search?query=${encodeURIComponent(query)}`, { method: 'GET' })
};

// ==================== USER API ====================
export const userApi = {
  updateProfile: (userData) => request('/users/profile', { method: 'PUT', body: userData }),
  createFanSubmission: (data) => request('/fan-submissions', { method: 'POST', body: data }),
  submitFeedback: (data) => request('/feedback', { method: 'POST', body: data }),
  getBookmarks: () => request('/bookmarks', { method: 'GET' }),
  addBookmark: (data) => request('/bookmarks', { method: 'POST', body: data }),
  updateBookmarkNote: (id, note) => request(`/bookmarks/${id}`, { method: 'PUT', body: { note } }),
  deleteBookmark: (id) => request(`/bookmarks/${id}`, { method: 'DELETE' }),
  getRatings: () => request('/ratings', { method: 'GET' }),
  addRating: (data) => request('/ratings', { method: 'POST', body: data })
};

export default {
  auth: authApi,
  admin: adminApi,
  user: userApi
};
