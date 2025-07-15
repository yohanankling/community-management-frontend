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
        console.error('Error fetching users:', error);
        throw new Error(error.message || 'Network error while fetching users.');
    }
};

export const addUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add user');
        }

        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Error adding user:', error);
        throw new Error(error.message || 'Network error while adding user.');
    }
};

export const deleteUser = async (userId) => {
    try {
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
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw new Error(error.message || 'Network error while deleting user.');
    }
};

export const updateUser = async (userId, updatedData) => {
    try {
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
        return data.user;
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        throw new Error(error.message || 'Network error while updating user.');
    }
};