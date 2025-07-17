// Define the base URL for the API.
const API_BASE_URL = 'http://localhost:5000';

/**
 * Fetches all users from the API.
 * @returns {Promise<Array>} A promise that resolves with an array of user data.
 * @throws {Error} Throws an error if the API call fails or network issues occur.
 */
export const getAllUsers = async () => {
    try {
        // Send a GET request to the /users endpoint.
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specify content type for the request.
            },
        });

        // Check if the response was successful (status code 2xx).
        if (!response.ok) {
            // If not successful, parse the error message from the response body.
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch users');
        }

        // Parse the successful response data as JSON.
        const data = await response.json();
        return data; // Return the fetched user data.
    } catch (error) {
        // Catch and re-throw any errors, providing a generic network error message if specific message is unavailable.
        throw new Error(error.message || 'Network error while fetching users.');
    }
};

/**
 * Fetches a single user by their ID from the API.
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<Object>} A promise that resolves with the user's data.
 * @throws {Error} Throws an error if userId is missing, the API call fails, or network issues occur.
 */
export const getUserById = async (userId) => {
    try {
        // Validate that a userId is provided.
        if (!userId) {
            throw new Error('User ID is required to fetch user data.');
        }
        // Send a GET request to the /auth/user/:userId endpoint.
        const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response was successful.
        if (!response.ok) {
            // If not successful, parse the error message.
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user');
        }

        // Parse the successful response data as JSON.
        const data = await response.json();
        return data; // Return the fetched user data.
    } catch (error) {
        // Catch and re-throw any errors.
        throw new Error(error.message || 'Network error while fetching user.');
    }
};

/**
 * Updates an existing user's data.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} updatedData - An object containing the fields to update for the user.
 * @returns {Promise<Object>} A promise that resolves with a success status and the updated user data.
 * @throws {Error} Throws an error if userId is missing, the API call fails, or network issues occur.
 */
export const updateUser = async (userId, updatedData) => {
    try {
        // Validate that a userId is provided.
        if (!userId) {
            throw new Error('User ID is required to update user data.');
        }
        // Send a PUT request to the /auth/users/:userId endpoint with the updated data.
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData), // Convert the updated data object to a JSON string.
        });

        // Check if the response was successful.
        if (!response.ok) {
            // If not successful, parse the error message.
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user');
        }

        // Parse the successful response data as JSON.
        const data = await response.json();
        return { success: true, user: data.user }; // Return success status and the updated user object.
    } catch (error) {
        // Catch and re-throw any errors.
        throw new Error(error.message || 'Network error while updating user.');
    }
};

/**
 * Deletes a user by their ID from the API.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<Object>} A promise that resolves with the response data from the deletion.
 * @throws {Error} Throws an error if userId is missing, the API call fails, or network issues occur.
 */
export const deleteUser = async (userId) => {
    try {
        // Validate that a userId is provided.
        if (!userId) {
            throw new Error('User ID is required to delete user data.');
        }
        // Send a DELETE request to the /auth/users/:userId endpoint.
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response was successful.
        if (!response.ok) {
            // If not successful, parse the error message.
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete user');
        }

        // Parse the successful response data as JSON.
        const data = await response.json();
        return data; // Return the response data from the deletion.
    } catch (error) {
        // Catch and re-throw any errors.
        throw new Error(error.message || 'Network error while deleting user.');
    }
};
