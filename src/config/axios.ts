import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Trỏ thẳng vào Backend của bạn
});

// Tự động kẹp Token vào Header trước khi gửi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;