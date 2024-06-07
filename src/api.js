import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,  // Set base URL from environment variables for API requests
});

api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem(ACCESS_TOKEN);
        
        if (token) {
            const decoded = jwtDecode(token);
            const now = Date.now() / 1000;

            // Check if token is expired
            if (decoded.exp < now) {
                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/token/refresh/`, {
                        refresh: localStorage.getItem(REFRESH_TOKEN)
                    });
                    localStorage.setItem(ACCESS_TOKEN, response.data.access);
                    token = response.data.access;
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    // Optionally handle logout here if refresh fails
                }
            }

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
