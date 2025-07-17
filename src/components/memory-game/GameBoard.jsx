import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MemoryCard from './MemoryCard';

// GameBoard component renders the layout for a memory game.
// It receives 'cards' (an array of card objects), 'onCardClick' (a function to handle card clicks),
// and 'disabled' (a boolean to disable card interactions) as props.
const GameBoard = ({
                       cards,
                       onCardClick,
                       disabled = false
                   }) => {
    return (
        // Fluid container for the entire game board, removing default padding.
        <Container fluid className="memory-game-board p-0">
            {/* Row to contain the memory cards, with a gutter for spacing and centered justification. */}
            <Row className="g-3 justify-content-center">
                {/* Maps over the 'cards' array to render each MemoryCard component. */}
                {cards.map((card) => (
                    // Column for each card, taking up 3 units on extra small screens,
                    // centered within its column, and with a small padding.
                    <Col
                        key={card.id} // Unique key for each card, essential for React list rendering.
                        xs={3}
                        className="d-flex justify-content-center p-1"
                    >
                        {/* Renders a single MemoryCard component. */}
                        <MemoryCard
                            card={card} // Passes the card object's data to the MemoryCard.
                            // Defines the onClick handler for the card.
                            // It only calls 'onCardClick' if the 'disabled' prop is false,
                            // preventing interaction when the board is temporarily locked.
                            onClick={() => !disabled && onCardClick(card.id)}
                            disabled={disabled} // Passes the 'disabled' prop to the MemoryCard,
                            // allowing individual cards to visually indicate their disabled state.
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default GameBoard;