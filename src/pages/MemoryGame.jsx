import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, PlayFill } from 'react-bootstrap-icons';
import GameBoard from '../components/memory-game/GameBoard';
import GameStats from '../components/memory-game/GameStats';
import GameOver from '../components/memory-game/GameOver';
import { useMemoryGame } from '../hooks/useMemoryGame.js';
import '../styles/memory-game.css';

const MemoryGame = () => {
    const navigate = useNavigate();
    const [showGameOver, setShowGameOver] = useState(false);

    const {
        gameState,
        cards,
        gameStatus,
        isEvaluating,
        startGame,
        flipCard,
        resetGame,
        newGame,
        getStats
    } = useMemoryGame();

    const stats = getStats();

    // Show game over modal when game is won
    React.useEffect(() => {
        if (gameStatus === 'won' && !showGameOver) {
            setTimeout(() => setShowGameOver(true), 1000);
        }
    }, [gameStatus, showGameOver]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleStartGame = () => {
        startGame();
    };

    const handleNewGame = () => {
        newGame();
        setShowGameOver(false);
    };

    const handleResetGame = () => {
        resetGame();
        setShowGameOver(false);
    };

    const handleCloseGameOver = () => {
        setShowGameOver(false);
    };

    return (
        <Container fluid className="memory-game-container py-3">
            {/* Header */}
            <Row className="mb-3">
                <Col>
                    <div className="d-flex align-items-center justify-content-between">
                        <Button 
                            variant="outline-dark" 
                            onClick={handleBack}
                            className="d-flex align-items-center"
                        >
                            <ArrowLeft className="me-2" />
                            Back
                        </Button>
                        
                        <h2 className="m-0 d-flex align-items-center text-dark">
                            <Trophy className="me-2 text-warning" />
                            Memory Game
                        </h2>
                        
                        {gameStatus === 'playing' && (
                            <Button 
                                variant="outline-danger" 
                                onClick={handleResetGame}
                            >
                                Reset
                            </Button>
                        )}
                        
                        {gameStatus === 'idle' && (
                            <Button 
                                variant="success" 
                                onClick={handleStartGame}
                                className="d-flex align-items-center"
                            >
                                <PlayFill className="me-2" />
                                Start
                            </Button>
                        )}
                        
                        {gameStatus === 'won' && (
                            <Button 
                                variant="primary" 
                                onClick={handleNewGame}
                                className="d-flex align-items-center"
                            >
                                <PlayFill className="me-2" />
                                New Game
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Game Status */}
            {gameStatus === 'won' && !showGameOver && (
                <Row className="mb-3">
                    <Col>
                        <Alert variant="success" className="text-center game-complete">
                            <Trophy className="me-2" />
                            🎉 Congratulations! You completed the game! 🎉
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Game Stats */}
            {gameStatus !== 'idle' && (
                <Row className="mb-3">
                    <Col>
                        <GameStats 
                            gameState={gameState}
                            stats={stats}
                        />
                    </Col>
                </Row>
            )}

            {/* Welcome Screen */}
            {gameStatus === 'idle' && (
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <Card className="text-center bg-light">
                            <Card.Body className="py-5">
                                <div className="mb-4">
                                    <div className="display-1 mb-3">🧠</div>
                                    <h3 className="text-primary">4×4 Emoji Memory Game</h3>
                                    <p className="text-muted">
                                        Match all 8 pairs of emojis to win!
                                    </p>
                                </div>
                                
                                <div className="mb-4">
                                    <h5 className="text-secondary">How to Play:</h5>
                                    <ul className="list-unstyled text-muted">
                                        <li>• Click cards to reveal emojis</li>
                                        <li>• Find matching pairs</li>
                                        <li>• Complete all 8 pairs to win</li>
                                        <li>• Try to do it in fewer attempts!</li>
                                    </ul>
                                </div>
                                
                                <Button 
                                    variant="primary" 
                                    size="lg"
                                    onClick={handleStartGame}
                                    className="d-flex align-items-center mx-auto"
                                >
                                    <PlayFill className="me-2" />
                                    Start Playing
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Game Board */}
            {gameStatus !== 'idle' && cards.length > 0 && (
                <Row className="justify-content-center">
                    <Col xs={12} lg={8} xl={6}>
                        <GameBoard
                            cards={cards}
                            onCardClick={flipCard}
                            disabled={gameStatus === 'won' || isEvaluating}
                        />
                    </Col>
                </Row>
            )}

            {/* Game Over Modal */}
            <GameOver
                show={showGameOver}
                stats={stats}
                onNewGame={handleNewGame}
                onClose={handleCloseGameOver}
            />
        </Container>
    );
};

export default MemoryGame;
