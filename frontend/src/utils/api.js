import axios from 'axios';

// Get the hostname - works on both PC and mobile when on same network
const hostname = window.location.hostname;

// Backup API URL in case automatic detection fails
const FALLBACK_API_URL = 'http://localhost:5001/api';

// Production API URL
const PRODUCTION_API_URL = 'https://doctor-appointment-backend.onrender.com/api';

// Determine the best API URL to use
const determineApiUrl = () => {
  // If in production (on a deployed host), use the production API URL
  if (hostname !== 'localhost' && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    console.log(`[API] Using production API URL: ${PRODUCTION_API_URL}`);
    return PRODUCTION_API_URL;
  }

  // For local development, use local backend
  const localUrl = `http://${hostname}:5001/api`;
  console.log(`[API] Using local API URL: ${localUrl} (hostname: ${hostname})`);
  return localUrl;
};

// Create an axios instance with default config
const api = axios.create({
  baseURL: determineApiUrl(),
  timeout: 15000, // Increased timeout for slower networks
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable cross-site cookies
  withCredentials: true,
});

// Add debugging function
const debug = (message, data) => {
  console.log(`[API Debug] ${message}`, data);
};

// Add a retry mechanism
api.interceptors.request.use(
  config => {
    // Add retry count to track retries
    config.retryCount = config.retryCount || 0;
    return config;
  }
);

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    debug('Request:', { url: config.url, method: config.method });

    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo && userInfo.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
          debug('Token added to request', { tokenPrefix: userInfo.token.substring(0, 10) + '...' });
        } else {
          console.warn('No token found in userInfo', userInfo);
        }
      } catch (error) {
        console.error('Error parsing userInfo from localStorage', error);
        // Clear corrupted localStorage
        localStorage.removeItem('userInfo');
      }
    }
    return config;
  },
  (error) => {
    debug('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    debug('Response success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const { config, response } = error;

    debug('Response error:', {
      url: config?.url,
      message: error.message,
      response: response?.data,
      status: response?.status
    });

    // Retry logic for network errors or 5xx server errors
    // Don't retry for 4xx client errors, POST operations, or if we've already retried 3 times
    const shouldRetry = (
      (!response || response.status >= 500) &&
      config &&
      config.retryCount < 3 &&
      config.method !== 'post'
    );

    if (shouldRetry) {
      // Increment the retry count
      config.retryCount = config.retryCount + 1;

      // Exponential backoff delay: 1s, 2s, 4s
      const delay = 1000 * Math.pow(2, config.retryCount - 1);
      console.log(`Retrying request to ${config.url} (attempt ${config.retryCount}/3) after ${delay}ms`);

      // Return a promise that resolves after the delay and retries the request
      return new Promise(resolve => {
        setTimeout(() => resolve(api(config)), delay);
      });
    }

    // Handle authentication errors (401)
    if (response && response.status === 401) {
      console.log('Authentication error detected, clearing user session');
      localStorage.removeItem('userInfo');

      // Only redirect if not already on login page to avoid redirect loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle server errors (500)
    if (response && response.status >= 500) {
      console.error('Server error:', response.data);
    }

    return Promise.reject(error);
  }
);

// Add a function to check if the user is logged in
api.isLoggedIn = () => {
  const userInfo = localStorage.getItem('userInfo');
  return !!userInfo;
};

// Function to get the current user
api.getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    localStorage.removeItem('userInfo');
    return null;
  }
};

export default api; 