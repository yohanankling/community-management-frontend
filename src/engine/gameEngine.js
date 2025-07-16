// Pure functions for 6×6 Emoji Memory Game Logic

// Emoji sets for the game
const EMOJI_SET = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
    '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
    '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜'
];

/**
 * Creates initial game state
 * @returns {Object} Initial game state
 */
export const createInitialState = () => ({
    cards: [],
    score: {
        attempts: 0,
        matches: 0,
        startTime: null,
        endTime: null
    },
    gameStatus: 'idle', // 'idle', 'playing', 'won'
    revealedCards: [],
    isEvaluating: false
});

/**
 * Initializes the game board with 16 cards (8 emoji pairs) for 4x4 grid
 * @returns {Array} Array of 16 card objects
 */
export const initializeBoard = () => {
    // Select 8 random emojis for 4x4 grid
    const selectedEmojis = EMOJI_SET
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);
    
    // Create pairs (duplicate each emoji)
    const cardPairs = selectedEmojis.flatMap(emoji => [
        { emoji, pairId: emoji },
        { emoji, pairId: emoji }
    ]);
    
    // Shuffle and assign unique IDs
    const shuffledCards = cardPairs
        .sort(() => Math.random() - 0.5)
        .map((card, index) => ({
            id: index,
            emoji: card.emoji,
            pairId: card.pairId,
            isRevealed: false,
            isMatched: false,
            isHighlighted: false
        }));
    
    return shuffledCards;
};

/**
 * Starts a new game
 * @param {Object} state - Current game state
 * @returns {Object} New game state with initialized board
 */
export const startGame = (state) => ({
    ...state,
    cards: initializeBoard(),
    score: {
        attempts: 0,
        matches: 0,
        startTime: Date.now(),
        endTime: null
    },
    gameStatus: 'playing',
    revealedCards: [],
    isEvaluating: false
});

/**
 * Flips a card and triggers evaluation if needed
 * @param {number} cardId - ID of the card to flip
 * @param {Object} state - Current game state
 * @returns {Object} Updated game state
 */
export const flipCard = (cardId, state) => {
    if (state.gameStatus !== 'playing' || state.isEvaluating) {
        return state;
    }

    const card = state.cards.find(c => c.id === cardId);
    
    // Can't flip if card is already revealed or matched
    if (!card || card.isRevealed || card.isMatched) {
        return state;
    }

    // Can't flip more than 2 cards at once
    if (state.revealedCards.length >= 2) {
        return state;
    }

    // Flip the card
    const updatedCards = state.cards.map(c =>
        c.id === cardId ? { ...c, isRevealed: true } : c
    );

    const newRevealedCards = [...state.revealedCards, cardId];

    const newState = {
        ...state,
        cards: updatedCards,
        revealedCards: newRevealedCards
    };

    // If we have 2 revealed cards, evaluate for match
    if (newRevealedCards.length === 2) {
        return evaluateMatch(newState);
    }

    return newState;
};

/**
 * Evaluates if two revealed cards match
 * @param {Object} state - Current game state
 * @returns {Object} Updated game state after evaluation
 */
export const evaluateMatch = (state) => {
    if (state.revealedCards.length !== 2) {
        return state;
    }

    const [cardId1, cardId2] = state.revealedCards;
    const card1 = state.cards.find(c => c.id === cardId1);
    const card2 = state.cards.find(c => c.id === cardId2);

    const isMatch = card1.pairId === card2.pairId;
    const newAttempts = state.score.attempts + 1;

    if (isMatch) {
        // Cards match - mark as matched and keep revealed
        const updatedCards = state.cards.map(c => {
            if (c.id === cardId1 || c.id === cardId2) {
                return { ...c, isMatched: true, isHighlighted: true };
            }
            return c;
        });

        const newMatches = state.score.matches + 1;
        const newGameStatus = newMatches === 8 ? 'won' : 'playing';
        const endTime = newGameStatus === 'won' ? Date.now() : null;

        return {
            ...state,
            cards: updatedCards,
            score: {
                ...state.score,
                attempts: newAttempts,
                matches: newMatches,
                endTime
            },
            gameStatus: newGameStatus,
            revealedCards: [],
            isEvaluating: false
        };
    } else {
        // Cards don't match - hide them after a delay
        return {
            ...state,
            score: {
                ...state.score,
                attempts: newAttempts
            },
            isEvaluating: true // This will trigger a timeout to hide cards
        };
    }
};

/**
 * Hides non-matching cards (called after a delay)
 * @param {Object} state - Current game state
 * @returns {Object} Updated game state with cards hidden
 */
export const hideNonMatchingCards = (state) => {
    const updatedCards = state.cards.map(c => {
        if (state.revealedCards.includes(c.id) && !c.isMatched) {
            return { ...c, isRevealed: false };
        }
        return c;
    });

    return {
        ...state,
        cards: updatedCards,
        revealedCards: [],
        isEvaluating: false
    };
};

/**
 * Removes highlight from matched cards
 * @param {Object} state - Current game state
 * @returns {Object} Updated game state
 */
export const removeHighlight = (state) => ({
    ...state,
    cards: state.cards.map(c => ({ ...c, isHighlighted: false }))
});

/**
 * Checks if the game is over (all 8 pairs matched)
 * @param {Object} state - Current game state
 * @returns {boolean} True if game is over
 */
export const isGameOver = (state) => {
    return state.score.matches === 8;
};

/**
 * Resets the game to initial state
 * @returns {Object} Fresh initial game state
 */
export const resetGame = () => createInitialState();

/**
 * Calculates game statistics
 * @param {Object} state - Current game state
 * @returns {Object} Game statistics
 */
export const getGameStats = (state) => {
    const { score } = state;
    const elapsedTime = score.endTime 
        ? score.endTime - score.startTime 
        : score.startTime 
            ? Date.now() - score.startTime 
            : 0;

    const accuracy = score.attempts > 0 ? (score.matches / score.attempts * 100).toFixed(1) : 0;
    const timeInSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    return {
        attempts: score.attempts,
        matches: score.matches,
        accuracy: `${accuracy}%`,
        timeFormatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        timeInSeconds,
        isComplete: score.matches === 8
    };
};
