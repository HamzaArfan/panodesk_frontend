import axios from 'axios';

// Ensure the API base URL always includes /api prefix
const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  // If baseUrl already ends with /api, use it as is, otherwise append /api
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if not already on an auth page
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const authPages = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/accept-invitation'];
        
        if (!authPages.includes(currentPath)) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  verifyInvitation: (token) => api.get(`/auth/verify-invitation?token=${token}`),
  acceptInvitation: (payload) => api.post('/auth/accept-invitation', payload),
  getCurrentUser: () => api.get('/auth/me'),
};

// Users API calls
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  changePassword: (id, passwordData) => api.put(`/users/${id}/password`, passwordData),
};

// Organizations API calls
export const organizationsAPI = {
  getAll: (params = {}) => api.get('/organizations', { params }),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (orgData) => api.post('/organizations', orgData),
  update: (id, orgData) => api.put(`/organizations/${id}`, orgData),
  delete: (id) => api.delete(`/organizations/${id}`),
  addMember: (id, userId) => api.post(`/organizations/${id}/members`, { userId }),
  removeMember: (id, userId) => api.delete(`/organizations/${id}/members/${userId}`),
  getMembers: (id) => api.get(`/organizations/${id}/members`),
};

// Projects API calls
export const projectsAPI = {
  getAll: (params = {}) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
  addReviewer: (id, userId) => api.post(`/projects/${id}/reviewers`, { userId }),
  removeReviewer: (id, userId) => api.delete(`/projects/${id}/reviewers/${userId}`),
  getReviewers: (id) => api.get(`/projects/${id}/reviewers`),
};

// Tours API calls
export const toursAPI = {
  getAll: (params = {}) => api.get('/tours', { params }),
  getById: (id) => api.get(`/tours/${id}`),
  create: (tourData) => api.post('/tours', tourData),
  update: (id, tourData) => api.put(`/tours/${id}`, tourData),
  delete: (id) => api.delete(`/tours/${id}`),
  getVersions: (id) => api.get(`/tours/${id}/versions`),
};

// Comments API calls
export const commentsAPI = {
  getAll: (params = {}) => api.get('/comments', { params }),
  getById: (id) => api.get(`/comments/${id}`),
  create: (commentData) => api.post('/comments', commentData),
  update: (id, commentData) => api.put(`/comments/${id}`, commentData),
  delete: (id) => api.delete(`/comments/${id}`),
  getByTour: (tourId) => api.get(`/comments?tourId=${tourId}`),
  getReplies: (commentId) => api.get(`/comments?parentId=${commentId}`),
};

// Invitations API calls
export const invitationsAPI = {
  getAll: (params = {}) => api.get('/invitations', { params }),
  getById: (id) => api.get(`/invitations/${id}`),
  send: (invitationData) => api.post('/invitations/send', invitationData),
  resend: (id) => api.post(`/invitations/${id}/resend`),
  revoke: (id) => api.delete(`/invitations/${id}`),
  updateStatus: (id, status) => api.put(`/invitations/${id}/status`, { status }),
};

export default api; 