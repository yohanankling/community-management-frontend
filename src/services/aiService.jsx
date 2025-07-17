import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const aiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json', // Ensure content type is JSON for POST requests
    },
});

export const sendAiPrompt = async (promptText) => {
    try {
        const response = await aiService.post('/ai/rate_all', { manager_prompt: promptText });
        return response.data;
    } catch (error) {
        console.error('Error sending AI prompt:', error);
        throw error;
    }
};
