import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;


if (import.meta.env.DEV) {
  console.log('API Base URL:', baseURL);
}


const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


const authAxios = axios.create({
  baseURL,
  withCredentials: true,
});


const attachAuthHeader = (config) => {
  try {
    const stored = JSON.parse(localStorage.getItem('userData'));
    if (stored?.accessToken) {
      config.headers.Authorization = `Bearer ${stored.accessToken}`;
    }
  } catch (err) {
    console.error('🔒 Failed to parse token from localStorage', err);
  }
  return config;
};


axiosInstance.interceptors.request.use(attachAuthHeader);
authAxios.interceptors.request.use(attachAuthHeader);


const refreshAccessToken = async () => {
  try {
    const res = await authAxios.post('/api/auth/refresh-token');
    const { accessToken } = res.data;

    const stored = JSON.parse(localStorage.getItem('userData')) || {};
    const updated = { ...stored, accessToken };

    localStorage.setItem('userData', JSON.stringify(updated));
    return accessToken;
  } catch (error) {
    console.error('⚠️ Token refresh failed:', error);
    localStorage.removeItem('userData');
    window.location.href = '/login';
    return null;
  }
};


const setupResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest); // Retry with new token
        }
      }

      return Promise.reject(error);
    }
  );
};

setupResponseInterceptor(axiosInstance);
setupResponseInterceptor(authAxios);

export { axiosInstance as default, authAxios };

