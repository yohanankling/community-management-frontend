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

// useMemoryGame is a custom React hook that encapsulates the entire logic
// and state management for a memory card game.
export const useMemoryGame = () => {
    // gameState holds the current state of the game, including cards, score, and status.
    // It attempts to load a previously saved game state from storage; otherwise, it creates a new one.
    const [gameState, setGameState] = useState(() => {
        const savedState = loadGameState();
        return savedState || createInitialState();
    });

    // useRef hooks are used to store references to timeout IDs,
    // allowing them to be cleared if the component unmounts or state changes.
    const hideCardsTimeoutRef = useRef(null);
    const highlightTimeoutRef = useRef(null);

    // This useEffect hook saves the current game state to local storage whenever `gameState` changes.
    // This ensures that the game progress is persisted across sessions.
    useEffect(() => {
        saveGameState(gameState);
    }, [gameState]); // Dependency array: `gameState` ensures this effect runs on state updates.

    // This useEffect hook manages the delay for hiding non-matching cards.
    // It triggers when `isEvaluating` becomes true, meaning two cards have been flipped.
    useEffect(() => {
        if (gameState.isEvaluating) {
            // Sets a timeout to call `hideNonMatchingCards` after a delay,
            // allowing the player to see the flipped cards before they hide.
            hideCardsTimeoutRef.current = setTimeout(() => {
                setGameState(prevState => hideNonMatchingCards(prevState));
            }, 1500); // 1.5 second delay.
        }

        // Cleanup function: clears the timeout if the component unmounts or `isEvaluating` changes,
        // preventing memory leaks or unintended state updates.
        return () => {
            if (hideCardsTimeoutRef.current) {
                clearTimeout(hideCardsTimeoutRef.current);
            }
        };
    }, [gameState.isEvaluating]); // Dependency array: `gameState.isEvaluating` triggers this effect.

    // This useEffect hook manages the duration of card highlighting after a match.
    // It triggers when any card in `gameState.cards` has `isHighlighted` set to true.
    useEffect(() => {
        const hasHighlightedCards = gameState.cards.some(card => card.isHighlighted);
        if (hasHighlightedCards) {
            // Sets a timeout to call `removeHighlight` after a delay,
            // allowing the player to see the matched cards highlighted.
            highlightTimeoutRef.current = setTimeout(() => {
                setGameState(prevState => removeHighlight(prevState));
            }, 1000); // 1 second highlight duration.
        }

        // Cleanup function: clears the timeout to prevent issues.
        return () => {
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }
        };
    }, [gameState.cards]); // Dependency array: `gameState.cards` (specifically, `isHighlighted` property changes).

    // This useEffect hook saves game statistics when the game is won.
    // It triggers when `gameStatus` is 'won' and `endTime` is recorded.
    useEffect(() => {
        if (gameState.gameStatus === 'won' && gameState.score.endTime) {
            const stats = getGameStats(gameState); // Calculates final game statistics.
            saveGameStats(stats); // Saves the statistics to storage.
        }
    }, [gameState]); // Dependency array: `gameState` (specifically `gameStatus` and `score.endTime`).

    // handleStartGame is a memoized callback function to start the game.
    // It updates the game state using the `startGame` function from the game engine.
    const handleStartGame = useCallback(() => {
        setGameState(prevState => startGame(prevState));
    }, []); // No dependencies, as `startGame` only depends on `prevState`.

    // handleFlipCard is a memoized callback function to flip a card.
    // It updates the game state using the `flipCard` function from the game engine.
    const handleFlipCard = useCallback((cardId) => {
        setGameState(prevState => flipCard(cardId, prevState));
    }, []); // No dependencies, as `flipCard` only depends on `cardId` and `prevState`.

    // handleResetGame is a memoized callback function to reset the game to its initial state.
    // It clears any pending timeouts and then resets the game state and local storage.
    const handleResetGame = useCallback(() => {
        // Clear any active timeouts before resetting the game.
        if (hideCardsTimeoutRef.current) {
            clearTimeout(hideCardsTimeoutRef.current);
        }
        if (highlightTimeoutRef.current) {
            clearTimeout(highlightTimeoutRef.current);
        }

        setGameState(resetGameEngine()); // Resets the game state using the engine's function.
        clearGameState(); // Clears the saved game state from local storage.
    }, []); // No dependencies.

    // handleNewGame is a memoized callback function to start a completely new game.
    // It clears any pending timeouts and then initializes a new game state.
    const handleNewGame = useCallback(() => {
        // Clear any active timeouts before starting a new game.
        if (hideCardsTimeoutRef.current) {
            clearTimeout(hideCardsTimeoutRef.current);
        }
        if (highlightTimeoutRef.current) {
            clearTimeout(highlightTimeoutRef.current);
        }

        setGameState(startGame(createInitialState())); // Creates a fresh initial state and starts the game.
    }, []); // No dependencies.

    // canFlipCard is a memoized callback function that determines if a card can be flipped.
    // It checks the current game status, evaluation state, and card properties.
    const canFlipCard = useCallback((cardId) => {
        // Cannot flip if the game is not playing or if cards are currently being evaluated.
        if (gameState.gameStatus !== 'playing' || gameState.isEvaluating) {
            return false;
        }

        const card = gameState.cards.find(c => c.id === cardId);
        // Cannot flip if the card doesn't exist, is already revealed, or already matched.
        if (!card || card.isRevealed || card.isMatched) {
            return false;
        }

        // Can only flip if fewer than two cards are currently revealed.
        return gameState.revealedCards.length < 2;
    }, [gameState]); // Dependency array: `gameState` to react to changes in game status, evaluation, and revealed cards.

    // getStats is a memoized callback function that returns the current game statistics.
    const getStats = useCallback(() => {
        return getGameStats(gameState); // Retrieves statistics using the game engine's function.
    }, [gameState]); // Dependency array: `gameState` to reflect the latest game state in stats.

    // This useEffect hook provides a cleanup mechanism for all timeouts when the component unmounts.
    // This is crucial to prevent memory leaks and ensure no state updates occur on an unmounted component.
    useEffect(() => {
        return () => {
            if (hideCardsTimeoutRef.current) {
                clearTimeout(hideCardsTimeoutRef.current);
            }
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount.

    // The hook returns an object containing the game state properties and action functions,
    // making them accessible to components that use this hook.
    return {
        // Game state properties for direct access.
        gameState,
        cards: gameState.cards,
        score: gameState.score,
        gameStatus: gameState.gameStatus,
        isEvaluating: gameState.isEvaluating,

        // Game action functions.
        startGame: handleStartGame,
        flipCard: handleFlipCard,
        resetGame: handleResetGame,
        newGame: handleNewGame,

        // Utility functions.
        canFlipCard,
        getStats
    };
};