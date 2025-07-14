// src/services/authService.js

const API_BASE_URL = 'http://localhost:5000/auth';

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during user registration:', error);
        throw new Error(error.message || 'Network error or unable to connect to server.');
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during user login:', error);
        throw new Error(error.message || 'Network error or unable to connect to server.');
    }
};