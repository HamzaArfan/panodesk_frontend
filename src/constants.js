export const METADATA = {
  title: "PanoDesk",
  description: "Admin panel for PanoDesk",
};

// Authentication Routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  ACCEPT_INVITATION: '/accept-invitation',
};

// Admin Routes
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  USERS: '/admin/users',
  ORGANIZATIONS: '/admin/organizations',
  PROJECTS: '/admin/projects',
  TOURS: '/admin/tours',
  COMMENTS: '/admin/comments',
  INVITATIONS: '/admin/invitations',
};

// Default redirect route for authenticated users
export const DEFAULT_AUTHENTICATED_ROUTE = ADMIN_ROUTES.PROJECTS; 
