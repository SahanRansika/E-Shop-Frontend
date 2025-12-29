import axios from 'axios';

const api = axios.create({
  // baseURL එක '/api' ලෙස තැබීමෙන් Proxy එක හරහා Request එක යයි
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Token එක Header එකට එකතු කිරීම
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log("Sending Request with Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;