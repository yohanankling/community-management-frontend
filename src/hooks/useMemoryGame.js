import { useState, useEffect, useCallback, useRef } from 'react';
import {
    createInitialState,
    startGame,
    flipCard,
    hideNonMatchingCards,
    removeHighlight,
    resetGame as resetGameEngine,
    getGameStats
} from '../engine/gameEngine';
import { saveGameState, loadGameState, clearGameState, saveGameStats } from '../utils/storage';

/**
 * Custom hook for managing memory game state and logic
 */
export const useMemoryGame = () => {
    const [gameState, setGameState] = useState(() => {
        // Try to load saved game state, otherwise create initial state
        const savedState = loadGameState();
        return savedState || createInitialState();
    });

    const hideCardsTimeoutRef = useRef(null);
    const highlightTimeoutRef = useRef(null);

    // Save game state to localStorage whenever it changes
    useEffect(() => {
        saveGameState(gameState);
    }, [gameState]);

    // Handle card hiding after mismatch
    useEffect(() => {
        if (gameState.isEvaluating) {
            hideCardsTimeoutRef.current = setTimeout(() => {
                setGameState(prevState => hideNonMatchingCards(prevState));
            }, 1500); // 1.5 second delay to show mismatched cards
        }

        return () => {
            if (hideCardsTimeoutRef.current) {
                clearTimeout(hideCardsTimeoutRef.current);
            }
        };
    }, [gameState.isEvaluating]);

    // Handle highlight removal after match
    useEffect(() => {
        const hasHighlightedCards = gameState.cards.some(card => card.isHighlighted);
        if (hasHighlightedCards) {
            highlightTimeoutRef.current = setTimeout(() => {
                setGameState(prevState => removeHighlight(prevState));
            }, 1000); // 1 second highlight duration
        }

        return () => {
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }
        };
    }, [gameState.cards]);

    // Save stats when game is won
    useEffect(() => {
        if (gameState.gameStatus === 'won' && gameState.score.endTime) {
            const stats = getGameStats(gameState);
            saveGameStats(stats);
        }
    }, [gameState]);

    // Game actions
    const handleStartGame = useCallback(() => {
        setGameState(prevState => startGame(prevState));
    }, []);

    const handleFlipCard = useCallback((cardId) => {
        setGameState(prevState => flipCard(cardId, prevState));
    }, []);

    const handleResetGame = useCallback(() => {
        // Clear any pending timeouts
        if (hideCardsTimeoutRef.current) {
            clearTimeout(hideCardsTimeoutRef.current);
        }
        if (highlightTimeoutRef.current) {
            clearTimeout(highlightTimeoutRef.current);
        }

        setGameState(resetGameEngine());
        clearGameState();
    }, []);

    const handleNewGame = useCallback(() => {
        // Clear any pending timeouts
        if (hideCardsTimeoutRef.current) {
            clearTimeout(hideCardsTimeoutRef.current);
        }
        if (highlightTimeoutRef.current) {
            clearTimeout(highlightTimeoutRef.current);
        }

        setGameState(startGame(createInitialState()));
    }, []);

    // Utility functions
    const canFlipCard = useCallback((cardId) => {
        if (gameState.gameStatus !== 'playing' || gameState.isEvaluating) {
            return false;
        }

        const card = gameState.cards.find(c => c.id === cardId);
        if (!card || card.isRevealed || card.isMatched) {
            return false;
        }

        return gameState.revealedCards.length < 2;
    }, [gameState]);

    const getStats = useCallback(() => {
        return getGameStats(gameState);
    }, [gameState]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (hideCardsTimeoutRef.current) {
                clearTimeout(hideCardsTimeoutRef.current);
            }
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }
        };
    }, []);

    return {
        // Game state
        gameState,
        cards: gameState.cards,
        score: gameState.score,
        gameStatus: gameState.gameStatus,
        isEvaluating: gameState.isEvaluating,
        
        // Game actions
        startGame: handleStartGame,
        flipCard: handleFlipCard,
        resetGame: handleResetGame,
        newGame: handleNewGame,
        
        // Utility functions
        canFlipCard,
        getStats
    };
};
