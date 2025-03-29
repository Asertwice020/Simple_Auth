import { authService } from "../redux/auth/api.auth";

// Refresh control flags
let isRefreshing = false;
let refreshSubscribers = []; // Pending request queue

/**
 * Refresh access token, queue requests if already refreshing
 * @returns {Promise<string|null>} New token or null
 */

const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {  // Queue request until refresh completes
      refreshSubscribers.push((token, error) => error ? reject(error) : resolve(token));
    });
  }

  isRefreshing = true;
  try {
    const { data: { data: { accessToken } } } = await authService.renewAccessToken();
    onTokenRefreshed(accessToken); // Update queued requests with new token
    return accessToken;
  } catch (error) {
    onTokenRefreshFailed(error);
    clearAuthState(); // Clean auth state on failure
    return null;
  } finally {
    isRefreshing = false;
  }
};

// Queue management
const subscribeToTokenRefresh = (callback) => refreshSubscribers.push(callback);
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = []; // Clear queue
};


const onTokenRefreshFailed = (error) => {
  refreshSubscribers.forEach(callback => callback(null, error));
  refreshSubscribers = [];  // Clear queue
};

// Auth cleanup
const clearAuthState = () => {
  // sessionStorage.removeItem('user');
  // window.location.href = '/login'; // Force re-login
  // alert('Clear Auth State!')
  console.log('Clear Auth State!')
};

export { refreshAccessToken, subscribeToTokenRefresh, clearAuthState };