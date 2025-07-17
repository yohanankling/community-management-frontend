import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { Trophy, Clock, Bullseye, Percent, Star } from 'react-bootstrap-icons';

// GameOver component displays a modal with game statistics and a performance message
// once a memory game is complete.
// It receives 'show' (boolean for modal visibility), 'stats' (game statistics object),
// 'onNewGame' (callback to start a new game), and 'onClose' (callback to close the modal) as props.
const GameOver = ({ show, stats, onNewGame, onClose }) => {
    // If stats are not provided or the game is not complete, render nothing.
    if (!stats || !stats.isComplete) return null;

    // Determines a performance message based on game accuracy and time.
    const getPerformanceMessage = () => {
        const accuracy = parseFloat(stats.accuracy); // Convert accuracy string to float.
        const timeInSeconds = stats.timeInSeconds;

        if (accuracy >= 90 && timeInSeconds <= 120) {
            // Excellent performance criteria.
            return { message: "Outstanding! Perfect memory!", icon: "🏆", variant: "success" };
        } else if (accuracy >= 80 && timeInSeconds <= 180) {
            // Very good performance criteria.
            return { message: "Excellent performance!", icon: "🌟", variant: "primary" };
        } else if (accuracy >= 70) {
            // Good performance criteria.
            return { message: "Good job! Keep practicing!", icon: "👍", variant: "info" };
        } else {
            // Standard message for other performances.
            return { message: "Nice try! You'll do better next time!", icon: "💪", variant: "warning" };
        }
    };

    // Get the performance message and associated data.
    const performance = getPerformanceMessage();

    return (
        // Bootstrap Modal component.
        // 'show' controls visibility, 'onHide' is called when the modal needs to close,
        // and 'centered' positions it in the middle of the screen.
        <Modal show={show} onHide={onClose} centered>
            {/* Modal header with a close button and title including a trophy icon. */}
            <Modal.Header closeButton>
                <Modal.Title className="d-flex align-items-center">
                    <Trophy className="text-warning me-2" />
                    Game Complete!
                </Modal.Title>
            </Modal.Header>

            {/* Modal body displaying the game results and performance message. */}
            <Modal.Body className="text-center">
                {/* Section for the main performance icon and message. */}
                <div className="mb-4">
                    <div className="display-1 mb-2">{performance.icon}</div>
                    <h4 className={`text-${performance.variant}`}>
                        {performance.message}
                    </h4>
                </div>

                {/* Row for displaying detailed game statistics in two columns. */}
                <Row className="mb-4">
                    {/* Column for Total Time statistic. */}
                    <Col xs={6} className="mb-3">
                        <div className="d-flex flex-column align-items-center">
                            <Clock className="text-primary mb-2" size={24} />
                            <small className="text-muted">Total Time</small>
                            <Badge bg="primary" className="fs-6">
                                {stats.timeFormatted} {/* Displays formatted time */}
                            </Badge>
                        </div>
                    </Col>

                    {/* Column for Attempts statistic. */}
                    <Col xs={6} className="mb-3">
                        <div className="d-flex flex-column align-items-center">
                            <Bullseye className="text-info mb-2" size={24} />
                            <small className="text-muted">Attempts</small>
                            <Badge bg="info" className="fs-6">
                                {stats.attempts} {/* Displays total attempts */}
                            </Badge>
                        </div>
                    </Col>

                    {/* Column for Accuracy statistic. */}
                    <Col xs={6}>
                        <div className="d-flex flex-column align-items-center">
                            <Percent className="text-success mb-2" size={24} />
                            <small className="text-muted">Accuracy</small>
                            <Badge bg="success" className="fs-6">
                                {stats.accuracy} {/* Displays accuracy percentage */}
                            </Badge>
                        </div>
                    </Col>

                    {/* Column for Score statistic. */}
                    <Col xs={6}>
                        <div className="d-flex flex-column align-items-center">
                            <Star className="text-warning mb-2" size={24} />
                            <small className="text-muted">Score</small>
                            <Badge bg="warning" className="fs-6">
                                {/* Calculates score based on attempts and time, ensuring a minimum of 100. */}
                                {Math.max(1000 - (stats.attempts * 10) - (stats.timeInSeconds * 2), 100)}
                            </Badge>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>

            {/* Modal footer with action buttons. */}
            <Modal.Footer className="justify-content-center">
                {/* Button to start a new game. */}
                <Button variant="primary" onClick={onNewGame} className="me-2">
                    <Trophy className="me-2" />
                    Play Again
                </Button>
                {/* Button to close the modal. */}
                <Button variant="outline-secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GameOver;