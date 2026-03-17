import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const { token } = JSON.parse(user);
            config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            console.error("Invalid user data in local storage", error);
            localStorage.removeItem('user');
        }
    }
    return config;
});

export default api;
