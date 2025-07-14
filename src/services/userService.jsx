const API_BASE_URL = 'http://localhost:5000'; // נתיב הבסיס של השרת שלך

/**
 * Fetches all users from the backend.
 * @returns {Promise<Array>} A promise that resolves with an array of user objects.
 * @throws {Error} If the API call fails.
 */
export const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization token if needed, e.g.:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch users');
        }

        const data = await response.json();
        // ה-API מחזיר אובייקט עם שדה "users", לכן נחזיר רק את מערך המשתמשים
        return data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error(error.message || 'Network error while fetching users.');
    }
};

/**
 * Adds a new user to the backend.
 * @param {object} userData - The new user data.
 * @returns {Promise<object>} A promise that resolves with the newly created user object.
 * @throws {Error} If the API call fails.
 */
export const addUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, { // נניח שזה אותו endpoint כמו הרשמה
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add user');
        }

        const data = await response.json();
        return data.user; // נניח שהשרת מחזיר את המשתמש שנוצר באובייקט 'user'
    } catch (error) {
        console.error('Error adding user:', error);
        throw new Error(error.message || 'Network error while adding user.');
    }
};

/**
 * Deletes a user from the backend.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<object>} A promise that resolves upon successful deletion.
 * @throws {Error} If the API call fails.
 */
export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, { // נניח endpoint: /auth/users/:id
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete user');
        }

        const data = await response.json();
        return data; // ייתכן שהשרת יחזיר הודעת הצלחה
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw new Error(error.message || 'Network error while deleting user.');
    }
};

/**
 * Updates an existing user in the backend.
 * @param {string} userId - The ID of the user to update.
 * @param {object} updatedData - The data to update.
 * @returns {Promise<object>} A promise that resolves with the updated user object.
 * @throws {Error} If the API call fails.
 */
export const updateUser = async (userId, updatedData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, { // נניח endpoint: /auth/users/:id
            method: 'PUT', // או PATCH
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user');
        }

        const data = await response.json();
        return data.user; // נניח שהשרת מחזיר את המשתמש המעודכן באובייקט 'user'
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        throw new Error(error.message || 'Network error while updating user.');
    }
};