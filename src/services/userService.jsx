// userService.jsx
const API_BASE_URL = 'http://localhost:5000';

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch users');
        }

        const data = await response.json();
        return data.users;
    } catch (error) {
        throw new Error(error.message || 'Network error while fetching users.');
    }
};

export const getUserById = async (userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required to fetch user data.');
        }
        const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Network error while fetching user.');
    }
};

export const updateUser = async (userId, updatedData) => {
    try {
        if (!userId) {
            throw new Error('User ID is required to update user data.');
        }
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user');
        }

        const data = await response.json();
        return { success: true, user: data.user };
    } catch (error) {
        throw new Error(error.message || 'Network error while updating user.');
    }
};

export const deleteUser = async (userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required to delete user data.');
        }
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete user');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Network error while deleting user.');
    }
};