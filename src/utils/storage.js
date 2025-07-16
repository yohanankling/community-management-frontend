// Local storage utilities for game state persistence

const STORAGE_KEY = 'memoryGameState';

/**
 * Saves game state to localStorage
 * @param {Object} gameState - The game state to save
 */
export const saveGameState = (gameState) => {
    try {
        const serializedState = JSON.stringify(gameState);
        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (error) {
        console.warn('Failed to save game state to localStorage:', error);
    }
};

/**
 * Loads game state from localStorage
 * @returns {Object|null} The saved game state or null if not found
 */
export const loadGameState = () => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState === null) {
            return null;
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.warn('Failed to load game state from localStorage:', error);
        return null;
    }
};

/**
 * Clears saved game state from localStorage
 */
export const clearGameState = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn('Failed to clear game state from localStorage:', error);
    }
};

/**
 * Checks if there's a saved game in localStorage
 * @returns {boolean} True if there's a saved game
 */
export const hasSavedGame = () => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        return serializedState !== null;
    } catch (error) {
        return false;
    }
};

/**
 * Gets game statistics from localStorage (for high scores, etc.)
 */
const STATS_STORAGE_KEY = 'memoryGameStats';

export const saveGameStats = (stats) => {
    try {
        let allStats = JSON.parse(localStorage.getItem(STATS_STORAGE_KEY) || '[]');
        allStats.push({
            ...stats,
            timestamp: Date.now()
        });
        
        // Keep only last 10 games
        allStats = allStats.slice(-10);
        
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(allStats));
    } catch (error) {
        console.warn('Failed to save game stats:', error);
    }
};

export const getGameStats = () => {
    try {
        return JSON.parse(localStorage.getItem(STATS_STORAGE_KEY) || '[]');
    } catch (error) {
        console.warn('Failed to load game stats:', error);
        return [];
    }
};

export const getBestStats = () => {
    const stats = getGameStats();
    if (stats.length === 0) return null;
    
    const completedGames = stats.filter(game => game.isComplete);
    if (completedGames.length === 0) return null;
    
    // Find best time and best accuracy
    const bestTime = Math.min(...completedGames.map(game => game.timeInSeconds));
    const bestAccuracy = Math.max(...completedGames.map(game => parseFloat(game.accuracy)));
    const fewestAttempts = Math.min(...completedGames.map(game => game.attempts));
    
    return {
        bestTime,
        bestAccuracy: `${bestAccuracy}%`,
        fewestAttempts,
        totalGames: completedGames.length
    };
};
