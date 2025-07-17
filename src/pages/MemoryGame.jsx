import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, PlayFill } from 'react-bootstrap-icons';
import GameBoard from '../components/memory-game/GameBoard';
import GameStats from '../components/memory-game/GameStats';
import GameOver from '../components/memory-game/GameOver';
import { useMemoryGame } from '../hooks/useMemoryGame.js';
import '../styles/memory-game.css';

// MemoryGame is the main component for the memory game application.
const MemoryGame = () => {
    // useNavigate hook from react-router-dom for programmatic navigation.
    const navigate = useNavigate();
    // State variable to control the visibility of the Game Over modal.
    const [showGameOver, setShowGameOver] = useState(false);

    // Destructuring values and functions from the custom useMemoryGame hook.
    // gameState: Current state of the game (e.g., moves, matches).
    // cards: Array of card objects representing the game board.
    // gameStatus: Current status of the game ('idle', 'playing', 'won').
    // isEvaluating: Boolean indicating if two cards are currently being evaluated for a match.
    // startGame: Function to initialize and start a new game.
    // flipCard: Function to handle a card click, flipping it over.
    // resetGame: Function to reset the current game without starting a new one.
    // newGame: Function to start an entirely new game (resets stats and board).
    // getStats: Function to retrieve current game statistics.
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

    // Retrieve current game statistics using the getStats function from the hook.
    const stats = getStats();

    // useEffect hook to trigger the Game Over modal when the game is won.
    React.useEffect(() => {
        // Check if the game status is 'won' and the Game Over modal is not already shown.
        if (gameStatus === 'won' && !showGameOver) {
            // Delay showing the modal slightly to allow final card animations to complete.
            setTimeout(() => setShowGameOver(true), 1000);
        }
    }, [gameStatus, showGameOver]); // Dependencies: re-run effect if gameStatus or showGameOver changes.

    // Handler for the "Back" button, navigates to the previous page in history.
    const handleBack = () => {
        navigate(-1);
    };

    // Handler for the "Start" button, initiates the game.
    const handleStartGame = () => {
        startGame();
    };

    // Handler for the "New Game" button, resets the game and hides the Game Over modal.
    const handleNewGame = () => {
        newGame();
        setShowGameOver(false);
    };

    // Handler for the "Reset" button, resets the current game's state and hides the Game Over modal.
    const handleResetGame = () => {
        resetGame();
        setShowGameOver(false);
    };

    // Handler to close the Game Over modal.
    const handleCloseGameOver = () => {
        setShowGameOver(false);
    };

    // Render the main Memory Game UI.
    return (
        <Container fluid className="memory-game-container py-3">
            {/* Header section containing navigation and game control buttons. */}
            <Row className="mb-3">
                <Col>
                    <div className="d-flex align-items-center justify-content-between">
                        {/* Back button */}
                        <Button
                            variant="outline-dark"
                            onClick={handleBack}
                            className="d-flex align-items-center"
                        >
                            <ArrowLeft className="me-2" />
                            Back
                        </Button>

                        {/* Game title */}
                        <h2 className="m-0 d-flex align-items-center text-dark">
                            <Trophy className="me-2 text-warning" />
                            Memory Game
                        </h2>

                        {/* Reset button, visible only when the game is 'playing'. */}
                        {gameStatus === 'playing' && (
                            <Button
                                variant="outline-danger"
                                onClick={handleResetGame}
                            >
                                Reset
                            </Button>
                        )}

                        {/* Start button, visible only when the game is 'idle'. */}
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

                        {/* New Game button, visible only when the game is 'won'. */}
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

            {/* Game Status Alert: Displays a congratulatory message when the game is won. */}
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

            {/* Game Statistics component, visible when the game is not 'idle'. */}
            {gameStatus !== 'idle' && (
                <Row className="mb-3">
                    <Col>
                        <GameStats
                            gameState={gameState} // Pass current game state (e.g., moves, matches).
                            stats={stats}         // Pass calculated game statistics.
                        />
                    </Col>
                </Row>
            )}

            {/* Welcome Screen: Displayed when the game is in 'idle' status. */}
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

                                {/* Start Playing button on the welcome screen. */}
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

            {/* Game Board component: Renders the cards, visible when not 'idle' and cards array is populated. */}
            {gameStatus !== 'idle' && cards.length > 0 && (
                <Row className="justify-content-center">
                    <Col xs={12} lg={8} xl={6}>
                        <GameBoard
                            cards={cards} // Pass the array of card objects to the GameBoard.
                            onCardClick={flipCard} // Pass the flipCard function to handle card clicks.
                            disabled={gameStatus === 'won' || isEvaluating} // Disable card clicks if game is won or cards are being evaluated.
                        />
                    </Col>
                </Row>
            )}

            {/* Game Over Modal component: Displays game results when the game is won. */}
            <GameOver
                show={showGameOver} // Control modal visibility.
                stats={stats} // Pass final game statistics to the modal.
                onNewGame={handleNewGame} // Callback for starting a new game from the modal.
                onClose={handleCloseGameOver} // Callback for closing the modal.
            />
        </Container>
    );
};

export default MemoryGame;
