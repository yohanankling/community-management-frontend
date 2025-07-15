const API_BASE_URL = 'http://localhost:5000/auth';

const callApi = async (endpoint, method = 'GET', data = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
        const error = new Error(responseData.message || 'An error occurred');
        error.status = response.status;
        error.response = responseData;
        throw error;
    }

    return responseData;
};

export const loginUser = async ({ email, password }) => {
    const response = await callApi('/login', 'POST', { email, password });
    return response;
};

export const registerUser = async ({ email, password, is_manager }) => {
    const response = await callApi('/register', 'POST', { email, password, is_manager });
    return response;
};

export const getAllUsers = async () => {
    const response = await callApi('/users', 'GET');
    return response;
};