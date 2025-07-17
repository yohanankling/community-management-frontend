import React from 'react';

// MemoryCard component represents a single card in the memory game.
// It receives 'card' (the card object), 'onClick' (callback for card clicks),
// and 'disabled' (boolean to disable interaction) as props.
const MemoryCard = ({ card, onClick, disabled }) => {
    // Dynamically generates a string of CSS classes based on the card's state.
    // 'filter(Boolean)' removes any empty strings, and 'join(' ')' combines them into a single class string.
    const cardClasses = [
        'memory-card', // Base class for all memory cards.
        card.isRevealed ? 'flipped' : '', // 'flipped' class if the card is revealed.
        card.isMatched ? 'matched' : '',   // 'matched' class if the card is a matched pair.
        card.isHighlighted ? 'highlighted' : '', // 'highlighted' class if the card is visually highlighted.
        disabled ? 'disabled' : ''         // 'disabled' class if interaction is globally disabled.
    ].filter(Boolean).join(' ');

    // Handles the click event on the card.
    const handleClick = () => {
        // A card can only be clicked if:
        // 1. The entire board is not disabled (`!disabled`).
        // 2. The card is not already revealed (`!card.isRevealed`).
        // 3. The card is not already matched (`!card.isMatched`).
        if (!disabled && !card.isRevealed && !card.isMatched) {
            onClick(); // If conditions are met, trigger the 'onClick' callback passed from the parent.
        }
    };

    return (
        // The main div element representing the memory card.
        <div
            className={cardClasses} // Applies the dynamically generated CSS classes.
            onClick={handleClick}   // Attaches the handleClick function to the click event.
            // Inline styles are used to control the card's appearance based on its state.
            style={{
                // Changes cursor based on whether the card is interactable.
                cursor: (!disabled && !card.isRevealed && !card.isMatched) ? 'pointer' : 'default',
                aspectRatio: '1',     // Ensures the card maintains a square aspect ratio.
                minHeight: '80px',    // Minimum height and width for smaller screens.
                minWidth: '80px',
                border: '3px solid #e8f4f8', // Light blue border.
                borderRadius: '12px', // Rounded corners.
                display: 'flex',      // Flexbox for content centering.
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',     // Default font size for content.
                // Background color changes based on whether the card is revealed or matched.
                backgroundColor: card.isRevealed || card.isMatched ? '#f8f9ff' : '#dfe7fd',
                // Text color changes based on whether the card is revealed or matched.
                color: card.isRevealed || card.isMatched ? '#2c3e50' : '#7c8db5',
                transition: 'all 0.3s ease', // Smooth transition for visual changes.
                userSelect: 'none',   // Prevents text selection.
                // Applies a slight scale transform and stronger box shadow if the card is highlighted.
                transform: card.isHighlighted ? 'scale(1.05)' : 'scale(1)',
                boxShadow: card.isHighlighted ? '0 6px 20px rgba(74, 144, 226, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
            }}
        >
            <div className="card-content">
                {/* Conditionally renders content based on card state. */}
                {card.isRevealed || card.isMatched ? (
                    // If revealed or matched, display the emoji.
                    <span className="emoji" style={{ fontSize: '2.2rem' }}>
                        {card.emoji}
                    </span>
                ) : (
                    // Otherwise, display a question mark.
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        ?
                    </span>
                )}
            </div>
        </div>
    );
};

export default MemoryCard;