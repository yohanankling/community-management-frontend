import React from 'react';

const MemoryCard = ({ card, onClick, disabled }) => {
    const cardClasses = [
        'memory-card',
        card.isRevealed ? 'flipped' : '',
        card.isMatched ? 'matched' : '',
        card.isHighlighted ? 'highlighted' : '',
        disabled ? 'disabled' : ''
    ].filter(Boolean).join(' ');

    const handleClick = () => {
        if (!disabled && !card.isRevealed && !card.isMatched) {
            onClick();
        }
    };

    return (
        <div 
            className={cardClasses}
            onClick={handleClick}
            style={{ 
                cursor: (!disabled && !card.isRevealed && !card.isMatched) ? 'pointer' : 'default',
                aspectRatio: '1',
                minHeight: '80px',
                minWidth: '80px',
                border: '3px solid #e8f4f8',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                backgroundColor: card.isRevealed || card.isMatched ? '#f8f9ff' : '#dfe7fd',
                color: card.isRevealed || card.isMatched ? '#2c3e50' : '#7c8db5',
                transition: 'all 0.3s ease',
                userSelect: 'none',
                transform: card.isHighlighted ? 'scale(1.05)' : 'scale(1)',
                boxShadow: card.isHighlighted ? '0 6px 20px rgba(74, 144, 226, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
            }}
        >
            <div className="card-content">
                {card.isRevealed || card.isMatched ? (
                    <span className="emoji" style={{ fontSize: '2.2rem' }}>
                        {card.emoji}
                    </span>
                ) : (
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        ?
                    </span>
                )}
            </div>
        </div>
    );
};

export default MemoryCard;
