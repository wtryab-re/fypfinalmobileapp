// api.tsx
// Central API configuration file

// Base URL for your backend
// Change this to your production URL when deploying
//export const API_BASE_URL = 'https://unhistrionic-immedicable-raguel.ngrok-free.dev'; //replce with your deployed backend URL later
export const API_BASE_URL =
  "https://slaggiest-pseudospiritually-gwyneth.ngrok-free.dev"; // Local development URL

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
  },

  // User endpoints (add more as needed)
  USER: {
    PROFILE: `${API_BASE_URL}/api/user/profile`,
    UPDATE: `${API_BASE_URL}/api/user/update`,

    UPLOAD_IMAGE: `${API_BASE_URL}/api/user/upload-image`, // image upload
    CREATE_CASE: `${API_BASE_URL}/api/cases`, // create new case
  },

  // Admin endpoints (add when needed)
  ADMIN: {
    APPROVE_WORKER: `${API_BASE_URL}/api/admin/approve-worker`,
    GET_PENDING_WORKERS: `${API_BASE_URL}/api/admin/pending-workers`,
  },
};

// Helper function for making API calls
export const apiCall = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
