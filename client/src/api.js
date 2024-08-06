// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000'; 

// Login API call
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            username,
            password,
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Failed to login');
        }

        const data = response.data;
        return data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Failed to login');
        }
    }
};

// Fetch tables API call
export const fetchTables = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/waiter/tables`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
