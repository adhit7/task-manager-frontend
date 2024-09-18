import axios from 'axios';

const INTERNAL_SERVER_ERROR = 'Something went wrong, please try again later.';

// Function to get the token (e.g., from localStorage, context, etc.)
const getToken = () => {
  return localStorage.getItem('userInfo'); // Replace with your actual token retrieval logic
};

const api = axios.create({
  baseURL: 'https://task-manager-pro.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
export { INTERNAL_SERVER_ERROR };
