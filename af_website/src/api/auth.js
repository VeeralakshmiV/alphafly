// client/src/api/auth.js

import axios from 'axios';

export const registerUser = (data) => axios.post('http://localhost:5000/api/auth/register', data);
export const loginUser = (data) => axios.post('http://localhost:5000/api/auth/login', data);
export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    return axios.get('http://localhost:5000/api/auth/current', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

