import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MemoryCard from './MemoryCard';

const GameBoard = ({ 
    cards, 
    onCardClick, 
    disabled = false 
}) => {
    return (
        <Container fluid className="memory-game-board p-0">
            <Row className="g-3 justify-content-center">
                {cards.map((card) => (
                    <Col 
                        key={card.id} 
                        xs={3} 
                        className="d-flex justify-content-center p-1"
                    >
                        <MemoryCard
                            card={card}
                            onClick={() => !disabled && onCardClick(card.id)}
                            disabled={disabled}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default GameBoard;
